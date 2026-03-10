from datetime import date

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.player_profile import PlayerProfile
from app.models.user import User
from app.models.video import Video
from app.schemas.player import DocumentRead, PlayerCard, PlayerProfilePrivate, PlayerProfileRead, VideoRead
from app.services.storage import delete_upload, save_upload


def calculate_age(date_of_birth: date) -> int:
    today = date.today()
    return today.year - date_of_birth.year - (
        (today.month, today.day) < (date_of_birth.month, date_of_birth.day)
    )


def serialize_video(video: Video) -> VideoRead:
    return VideoRead(
        id=video.id,
        title=video.title,
        description=video.description,
        file_path=video.file_path,
        uploaded_at=video.uploaded_at,
    )


def serialize_document(document: Document) -> DocumentRead:
    return DocumentRead(
        id=document.id,
        title=document.title,
        document_type=document.document_type,
        file_path=document.file_path,
        visibility=document.visibility,
        uploaded_at=document.uploaded_at,
    )


def serialize_player_card(profile: PlayerProfile) -> PlayerCard:
    return PlayerCard(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        age=calculate_age(profile.date_of_birth),
        nationality=profile.nationality,
        current_team=profile.current_team,
        primary_role=profile.primary_role,
        secondary_role=profile.secondary_role,
        preferred_foot=profile.preferred_foot,
        availability_status=profile.availability_status,
        profile_image_path=profile.profile_image_path,
    )


def serialize_player_profile(profile: PlayerProfile) -> PlayerProfileRead:
    base = serialize_player_card(profile).model_dump()
    return PlayerProfileRead(
        **base,
        date_of_birth=profile.date_of_birth,
        height_cm=profile.height_cm,
        weight_kg=profile.weight_kg,
        bio=profile.bio,
        videos=[serialize_video(video) for video in sorted(profile.videos, key=lambda item: item.uploaded_at, reverse=True)],
    )


def serialize_player_private(profile: PlayerProfile) -> PlayerProfilePrivate:
    public_data = serialize_player_profile(profile).model_dump()
    return PlayerProfilePrivate(
        **public_data,
        documents=[
            serialize_document(document)
            for document in sorted(profile.documents, key=lambda item: item.uploaded_at, reverse=True)
        ],
    )


def require_player_profile(user: User) -> PlayerProfile:
    if not user.player_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player profile not found")
    return user.player_profile


def create_player_profile(
    db: Session,
    current_user: User,
    data: dict,
    profile_image: UploadFile | None = None,
) -> PlayerProfile:
    if current_user.player_profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Profile already exists")

    image_path = None
    if profile_image and profile_image.filename:
        image_path = save_upload(
            profile_image,
            "profile-images",
            {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".jfif"},
        )

    profile = PlayerProfile(user_id=current_user.id, profile_image_path=image_path, **data)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_player_profile(
    db: Session,
    current_user: User,
    data: dict,
    profile_image: UploadFile | None = None,
) -> PlayerProfile:
    profile = require_player_profile(current_user)

    if profile_image and profile_image.filename:
        delete_upload(profile.profile_image_path)
        profile.profile_image_path = save_upload(
            profile_image,
            "profile-images",
            {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".jfif"},
        )

    for field, value in data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile


def filter_profiles(
    profiles: list[PlayerProfile],
    role: str | None = None,
    nationality: str | None = None,
    preferred_foot: str | None = None,
    min_age: int | None = None,
    max_age: int | None = None,
) -> list[PlayerProfile]:
    filtered = []
    for profile in profiles:
        age = calculate_age(profile.date_of_birth)
        if role and role.lower() not in (profile.primary_role or "").lower() and role.lower() not in (
            profile.secondary_role or ""
        ).lower():
            continue
        if nationality and nationality.lower() not in profile.nationality.lower():
            continue
        if preferred_foot and preferred_foot.lower() not in (profile.preferred_foot or "").lower():
            continue
        if min_age is not None and age < min_age:
            continue
        if max_age is not None and age > max_age:
            continue
        filtered.append(profile)
    return filtered
