import { useState } from "react";
import { Crown, LayoutGrid, Plus, X, Shield, Ban, Search, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/lib/use-roles";
import { useWidgets } from "@/lib/use-widgets";
import { RoleBadge } from "./RoleBadge";
import { GameRecommendationsList } from "./GameRecommendationsList";

export function CreatorPanel() {
  const { admins, banned, addRole, removeRole } = useRoles();
  const { widgets, addWidget, removeWidget } = useWidgets();

  const [searchName, setSearchName] = useState("");
  const [banName, setBanName] = useState("");
  const [newWidget, setNewWidget] = useState("");
  const [newEmoji, setNewEmoji] = useState("⭐");

  const promoteAdmin = async () => {
    const n = searchName.trim();
    if (!n) return;
    await addRole(n, "admin");
    setSearchName("");
  };

  const ban = async () => {
    const n = banName.trim();
    if (!n) return;
    await addRole(n, "banned");
    setBanName("");
  };

  const adminList = Array.from(admins).sort();
  const bannedList = Array.from(banned).sort();

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--color-creator-gold)] to-[var(--color-sunny)] px-5 py-3 shadow-lg">
        <Crown className="text-amber-900" size={24} />
        <span className="font-extrabold text-amber-900 text-lg">Creator Mode</span>
        <Crown className="text-amber-900" size={24} />
      </div>

      {/* Promote to admin */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Shield size={20} /> Make Admin
        </h3>
        <p className="text-xs text-muted-foreground">
          Type a username (case-insensitive) to grant admin powers.
        </p>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search username..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && promoteAdmin()}
              className="w-full rounded-xl border bg-card pl-9 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={promoteAdmin} className="rounded-xl">
            <UserCheck size={18} />
          </Button>
        </div>
        {adminList.length > 0 ? (
          <ul className="space-y-2">
            {adminList.map((name) => (
              <li key={name} className="flex items-center justify-between rounded-xl bg-muted px-4 py-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <RoleBadge role="admin" size={10} /> {name}
                </span>
                <button
                  onClick={() => removeRole(name, "admin")}
                  className="text-destructive hover:text-destructive/80 text-xs font-bold"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">No admins yet</p>
        )}
      </div>

      {/* Ban users */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Ban size={20} /> Banned Users
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Username to ban"
            value={banName}
            onChange={(e) => setBanName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ban()}
            className="flex-1 rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
          />
          <Button onClick={ban} variant="destructive" className="rounded-xl">
            <Ban size={18} />
          </Button>
        </div>
        {bannedList.length > 0 ? (
          <ul className="space-y-2">
            {bannedList.map((name) => (
              <li key={name} className="flex items-center justify-between rounded-xl bg-destructive/10 px-4 py-2">
                <span className="text-sm font-medium text-destructive">🚫 {name}</span>
                <button
                  onClick={() => removeRole(name, "banned")}
                  className="text-xs font-bold text-foreground hover:text-primary"
                >
                  Unban
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">No one is banned</p>
        )}
      </div>

      {/* Widgets */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <LayoutGrid size={20} /> Manage Widgets
        </h3>
        <p className="text-xs text-muted-foreground">
          Widgets show up on everyone's Countdown tab.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Emoji"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            className="w-16 rounded-xl border bg-card px-3 py-3 text-center text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Widget name"
            value={newWidget}
            onChange={(e) => setNewWidget(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addWidget(newWidget, newEmoji);
                setNewWidget("");
                setNewEmoji("⭐");
              }
            }}
            className="flex-1 rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={() => {
              addWidget(newWidget, newEmoji);
              setNewWidget("");
              setNewEmoji("⭐");
            }}
            className="rounded-xl"
          >
            <Plus size={18} />
          </Button>
        </div>
        {widgets.length > 0 ? (
          <ul className="space-y-2">
            {widgets.map((w) => (
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
        ) : (
          <p className="text-sm text-muted-foreground italic">No widgets yet</p>
        )}
      </div>

      <GameRecommendationsList />
    </div>
  );
}