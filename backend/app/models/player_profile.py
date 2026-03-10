from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class PlayerProfile(Base):
    __tablename__ = "player_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255), index=True)
    date_of_birth: Mapped[date] = mapped_column(Date)
    nationality: Mapped[str] = mapped_column(String(120), index=True)
    current_team: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    primary_role: Mapped[str] = mapped_column(String(120), index=True)
    secondary_role: Mapped[str | None] = mapped_column(String(120), nullable=True)
    preferred_foot: Mapped[str | None] = mapped_column(String(40), nullable=True, index=True)
    height_cm: Mapped[int | None] = mapped_column(Integer, nullable=True)
    weight_kg: Mapped[int | None] = mapped_column(Integer, nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    availability_status: Mapped[str | None] = mapped_column(String(120), nullable=True)
    profile_image_path: Mapped[str | None] = mapped_column(String(500), nullable=True)

    user = relationship("User", back_populates="player_profile")
    videos = relationship("Video", back_populates="player", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="player", cascade="all, delete-orphan")
