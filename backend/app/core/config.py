import os
from pathlib import Path


class Settings:
    def __init__(self) -> None:
        backend_dir = Path(__file__).resolve().parents[2]
        self.project_dir = backend_dir
        self.database_url = os.getenv("DATABASE_URL", f"sqlite:///{backend_dir / 'frency.db'}")
        self.secret_key = os.getenv("SECRET_KEY", "local-dev-secret")
        self.algorithm = "HS256"
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
        cors = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
        self.cors_origins = [origin.strip() for origin in cors.split(",") if origin.strip()]
        self.upload_root = Path(os.getenv("UPLOAD_ROOT", str(backend_dir / "uploads")))

        for folder in ("videos", "documents", "profile-images"):
            (self.upload_root / folder).mkdir(parents=True, exist_ok=True)


settings = Settings()
