from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.db.session import get_db
from app.models.user import User
from app.schemas.scout import SavedPlayersResponse, SaveToggleResponse, ScoutNoteRead, ScoutNoteWrite
from app.services.scouts import (
    get_player_profile_or_404,
    get_scout_note,
    list_saved_players,
    save_player_for_scout,
    unsave_player_for_scout,
    upsert_scout_note,
)

router = APIRouter()


@router.post("/save/{player_id}", response_model=SaveToggleResponse)
def save_player(
    player_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("scout")),
) -> SaveToggleResponse:
    player_profile = get_player_profile_or_404(db, player_id)
    save_player_for_scout(db, current_user, player_profile)
    return SaveToggleResponse(status="saved", player_id=player_id)


@router.delete("/save/{player_id}", response_model=SaveToggleResponse)
def unsave_player(
    player_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("scout")),
) -> SaveToggleResponse:
    player_profile = get_player_profile_or_404(db, player_id)
    unsave_player_for_scout(db, current_user, player_profile)
    return SaveToggleResponse(status="removed", player_id=player_id)


@router.get("/saved", response_model=SavedPlayersResponse)
def saved_players(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("scout")),
) -> SavedPlayersResponse:
    return SavedPlayersResponse(players=list_saved_players(db, current_user))


@router.post("/notes/{player_id}", response_model=ScoutNoteRead)
def write_note(
    player_id: int,
    payload: ScoutNoteWrite,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("scout")),
) -> ScoutNoteRead:
    player_profile = get_player_profile_or_404(db, player_id)
    return upsert_scout_note(db, current_user, player_profile, payload.note)


@router.get("/notes/{player_id}", response_model=ScoutNoteRead | None)
def read_note(
    player_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("scout")),
) -> ScoutNoteRead | None:
    player_profile = get_player_profile_or_404(db, player_id)
    return get_scout_note(db, current_user, player_profile)
