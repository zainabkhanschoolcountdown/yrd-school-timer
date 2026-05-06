import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Among Us Mini-Game
 * - You are the crewmate (cyan circle). Move with arrow keys or WASD.
 * - An impostor (red) chases you around the map.
 * - Collect all tasks (green squares) before the impostor catches you.
 * - Touch buttons (yellow) to briefly stun the impostor.
 */

interface Entity {
  x: number;
  y: number;
  w: number;
  h: number;
}

const CANVAS_W = 480;
const CANVAS_H = 360;
const PLAYER_SIZE = 22;
const IMPOSTOR_SIZE = 24;
const TASK_SIZE = 16;
const BUTTON_SIZE = 20;
const SPEED = 3;
const IMPOSTOR_SPEED = 1.8;
const STUN_DURATION = 90; // frames

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function spawnTasks(count: number): Entity[] {
  const tasks: Entity[] = [];
  for (let i = 0; i < count; i++) {
    tasks.push({
      x: randInt(30, CANVAS_W - 50),
      y: randInt(30, CANVAS_H - 50),
      w: TASK_SIZE,
      h: TASK_SIZE,
    });
  }
  return tasks;
}

export function AmongUsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"playing" | "win" | "caught">("playing");
  const [score, setScore] = useState(0);
  const gameRef = useRef<{
    player: Entity;
    impostor: Entity;
    tasks: Entity[];
    button: Entity;
    keys: Set<string>;
    stun: number;
    collected: number;
    total: number;
    animId: number;
  } | null>(null);

  const resetGame = useCallback(() => {
    const total = 8;
    gameRef.current = {
      player: { x: 40, y: CANVAS_H / 2, w: PLAYER_SIZE, h: PLAYER_SIZE },
      impostor: { x: CANVAS_W - 60, y: CANVAS_H / 2, w: IMPOSTOR_SIZE, h: IMPOSTOR_SIZE },
      tasks: spawnTasks(total),
      button: { x: CANVAS_W / 2 - BUTTON_SIZE / 2, y: CANVAS_H / 2 - BUTTON_SIZE / 2, w: BUTTON_SIZE, h: BUTTON_SIZE },
      keys: new Set(),
      stun: 0,
      collected: 0,
      total,
      animId: 0,
    };
    setStatus("playing");
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const g = gameRef.current;
      if (!g) return;
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(k)) {
        e.preventDefault();
        if (down) g.keys.add(k); else g.keys.delete(k);
      }
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, []);

  // Touch controls state
  const touchDir = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  useEffect(() => {
    if (status !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const g = gameRef.current;
      if (!g) return;

      // Move player
      let dx = 0, dy = 0;
      if (g.keys.has("arrowleft") || g.keys.has("a")) dx -= SPEED;
      if (g.keys.has("arrowright") || g.keys.has("d")) dx += SPEED;
      if (g.keys.has("arrowup") || g.keys.has("w")) dy -= SPEED;
      if (g.keys.has("arrowdown") || g.keys.has("s")) dy += SPEED;
      // Add touch direction
      dx += touchDir.current.dx * SPEED;
      dy += touchDir.current.dy * SPEED;
      g.player.x = Math.max(0, Math.min(CANVAS_W - g.player.w, g.player.x + dx));
      g.player.y = Math.max(0, Math.min(CANVAS_H - g.player.h, g.player.y + dy));

      // Impostor chases player (unless stunned)
      if (g.stun > 0) {
        g.stun--;
      } else {
        const ix = g.player.x - g.impostor.x;
        const iy = g.player.y - g.impostor.y;
        const dist = Math.sqrt(ix * ix + iy * iy) || 1;
        g.impostor.x += (ix / dist) * IMPOSTOR_SPEED;
        g.impostor.y += (iy / dist) * IMPOSTOR_SPEED;
      }

      // Check task collection
      g.tasks = g.tasks.filter(t => {
        const overlap =
          g.player.x < t.x + t.w && g.player.x + g.player.w > t.x &&
          g.player.y < t.y + t.h && g.player.y + g.player.h > t.y;
        if (overlap) g.collected++;
        return !overlap;
      });

      // Check button
      const bOverlap =
        g.player.x < g.button.x + g.button.w && g.player.x + g.player.w > g.button.x &&
        g.player.y < g.button.y + g.button.h && g.player.y + g.player.h > g.button.y;
      if (bOverlap && g.stun <= 0) {
        g.stun = STUN_DURATION;
        g.button.x = randInt(30, CANVAS_W - 50);
        g.button.y = randInt(30, CANVAS_H - 50);
      }

      // Check impostor catch
      const cx = g.player.x - g.impostor.x;
      const cy = g.player.y - g.impostor.y;
      if (Math.sqrt(cx * cx + cy * cy) < (PLAYER_SIZE + IMPOSTOR_SIZE) / 2) {
        setStatus("caught");
        return;
      }

      // Win check
      if (g.collected >= g.total) {
        setScore(prev => prev + 1);
        setStatus("win");
        return;
      }

      // Draw
      // Space background
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Grid lines for spaceship feel
      ctx.strokeStyle = "#ffffff10";
      for (let i = 0; i < CANVAS_W; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_H); ctx.stroke(); }
      for (let i = 0; i < CANVAS_H; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_W, i); ctx.stroke(); }

      // Tasks (green)
      ctx.fillStyle = "#4ade80";
      g.tasks.forEach(t => {
        ctx.fillRect(t.x, t.y, t.w, t.h);
        ctx.fillStyle = "#166534";
        ctx.font = "10px sans-serif";
        ctx.fillText("📋", t.x + 1, t.y + 13);
        ctx.fillStyle = "#4ade80";
      });

      // Emergency button (yellow)
      ctx.fillStyle = g.stun > 0 ? "#666" : "#facc15";
      ctx.beginPath();
      ctx.arc(g.button.x + BUTTON_SIZE / 2, g.button.y + BUTTON_SIZE / 2, BUTTON_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("!", g.button.x + BUTTON_SIZE / 2, g.button.y + BUTTON_SIZE / 2 + 4);
      ctx.textAlign = "start";

      // Player (cyan crewmate)
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.ellipse(g.player.x + PLAYER_SIZE / 2, g.player.y + PLAYER_SIZE / 2, PLAYER_SIZE / 2, PLAYER_SIZE / 2 + 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Visor
      ctx.fillStyle = "#bae6fd";
      ctx.beginPath();
      ctx.ellipse(g.player.x + PLAYER_SIZE / 2 + 4, g.player.y + PLAYER_SIZE / 2 - 3, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Impostor (red)
      const impAlpha = g.stun > 0 ? 0.4 : 1;
      ctx.globalAlpha = impAlpha;
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.ellipse(g.impostor.x + IMPOSTOR_SIZE / 2, g.impostor.y + IMPOSTOR_SIZE / 2, IMPOSTOR_SIZE / 2, IMPOSTOR_SIZE / 2 + 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fca5a5";
      ctx.beginPath();
      ctx.ellipse(g.impostor.x + IMPOSTOR_SIZE / 2 + 5, g.impostor.y + IMPOSTOR_SIZE / 2 - 3, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // HUD
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px 'Nunito', sans-serif";
      ctx.fillText(`Tasks: ${g.collected}/${g.total}`, 10, 22);
      if (g.stun > 0) {
        ctx.fillStyle = "#facc15";
        ctx.fillText(`Impostor stunned! ${Math.ceil(g.stun / 30)}s`, CANVAS_W - 180, 22);
      }

      g.animId = requestAnimationFrame(loop);
    };

    if (gameRef.current) gameRef.current.animId = requestAnimationFrame(loop);
    return () => { if (gameRef.current) cancelAnimationFrame(gameRef.current.animId); };
  }, [status]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-xl font-extrabold text-foreground">🚀 Among Us Mini</h3>
      <p className="text-sm text-muted-foreground">
        {status === "playing" ? "Collect all tasks! Avoid the impostor! Hit ⚠️ to stun." :
         status === "win" ? "🎉 You completed all tasks!" : "💀 The impostor got you!"}
      </p>
      <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block max-w-full"
          style={{ imageRendering: "pixelated" }}
        />
        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-3">
            <span className="text-4xl">{status === "win" ? "🏆" : "💀"}</span>
            <p className="text-white font-bold text-lg">{status === "win" ? "Tasks Complete!" : "Ejected!"}</p>
            <button
              onClick={resetGame}
              className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      {/* Mobile touch controls */}
      <div className="grid grid-cols-3 gap-1 sm:hidden w-36">
        <div />
        <button
          onTouchStart={() => { touchDir.current.dy = -1; }}
          onTouchEnd={() => { touchDir.current.dy = 0; }}
          className="bg-white/20 rounded-lg p-3 text-center text-xl active:bg-white/40"
        >▲</button>
        <div />
        <button
          onTouchStart={() => { touchDir.current.dx = -1; }}
          onTouchEnd={() => { touchDir.current.dx = 0; }}
          className="bg-white/20 rounded-lg p-3 text-center text-xl active:bg-white/40"
        >◀</button>
        <div className="bg-white/10 rounded-lg p-3" />
        <button
          onTouchStart={() => { touchDir.current.dx = 1; }}
          onTouchEnd={() => { touchDir.current.dx = 0; }}
          className="bg-white/20 rounded-lg p-3 text-center text-xl active:bg-white/40"
        >▶</button>
        <div />
        <button
          onTouchStart={() => { touchDir.current.dy = 1; }}
          onTouchEnd={() => { touchDir.current.dy = 0; }}
          className="bg-white/20 rounded-lg p-3 text-center text-xl active:bg-white/40"
        >▼</button>
        <div />
      </div>
      <p className="text-xs text-muted-foreground">Arrow keys / WASD to move • Score: {score}</p>
    </div>
  );
}