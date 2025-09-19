import React from "react";
import { BsFillTelephoneFill } from "react-icons/bs";

type Props = {
  callState: "inactive" | "active" | "offline";
  micStatus: "active" | "muted" | "denied" | "checking";
  onStartEnd: () => void; // handleWidgetClick
  onMute: () => void;
  onUnmute: () => void;
};

const CallView: React.FC<Props> = ({
  callState,
  micStatus,
  onStartEnd,
  onMute,
  onUnmute,
}) => {
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 140,
            height: 140,
            display: "grid",
            placeItems: "center",
          }}
        >
          <img
            src={
              callState === "active" && micStatus === "active"
                ? "assets/Fermaglo_Image03.gif"
                : "assets/Fermaglo_Image02.png"
            }
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform:
                callState === "active" && micStatus === "active"
                  ? "translate(-50%, -50%) scale(1.35)"
                  : "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
          <img
            src="assets/Fermaglo_Image01.png"
            alt="Glo brand mark"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 92,
              height: 92,
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            gap: 16,
          }}
        >
          {callState === "active" ? (
            micStatus === "active" ? (
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
                Assisting Now
              </div>
            ) : (
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
                Muted
              </div>
            )
          ) : (
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
              Glo is <span style={{ color: "#22C55E" }}>Available</span>
            </div>
          )}

          {callState === "active" ? (
            micStatus === "active" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMute();
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: "1px solid #E5E7EB",
                  background: "#EDE7F6",
                  color: "#4B5563",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  minWidth: 140,
                }}
              >
                Mute
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnmute();
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: "1px solid #D1D5DB",
                  background: "#6B21A8",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  minWidth: 140,
                }}
              >
                Unmute
              </button>
            )
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEnd();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 18px",
                borderRadius: 999,
                border: "1px solid #D1D5DB",
                background: "#ffffff",
                color: "#6B21A8",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#F3E8FF",
                }}
              >
                <BsFillTelephoneFill />
              </span>
              Start a Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallView;
