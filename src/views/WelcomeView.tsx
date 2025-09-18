import React from "react";

type Props = {
  onSelectChat: () => void;
  onSelectCall: () => void;
};

const WelcomeView: React.FC<Props> = ({ onSelectChat, onSelectCall }) => {
  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <img
          src="assets/Fermaglo_Image01.png"
          alt="Brandmark"
          width={48}
          height={48}
          style={{
            objectFit: "contain",
            borderRadius: 10,
            background: "#F8FAFC",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.06) inset",
          }}
        />
      </div>

      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>
        Hi There!
      </div>
      <div style={{ fontSize: 14, color: "#6B7280" }}>
        We are delighted to help you
      </div>

      <button
        onClick={onSelectChat}
        style={{
          width: "100%",
          padding: "12px 18px",
          borderRadius: 999,
          background: "#572c5d",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 18 }}>
          <img
            src="Icon_ChatWithUs.svg"
            width={20}
            style={{
              objectFit: "contain",
            }}
          />
        </span>
        Chat With Us
      </button>

      <button
        onClick={onSelectCall}
        style={{
          width: "100%",
          padding: "12px 18px",
          borderRadius: 999,
          background: "#fff",
          color: "#5B21B6",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          border: "1px solid #5B21B6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 16 }}>
          <img
            src="assets/Icon_CallUs.svg"
            width={20}
            style={{
              objectFit: "contain",
            }}
          />
        </span>{" "}
        Call Us
      </button>
    </div>
  );
};

export default WelcomeView;
