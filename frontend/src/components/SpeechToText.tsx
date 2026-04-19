import React, { useState, useRef, useEffect } from "react";

interface SpeechToTextProps {
  onSummarized?: (summary: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onSummarized }) => {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textRef = useRef<string>("");

  const toggle = async () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);

      const currentText = textRef.current;
      console.log("Captured text on stop:", currentText);

      if (currentText && onSummarized) {
        setLoading(true);
        try {
          const response = await fetch("http://localhost:3000/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: currentText }),
          });

          if (!response.ok) {
            const err = await response.json();
            console.error("Summarize backend error:", err);
            return;
          }

          const data = await response.json();
          console.log("Summary received:", data.summary);
          onSummarized(data.summary);
          setText("");
          textRef.current = "";
        } catch (err) {
          console.error("Summarize fetch error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("No text captured or onSummarized not provided.");
      }
      return;
    }

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setText(transcript);
      textRef.current = transcript;
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const buttonBackground = listening
    ? "rgba(220,53,53,0.85)"
    : loading
      ? "rgba(100,100,100,0.85)"
      : "rgba(0,0,0,0.7)";

  const buttonLabel = loading
    ? "⏳ Summarizing..."
    : listening
      ? "⏹ Stop"
      : "🎤 Speak";

  return (
    <div
      style={{
        position: "fixed",
        left: 32,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 220,
        pointerEvents: "auto",
      }}
    >
      <button
        onClick={toggle}
        disabled={loading}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          border: "none",
          cursor: loading ? "wait" : "pointer",
          background: buttonBackground,
          color: "white",
          fontSize: "1rem",
          fontWeight: 600,
          pointerEvents: "auto",
        }}
      >
        {buttonLabel}
      </button>
      {text && !loading && (
        <div
          style={{
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: "1rem",
            lineHeight: 1.5,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
