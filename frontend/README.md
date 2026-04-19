# Frontend — Remember Me

React + TypeScript + Vite app that opens the device camera, detects faces in real-time using `face-api.js`, and sends face crops to the backend for recognition. Recognised people are displayed as an AR-style overlay on the video feed.

## What it does

The app runs a `TinyFaceDetector` model entirely in the browser. Every 2 seconds, if a face is visible, it crops that region of the video frame and POSTs it (as base64 JPEG) to the backend. The response is used to render a heads-up overlay showing the person's name, relationship, last conversation summary, and other contextual cues useful for someone with dementia.

## Prerequisites

- Node.js ≥ 18
- The backend running on `http://localhost:3001`

## First-time setup

Before the app can detect faces it needs the `TinyFaceDetector` model weights, which are not committed to the repo (they are binary blobs ~180 KB total). Download them once with the provided script:

```bash
node scripts/download-models.mjs
```

This writes two files into `frontend/public/models/`. Vite will serve them statically so `face-api.js` can fetch them at runtime.

Then install dependencies as usual:

```bash
cd frontend
npm install
```

## Running locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. The browser will ask for camera permission on the first load — you must allow it.

## Building for production

```bash
npm run build
```

Output goes to `frontend/dist/`. Serve it with any static file server.

## Key files

`src/FrontCamera.tsx` is the main component. It owns the camera stream, the detection loop, the throttled backend calls, and the canvas overlay drawing. `src/PersonOverlay.tsx` is a pure presentational component that receives recognition data as props and renders the on-screen labels.

## Notes

The backend URL is hardcoded as `http://localhost:3001/api/recognize` in `FrontCamera.tsx`. Change the `BACKEND_URL` constant at the top of that file if your backend runs elsewhere. The recognition interval (default 2 s) is controlled by `RECOGNIZE_INTERVAL_MS` in the same file.