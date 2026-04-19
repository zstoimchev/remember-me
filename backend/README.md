# Backend — Remember Me

Express.js API that sits between the frontend and the ML service. It receives face crop images from the frontend, forwards them to the Python ML service for embedding generation, and will eventually match those embeddings against the PostgreSQL database to return person data.

## What it does

The backend exposes a single main endpoint (`POST /api/recognize`) that the frontend calls every 2 seconds whenever a face is on screen. Currently the recognition logic is a stub that returns hardcoded sample data — this is intentional so the full frontend → backend → overlay pipeline can be validated before the real ML matching is wired in.

The next step is for this service to call the ML service, receive the face embedding, query PostgreSQL for the closest match using pgvector, and return real person data.

## Prerequisites

- Node.js ≥ 18
- The ML service running on `http://localhost:8000` (when real recognition is enabled)
- PostgreSQL running (when DB matching is enabled)

## Setup

```bash
cd backend
npm install
```

## Running

```bash
# Development mode with auto-restart on file changes
npm run dev

# Production
npm start
```

The server listens on `http://localhost:3001`.

## Endpoints

`POST /api/recognize` accepts a JSON body with two fields: `image` (base64-encoded JPEG of the face crop) and `timestamp` (ISO 8601 string). It returns either a recognised person object or `{ recognized: false, person: null }`.

`GET /api/health` returns a simple status check — useful for verifying the server is up before running the frontend.

## Connecting the ML service

When you are ready to swap out the stub, the backend needs to forward the image to the ML service as a multipart file upload (because the Python route uses `UploadFile`). Install the required packages:

```bash
npm install node-fetch form-data
```

Then in the recognize handler, decode the base64 string into a Buffer, attach it to a `FormData` instance under the field name `file`, and POST it to `http://localhost:8000/recognize`. The ML service will return an embedding array in `data.embedding` which you then use to query PostgreSQL.

## Environment variables

There are none required for the stub. When real DB and ML connections are added, create a `.env` file in this directory:

```
PORT=3001
ML_SERVICE_URL=http://localhost:8000
DATABASE_URL=postgres://remember_me_user:password@localhost:5432/remember_me
```