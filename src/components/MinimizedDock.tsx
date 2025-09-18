import React from "react";

// importa los assets para que webpack genere la URL correcta
import bgUrl from "../assets/Fermaglo_Image04.svg";
import markUrl from "../../assets/Fermaglo_Image01.png";

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
        right: 0,
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
        }}
      >
        <img
          src={bgUrl}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            userSelect: "none",
          }}
          loading="lazy"
        />

        <div
          style={{
            position: "absolute",
            inset: "0px 5px 30px 15px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 150 }}>
            <div style={{ fontWeight: 700, color: "#4B2A7A", fontSize: 18 }}>
              I’m Glo!
            </div>
            <div style={{ color: "#5B6470", fontSize: 13, lineHeight: 1.4 }}>
              Here to guide you with products,
              <br />
              support, or getting started in community.
            </div>
          </div>

          <img
            src={markUrl}
            alt="Glo mark"
            width={84}
            height={84}
            style={{ objectFit: "contain" }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default MinimizedDock;
