from datetime import datetime

from pydantic import BaseModel

from app.schemas.player import PlayerCard


class SaveToggleResponse(BaseModel):
    status: str
    player_id: int


class SavedPlayersResponse(BaseModel):
    players: list[PlayerCard]


class ScoutNoteWrite(BaseModel):
    note: str


class ScoutNoteRead(BaseModel):
    player_id: int
    note: str
    created_at: datetime
    updated_at: datetime
