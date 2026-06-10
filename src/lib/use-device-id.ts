import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cached: Promise<string> | null = null;

export function getDeviceId(): Promise<string> {
  if (!cached) {
    cached = (async () => {
      const fp = await FingerprintJS.load();
      const r = await fp.get();
      return r.visitorId;
    })();
  }
  return cached;
}

export function useDeviceId() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    let cancel = false;
    getDeviceId().then((v) => { if (!cancel) setId(v); });
    return () => { cancel = true; };
  }, []);
  return id;
}