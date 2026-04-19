# ML Service — Remember Me

Python FastAPI service responsible for face detection and embedding generation. It receives a face image, verifies a face is present, and returns a 128-dimensional numeric vector (embedding) that represents that face. This vector is what gets stored in and compared against the PostgreSQL database.

## What it does

The service uses **DeepFace** as a high-level wrapper around two underlying steps. First it runs **OpenCV** to detect whether a face exists in the image and where it is. Then it runs the image through **FaceNet**, a neural network that converts a face into 128 numbers. Two photos of the same person will produce vectors that are very close together; two different people will be far apart. All matching logic lives in the backend — this service only produces the vectors.

## Python version requirement

This service requires **Python 3.11**. It will not work on Python 3.12+ because TensorFlow (which DeepFace depends on) does not yet support those versions. If your system Python is newer, see the setup section below.

## Prerequisites

- Python 3.11 (check with `python3.11 --version`)
- If not installed: `brew install python@3.11` on macOS, or `sudo apt install python3.11 python3.11-venv` on Ubuntu/Debian

## Setup

Always use a virtual environment to keep these dependencies isolated from your system Python.

```bash
cd ml-service

# Create the virtual environment using Python 3.11 explicitly
python3.11 -m venv venv

# Activate it — your terminal prompt will show (venv) when active
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install dependencies (this takes 3–5 minutes — TensorFlow is large)
pip install -r requirements.txt
```

## Running

With the virtual environment active:

```bash
uvicorn app.main:app --reload --port 8000
```

The service will be available at `http://localhost:8000`. You can verify it is running:

```bash
curl http://localhost:8000/health
# {"success": true, "data": {"status": "ok"}}
```

The first request after startup will be slow (5–10 seconds) because FaceNet weights are downloaded and loaded into memory. Subsequent requests are fast.

## Endpoints

`POST /recognize` accepts a multipart file upload. The field name must be `file`. It returns a JSON object containing the embedding array and metadata about the detected face. If no face is found it returns a 422 error. If more than one face is found it also returns a 422 — the expectation is that the frontend sends pre-cropped single-face images.

`GET /health` returns a simple status check.

## What is not implemented yet

The service currently returns the embedding but does not perform any database lookup. The intended next step is to add a database query here (or in the backend) that compares the new embedding against stored embeddings using pgvector's cosine similarity operator, and returns the closest match above a confidence threshold.

## Dependencies

`fastapi` and `uvicorn` are the web framework and server. `deepface` is the high-level face analysis library that handles both detection and embedding. `opencv-python-headless` is used internally by DeepFace for face detection — the headless variant is used because GUI window support is not needed and causes issues in server environments. `numpy` is used for image array manipulation. `tf-keras` is required by DeepFace's FaceNet model.
