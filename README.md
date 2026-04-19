# 🧠 Remember Me

> Smart glasses assistant for memory support — Dragonhack 2026

Built in under 24 hours at **Dragonhack 2026** — from idea to working prototype.

> ⚠️ This is a hackathon prototype, not a production system. Expect rough edges.

---

## 📌 Overview

**Remember Me** is a prototype system designed to assist people with Alzheimer's disease and dementia by helping them recognise individuals and recall recent interactions.

When a person is detected through the camera, the system displays contextual information as an AR-style overlay:

- Name and relationship of the person
- Age and diagnosis context
- Summary of the last conversation
- Current time, date, and location

The goal is to reduce social stress and improve independence for people with memory impairment.

---

## 🏗️ Current Status

All core services are implemented and connected end-to-end:

- ✅ Frontend — React + Vite app with live face detection and overlay UI
- ✅ Backend — Express API orchestrating frontend ↔ ML service communication
- ✅ ML Service — Python FastAPI service generating FaceNet face embeddings
- ✅ Database — PostgreSQL Dockerized with schema and seed data

What is not yet complete: real embedding-to-database matching. The backend currently returns stub data. The ML service generates real embeddings — they just are not compared against the database yet. That is the next step.

---

## 🧱 Architecture

```
Browser (camera)
  │
  │  face crop (base64 JPEG, every 2s)
  ▼
Backend :3001  ──── face image (multipart) ──▶  ML Service :8000
  │                                                  │
  │  ◀──── 128-dim FaceNet embedding ───────────────┘
  │
  │  similarity check
  ▼
PostgreSQL :5432
  │
  │  person data (name, relationship, last interaction…)
  ▼
Backend → Frontend → overlay rendered on video feed
```

**Frontend** captures the camera stream, runs `TinyFaceDetector` in-browser to locate faces, crops them, and sends crops to the backend on a 2-second throttle.

**Backend** is the orchestrator. It receives crops from the frontend, forwards them to the ML service, will eventually query the database for the closest embedding match, and returns structured person data.

**ML Service** does the neural network work. It accepts a face image and returns a 128-dimensional vector (embedding) that numerically represents that face. Similar faces produce similar vectors — this is what makes matching possible.

**Database** stores person profiles, their face embeddings, and interaction history.

---

## 🌐 Browser Requirement

**A Chromium-based browser is required.** This means Chrome, Edge, Brave, Arc, or any other browser built on Chromium.

The face detection model (`face-api.js`) and the camera APIs used by the frontend rely on browser features that are either unavailable or significantly less performant in Firefox and Safari. Using a non-Chromium browser will likely result in the camera feed not working or face detection failing silently.

---

## 💻 Running locally (for development)

Running services individually is easier when you are actively developing, because you get faster hot-reloading and direct access to logs.

### Prerequisites

- Node.js ≥ 18
- Python 3.11 (not 3.12+ — TensorFlow does not yet support those)
- Docker (for PostgreSQL only)

### 1. Database

```bash
docker compose up -d db
```

### 2. ML Service

```bash
cd ml-service
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is available at `http://localhost:5173`.

---

## 🗄️ Database

We use PostgreSQL 16, running in Docker. See [`data/README.md`](data/README.md) for details on the schema and how initialisation scripts work.

### Useful commands

Connect to the database inside the container:

```bash
docker exec -it remember_me_db psql -U remember_me_user -d remember_me
```

---

## 📁 Project Structure

```
remember-me/
├── frontend/          # React + Vite + face-api.js
├── backend/           # Node.js Express API
├── ml-service/        # Python FastAPI + DeepFace + FaceNet
├── data/              # SQL initialisation scripts (schema + seed)
├── scripts/           # Utility scripts (model download, etc.)
└── docker-compose.yml # Full stack orchestration
```

---

## 👥 Team

Built at Dragonhack 2026 in under 24 hours.
