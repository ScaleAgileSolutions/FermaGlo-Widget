import React from "react";

type Props = {
  open: boolean;
  mode: "call" | "chat"; // ← NUEVO: distingue el contexto
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmCloseModal({
  open,
  mode,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  const confirmLabel = mode === "chat" ? "End Chat" : "End Call";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        display: "grid",
        placeItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Close session confirmation"
        style={{
          width: 320,
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #E5E7EB",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          padding: "16px 16px 12px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 12,
          }}
        >
          Are you sure you want to close this session?
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid #4C1D95",
              background: "#4C1D95",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {confirmLabel}
          </button>

          <button
            onClick={onCancel}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid #D1D5DB",
              background: "#fff",
              color: "#4B5563",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
