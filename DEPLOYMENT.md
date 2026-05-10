# Deployment Guide

This repo is now prepared for deployment on `Render`.

It includes:

- A Render Blueprint: [render.yaml](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/render.yaml:1)
- A backend Dockerfile: [Resume_backend/Dockerfile](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/Resume_backend/Dockerfile:1)
- A MySQL Dockerfile for Render: [render/mysql/Dockerfile](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/render/mysql/Dockerfile:1)
- Backend env template: [Resume_backend/.env.example](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/Resume_backend/.env.example:1)
- Frontend env template: [resume_frontend/.env.example](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/resume_frontend/.env.example:1)

## What The Blueprint Creates

When you deploy the Blueprint, Render will create:

- `resume-db`: a private MySQL service with a persistent disk
- `resume-backend`: a public Spring Boot web service
- `resume-frontend`: a public static site for the React app

## 1. Push The Repo

Push this repo to GitHub before importing it into Render.

## 2. Create Services From Blueprint

In Render:

1. Click `New`.
2. Choose `Blueprint`.
3. Select this repository.
4. Render will detect [render.yaml](/C:/Users/Akash Mohalkar/Videos/Ai_Generated_Resume-main/render.yaml:1).
5. Review the three services and continue.

## 3. Fill Required Secret Values

The Blueprint intentionally leaves secret values unset with `sync: false`, so Render will prompt you for them in the dashboard.

### For `resume-db`

Set:

- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`

### For `resume-backend`

Set:

- `FRONTEND_URL`
- `GROQ_API_KEY`
- `FEEDBACK_RECIPIENT_EMAIL`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `SERPAPI_API_KEY`

### For `resume-frontend`

Set:

- `VITE_API_URL`

## 4. Deployment Order

Use this order to avoid CORS and broken API URLs:

1. Deploy the Blueprint once.
2. Wait for Render to create the backend public URL.
3. Set `VITE_API_URL` on `resume-frontend` to the backend URL.
4. Wait for Render to create the frontend public URL.
5. Set `FRONTEND_URL` on `resume-backend` to the frontend URL.
6. Redeploy the frontend and backend if needed.

## 5. Exact Values To Use

### `resume-frontend`

For `VITE_API_URL`, use your backend Render URL, for example:

```txt
https://resume-backend.onrender.com
```

### `resume-backend`

For `FRONTEND_URL`, use your frontend Render URL, for example:

```txt
https://resume-frontend.onrender.com
```

The backend already gets these database values from the Blueprint:

- `MYSQL_URL=jdbc:mysql://resume-db:3306/resume_app?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- `MYSQL_USERNAME` from the `resume-db` service
- `MYSQL_PASSWORD` from the `resume-db` service

## 6. Important Notes

- The frontend is configured as a static site with a rewrite rule for React Router.
- The backend uses `/api/health` as its health check path.
- The MySQL service is private and reachable only by other Render services.
- Render’s current docs indicate that Java apps are typically deployed via Docker, which is why the backend uses a Docker-based web service.
- Render’s MySQL guidance uses a private service plus a persistent disk mounted at `/var/lib/mysql`, and this repo is configured the same way.

## 7. Gmail Setup

If you use Gmail for feedback emails, `MAIL_PASSWORD` should be a Gmail App Password, not your normal Gmail login password.

## 8. Security Step

Because this project previously contained real-looking secrets in source config, rotate any credentials or API keys that were ever committed before you go live.
