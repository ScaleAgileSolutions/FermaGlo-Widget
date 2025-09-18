const BASE = "http://localhost:3001/api/retell";

export async function startChat(agentId: string, metadata?: any) {
  const r = await fetch(`${BASE}/chat/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent_id: agentId, metadata }),
  });
  if (!r.ok) throw new Error("startChat failed");
  return r.json() as Promise<{ chat_id: string }>;
}

export async function sendMessage(chat_id: string, userText: string) {
  const r = await fetch(`${BASE}/chat/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, userText }),
  });
  if (!r.ok) throw new Error("sendMessage failed");
  return r.json() as Promise<{
    messages: {
      created_timestamp(created_timestamp: any): number;
      message_id: string;
      role: "user" | "assistant" | "system";
      content: string;
    }[];
  }>;
}

export async function endChat(chat_id: string) {
  const r = await fetch(`${BASE}/chat/end`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id }),
  });
  if (!r.ok) throw new Error("endChat failed");
  return r.json() as Promise<{ ok: boolean }>;
}
