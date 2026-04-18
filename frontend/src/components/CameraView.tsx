import React, { useEffect, useRef, useState, useCallback } from "react";
import PersonOverlay from "./PersonOverlay.tsx";
import { recognizeFace } from "../services/api";

const DEFAULT_PERSON = {
    known: false,
    name: "Person unknown",
    relationship: null,
    age: null,
    diagnosis: null,
    lastConversation: null,
    time: new Date().toLocaleString(),
    location: "Unknown Location",
};

const CameraView: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const startedRef = useRef(false);
    const isProcessingRef = useRef(false);

    const [person, setPerson] = useState(DEFAULT_PERSON);

    // ----------------------------
    // CAMERA INIT (FIXED)
    // ----------------------------
    useEffect(() => {
        if (startedRef.current) return; // 🔥 prevents StrictMode double run
        startedRef.current = true;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                    audio: false,
                });

                streamRef.current = stream;

                const video = videoRef.current;
                if (!video) return;

                video.srcObject = stream;
                video.muted = true;
                video.playsInline = true;

                await video.play();

                console.log("Camera ready");
            } catch (err) {
                console.error("Camera error:", err);
            }
        };

        startCamera().then();

        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    // ----------------------------
    // CAPTURE FUNCTION (NON-BLOCKING)
    // ----------------------------
    const captureFrame = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;
        if (isProcessingRef.current) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        isProcessingRef.current = true;

        requestAnimationFrame(() => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0);

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    isProcessingRef.current = false;
                    return;
                }

                try {
                    const data = await recognizeFace(blob);

                    setPerson({
                        ...DEFAULT_PERSON,
                        ...data,
                        time: new Date().toLocaleString(),
                    });
                } catch (err) {
                    console.error("Recognition error:", err);
                } finally {
                    isProcessingRef.current = false;
                }
            }, "image/jpeg", 0.6);
        });
    }, []);

    // ----------------------------
    // FRAME CAPTURE LOOP (10s)
    // ----------------------------
    useEffect(() => {
        const interval = setInterval(() => {
            captureFrame();
        }, 10000);

        return () => clearInterval(interval);
    }, [captureFrame]);

    // ----------------------------
    // UI
    // ----------------------------
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "black",
                overflow: "hidden",
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* hidden canvas used only for frame capture */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            <PersonOverlay
                name={person.name}
                relationship={person.relationship}
                age={person.age}
                diagnosis={person.diagnosis}
                lastConversation={person.lastConversation}
                time={person.time}
                location={person.location}
            />
        </div>
    );
};

export default CameraView;