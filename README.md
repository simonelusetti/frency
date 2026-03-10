# Frency Local Prototype

Local monorepo prototype for a football scouting platform with short-form highlight videos, player profiles, scout discovery, saved players, and private notes.

## Stack

- Frontend web: Next.js App Router, TypeScript, Tailwind CSS
- Frontend mobile: Expo, Expo Router, TypeScript
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
apps/
  mobile/
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

## Mobile app setup

```bash
cd apps/mobile
cp .env.example .env
npm install
npm run start
```

Then open the Expo QR code in Expo Go or start a simulator from the Expo CLI.

Mobile env:

- Simulator on the same machine:
  `EXPO_PUBLIC_API_URL=http://127.0.0.1:8000`
- Physical phone on the same Wi-Fi:
  `EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_LAN_IP:8000`

Example:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.68:8000
```

## Environment variables

Backend example: [backend/.env.example](/Users/simonelusetti/code/misc/frency/backend/.env.example)

Frontend example: [frontend/.env.local.example](/Users/simonelusetti/code/misc/frency/frontend/.env.local.example)

Mobile example: [apps/mobile/.env.example](/Users/simonelusetti/code/misc/frency/apps/mobile/.env.example)

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

Mobile:

- `/(auth)/welcome`
- `/(auth)/login`
- `/(auth)/register`
- `/(scout)/discovery`
- `/(scout)/players/[id]`
- `/(scout)/saved`
- `/(player)/dashboard`
- `/(player)/profile-edit`
- `/(player)/upload-video`
- `/(player)/upload-document`

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
- The Expo app reuses the current backend API contract and secure local token storage.
- The Expo app scaffold was added, but dependency installation and device boot were not run in this environment.
