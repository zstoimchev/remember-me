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

    const [person, setPerson] = useState(DEFAULT_PERSON);

    // 🔒 prevents overlapping requests
    const isProcessingRef = useRef(false);

    useEffect(() => {
        let stream: MediaStream | null = null;

        // ✅ capture refs safely at mount time (fixes ESLint warning)
        const videoEl = videoRef.current;
        const canvasEl = canvasRef.current;

        const captureAndSend = async () => {
            if (!videoEl || !canvasEl) return;
            if (isProcessingRef.current) return;

            isProcessingRef.current = true;

            canvasEl.width = videoEl.videoWidth;
            canvasEl.height = videoEl.videoHeight;

            const ctx = canvasEl.getContext('2d');
            if (!ctx) {
                isProcessingRef.current = false;
                return;
            }

            ctx.drawImage(videoEl, 0, 0);

            canvasEl.toBlob(async (blob) => {
                if (!blob) {
                    isProcessingRef.current = false;
                    return;
                }

                console.log('Sending frame...');

                try {
                    const data = await recognizeFace(blob);

                    setPerson({
                        ...DEFAULT_PERSON,
                        ...data,
                        time: new Date().toLocaleString(),
                    });

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

                if (videoEl) {
                    videoEl.srcObject = stream;

                    videoEl.setAttribute('playsinline', 'true');
                    videoEl.muted = true;
                    videoEl.autoplay = true;

                    await new Promise((resolve) => {
                        videoEl.onloadedmetadata = () => resolve(true);
                    });

                    console.log('Camera ready');

                    setTimeout(captureAndSend, 10000);
                }
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
            });

        return () => {
            // ✅ use local stream variable instead of ref (FIXES ESLint warning)
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

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
            {/* VIDEO */}
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

            {/* CANVAS */}
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

            {/* OVERLAY */}
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