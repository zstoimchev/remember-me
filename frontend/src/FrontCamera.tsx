import React, { useEffect, useRef } from 'react';
import PersonOverlay from './PersonOverlay';

const FrontCamera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    })
    .catch(err => {
      console.error('Error accessing camera:', err);
    });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
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
      zIndex: 0
    }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      {/* Example overlay for demonstration */}
      <PersonOverlay
        name="Jane Doe"
        relationship="Mother"
        age={72}
        diagnosis="Alzheimer's"
        lastConversation="Discussed family photos and vacation plans."
        time="2026-04-18 14:20"
        location="Home, Living Room"
      />
    </div>
  );
};

export default FrontCamera;