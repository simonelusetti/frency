from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


def save_upload(upload: UploadFile, folder: str, allowed_extensions: set[str]) -> str:
    suffix = Path(upload.filename or "").suffix.lower()
    if suffix not in allowed_extensions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    target_dir = settings.upload_root / folder
    target_dir.mkdir(parents=True, exist_ok=True)
    target_name = f"{uuid4()}{suffix}"
    target_path = target_dir / target_name

    with target_path.open("wb") as buffer:
        buffer.write(upload.file.read())

    return f"/media/{folder}/{target_name}"


def delete_upload(file_path: str | None) -> None:
    if not file_path or not file_path.startswith("/media/"):
        return

    relative_path = file_path.removeprefix("/media/")
    absolute_path = settings.upload_root / relative_path
    if absolute_path.exists():
        absolute_path.unlink()
