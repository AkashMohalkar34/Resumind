# Deployment Guide

This repo is now prepared for a free-friendly Render setup:

- `resume-db`: free Render Postgres
- `resume-backend`: free Render web service
- `resume-frontend`: free Render static site

Main files:

- Blueprint: [render.yaml](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/render.yaml:1)
- Backend config: [application.properties](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/Resume_backend/src/main/resources/application.properties:1)
- Backend env template: [Resume_backend/.env.example](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/Resume_backend/.env.example:1)

## 1. Create The Blueprint

1. Push the repo to GitHub.
2. In Render, click `New` -> `Blueprint`.
3. Select this repo.
4. Render should detect [render.yaml](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/render.yaml:1).

## 2. What Render Will Create

- `resume-db` as a free Postgres database
- `resume-backend` as a free Docker web service
- `resume-frontend` as a free static site

## 3. Values You Must Enter

Render will prompt for these because they are marked `sync: false`:

### `resume-backend`

- `FRONTEND_URL`
- `GROQ_API_KEY`
- `SERPAPI_API_KEY`

### `resume-frontend`

- `VITE_API_URL`

## 4. Deployment Order

1. Create the Blueprint.
2. Wait for `resume-backend` to get a public URL.
3. Set `resume-frontend` -> `VITE_API_URL` to that backend URL.
4. Wait for `resume-frontend` to get a public URL.
5. Set `resume-backend` -> `FRONTEND_URL` to that frontend URL.
6. Redeploy the affected service if Render does not redeploy automatically.

## 5. Backend Database Wiring

The backend now reads these environment variables:

- `DATABASE_URL`
- `DATABASE_USER`
- `DATABASE_PASSWORD`

Render injects them automatically from the `resume-db` Postgres instance through the Blueprint.

The app also automatically converts Render's private connection string format:

- Input from Render: `postgresql://user:password@host:port/database`
- Runtime JDBC URL used by Spring: `jdbc:postgresql://user:password@host:port/database`

## 6. Health Check

After deploy, verify the backend at:

```txt
https://your-backend-name.onrender.com/api/health
```

Expected response:

```json
{"status":"ok"}
```

## 7. Feedback Endpoint

Email-based feedback has been removed from the deployment requirements.

The backend endpoint `/api/feedback` now returns a disabled response instead of trying to send email.

## 8. Security Note

This repo previously contained real-looking secrets in source config. Those defaults have been removed, but you should still rotate any credentials or API keys that were ever committed before deploying.
