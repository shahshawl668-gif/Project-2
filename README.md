# JobTracker AI

JobTracker AI is a production-oriented SaaS starter for tracking job applications, measuring funnel performance, and improving resume alignment with AI-assisted feedback.

## Stack

- Frontend: Next.js App Router, React, Tailwind CSS, Zustand
- Backend: FastAPI, Pydantic, SQLAlchemy, Alembic
- Database: PostgreSQL
- Auth: JWT with bcrypt password hashing
- AI: deterministic keyword matching with optional OpenAI suggestions

## Project structure

```text
.
├── backend
│   ├── alembic
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── models
│   │   ├── schemas
│   │   └── services
│   ├── tests
│   ├── Dockerfile
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── lib
│   │   ├── store
│   │   └── types
│   └── Dockerfile
├── alembic.ini
└── render.yaml
```

## Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Set `DATABASE_URL`, `JWT_SECRET_KEY`, and optionally `OPENAI_API_KEY` in `backend/.env`.

Run migrations and start the API:

```bash
cd ..
backend\.venv\Scripts\alembic -c alembic.ini upgrade head
backend\.venv\Scripts\uvicorn app.main:app --app-dir backend --reload
```

Backend endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/applications`
- `GET /api/applications`
- `PUT /api/applications/{id}`
- `DELETE /api/applications/{id}`
- `POST /api/ai/match`
- `GET /api/analytics`

## Frontend setup

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

By default the frontend expects the API at `http://localhost:8000/api`.

## Testing

Backend:

```bash
backend\.venv\Scripts\python -m pytest backend\tests
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Deployment

- Frontend: deploy `frontend/` to Vercel
- Backend: deploy `backend/` to Render using `render.yaml`
- Database: use the Render Postgres blueprint or swap `DATABASE_URL` for a Neon or Supabase connection string

## MVP highlights

- Email/password authentication with JWTs
- CRUD job application tracking
- Dashboard analytics with weekly trend and conversion rates
- Table and kanban views
- AI resume match analysis with fallback scoring
- Smart insights and reminder-ready metadata
- Phase-2 email parsing integration surface
