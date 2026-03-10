from datetime import date

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.db.session import get_db
from app.models.player_profile import PlayerProfile
from app.models.user import User
from app.schemas.player import PlayerCard, PlayerProfilePrivate, PlayerProfileRead
from app.services.players import (
    create_player_profile,
    filter_profiles,
    require_player_profile,
    serialize_player_card,
    serialize_player_private,
    serialize_player_profile,
    update_player_profile,
)

router = APIRouter()


def profile_form_data(
    full_name: str = Form(...),
    date_of_birth: date = Form(...),
    nationality: str = Form(...),
    current_team: str | None = Form(default=None),
    primary_role: str = Form(...),
    secondary_role: str | None = Form(default=None),
    preferred_foot: str | None = Form(default=None),
    height_cm: int | None = Form(default=None),
    weight_kg: int | None = Form(default=None),
    bio: str | None = Form(default=None),
    availability_status: str | None = Form(default=None),
):
    return {
        "full_name": full_name,
        "date_of_birth": date_of_birth,
        "nationality": nationality,
        "current_team": current_team,
        "primary_role": primary_role,
        "secondary_role": secondary_role,
        "preferred_foot": preferred_foot,
        "height_cm": height_cm,
        "weight_kg": weight_kg,
        "bio": bio,
        "availability_status": availability_status,
    }


@router.get("", response_model=list[PlayerCard])
def list_players(
    role: str | None = None,
    nationality: str | None = None,
    preferred_foot: str | None = None,
    min_age: int | None = None,
    max_age: int | None = None,
    db: Session = Depends(get_db),
) -> list[PlayerCard]:
    profiles = db.scalars(select(PlayerProfile).order_by(PlayerProfile.full_name.asc())).all()
    filtered = filter_profiles(
        profiles,
        role=role,
        nationality=nationality,
        preferred_foot=preferred_foot,
        min_age=min_age,
        max_age=max_age,
    )
    return [serialize_player_card(profile) for profile in filtered]


@router.get("/me", response_model=PlayerProfilePrivate)
def get_my_profile(current_user: User = Depends(require_role("player"))) -> PlayerProfilePrivate:
    return serialize_player_private(require_player_profile(current_user))


@router.get("/{player_id}", response_model=PlayerProfileRead)
def get_player(player_id: int, db: Session = Depends(get_db)) -> PlayerProfileRead:
    profile = db.get(PlayerProfile, player_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Player not found")
    return serialize_player_profile(profile)


@router.post("/me", response_model=PlayerProfilePrivate)
def create_my_profile(
    data: dict = Depends(profile_form_data),
    profile_image: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("player")),
) -> PlayerProfilePrivate:
    profile = create_player_profile(db, current_user, data, profile_image)
    return serialize_player_private(profile)


@router.put("/me", response_model=PlayerProfilePrivate)
def update_my_profile(
    data: dict = Depends(profile_form_data),
    profile_image: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("player")),
) -> PlayerProfilePrivate:
    profile = update_player_profile(db, current_user, data, profile_image)
    return serialize_player_private(profile)
