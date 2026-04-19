# 🧠 Remember Me

> Smart glasses assistant for memory support — Dragonhack 2026

Built in under 24 hours at **Dragonhack 2026** as a hackathon prototype — from idea to working implementation.

---

## 📌 Overview

**Remember Me** is a prototype system designed to assist people with Alzheimer’s disease and dementia by helping them recognize individuals and recall recent interactions.

When a person is detected through a camera, the system displays contextual information such as:

* name of the person
* last interaction summary
* optionally other memory cues (future feature)

The goal is to reduce stress in social situations and improve independence.

---

## 🏗️ Current Status

This is an **early-stage prototype**.

Currently implemented:

* 🐳 PostgreSQL database (Dockerized)
* 📁 Database initialization scripts
* 📦 Project structure for frontend, backend, and ML service (not yet implemented)

Planned:

* Frontend (camera + UI overlay)
* Backend (API + orchestration)
* ML service (face recognition + embeddings)

---

## 🧱 Architecture (planned)

* **Frontend**

    * Captures camera input
    * Displays real-time overlays

* **Backend**

    * Handles API requests
    * Stores users, embeddings, and interactions

* **ML Service**

    * Generates face embeddings
    * Matches faces against stored profiles

* **Database (PostgreSQL)**

    * Stores user profiles
    * Stores embeddings + interaction history

---

## 🗄️ Database (Docker)

We use PostgreSQL running in Docker.

### Start database

```bash
docker compose up -d
```

This will:

* start PostgreSQL 16
* create database `remember_me`
* create user `remember_me_user`
* initialize schema from `./data/*.sql` (first run only)
* persist data in Docker volume `postgres_data`

---

### Stop database

```bash
docker compose down
```

---

### Reset database (wipe all data)

```bash
docker compose down -v
docker compose up
```

### Log in to Postgres inside the container:

```basb
docker exec -it db psql -U remember_me_user -d remember_me
```

---

## 📁 Database initialization

All SQL files inside:

```
./data/
```

are executed automatically **on first startup only**.

Example:

```
data/
 └── 01-schema.sql   → creates tables
 └── 02-seed.sql     → test data (optional)
```

---

## 💻 Frontend

Will be a React + Vite app.

### Local start:

```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Backend

Will be a Node.js (Express) API.

### Planned local start:

```bash
cd backend
npm install
npm run dev
```

---

## 🤖 ML Service

Python FastAPI service for face recognition. Still not confirmed or implemented.

### Planned local start:

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload
```
