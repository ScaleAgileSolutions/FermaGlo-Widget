import React, { useEffect, useRef, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "agent" | "user";
  text: string;
  createdAt?: number;
  timeLabel?: string;
};

type Props = {
  title?: string;
  messages: ChatMessage[];
  inputValue: string;
  onChangeInput: (v: string) => void;
  onSend: () => void;
  onEmoji?: () => void;
  onAttach?: () => void;
};

function useNow(intervalMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function timeLabelFrom(tsMs: number, now: number): string {
  const ts = Number.isFinite(tsMs) ? tsMs : now;
  const diffMin = Math.max(0, Math.floor((now - ts) / 60000));
  if (diffMin < 1) return "Just now";
  if (diffMin === 1) return "1 min ago";
  return `${diffMin} mins ago`;
}

const ChatView: React.FC<Props> = ({
  title,
  messages,
  inputValue,
  onChangeInput,
  onSend,
  onEmoji,
  onAttach,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const now = useNow(60_000);

  // autoscroll to bottom when messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // autosize textarea up to 2 lines
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;

    // reset height to measure
    ta.style.height = "auto";

    const cs = window.getComputedStyle(ta);
    const lineHeight = parseFloat(cs.lineHeight || "20") || 20;
    const paddingTop = parseFloat(cs.paddingTop || "0") || 0;
    const paddingBottom = parseFloat(cs.paddingBottom || "0") || 0;
    const borderTop = parseFloat(cs.borderTopWidth || "0") || 0;
    const borderBottom = parseFloat(cs.borderBottomWidth || "0") || 0;

    const maxHeight =
      lineHeight * 2 + paddingTop + paddingBottom + borderTop + borderBottom;
    const desired = Math.min(ta.scrollHeight, maxHeight);

    ta.style.height = `${desired}px`;
    ta.style.overflowY = ta.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [inputValue]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  const sendDisabled = !inputValue.trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        ref={scrollRef}
        style={{
          padding: 16,
          paddingTop: 10,
          height: 380,
          overflowY: "auto",
          background: "#ffffff",
        }}
      >
        {messages.map((m) => {
          const isUser = m.role === "user";
          const computedLabel =
            m.timeLabel ??
            (m.createdAt ? timeLabelFrom(m.createdAt, now) : undefined);

          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                marginBottom: 12,
                justifyContent: isUser ? "flex-end" : "flex-start",
              }}
            >
              {!isUser && (
                <img
                  src="assets/Fermaglo_Image01.png"
                  alt=""
                  width={24}
                  height={24}
                  style={{
                    alignSelf: "flex-start",
                    borderRadius: 6,
                    objectFit: "contain",
                  }}
                />
              )}

              {/* bubble */}
              <div
                style={{
                  maxWidth: "78%",
                  background: "#F3F4F6",
                  color: "#111827",
                  borderRadius: 8,
                  padding: "10px 12px",
                  boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                {computedLabel && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#6B7280",
                      marginTop: 6,
                    }}
                  >
                    {computedLabel}
                  </div>
                )}
              </div>

              {isUser && (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "#E5E7EB",
                    display: "grid",
                    placeItems: "center",
                    color: "#6B7280",
                    fontSize: 14,
                  }}
                >
                  <span style={{ lineHeight: 1 }}>👤</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* composer */}
      <div
        style={{
          padding: 12,
          paddingTop: 10,
          borderTop: "1px solid #F0F2F5",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            border: "1px solid #E5E7EB",
            borderRadius: 999,
            padding: "6px 10px",
            background: "#fff",
          }}
        >
          <textarea
            ref={taRef}
            value={inputValue}
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Type Your Question..."
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "#111827",
              padding: "6px 6px",
              lineHeight: "20px",
              background: "transparent",
              maxHeight: 64, // ~2 lines con padding/border
            }}
            aria-label="Message input"
          />

          <button
            onClick={onSend}
            disabled={sendDisabled}
            style={{
              display: "grid",
              placeItems: "center",
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: sendDisabled ? "#9CA3AF" : "#5B21B6",
              color: "#fff",
              border: "1px solid #4C1D95",
              cursor: sendDisabled ? "not-allowed" : "pointer",
              fontSize: 16,
              transition: "opacity .15s",
              opacity: sendDisabled ? 0.7 : 1,
            }}
            aria-label="Send"
            type="button"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
