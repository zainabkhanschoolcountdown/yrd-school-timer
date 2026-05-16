import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const SYNTH_DOMAIN = "@countdown.local";
const usernameToEmail = (u: string) => `${u.trim().toLowerCase()}${SYNTH_DOMAIN}`;

export interface AuthProfile {
  user_id: string;
  username: string;
  username_lower: string;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, username, username_lower")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (!cancel && data) setProfile(data);
    })();
    return () => { cancel = true; };
  }, [session?.user?.id]);

  const signUp = useCallback(async (username: string, password: string) => {
    const u = username.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(u)) {
      return { error: "Username must be 3–20 letters, numbers, or underscores." };
    }
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }
    const { error } = await supabase.auth.signUp({
      email: usernameToEmail(u),
      password,
      options: { data: { username: u } },
    });
    if (error) {
      if (error.message.toLowerCase().includes("registered")) {
        return { error: "That username is already taken." };
      }
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });
    if (error) return { error: "Wrong username or password." };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { session, profile, loading, signUp, signIn, signOut };
}
