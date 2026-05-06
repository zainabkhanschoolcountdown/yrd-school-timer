import { useState, useRef, useEffect } from "react";
import { Send, AlertTriangle } from "lucide-react";
import { containsProfanity, censorText } from "@/lib/profanity-filter";

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

const STORAGE_KEY = "yrdsb-chat-messages";
const MAX_MESSAGES = 100;

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveMessages(msgs: ChatMessage[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_MESSAGES)));
}

export function ChatRoom({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const displayName = userName || "Anonymous";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Check for profanity
    if (containsProfanity(trimmed)) {
      setWarning("🚫 Watch your language! Swearing is not allowed here. Your message was cleaned up.");
      const cleaned = censorText(trimmed);
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        author: displayName,
        text: cleaned,
        timestamp: Date.now(),
      };
      const updated = [...messages, msg];
      setMessages(updated);
      saveMessages(updated);
      setInput("");
      setTimeout(() => setWarning(null), 4000);
      return;
    }

    setWarning(null);
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      author: displayName,
      text: trimmed,
      timestamp: Date.now(),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    saveMessages(updated);
    setInput("");
  };

  const clearChat = () => {
    setMessages([]);
    saveMessages([]);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-foreground">💬 Chat</h2>
        <button
          onClick={clearChat}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Clear chat
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Chatting as <span className="font-bold text-foreground">{displayName}</span> • Be kind & respectful!
      </p>

      {/* Warning banner */}
      {warning && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/15 text-destructive px-4 py-2 text-sm font-medium animate-in fade-in">
          <AlertTriangle size={16} />
          {warning}
        </div>
      )}

      {/* Messages area */}
      <div className="h-72 overflow-y-auto rounded-2xl bg-muted/50 p-3 space-y-2 border">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No messages yet. Say hi! 👋
          </p>
        )}
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.author === displayName ? "items-end" : "items-start"}`}
          >
            <span className="text-[10px] text-muted-foreground mb-0.5 px-1">
              {m.author} • {formatTime(m.timestamp)}
            </span>
            <div
              className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${
                m.author === displayName
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card text-foreground border rounded-bl-md"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          maxLength={300}
          className="flex-1 rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="rounded-xl bg-primary px-4 py-3 text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground text-center">
        Messages are stored locally on your device. Be respectful — swearing is automatically filtered! 🛡️
      </p>
    </div>
  );
}