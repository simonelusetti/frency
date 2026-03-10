from fastapi import APIRouter

from app.api.routes import auth, documents, players, scouts, videos

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(players.router, prefix="/players", tags=["players"])
api_router.include_router(videos.router, tags=["videos"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(scouts.router, prefix="/scouts", tags=["scouts"])
