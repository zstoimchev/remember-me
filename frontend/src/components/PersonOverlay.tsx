import React, { useState } from "react";
import SpeechToText from "./SpeechToText";

interface PersonOverlayProps {
  name: string;
  relationship: string;
  age: number;
  diagnosis: string;
  lastConversation: string;
  time: string;
  location: string;
}

const rightColumnStyle: React.CSSProperties = {
  position: "fixed",
  right: 32,
  top: 32,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 16,
  zIndex: 10,
  pointerEvents: "none",
};

const overlayBoxStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.7)",
  color: "white",
  padding: "16px 20px",
  borderRadius: "12px",
  minWidth: "220px",
  fontSize: "1.1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 8,
  pointerEvents: "none",
};

const conversationBottomRightStyle: React.CSSProperties = {
  position: "fixed",
  right: 32,
  bottom: 32,
  background: "rgba(0,0,0,0.8)",
  color: "white",
  padding: "20px 28px",
  borderRadius: "14px",
  minWidth: "320px",
  maxWidth: "480px",
  fontSize: "1.25rem",
  lineHeight: 1.5,
  boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
  pointerEvents: "none",
  zIndex: 10,
};

const diagnosisBoxStyle: React.CSSProperties = {
  position: "fixed",
  left: 32,
  bottom: 32,
  background: "rgba(0,0,0,0.7)",
  color: "white",
  padding: "10px 16px",
  borderRadius: "10px",
  zIndex: 10,
  pointerEvents: "none",
  fontSize: "1.05rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
};

const timeLocationBoxStyle: React.CSSProperties = {
  position: "fixed",
  left: 32,
  top: 32,
  background: "rgba(0,0,0,0.7)",
  color: "white",
  padding: "10px 16px",
  borderRadius: "10px",
  zIndex: 10,
  pointerEvents: "none",
  fontSize: "1.05rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
};

const PersonOverlay: React.FC<PersonOverlayProps> = ({
  name,
  relationship,
  age,
  diagnosis,
  lastConversation,
  time,
  location,
}) => {
  const [summarizedConversation, setSummarizedConversation] = useState<
    string | null
  >(null);

  return (
    <>
      <SpeechToText onSummarized={setSummarizedConversation} />
      {/* Right top: personal info */}
      <div style={rightColumnStyle}>
        <div style={overlayBoxStyle}>
          <div style={{ fontWeight: "bold", fontSize: "1.25rem" }}>{name}</div>
          <div style={{ fontSize: "1.1rem", opacity: 0.85 }}>
            {relationship}
          </div>
          <div>Age: {age}</div>
        </div>
      </div>
      {/* Bottom right: last conversation summary */}
      <div style={conversationBottomRightStyle}>
        <span style={{ fontWeight: 600, fontSize: "1.15rem", opacity: 0.9 }}>
          Last conversation summary:
        </span>
        <div style={{ marginTop: 8 }}>
          {summarizedConversation ?? lastConversation}
        </div>
      </div>
      {/* Bottom left: diagnosis */}
      <div style={diagnosisBoxStyle}>
        <span style={{ fontWeight: 500 }}>Diagnosis:</span> {diagnosis}
      </div>
      {/* Top left: time/date and location */}
      <div style={timeLocationBoxStyle}>
        <div>{time}</div>
        <div>{location}</div>
      </div>
    </>
  );
};

export default PersonOverlay;
