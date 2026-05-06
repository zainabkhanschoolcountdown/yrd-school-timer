import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Stickman Parkour Mini-Game
 * - Side-scrolling endless runner.
 * - Tap/Space/Up to jump. Double-jump available!
 * - Avoid obstacles (red blocks) and collect coins (yellow).
 * - Platforms at varying heights to parkour across.
 */

const CW = 480;
const CH = 300;
const GRAVITY = 0.55;
const JUMP_FORCE = -10;
const SCROLL_SPEED = 3;
const GROUND_Y = CH - 40;

interface Platform {
  x: number;
  y: number;
  w: number;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

function generateChunk(startX: number): { platforms: Platform[]; obstacles: Obstacle[]; coins: Coin[] } {
  const platforms: Platform[] = [];
  const obstacles: Obstacle[] = [];
  const coins: Coin[] = [];
  let x = startX;
  for (let i = 0; i < 5; i++) {
    const gap = 80 + Math.random() * 60;
    const w = 60 + Math.random() * 80;
    const y = GROUND_Y - 30 - Math.random() * 100;
    x += gap;
    platforms.push({ x, y, w });
    // Coins on platform
    for (let c = 0; c < 3; c++) {
      coins.push({ x: x + 10 + c * 20, y: y - 20, collected: false });
    }
    // Obstacle sometimes
    if (Math.random() > 0.5) {
      obstacles.push({ x: x + w / 2 - 8, y: y - 24, w: 16, h: 24 });
    }
    x += w;
  }
  return { platforms, obstacles, coins };
}

export function StickmanParkourGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const stateRef = useRef<{
    px: number; py: number; vy: number;
    jumps: number;
    platforms: Platform[];
    obstacles: Obstacle[];
    coins: Coin[];
    score: number;
    dist: number;
    camX: number;
    jumpPressed: boolean;
    animId: number;
    nextChunkX: number;
  } | null>(null);

  const resetGame = useCallback(() => {
    const chunk = generateChunk(300);
    stateRef.current = {
      px: 60, py: GROUND_Y - 30, vy: 0,
      jumps: 0,
      platforms: [{ x: -10, y: GROUND_Y, w: 400 }, ...chunk.platforms],
      obstacles: chunk.obstacles,
      coins: chunk.coins,
      score: 0, dist: 0, camX: 0,
      jumpPressed: false,
      animId: 0,
      nextChunkX: 800,
    };
    setGameOver(false);
  }, []);

  useEffect(() => { resetGame(); }, [resetGame]);

  // Controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "ArrowUp" || e.key === "w") && stateRef.current) {
        e.preventDefault();
        stateRef.current.jumpPressed = true;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const s = stateRef.current;
      if (!s) return;

      // Jump logic
      if (s.jumpPressed) {
        s.jumpPressed = false;
        if (s.jumps < 2) {
          s.vy = JUMP_FORCE;
          s.jumps++;
        }
      }

      // Physics
      s.vy += GRAVITY;
      s.py += s.vy;
      s.px += SCROLL_SPEED;
      s.camX = s.px - 60;
      s.dist += SCROLL_SPEED;

      // Platform collision
      let onPlatform = false;
      for (const p of s.platforms) {
        if (
          s.px + 10 > p.x && s.px - 10 < p.x + p.w &&
          s.py + 30 >= p.y && s.py + 30 <= p.y + 10 && s.vy >= 0
        ) {
          s.py = p.y - 30;
          s.vy = 0;
          s.jumps = 0;
          onPlatform = true;
        }
      }

      // Fall death
      if (s.py > CH + 50) {
        setFinalScore(s.score);
        setGameOver(true);
        return;
      }

      // Obstacle collision
      for (const o of s.obstacles) {
        if (
          s.px + 8 > o.x && s.px - 8 < o.x + o.w &&
          s.py + 28 > o.y && s.py < o.y + o.h
        ) {
          setFinalScore(s.score);
          setGameOver(true);
          return;
        }
      }

      // Coin collection
      for (const c of s.coins) {
        if (!c.collected && Math.abs(s.px - c.x) < 16 && Math.abs(s.py - c.y) < 20) {
          c.collected = true;
          s.score += 10;
        }
      }

      // Generate new chunks
      if (s.px > s.nextChunkX - 300) {
        const chunk = generateChunk(s.nextChunkX);
        s.platforms.push(...chunk.platforms);
        s.obstacles.push(...chunk.obstacles);
        s.coins.push(...chunk.coins);
        s.nextChunkX += 600;
        // Clean old stuff
        s.platforms = s.platforms.filter(p => p.x + p.w > s.camX - 100);
        s.obstacles = s.obstacles.filter(o => o.x + o.w > s.camX - 100);
        s.coins = s.coins.filter(c => c.x > s.camX - 100);
      }

      // === DRAW ===
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, CH);
      grad.addColorStop(0, "#7c3aed");
      grad.addColorStop(1, "#c084fc");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CW, CH);

      ctx.save();
      ctx.translate(-s.camX, 0);

      // Platforms
      ctx.fillStyle = "#4ade80";
      for (const p of s.platforms) {
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(p.x, p.y, p.w, 12);
        ctx.fillStyle = "#166534";
        ctx.fillRect(p.x, p.y + 12, p.w, 4);
      }

      // Obstacles (red spikes)
      ctx.fillStyle = "#ef4444";
      for (const o of s.obstacles) {
        ctx.beginPath();
        ctx.moveTo(o.x, o.y + o.h);
        ctx.lineTo(o.x + o.w / 2, o.y);
        ctx.lineTo(o.x + o.w, o.y + o.h);
        ctx.fill();
      }

      // Coins
      for (const c of s.coins) {
        if (c.collected) continue;
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#a16207";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("$", c.x, c.y + 3);
        ctx.textAlign = "start";
      }

      // Stickman
      const sx = s.px, sy = s.py;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      // Head
      ctx.beginPath();
      ctx.arc(sx, sy - 2, 8, 0, Math.PI * 2);
      ctx.stroke();
      // Body
      ctx.beginPath(); ctx.moveTo(sx, sy + 6); ctx.lineTo(sx, sy + 20); ctx.stroke();
      // Arms
      const armSwing = Math.sin(s.dist * 0.15) * 8;
      ctx.beginPath(); ctx.moveTo(sx - 10, sy + 10 + armSwing); ctx.lineTo(sx, sy + 10); ctx.lineTo(sx + 10, sy + 10 - armSwing); ctx.stroke();
      // Legs
      ctx.beginPath(); ctx.moveTo(sx - 8, sy + 28 - armSwing); ctx.lineTo(sx, sy + 20); ctx.lineTo(sx + 8, sy + 28 + armSwing); ctx.stroke();

      ctx.restore();

      // HUD
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px 'Nunito', sans-serif";
      ctx.fillText(`🪙 ${s.score}`, 10, 24);
      ctx.fillText(`📏 ${Math.floor(s.dist / 10)}m`, CW - 100, 24);

      s.animId = requestAnimationFrame(loop);
    };

    if (stateRef.current) stateRef.current.animId = requestAnimationFrame(loop);
    return () => { if (stateRef.current) cancelAnimationFrame(stateRef.current.animId); };
  }, [gameOver]);

  const handleTap = () => {
    if (stateRef.current) stateRef.current.jumpPressed = true;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-xl font-extrabold text-foreground">🏃 Stickman Parkour</h3>
      <p className="text-sm text-muted-foreground">
        {gameOver ? `Game Over! Score: ${finalScore}` : "Space / Tap to jump (double-jump!)  •  Collect coins, avoid spikes!"}
      </p>
      <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="block max-w-full"
          onClick={handleTap}
          onTouchStart={(e) => { e.preventDefault(); handleTap(); }}
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-3">
            <span className="text-4xl">💥</span>
            <p className="text-white font-bold text-lg">Score: {finalScore}</p>
            <button
              onClick={resetGame}
              className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Space / ↑ / Tap to jump</p>
    </div>
  );
}