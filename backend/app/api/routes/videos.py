from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.db.session import get_db
from app.models.player_profile import PlayerProfile
from app.models.user import User
from app.models.video import Video
from app.schemas.player import VideoRead
from app.schemas.video import VideoUploadResponse
from app.services.players import require_player_profile, serialize_video
from app.services.storage import delete_upload, save_upload

router = APIRouter()


@router.post("/videos/upload", response_model=VideoUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_video(
    title: str = Form(...),
    description: str | None = Form(default=None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("player")),
) -> VideoUploadResponse:
    profile = require_player_profile(current_user)
    file_path = save_upload(file, "videos", {".mp4"})

    video = Video(player_id=profile.id, title=title, description=description, file_path=file_path)
    db.add(video)
    db.commit()
    db.refresh(video)
    return VideoUploadResponse(
        id=video.id,
        player_id=video.player_id,
        title=video.title,
        description=video.description,
        file_path=video.file_path,
        uploaded_at=video.uploaded_at,
    )


@router.get("/players/{player_id}/videos", response_model=list[VideoRead])
def get_player_videos(player_id: int, db: Session = Depends(get_db)) -> list[VideoRead]:
    profile = db.get(PlayerProfile, player_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Player not found")
    return [serialize_video(video) for video in sorted(profile.videos, key=lambda item: item.uploaded_at, reverse=True)]


@router.delete("/videos/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("player")),
) -> None:
    profile = require_player_profile(current_user)
    video = db.scalar(select(Video).where(Video.id == video_id, Video.player_id == profile.id))
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    delete_upload(video.file_path)
    db.delete(video)
    db.commit()
