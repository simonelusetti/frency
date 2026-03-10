from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.db.session import get_db
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentUploadResponse
from app.schemas.player import DocumentRead
from app.services.players import require_player_profile, serialize_document
from app.services.storage import save_upload

router = APIRouter()


@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    title: str = Form(...),
    document_type: str | None = Form(default=None),
    visibility: str = Form(default="private"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("player")),
) -> DocumentUploadResponse:
    profile = require_player_profile(current_user)
    file_path = save_upload(file, "documents", {".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"})

    document = Document(
        player_id=profile.id,
        title=title,
        document_type=document_type,
        file_path=file_path,
        visibility=visibility or "private",
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return DocumentUploadResponse(
        id=document.id,
        player_id=document.player_id,
        title=document.title,
        document_type=document.document_type,
        file_path=document.file_path,
        visibility=document.visibility,
        uploaded_at=document.uploaded_at,
    )


@router.get("/me", response_model=list[DocumentRead])
def list_my_documents(current_user: User = Depends(require_role("player"))) -> list[DocumentRead]:
    profile = require_player_profile(current_user)
    return [
        serialize_document(document)
        for document in sorted(profile.documents, key=lambda item: item.uploaded_at, reverse=True)
    ]
