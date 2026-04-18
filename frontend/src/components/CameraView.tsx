import React, { useEffect, useRef, useState } from 'react';
import PersonOverlay from './PersonOverlay.tsx';
import { recognizeFace } from '../services/api';

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

    // 🚀 NO HOT RE-RENDER STATE
    const personRef = useRef(DEFAULT_PERSON);

    // only used to trigger UI refresh (lightweight)
    const [, forceRender] = useState(0);

    const isProcessingRef = useRef(false);

    useEffect(() => {
        let stream: MediaStream;

        const captureAndSend = async () => {
            if (!videoRef.current || !canvasRef.current) return;
            if (isProcessingRef.current) return;

            isProcessingRef.current = true;

            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                isProcessingRef.current = false;
                return;
            }

            ctx.drawImage(video, 0, 0);

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    isProcessingRef.current = false;
                    return;
                }

                try {
                    const data = await recognizeFace(blob);

                    // 🚀 update ref (NO RE-RENDER STORM)
                    personRef.current = {
                        ...DEFAULT_PERSON,
                        ...data,
                        time: new Date().toLocaleString(),
                    };

                    // lightweight UI refresh only
                    forceRender(v => v + 1);

                } catch (err) {
                    console.error('Send error:', err);
                } finally {
                    isProcessingRef.current = false;
                }
            }, 'image/jpeg', 0.9);
        };

        navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
        })
            .then(async (s) => {
                stream = s;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    videoRef.current.setAttribute('playsinline', 'true');
                    videoRef.current.muted = true;
                    videoRef.current.autoplay = true;

                    await new Promise((resolve) => {
                        videoRef.current!.onloadedmetadata = () => resolve(true);
                    });

                    console.log('Camera ready');

                    // first run
                    setTimeout(captureAndSend, 10000);

                    // optional loop (safe now)
                    // setInterval(captureAndSend, 10000);
                }
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
            });

        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(t => t.stop());
            }
        };
    }, []);

    const p = personRef.current;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'black',
            zIndex: 0,
            overflow: 'hidden'
        }}>
            {/* VIDEO (NEVER RE-RENDERS) */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            />

            {/* CANVAS (NO fixed width/height = no layout thrash) */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />

            {/* OVERLAY ALWAYS RENDERS FROM REF */}
            <PersonOverlay
                name={p.name}
                relationship={p.relationship}
                age={p.age}
                diagnosis={p.diagnosis}
                lastConversation={p.lastConversation}
                time={p.time}
                location={p.location}
            />
        </div>
    );
};

export default CameraView;