from datetime import date, datetime

from pydantic import BaseModel


class VideoRead(BaseModel):
    id: int
    title: str
    description: str | None = None
    file_path: str
    uploaded_at: datetime


class DocumentRead(BaseModel):
    id: int
    title: str
    document_type: str | None = None
    file_path: str
    visibility: str
    uploaded_at: datetime


class PlayerCard(BaseModel):
    id: int
    user_id: int
    full_name: str
    age: int
    nationality: str
    current_team: str | None = None
    primary_role: str
    secondary_role: str | None = None
    preferred_foot: str | None = None
    availability_status: str | None = None
    profile_image_path: str | None = None


class PlayerProfileRead(PlayerCard):
    date_of_birth: date
    height_cm: int | None = None
    weight_kg: int | None = None
    bio: str | None = None
    videos: list[VideoRead] = []


class PlayerProfilePrivate(PlayerProfileRead):
    documents: list[DocumentRead] = []
