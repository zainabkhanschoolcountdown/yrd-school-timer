import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthScreen } from "@/components/AuthScreen";
import { useAuth } from "@/lib/use-auth";

type OAuthDetails = {
  client?: { name?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  component: ConsentPage,
  head: () => ({
    meta: [
      { title: "Authorize app access — School Countdown Timer" },
      { name: "description", content: "Approve or deny an app that wants to connect to your School Countdown Timer account." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ConsentPage() {
  const { session, loading } = useAuth();
  const { authorization_id } = Route.useSearch();

  if (!authorization_id) {
    return <Shell><p className="text-sm text-destructive">Missing authorization request.</p></Shell>;
  }
  if (loading) return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;
  if (!session) return <AuthScreen />;
  return <Consent authorizationId={authorization_id} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-card shadow-xl border p-8 space-y-4 text-center">
        {children}
      </div>
    </main>
  );
}

function Consent({ authorizationId }: { authorizationId: string }) {
  const [details, setDetails] = useState<OAuthDetails | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: err } = await oauth().getAuthorizationDetails(authorizationId);
      if (cancelled) return;
      if (err) setError(err.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [authorizationId]);

  if (!ready) {
    return <Shell><p className="text-sm text-muted-foreground">{error ?? "Loading request…"}</p></Shell>;
  }

  const clientName = details?.client?.name ?? "an app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const api = oauth();
    const { data, error: err } = approve
      ? await api.approveAuthorization(authorizationId)
      : await api.denyAuthorization(authorizationId);
    if (err) { setBusy(false); setError(err.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("No redirect returned by the authorization server."); return; }
    window.location.href = target;
  }

  return (
    <Shell>
      <div className="text-4xl">🎒</div>
      <h1 className="text-xl font-extrabold text-foreground">Connect {clientName}</h1>
      <p className="text-sm text-muted-foreground">
        This lets {clientName} use School Countdown Timer as you — reading your countdown and profile,
        and posting chat messages or game suggestions on your behalf.
      </p>
      {error && <p role="alert" className="text-xs text-destructive font-medium">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          disabled={busy}
          onClick={() => decide(false)}
          className="flex-1 rounded-xl border px-4 py-3 text-sm font-bold text-foreground hover:bg-muted transition disabled:opacity-50"
        >
          Deny
        </button>
        <button
          disabled={busy}
          onClick={() => decide(true)}
          className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
        >
          Approve
        </button>
      </div>
    </Shell>
  );
}
