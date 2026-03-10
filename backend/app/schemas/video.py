from datetime import datetime

from pydantic import BaseModel


class VideoUploadResponse(BaseModel):
    id: int
    player_id: int
    title: str
    description: str | None = None
    file_path: str
    uploaded_at: datetime
