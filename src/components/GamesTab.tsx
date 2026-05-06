import { useState } from "react";

type GameId = "menu" | "among-us" | "parkour";

const GAMES = [
  {
    id: "among-us" as const,
    name: "Impostor (Among Us)",
    emoji: "🚀",
    desc: "Play the classic impostor game online!",
    url: "https://html5.gamedistribution.com/rvvASMiM/9abe6af0fbb440b98a3e24bf7fb0636a/index.html",
  },
  {
    id: "parkour" as const,
    name: "Stickman Parkour",
    emoji: "🏃",
    desc: "Run, jump & flip through parkour levels!",
    url: "https://html5.gamedistribution.com/d62e52e09f574651b3b0e984846de630/",
  },
];

export function GamesTab() {
  const [active, setActive] = useState<GameId>("menu");

  const activeGame = GAMES.find(g => g.id === active);

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
        <div className="w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg" style={{ aspectRatio: "16/10" }}>
          <iframe
            src={activeGame.url}
            title={activeGame.name}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; gamepad"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
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
    </div>
  );
}