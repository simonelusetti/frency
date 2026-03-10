from datetime import datetime

from pydantic import BaseModel


class DocumentUploadResponse(BaseModel):
    id: int
    player_id: int
    title: str
    document_type: str | None = None
    file_path: str
    visibility: str
    uploaded_at: datetime
