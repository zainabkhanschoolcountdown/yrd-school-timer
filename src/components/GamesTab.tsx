import { useState } from "react";
import { AmongUsGame } from "./AmongUsGame";
import { StickmanParkourGame } from "./StickmanParkourGame";

type GameId = "menu" | "among-us" | "parkour";

const GAMES = [
  { id: "among-us" as const, name: "Among Us Mini", emoji: "🚀", desc: "Complete tasks & dodge the impostor!" },
  { id: "parkour" as const, name: "Stickman Parkour", emoji: "🏃", desc: "Jump, run & collect coins!" },
];

export function GamesTab() {
  const [active, setActive] = useState<GameId>("menu");

  if (active === "among-us") {
    return (
      <div className="flex flex-col items-center gap-4">
        <button onClick={() => setActive("menu")} className="self-start text-sm font-bold text-primary hover:underline">
          ← Back to Games
        </button>
        <AmongUsGame />
      </div>
    );
  }

  if (active === "parkour") {
    return (
      <div className="flex flex-col items-center gap-4">
        <button onClick={() => setActive("menu")} className="self-start text-sm font-bold text-primary hover:underline">
          ← Back to Games
        </button>
        <StickmanParkourGame />
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