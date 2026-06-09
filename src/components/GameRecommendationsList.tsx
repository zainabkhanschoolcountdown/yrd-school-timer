import { useEffect, useState } from "react";
import { Gamepad2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Rec = {
  id: string;
  game_name: string;
  game_url: string | null;
  created_at: string;
  user_id: string;
};

export function GameRecommendationsList() {
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("game_recommendations")
        .select("id, game_name, game_url, created_at, user_id")
        .order("created_at", { ascending: false });
      setRecs(data ?? []);
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel(`recs-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "game_recommendations" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Gamepad2 size={20} /> Game Recommendations
      </h3>
      {loading ? (
        <p className="text-sm text-muted-foreground italic">Loading…</p>
      ) : recs.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No recommendations yet</p>
      ) : (
        <ul className="space-y-2">
          {recs.map((r) => (
            <li key={r.id} className="rounded-xl bg-muted px-4 py-3">
              <div className="font-semibold text-foreground">{r.game_name}</div>
              {r.game_url && (
                <a
                  href={r.game_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline break-all"
                >
                  {r.game_url}
                </a>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(r.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}