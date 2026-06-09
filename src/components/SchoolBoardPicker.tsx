import { useMemo, useState } from "react";
import { Search, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCHOOL_BOARDS, type SchoolBoard } from "@/lib/school-boards";

type Props = {
  current?: string | null;
  onSelect: (board: SchoolBoard) => void;
  onSkip?: () => void;
};

export function SchoolBoardPicker({ current, onSelect, onSkip }: Props) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<"All" | "Canada" | "USA">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SCHOOL_BOARDS.filter((b) => {
      if (country !== "All" && b.country !== country) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }).slice(0, 200);
  }, [query, country]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="rounded-3xl bg-card shadow-xl border p-6 md:p-8 space-y-5">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            🏫 Pick your school board
          </h2>
          <p className="text-sm text-muted-foreground">
            We&apos;ll use the board&apos;s last day of school for your countdown.
          </p>
        </div>

        <div className="flex gap-2">
          {(["All", "Canada", "USA"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
                country === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {c === "All" ? "🌎 All" : c === "Canada" ? "🇨🇦 Canada" : "🇺🇸 USA"}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by board, district, city, or province..."
            className="w-full rounded-xl border bg-background pl-9 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>

        <div className="max-h-[50vh] overflow-y-auto rounded-xl border bg-background">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground italic">
              No school boards match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <ul className="divide-y">
              {filtered.map((b) => {
                const selected = current === b.id;
                return (
                  <li key={b.id}>
                    <button
                      onClick={() => onSelect(b)}
                      className={`w-full text-left px-4 py-3 hover:bg-muted/60 transition flex items-center justify-between gap-3 ${
                        selected ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate">{b.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin size={12} />
                          {b.region} · {b.country}
                        </div>
                      </div>
                      {selected && <Check size={18} className="text-primary shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Don&apos;t see your board? You can set a custom end date later in Settings.
        </p>

        {onSkip && (
          <div className="flex justify-center">
            <Button variant="ghost" onClick={onSkip}>
              Skip for now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}