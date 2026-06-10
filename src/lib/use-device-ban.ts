import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDeviceId } from "./use-device-id";

export function useDeviceBan() {
  const deviceId = useDeviceId();
  const [banned, setBanned] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!deviceId) return;
    let cancel = false;
    const check = async () => {
      const { data } = await supabase
        .from("banned_devices")
        .select("fingerprint")
        .eq("fingerprint", deviceId)
        .maybeSingle();
      if (cancel) return;
      setBanned(!!data);
      setChecked(true);
    };
    check();
    const ch = supabase
      .channel(`bandev-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "banned_devices" }, () => check())
      .subscribe();
    return () => {
      cancel = true;
      supabase.removeChannel(ch);
    };
  }, [deviceId]);

  return { banned, checked: checked && !!deviceId, deviceId };
}

// Record this device fingerprint against the signed-in user so admins can
// device-ban them later.
export function useRecordDevice(userId: string | null) {
  const deviceId = useDeviceId();
  useEffect(() => {
    if (!userId || !deviceId) return;
    supabase
      .from("device_fingerprints")
      .upsert(
        { user_id: userId, fingerprint: deviceId, last_seen_at: new Date().toISOString() },
        { onConflict: "user_id,fingerprint" }
      )
      .then(() => {});
  }, [userId, deviceId]);
}