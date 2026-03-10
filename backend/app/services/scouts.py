from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.player_profile import PlayerProfile
from app.models.saved_player import SavedPlayer
from app.models.scout_note import ScoutNote
from app.models.user import User
from app.schemas.player import PlayerCard
from app.schemas.scout import ScoutNoteRead
from app.services.players import serialize_player_card


def get_player_profile_or_404(db: Session, player_id: int) -> PlayerProfile:
    profile = db.get(PlayerProfile, player_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
    return profile


def save_player_for_scout(db: Session, scout: User, player_profile: PlayerProfile) -> None:
    existing = db.scalar(
        select(SavedPlayer).where(
            SavedPlayer.scout_user_id == scout.id,
            SavedPlayer.player_user_id == player_profile.user_id,
        )
    )
    if existing:
        return

    db.add(SavedPlayer(scout_user_id=scout.id, player_user_id=player_profile.user_id))
    db.commit()


def unsave_player_for_scout(db: Session, scout: User, player_profile: PlayerProfile) -> None:
    saved = db.scalar(
        select(SavedPlayer).where(
            SavedPlayer.scout_user_id == scout.id,
            SavedPlayer.player_user_id == player_profile.user_id,
        )
    )
    if saved:
        db.delete(saved)
        db.commit()


def list_saved_players(db: Session, scout: User) -> list[PlayerCard]:
    rows = db.scalars(select(SavedPlayer).where(SavedPlayer.scout_user_id == scout.id)).all()
    user_ids = [row.player_user_id for row in rows]
    if not user_ids:
        return []

    profiles = db.scalars(select(PlayerProfile).where(PlayerProfile.user_id.in_(user_ids))).all()
    ordered = sorted(profiles, key=lambda profile: profile.full_name.lower())
    return [serialize_player_card(profile) for profile in ordered]


def upsert_scout_note(db: Session, scout: User, player_profile: PlayerProfile, note: str) -> ScoutNoteRead:
    existing = db.scalar(
        select(ScoutNote).where(
            ScoutNote.scout_user_id == scout.id,
            ScoutNote.player_user_id == player_profile.user_id,
        )
    )

    if existing:
        existing.note = note
        db.commit()
        db.refresh(existing)
        target = existing
    else:
        target = ScoutNote(scout_user_id=scout.id, player_user_id=player_profile.user_id, note=note)
        db.add(target)
        db.commit()
        db.refresh(target)

    return ScoutNoteRead(
        player_id=player_profile.id,
        note=target.note,
        created_at=target.created_at,
        updated_at=target.updated_at,
    )


def get_scout_note(db: Session, scout: User, player_profile: PlayerProfile) -> ScoutNoteRead | None:
    note = db.scalar(
        select(ScoutNote).where(
            ScoutNote.scout_user_id == scout.id,
            ScoutNote.player_user_id == player_profile.user_id,
        )
    )
    if not note:
        return None

    return ScoutNoteRead(
        player_id=player_profile.id,
        note=note.note,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )
