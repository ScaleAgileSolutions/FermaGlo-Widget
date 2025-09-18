import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
  viewKey: string; // cambia cuando cambias de vista
  durationMs?: number; // opcional, default 280ms
  children: React.ReactNode; // la vista actual
};

const AnimatedContainer: React.FC<Props> = ({
  viewKey,
  durationMs = 280,
  children,
}) => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  const [animating, setAnimating] = useState(false);

  const measure = () => {
    const h = innerRef.current?.offsetHeight ?? 0;
    setHeight(h);
  };

  useLayoutEffect(() => {
    measure();
  }, []);

  useEffect(() => {
    if (!innerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (!animating) setHeight(innerRef.current!.offsetHeight);
    });
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [animating]);

  useEffect(() => {
    if (innerRef.current) {
      setHeight(innerRef.current.offsetHeight);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!innerRef.current) return;
          setAnimating(true);
          setHeight(innerRef.current.offsetHeight);
          const timer = setTimeout(() => {
            setAnimating(false);
            setHeight("auto");
          }, durationMs);
          return () => clearTimeout(timer);
        });
      });
    }
  }, [viewKey, durationMs]);

  return (
    <div
      ref={outerRef}
      style={{
        position: "relative",
        overflow: "hidden",
        height,
        transition: `height ${durationMs}ms cubic-bezier(.2,.8,.2,1)`,
        willChange: "height",
      }}
    >
      <div
        key={viewKey}
        ref={innerRef}
        style={{
          animation: `fadeSlideIn ${durationMs}ms ease both`,
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: .001; transform: translateY(6px); }
          to   { opacity: 1;    transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="fadeSlideIn"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedContainer;
