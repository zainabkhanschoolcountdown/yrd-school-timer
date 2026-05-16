import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { HolidayEntry } from "@/lib/school-days";
import { LogOut } from "lucide-react";
import { AvatarBuilder } from "./AvatarBuilder";
import { type AvatarConfig } from "@/lib/avatar";
import { useAuth } from "@/lib/use-auth";

interface SettingsPanelProps {
  name: string;
  grade: string;
  customEndDate: string | null;
  soundEnabled: boolean;
  customHolidays: HolidayEntry[];
  isCreator: boolean;
  avatar: AvatarConfig;
  onUpdate: (patch: { grade?: string; customEndDate?: string | null; soundEnabled?: boolean; avatar?: AvatarConfig }) => void;
  onAddHoliday: (entry: HolidayEntry) => void;
  onRemoveHoliday: (date: string) => void;
}

export function SettingsPanel({
  name, grade, customEndDate, soundEnabled, avatar,
  customHolidays, onUpdate, onAddHoliday, onRemoveHoliday,
}: SettingsPanelProps) {
  const [newDate, setNewDate] = useState("");
  const [newName, setNewName] = useState("");
  const { signOut } = useAuth();

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Account */}
      <div className="rounded-2xl bg-muted/40 p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="font-bold text-foreground">{name || "—"}</p>
        </div>
        <Button onClick={signOut} variant="secondary" className="rounded-xl">
          <LogOut size={16} className="mr-1" /> Log out
        </Button>
      </div>

      {/* Avatar Builder */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">🎨 Your Avatar</h3>
        <p className="text-xs text-muted-foreground">Build your animated avatar — it shows up next to your chat messages!</p>
        <AvatarBuilder config={avatar} onChange={(a) => onUpdate({ avatar: a })} />
      </div>

      {/* Grade */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">🎓 Grade</h3>
        <select
          value={grade}
          onChange={e => onUpdate({ grade: e.target.value })}
          className="w-full rounded-xl border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select grade</option>
          {["JK", "SK", "1", "2", "3", "4", "5", "6", "7", "8"].map(g => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </select>
      </div>

      {/* Last day customization */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">📅 Last Day of School</h3>
        <input
          type="date"
          value={customEndDate || ""}
          onChange={e => onUpdate({ customEndDate: e.target.value || null })}
          className="w-full rounded-xl border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground">Leave blank for default (June 30)</p>
      </div>

      {/* Sound toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">🔊 Sound Effects</h3>
        <button
          onClick={() => onUpdate({ soundEnabled: !soundEnabled })}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            soundEnabled ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-1 w-6 h-6 rounded-full bg-card shadow transition-transform ${
              soundEnabled ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Custom holidays */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">🏖️ Custom Days Off</h3>
        <div className="flex gap-2">
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="flex-1 rounded-xl border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Reason"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-1 rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button
          onClick={() => {
            if (newDate && newName) {
              onAddHoliday({ date: newDate, name: newName });
              setNewDate("");
              setNewName("");
            }
          }}
          className="w-full rounded-xl"
        >
          Add Day Off
        </Button>

        {customHolidays.length > 0 && (
          <ul className="space-y-2">
            {customHolidays.map(h => (
              <li key={h.date} className="flex items-center justify-between rounded-xl bg-muted px-4 py-2">
                <span className="text-sm">
                  <strong>{h.name}</strong> — {h.date}
                </span>
                <button
                  onClick={() => onRemoveHoliday(h.date)}
                  className="text-destructive hover:text-destructive/80 font-bold"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}