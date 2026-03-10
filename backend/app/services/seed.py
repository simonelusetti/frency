from datetime import date

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.player_profile import PlayerProfile
from app.models.scout_profile import ScoutProfile
from app.models.user import User


def seed_demo_data() -> None:
    db = SessionLocal()
    try:
        existing_user = db.scalar(select(User.id))
        if existing_user:
            return

        scout = User(email="scout@demo.com", password_hash=hash_password("password123"), role="scout")
        player_one = User(email="player@demo.com", password_hash=hash_password("password123"), role="player")
        player_two = User(email="winger@demo.com", password_hash=hash_password("password123"), role="player")
        db.add_all([scout, player_one, player_two])
        db.flush()

        db.add(ScoutProfile(user_id=scout.id))
        db.add_all(
            [
                PlayerProfile(
                    user_id=player_one.id,
                    full_name="Luca Bianchi",
                    date_of_birth=date(2003, 5, 12),
                    nationality="Italy",
                    current_team="AS Verona Academy",
                    primary_role="Striker",
                    secondary_role="Winger",
                    preferred_foot="Right",
                    height_cm=184,
                    weight_kg=77,
                    bio="Fast attacking player focused on pressing, movement in behind, and finishing in transition.",
                    availability_status="Open to trials",
                ),
                PlayerProfile(
                    user_id=player_two.id,
                    full_name="Mateo Silva",
                    date_of_birth=date(2005, 8, 28),
                    nationality="Portugal",
                    current_team="Braga U21",
                    primary_role="Winger",
                    secondary_role="Attacking Midfielder",
                    preferred_foot="Left",
                    height_cm=176,
                    weight_kg=70,
                    bio="Direct 1v1 winger with strong carry volume and a quick release on cut-inside shots.",
                    availability_status="Available now",
                ),
            ]
        )
        db.commit()
    finally:
        db.close()
