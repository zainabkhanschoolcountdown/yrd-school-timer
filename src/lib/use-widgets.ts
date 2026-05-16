import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Widget {
  id: string;
  label: string;
  emoji: string;
}

export function useWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("widgets")
      .select("id, label, emoji")
      .order("created_at", { ascending: true });
    if (data) setWidgets(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const ch = supabase
      .channel(`widgets-realtime-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "widgets" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [refresh]);

  const addWidget = useCallback(async (label: string, emoji: string) => {
    const l = label.trim();
    if (!l) return;
    await supabase.from("widgets").insert({ label: l, emoji: emoji || "⭐" });
  }, []);

  const removeWidget = useCallback(async (id: string) => {
    await supabase.from("widgets").delete().eq("id", id);
  }, []);

  return { widgets, loading, addWidget, removeWidget };
}