import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type GameId = "menu" | "parkour" | "four-colors" | "geometry-dash" | "chess";

const GAMES = [
  {
    id: "parkour" as const,
    name: "Stickman Parkour",
    emoji: "🏃",
    desc: "Run, jump & flip through parkour levels!",
    url: "https://html5.gamedistribution.com/d62e52e09f574651b3b0e984846de630/",
  },
  {
    id: "four-colors" as const,
    name: "Four Colors",
    emoji: "🃏",
    desc: "Classic UNO-style card game!",
    url: "https://html5.gamedistribution.com/bff8a5baf96043809f001ea89c129a4b/",
  },
  {
    id: "geometry-dash" as const,
    name: "Geometry Dash",
    emoji: "🔷",
    desc: "Jump to the beat & dodge obstacles!",
    url: "https://html5.gamedistribution.com/8b65f47d53a6406c8bc767cd1a16a2ec/",
  },
  {
    id: "chess" as const,
    name: "Chess.com",
    emoji: "♟️",
    desc: "Play chess online!",
    url: "https://www.chess.com/play/online",
  },
];

type GamesTabProps = { userId: string | null };

export function GamesTab({ userId }: GamesTabProps) {
  const [active, setActive] = useState<GameId>("menu");
  const [gameName, setGameName] = useState("");
  const [gameUrl, setGameUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [chessUser, setChessUser] = useState("");
  const [chessInput, setChessInput] = useState("");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("chesscom_username") : null;
    if (saved) {
      setChessUser(saved);
      setChessInput(saved);
    }
  }, []);

  function saveChessUser(e: React.FormEvent) {
    e.preventDefault();
    const u = chessInput.trim().replace(/^@/, "");
    if (!/^[a-zA-Z0-9_-]{3,25}$/.test(u)) {
      toast.error("Enter a valid Chess.com username (3–25 letters, numbers, _ or -).");
      return;
    }
    localStorage.setItem("chesscom_username", u);
    setChessUser(u);
    toast.success(`Saved! Welcome, ${u} ♟️`);
  }

  function clearChessUser() {
    localStorage.removeItem("chesscom_username");
    setChessUser("");
    setChessInput("");
  }

  async function submitRecommendation(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      toast.error("You must be signed in to recommend a game.");
      return;
    }
    const name = gameName.trim();
    const url = gameUrl.trim();
    if (name.length < 1 || name.length > 100) {
      toast.error("Game name must be 1–100 characters.");
      return;
    }
    if (url.length > 500) {
      toast.error("URL must be 500 characters or fewer.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("game_recommendations").insert({
      user_id: userId,
      game_name: name,
      game_url: url || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send recommendation. Try again.");
      return;
    }
    setGameName("");
    setGameUrl("");
    toast.success("Thanks! Your recommendation was sent. 🎉");
  }

  const activeGame = GAMES.find(g => g.id === active);
  const isExternal = activeGame?.url.includes("chess.com");

  if (activeGame) {
    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <button
          onClick={() => setActive("menu")}
          className="self-start text-sm font-bold text-primary hover:underline"
        >
          ← Back to Games
        </button>
        <h3 className="text-xl font-extrabold text-foreground">
          {activeGame.emoji} {activeGame.name}
        </h3>
        {isExternal ? (
          <div className="w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg flex items-center justify-center bg-muted" style={{ aspectRatio: "16/10" }}>
            <div className="text-center p-8">
              <div className="text-5xl mb-3">♟️</div>
              {chessUser ? (
                <>
                  <p className="text-sm text-foreground mb-1">
                    Playing as <span className="font-bold">{chessUser}</span> on Chess.com
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    (Make sure you're logged in to Chess.com in your browser.)
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <a
                      href="https://www.chess.com/play/online"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-primary text-primary-foreground font-bold text-sm px-6 py-3 hover:opacity-90 transition"
                    >
                      Play now →
                    </a>
                    <a
                      href={`https://www.chess.com/member/${chessUser}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-muted-foreground/20 text-foreground font-bold text-sm px-6 py-3 hover:opacity-90 transition"
                    >
                      My profile
                    </a>
                  </div>
                  <button
                    onClick={clearChessUser}
                    className="mt-3 text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Change username
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">{activeGame.desc}</p>
                  <form onSubmit={saveChessUser} className="flex flex-col gap-2 max-w-xs mx-auto mb-3">
                    <label className="text-xs font-bold text-foreground text-left">
                      Your Chess.com username
                    </label>
                    <input
                      type="text"
                      value={chessInput}
                      onChange={e => setChessInput(e.target.value)}
                      placeholder="e.g. magnuscarlsen"
                      maxLength={25}
                      className="rounded-lg bg-background px-3 py-2 text-sm text-foreground border border-white/10 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-primary text-primary-foreground font-bold text-sm py-2 hover:opacity-90 transition"
                    >
                      Save & continue
                    </button>
                  </form>
                  <p className="text-xs text-muted-foreground">
                    Don't have one?{" "}
                    <a
                      href="https://www.chess.com/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline font-bold"
                    >
                      Create a free Chess.com account →
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg" style={{ aspectRatio: "16/10" }}>
            <iframe
              src={activeGame.url}
              title={activeGame.name}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; gamepad"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        )}
        {!isExternal && (
          <p className="text-xs text-muted-foreground">
            Game not loading?{" "}
            <a
              href={activeGame.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Open in new tab
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-extrabold text-foreground">🎮 Games</h2>
      <p className="text-sm text-muted-foreground">Take a break! Pick a game to play.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        {GAMES.map(g => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className="flex flex-col items-center gap-2 rounded-2xl bg-muted p-6 hover:bg-muted/70 hover:scale-105 transition-all shadow-md"
          >
            <span className="text-4xl">{g.emoji}</span>
            <span className="font-bold text-foreground">{g.name}</span>
            <span className="text-xs text-muted-foreground">{g.desc}</span>
          </button>
        ))}
      </div>

      <form
        onSubmit={submitRecommendation}
        className="w-full max-w-md mt-4 rounded-2xl bg-muted p-4 flex flex-col gap-3 shadow-md"
      >
        <div>
          <h3 className="font-bold text-foreground text-sm">💡 Recommend a game</h3>
          <p className="text-xs text-muted-foreground">Suggest a game you'd love to see here!</p>
        </div>
        <input
          type="text"
          value={gameName}
          onChange={e => setGameName(e.target.value)}
          placeholder="Game name"
          maxLength={100}
          required
          className="rounded-lg bg-background px-3 py-2 text-sm text-foreground border border-white/10 focus:outline-none focus:border-primary"
        />
        <input
          type="url"
          value={gameUrl}
          onChange={e => setGameUrl(e.target.value)}
          placeholder="Game URL (optional)"
          maxLength={500}
          className="rounded-lg bg-background px-3 py-2 text-sm text-foreground border border-white/10 focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={submitting || !userId}
          className="rounded-lg bg-primary text-primary-foreground font-bold text-sm py-2 hover:opacity-90 disabled:opacity-50 transition"
        >
          {submitting ? "Sending…" : "Send Recommendation"}
        </button>
      </form>
    </div>
  );
}