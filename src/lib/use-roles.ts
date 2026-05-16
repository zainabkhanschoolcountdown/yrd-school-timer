import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useRoles() {
  const [admins, setAdmins] = useState<Set<string>>(new Set());
  const [banned, setBanned] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    const { data } = await supabase.from("user_roles").select("username_lower, role");
    if (!data) return;
    const a = new Set<string>();
    const b = new Set<string>();
    for (const r of data) {
      if (r.role === "admin") a.add(r.username_lower);
      else if (r.role === "banned") b.add(r.username_lower);
    }
    setAdmins(a);
    setBanned(b);
  }, []);

  useEffect(() => {
    refresh();
    const ch = supabase
      .channel(`roles-realtime-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [refresh]);

  const isAdmin = useCallback((name: string) => admins.has(name.trim().toLowerCase()), [admins]);
  const isBanned = useCallback((name: string) => banned.has(name.trim().toLowerCase()), [banned]);

  const addRole = useCallback(async (name: string, role: "admin" | "banned") => {
    const u = name.trim().toLowerCase();
    if (!u) return;
    await supabase.from("user_roles").insert({ username_lower: u, role });
  }, []);

  const removeRole = useCallback(async (name: string, role: "admin" | "banned") => {
    const u = name.trim().toLowerCase();
    await supabase.from("user_roles").delete().eq("username_lower", u).eq("role", role);
  }, []);

  return { admins, banned, isAdmin, isBanned, addRole, removeRole, refresh };
}