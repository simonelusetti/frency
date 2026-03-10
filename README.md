# Frency Local Prototype

Local monorepo prototype for a football scouting platform with short-form highlight videos, player profiles, scout discovery, saved players, and private notes.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy
- Database: SQLite
- File storage: local filesystem
- Auth: JWT

## Monorepo structure

```text
backend/
  app/
    api/
    core/
    db/
    models/
    schemas/
    services/
    main.py
frontend/
  app/
  components/
  lib/
```

## Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # optional, defaults are already local-friendly
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## Frontend setup

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## Environment variables

Backend example: [backend/.env.example](/Users/simonelusetti/code/misc/frency/backend/.env.example)

Frontend example: [frontend/.env.local.example](/Users/simonelusetti/code/misc/frency/frontend/.env.local.example)

## Demo accounts

- Scout: `scout@demo.com` / `password123`
- Player: `player@demo.com` / `password123`

These are seeded automatically on first backend startup if the SQLite database is empty.

## Main routes

Frontend:

- `/`
- `/login`
- `/register`
- `/player/dashboard`
- `/player/profile/edit`
- `/player/videos/upload`
- `/player/documents/upload`
- `/players/1`
- `/scout/discovery`
- `/scout/players/1`
- `/scout/saved`

Backend:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /players`
- `GET /players/{id}`
- `GET /players/me`
- `POST /players/me`
- `PUT /players/me`
- `POST /videos/upload`
- `GET /players/{id}/videos`
- `DELETE /videos/{id}`
- `POST /documents/upload`
- `GET /documents/me`
- `POST /scouts/save/{player_id}`
- `DELETE /scouts/save/{player_id}`
- `GET /scouts/saved`
- `POST /scouts/notes/{player_id}`
- `GET /scouts/notes/{player_id}`

## Notes

- SQLite database file is created at `backend/frency.db`.
- Uploads are stored in `backend/uploads/`.
- Videos are public on player profiles in this MVP.
- Documents are private to the owning player in this MVP.
- This is intentionally local-first and avoids production hardening or cloud storage abstractions.
