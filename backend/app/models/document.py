from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("player_profiles.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    document_type: Mapped[str | None] = mapped_column(String(120), nullable=True)
    file_path: Mapped[str] = mapped_column(String(500))
    visibility: Mapped[str] = mapped_column(String(20), default="private")
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    player = relationship("PlayerProfile", back_populates="documents")
