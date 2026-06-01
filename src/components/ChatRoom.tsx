import { useState, useRef, useEffect, useCallback } from "react";
import { Send, AlertTriangle, Loader2, Trash2, Ban } from "lucide-react";
import { containsProfanity, censorText } from "@/lib/profanity-filter";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedAvatar } from "./AnimatedAvatar";
import { RoleBadge } from "./RoleBadge";
import { type AvatarConfig, DEFAULT_AVATAR } from "@/lib/avatar";
import { useRoles } from "@/lib/use-roles";

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  created_at: string;
  avatar?: AvatarConfig | null;
}

const CREATOR_NAME_LOWER = "mountfuji";

export function ChatRoom({
  userName,
  userId,
  isCreator = false,
  avatar,
}: {
  userName: string;
  userId: string | null;
  isCreator?: boolean;
  avatar: AvatarConfig;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const displayName = userName || "Anonymous";
  const { isAdmin, isBanned, addRole } = useRoles();

  const meIsAdmin = isAdmin(displayName);
  const meIsBanned = isBanned(displayName);
  const meIsCreator = isCreator;

  const roleOf = (author: string): "creator" | "admin" | null => {
    if (author.trim().toLowerCase() === CREATOR_NAME_LOWER) return "creator";
    if (isAdmin(author)) return "admin";
    return null;
  };

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

  useEffect(() => {
    const channel = supabase
      .channel(`chat-realtime-${Math.random().toString(36).slice(2)}`)
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
    if (meIsBanned || !userId) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    let textToSend = trimmed;
    if (containsProfanity(trimmed)) {
      setWarning("🚫 Watch your language! Your message was cleaned up.");
      textToSend = censorText(trimmed);
      setTimeout(() => setWarning(null), 4000);
    } else {
      setWarning(null);
    }
    setInput("");
    await supabase.from("chat_messages").insert({
      user_id: userId,
      author: displayName,
      text: textToSend,
      avatar: avatar as unknown as never,
    });
  }, [input, displayName, avatar, meIsBanned, userId]);

  const deleteMessage = useCallback(async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase.from("chat_messages").delete().eq("id", id);
  }, []);

  const banUser = useCallback(async (name: string) => {
    if (!confirm(`Ban "${name}" from chatting?`)) return;
    await addRole(name, "banned");
  }, [addRole]);

  const clearAll = useCallback(async () => {
    if (!meIsCreator) return;
    if (!confirm("Clear the entire chat for everyone?")) return;
    setMessages([]);
    await supabase.from("chat_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }, [meIsCreator]);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const canModerate = meIsCreator || meIsAdmin;

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-foreground">💬 Chat</h2>
        <div className="flex items-center gap-2">
          {meIsCreator && messages.length > 0 && (
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

      <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
        <span>Chatting as <span className="font-bold text-foreground">{displayName}</span></span>
        <RoleBadge role={meIsCreator ? "creator" : meIsAdmin ? "admin" : null} size={10} />
        <span>• Be kind & respectful!</span>
      </p>

      {meIsAdmin && !meIsCreator && (
        <div className="rounded-xl bg-gradient-to-r from-fuchsia-500/15 via-violet-500/15 to-sky-500/15 border border-violet-500/30 px-4 py-2 text-xs font-semibold text-foreground">
          🛡️ Admin powers active — you can delete any message and ban users.
        </div>
      )}

      {meIsBanned && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-2 text-sm font-semibold flex items-center gap-2">
          <Ban size={16} /> You have been banned from chat.
        </div>
      )}

      {warning && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/15 text-destructive px-4 py-2 text-sm font-medium animate-in fade-in">
          <AlertTriangle size={16} />
          {warning}
        </div>
      )}

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
        {messages.map((m) => {
          const isMine = m.author === displayName;
          const canDelete = isMine || canModerate;
          const canBan = canModerate && !isMine && roleOf(m.author) !== "creator";
          const msgAvatar = m.avatar || DEFAULT_AVATAR;
          const authorRole = roleOf(m.author);
          const isAdminMsg = authorRole === "admin";
          const isCreatorMsg = authorRole === "creator";
          return (
            <div key={m.id} className={`group flex flex-col ${isMine ? "items-end" : "items-start"}`}>
              <span className="text-[10px] text-muted-foreground mb-0.5 px-1 flex items-center gap-1">
                <span>{m.author}</span>
                <RoleBadge role={authorRole} size={8} />
                <span>• {formatTime(m.created_at)}</span>
              </span>
              <div className={`flex items-center gap-1.5 ${isMine ? "flex-row-reverse" : ""}`}>
                <div className="relative">
                  <AnimatedAvatar config={msgAvatar} size={32} />
                  {authorRole && (
                    <div className="absolute -bottom-1 -right-1">
                      <RoleBadge role={authorRole} size={9} />
                    </div>
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${
                    isCreatorMsg
                      ? "bg-gradient-to-r from-[var(--color-creator-gold)] to-amber-300 text-amber-900 border border-amber-500/40 rounded-bl-md font-semibold"
                      : isAdminMsg
                      ? "bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500 text-white rounded-bl-md font-semibold"
                      : isMine
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card text-foreground border rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex flex-col gap-1">
                  {canDelete && (
                    <button
                      onClick={() => deleteMessage(m.id)}
                      aria-label="Delete message"
                      title="Delete message"
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {canBan && (
                    <button
                      onClick={() => banUser(m.author)}
                      aria-label="Ban user"
                      title={`Ban ${m.author}`}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Ban size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={meIsBanned ? "You are banned" : "Type a message..."}
          maxLength={300}
          disabled={meIsBanned}
          className="flex-1 rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || meIsBanned}
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