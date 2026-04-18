import React, { useState, useRef } from 'react';

const SpeechToText: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');
  const recognitionRef = useRef<any>(null);

  const toggle = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      setText(transcript);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <div style={{ position: 'fixed', left: 32, top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 220, pointerEvents: 'auto' }}>
      <button onClick={toggle} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', background: listening ? 'rgba(220,53,53,0.85)' : 'rgba(0,0,0,0.7)', color: 'white', fontSize: '1rem', fontWeight: 600, pointerEvents: 'auto' }}>
        {listening ? '⏹ Stop' : '🎤 Speak'}
      </button>
      {text && (
        <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px 14px', borderRadius: 8, fontSize: '1rem', lineHeight: 1.5 }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default SpeechToText;