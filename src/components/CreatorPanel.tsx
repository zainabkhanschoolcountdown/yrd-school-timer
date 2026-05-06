import { useState } from "react";
import { Crown, UserPlus, UserMinus, LayoutGrid, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
}

interface Widget {
  id: string;
  label: string;
  emoji: string;
}

const STORAGE_USERS_KEY = "yrdsb-creator-users";
const STORAGE_WIDGETS_KEY = "yrdsb-creator-widgets";

function loadList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveList<T>(key: string, list: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(list));
}

const DEFAULT_WIDGETS: Widget[] = [
  { id: "motivation", label: "Daily Motivation", emoji: "💪" },
  { id: "funfact", label: "Fun Fact", emoji: "🧠" },
  { id: "weather", label: "Weather", emoji: "🌤️" },
];

export function CreatorPanel() {
  const [users, setUsers] = useState<User[]>(() => loadList(STORAGE_USERS_KEY));
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = loadList<Widget>(STORAGE_WIDGETS_KEY);
    return saved.length > 0 ? saved : DEFAULT_WIDGETS;
  });
  const [newUser, setNewUser] = useState("");
  const [newWidget, setNewWidget] = useState("");
  const [newEmoji, setNewEmoji] = useState("⭐");

  const addUser = () => {
    if (!newUser.trim()) return;
    const updated = [...users, { id: crypto.randomUUID(), name: newUser.trim() }];
    setUsers(updated);
    saveList(STORAGE_USERS_KEY, updated);
    setNewUser("");
  };

  const removeUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveList(STORAGE_USERS_KEY, updated);
  };

  const addWidget = () => {
    if (!newWidget.trim()) return;
    const updated = [...widgets, { id: crypto.randomUUID(), label: newWidget.trim(), emoji: newEmoji }];
    setWidgets(updated);
    saveList(STORAGE_WIDGETS_KEY, updated);
    setNewWidget("");
    setNewEmoji("⭐");
  };

  const removeWidget = (id: string) => {
    const updated = widgets.filter(w => w.id !== id);
    setWidgets(updated);
    saveList(STORAGE_WIDGETS_KEY, updated);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Creator badge */}
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--color-creator-gold)] to-[var(--color-sunny)] px-5 py-3 shadow-lg">
        <Crown className="text-amber-900" size={24} />
        <span className="font-extrabold text-amber-900 text-lg">Creator Mode</span>
        <Crown className="text-amber-900" size={24} />
      </div>

      {/* User management */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <UserPlus size={20} /> Manage Users
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a user name"
            value={newUser}
            onChange={e => setNewUser(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addUser()}
            className="flex-1 rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={addUser} className="rounded-xl">
            <Plus size={18} />
          </Button>
        </div>
        {users.length > 0 ? (
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id} className="flex items-center justify-between rounded-xl bg-muted px-4 py-2">
                <span className="text-sm font-medium">{u.name}</span>
                <button onClick={() => removeUser(u.id)} className="text-destructive hover:text-destructive/80">
                  <UserMinus size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">No users added yet</p>
        )}
      </div>

      {/* Widget management */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <LayoutGrid size={20} /> Manage Widgets
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Emoji"
            value={newEmoji}
            onChange={e => setNewEmoji(e.target.value)}
            className="w-16 rounded-xl border bg-card px-3 py-3 text-center text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Widget name"
            value={newWidget}
            onChange={e => setNewWidget(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addWidget()}
            className="flex-1 rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={addWidget} className="rounded-xl">
            <Plus size={18} />
          </Button>
        </div>
        <ul className="space-y-2">
          {widgets.map(w => (
            <li key={w.id} className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
              <span className="text-sm font-medium">
                <span className="mr-2 text-lg">{w.emoji}</span>
                {w.label}
              </span>
              <button onClick={() => removeWidget(w.id)} className="text-destructive hover:text-destructive/80">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}