import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fn = mode === "login" ? signIn : signUp;
    const { error: err } = await fn(username, password);
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-card shadow-xl border p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary via-sky to-accent bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text" }}>
            🎒 School Countdown
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            autoComplete="username"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          {error && <p className="text-xs text-destructive font-medium">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full rounded-xl">
            {busy ? "..." : mode === "login" ? "Log In" : "Sign Up"}
          </Button>
        </form>

        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>

        <p className="text-xs text-center text-muted-foreground">
          Your name, avatar, and settings save to your account and follow you to any device.
        </p>
      </div>
    </div>
  );
}
