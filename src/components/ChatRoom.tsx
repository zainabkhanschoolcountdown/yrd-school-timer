import { useState, useRef, useEffect, useCallback } from "react";
import { Send, AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { containsProfanity, censorText } from "@/lib/profanity-filter";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedAvatar } from "./AnimatedAvatar";
import { type AvatarConfig, DEFAULT_AVATAR } from "@/lib/avatar";

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  created_at: string;
  avatar?: AvatarConfig | null;
}

export function ChatRoom({ userName, isCreator = false, avatar }: { userName: string; isCreator?: boolean; avatar: AvatarConfig }) {
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
      if (data) setMessages(data as unknown as ChatMessage[]);
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
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => {
          const oldId = (payload.old as { id: string }).id;
          setMessages((prev) => prev.filter((m) => m.id !== oldId));
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
      avatar: avatar as unknown as never,
    });
  }, [input, displayName, avatar]);

  const deleteMessage = useCallback(async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase.from("chat_messages").delete().eq("id", id);
  }, []);

  const clearAll = useCallback(async () => {
    if (!isCreator) return;
    if (!confirm("Clear the entire chat for everyone?")) return;
    setMessages([]);
    await supabase.from("chat_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }, [isCreator]);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-foreground">💬 Chat</h2>
        <div className="flex items-center gap-2">
          {isCreator && messages.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[10px] font-bold rounded-full bg-destructive/15 text-destructive px-2 py-1 hover:bg-destructive/25 transition"
            >
              Clear all
            </button>
          )}
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
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
        {messages.map(m => {
          const isMine = m.author === displayName;
          const canDelete = isMine || isCreator;
          const msgAvatar = m.avatar || DEFAULT_AVATAR;
          return (
            <div
              key={m.id}
              className={`group flex flex-col ${isMine ? "items-end" : "items-start"}`}
            >
              <span className="text-[10px] text-muted-foreground mb-0.5 px-1">
                {m.author} • {formatTime(m.created_at)}
              </span>
              <div className={`flex items-center gap-1.5 ${isMine ? "flex-row-reverse" : ""}`}>
                <AnimatedAvatar config={msgAvatar} size={32} />
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card text-foreground border rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
                {canDelete && (
                  <button
                    onClick={() => deleteMessage(m.id)}
                    aria-label="Delete message"
                    title={isMine ? "Delete your message" : "Delete (Creator)"}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
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