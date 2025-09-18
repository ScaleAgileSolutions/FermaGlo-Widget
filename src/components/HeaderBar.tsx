import React from "react";

type Props = {
  title: string;
  showBack?: boolean;
  showMinimize?: boolean;
  showClose?: boolean;
  closeEnabled?: boolean; // para decidir si abre modal
  onBack?: () => void;
  onMinimize?: () => void;
  onRequestClose?: () => void;
};

const HeaderBar: React.FC<Props> = ({
  title,
  showBack = true,
  showMinimize = true,
  showClose = true,
  closeEnabled = false,
  onBack,
  onMinimize,
  onRequestClose,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderBottom: "1px solid #F0F2F5",
      }}
    >
      {showBack && (
        <button
          aria-label="Back"
          style={btn}
          onClick={(e) => {
            e.stopPropagation();
            onBack?.();
          }}
        >
          <img
            src="/Icon_BackArrow.svg"
            alt=""
            width={20}
            height={20}
            style={img}
          />
        </button>
      )}

      <div style={{ fontWeight: 600, fontSize: 16, color: "#0b6060" }}>
        {title}
      </div>

      <div style={{ marginLeft: "auto" }} />

      {showMinimize && (
        <button
          aria-label="Minimize"
          style={btn}
          onClick={(e) => {
            e.stopPropagation();
            onMinimize?.();
          }}
        >
          <img
            src="/Icon_Minimized.svg"
            alt=""
            width={20}
            height={20}
            style={img}
          />
        </button>
      )}

      {showClose && (
        <button
          aria-label="Close"
          style={{ ...btn, cursor: closeEnabled ? "pointer" : "default" }}
          onClick={(e) => {
            e.stopPropagation();
            if (!closeEnabled) return;
            onRequestClose?.();
          }}
        >
          <img
            src="/Icon_Close.svg"
            alt=""
            width={20}
            height={20}
            style={img}
          />
        </button>
      )}
    </div>
  );
};

const btn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 6,
  borderRadius: 8,
};

const img: React.CSSProperties = {
  display: "block",
  pointerEvents: "none",
  userSelect: "none",
};

export default HeaderBar;
