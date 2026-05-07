import { useState, useRef, useEffect, useCallback } from "react";
import { Send, AlertTriangle, Loader2 } from "lucide-react";
import { containsProfanity, censorText } from "@/lib/profanity-filter";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  created_at: string;
}

export function ChatRoom({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const displayName = userName || "Anonymous";

  // Load initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setMessages(data);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  // Subscribe to realtime inserts
  useEffect(() => {
    const channel = supabase
      .channel("chat-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev.slice(-99), newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    let textToSend = trimmed;

    if (containsProfanity(trimmed)) {
      setWarning("🚫 Watch your language! Swearing is not allowed here. Your message was cleaned up.");
      textToSend = censorText(trimmed);
      setTimeout(() => setWarning(null), 4000);
    } else {
      setWarning(null);
    }

    setInput("");
    await supabase.from("chat_messages").insert({
      author: displayName,
      text: textToSend,
    });
  }, [input, displayName]);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-foreground">💬 Chat</h2>
        <span className="text-xs text-muted-foreground">Live</span>
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
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        )}
        {!loading && messages.length === 0 && (
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
              {m.author} • {formatTime(m.created_at)}
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
        Connected live with other users. Be respectful — swearing is automatically filtered! 🛡️
      </p>
    </div>
  );
}