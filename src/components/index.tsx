import React, { useEffect, useRef, useState } from "react";
import AnimatedContainer from "./AnimatedContainer";
import ModalWindow from "./ChatWidget/ModalWindow";
import ConfirmCloseModal from "./ConfirmCloseModal";
import { getWidgetConfig } from "../constants/config";
import "../../src/app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  startChat,
  sendMessage,
  endChat as apiEndChat,
} from "../services/retellClient";

import HeaderBar from "./HeaderBar";
import WelcomeView from "../views/WelcomeView";
import CallView from "../views/CallView";
import ChatView from "../views/ChatView";
import MinimizedDock from "./MinimizedDock";

type MicState = "active" | "muted" | "denied" | "checking";
type CallState = "inactive" | "active" | "offline";
type View = "welcome" | "call" | "chat";

function ChatWidget() {
  const [visible, setVisible] = useState<boolean>(false);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  const [micStatus, setMicStatus] = useState<MicState>("checking");
  const [callState, setCallState] = useState<CallState>("inactive");
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [currentView, setCurrentView] = useState<View>("welcome");
  const [isMinimized, setIsMinimized] = useState(true);
  const [lastView, setLastView] = useState<View>("welcome");

  const [chatId, setChatId] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const chatInitRequestedRef = useRef(false);

  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [currentAgentName, setCurrentAgentName] = useState(
    getWidgetConfig().agentName
  );
  const [currentStage, setCurrentStage] = useState("Speak With");

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: "m1",
      role: "agent" as const,
      text: "Hi, my name is Glo. How can I assist you today?",
      createdAt: Date.now() - 60_000,
    },
  ]);

  useEffect(() => {
    const saved = sessionStorage.getItem("retell_chat_id");
    if (saved) setChatId(saved);
  }, []);
  useEffect(() => {
    if (chatId) sessionStorage.setItem("retell_chat_id", chatId);
    else sessionStorage.removeItem("retell_chat_id");
  }, [chatId]);

  useEffect(() => {
    if (currentView !== "chat") return;
    if (chatId) return; // already have one
    if (chatInitRequestedRef.current) return; // already requested in this mount

    chatInitRequestedRef.current = true; // <-- block duplicates immediately

    (async () => {
      try {
        setIsStartingChat(true);
        const agentId = "agent_e8431920dc7de662b6c6dec4a9";
        const { chat_id } = await startChat(agentId);
        setChatId(chat_id);
      } catch (e) {
        console.error("Failed to start chat", e);
        chatInitRequestedRef.current = false; // allow retry on error
      } finally {
        setIsStartingChat(false);
      }
    })();
  }, [currentView, chatId]);

  const handleMinimize = () => {
    setLastView(currentView);
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setCurrentView(lastView || "welcome");
  };

  async function checkMic() {
    if (!navigator.mediaDevices || visible) {
      setVisible(false);
      setCurrentAgentName(getWidgetConfig().agentName);
      setCurrentStage("Speak With");
      stopMicrophone();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setMicStream(stream);
      (window as any).retellMicrophoneStream = stream;
      setMicStatus("active");
      setVisible(true);
    } catch {
      setMicStatus("denied");
    }
  }

  const muteMicrophone = () => {
    const sdk = (window as any).retellWebClient;
    if (sdk?.mute) sdk.mute();
    micStream?.getAudioTracks().forEach((t) => (t.enabled = false));
    setMicStatus("muted");
  };

  const unmuteMicrophone = () => {
    const sdk = (window as any).retellWebClient;
    if (sdk?.unmute) sdk.unmute();
    micStream?.getAudioTracks().forEach((t) => (t.enabled = true));
    setMicStatus("active");
  };

  const stopMicrophone = () => {
    if (!micStream) return;
    micStream.getTracks().forEach((track) => track.stop());
    setMicStream(null);
  };

  const endCallSession = () => {
    setVisible(false);
    setCurrentAgentName(getWidgetConfig().agentName);
    setCurrentStage("Speak With");
    stopMicrophone();
    setCallState("offline");
  };

  const handleWidgetClick = () => {
    if (callState === "inactive") {
      checkMic();
      setCallState("active");
    } else if (callState === "active") {
      endCallSession();
    } else if (callState === "offline") {
      checkMic();
      setCallState("active");
    }
  };

  function toEpochMs(v: unknown): number {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : Date.now();
  }

  useEffect(() => {
    (window as any).muteMicrophone = muteMicrophone;
    (window as any).unmuteMicrophone = unmuteMicrophone;
    (window as any).stopMicrophone = stopMicrophone;
  }, []);

  useEffect(() => () => stopMicrophone(), []);
  const panelWidth = isMinimized
    ? 0
    : currentView === "welcome"
    ? 280
    : currentView === "chat"
    ? 330
    : 380;

  const motionEasing = "cubic-bezier(.2,.8,.2,1)";
  const motionMs = 280;

  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || sending) return;

    const userMsg = {
      id: String(Date.now()),
      role: "user" as const,
      text: trimmed,
      createdAt: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    try {
      setSending(true);

      let id = chatId;
      if (!id) {
        const cfg: any = getWidgetConfig();
        const agentId = cfg.chatAgentId || cfg.agentId || "";
        const start = await startChat(agentId);
        id = start.chat_id;
        setChatId(id);
      }

      const res = await sendMessage(id!, trimmed);

      const mapped = (res.messages || [])
        .filter(
          (m) => m && typeof m.content === "string" && m.content.trim().length
        )
        .map((m) => ({
          id: m.message_id || String(Date.now() + Math.random()),
          role:
            m.role === "assistant"
              ? ("agent" as const)
              : (m.role as "agent" | "user" | "system"),
          text: m.content,
          createdAt: toEpochMs(m.created_timestamp),
        }));

      if (mapped.length) {
        setChatMessages((prev) => [...prev, ...mapped]);
      }
    } catch (e) {
      console.error("sendMessage error:", e);
      // opcional: empuja un mensaje de error del sistema
      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 2),
          role: "agent" as const,
          text: "Sorry—there was a connection issue. Please try again.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // helper local para mapear mensajes del backend a tu UI
  function appendAssistant(messages: { role: string; content: string }[]) {
    const assistantTexts = messages
      .filter((m) => m.role === "assistant" && m.content?.trim())
      .map((m) => ({
        id: String(Date.now() + Math.random()),
        role: "agent" as const,
        text: m.content,
        timeLabel: "Just now",
      }));
    if (assistantTexts.length) {
      setChatMessages((prev) => [...prev, ...assistantTexts]);
    }
  }

  function useNow(intervalMs: number) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), intervalMs);
      return () => clearInterval(id);
    }, [intervalMs]);

    return now;
  }

  if (isMinimized) {
    return <MinimizedDock onRestore={handleRestore} />;
  }
  return (
    <div ref={widgetRef}>
      <ModalWindow visible={visible} setVisible={setVisible} />

      <div
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: panelWidth,
          borderRadius: 16,
          background: "#fff",
          boxShadow: "0 8px 15px rgba(0,0,0,0.18)",
          border: "1px solid #E5E7EB",
          zIndex: 1000,
          overflow: "hidden",
          fontFamily:
            "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
          transition: `width ${motionMs}ms ${motionEasing}`,
          willChange: "width",
        }}
      >
        <HeaderBar
          title={
            currentView === "welcome"
              ? "Welcome"
              : currentView === "chat"
              ? "Chat with Us"
              : "Call Us"
          }
          showBack={currentView !== "welcome"}
          showMinimize={true}
          showClose={currentView !== "welcome"}
          closeEnabled={currentView === "chat" || callState === "active"}
          onBack={() => setCurrentView("welcome")}
          onMinimize={handleMinimize}
          onRequestClose={() => setShowConfirmClose(true)}
        />

        <AnimatedContainer viewKey={currentView}>
          {currentView === "welcome" ? (
            <WelcomeView
              onSelectChat={() => setCurrentView("chat")}
              onSelectCall={() => setCurrentView("call")}
            />
          ) : currentView === "chat" ? (
            <ChatView
              messages={chatMessages}
              inputValue={chatInput}
              onChangeInput={setChatInput}
              onSend={handleSend}
              onEmoji={() => console.log("emoji")}
              onAttach={() => console.log("attach")}
            />
          ) : (
            <CallView
              callState={callState}
              micStatus={micStatus}
              onStartEnd={handleWidgetClick}
              onMute={muteMicrophone}
              onUnmute={unmuteMicrophone}
            />
          )}
        </AnimatedContainer>

        <ConfirmCloseModal
          open={showConfirmClose}
          mode={currentView === "chat" ? "chat" : "call"}
          onConfirm={async () => {
            setShowConfirmClose(false);
            if (currentView === "chat") {
              try {
                if (chatId) await apiEndChat(chatId);
              } catch (e) {
                console.error(e);
              }
              setChatId(null);
              chatInitRequestedRef.current = false; // allow new session next time
              setChatMessages([]);
              setCurrentView("welcome");
            } else {
              endCallSession();
              setCurrentView("welcome");
            }
          }}
          onCancel={() => setShowConfirmClose(false)}
        />

        <div
          style={{
            padding: "8px 12px 14px",
            borderTop: "1px solid #F0F2F5",
            textAlign: "center",
            fontSize: 12,
            color: "#6B7280",
          }}
        >
          Powered by <span style={{ fontWeight: 600 }}>ConnexUs AI</span>
        </div>
      </div>
    </div>
  );
}

export default ChatWidget;
