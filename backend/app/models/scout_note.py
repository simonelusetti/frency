from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ScoutNote(Base):
    __tablename__ = "scout_notes"
    __table_args__ = (UniqueConstraint("scout_user_id", "player_user_id", name="uq_scout_note"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    scout_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    player_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    note: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
