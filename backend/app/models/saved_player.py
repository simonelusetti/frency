from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SavedPlayer(Base):
    __tablename__ = "saved_players"
    __table_args__ = (UniqueConstraint("scout_user_id", "player_user_id", name="uq_saved_player"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    scout_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    player_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
