import React from "react";
import bgSvg from "@/assets/Fermaglo_Image04.svg";
import markPng from "@/assets/Fermaglo_Image01.png";

type Props = {
  onRestore: () => void;
};

const MinimizedDock: React.FC<Props> = ({ onRestore }) => {
  return (
    <div
      onClick={onRestore}
      role="button"
      aria-label="Open Assistant"
      style={{
        position: "fixed",
        bottom: 10,
        right: 20,
        cursor: "pointer",
        zIndex: 1100,
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 320,
          height: 210,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Fondo */}
        <img
          src={bgSvg}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            userSelect: "none",
            display: "block",
          }}
        />

        {/* Contenido */}
        <div
          style={{
            position: "absolute",
            inset: "15px 15px 30px 15px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "left",
            gap: 20,
          }}
        >
          <div style={{ flex: 1, maxWidth: 160 }}>
            <div
              style={{
                fontWeight: 700,
                color: "#4B2A7A",
                fontSize: 18,
                marginBottom: 6,
              }}
            >
              I’m Glo!
            </div>
            <div
              style={{
                color: "#5B6470",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              Here to guide you with products,
              <br />
              support, or getting started in community.
            </div>
          </div>

          <img
            src={markPng}
            alt="Glo mark"
            style={{
              width: 84,
              height: 84,
              flexShrink: 0,
              objectFit: "contain",
              maxWidth: "none",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MinimizedDock;
