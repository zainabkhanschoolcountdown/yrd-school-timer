import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Widget {
  id: string;
  label: string;
  emoji: string;
  url: string | null;
}

export function useWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("widgets")
      .select("id, label, emoji, url")
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

  const addWidget = useCallback(async (label: string, emoji: string, url: string) => {
    const l = label.trim();
    const u = url.trim();
    if (!l || !u) return;
    let normalized = u;
    if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`;
    await supabase.from("widgets").insert({ label: l, emoji: emoji || "⭐", url: normalized });
  }, []);

  const removeWidget = useCallback(async (id: string) => {
    await supabase.from("widgets").delete().eq("id", id);
  }, []);

  return { widgets, loading, addWidget, removeWidget };
}