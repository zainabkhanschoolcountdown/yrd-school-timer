import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface CountdownDisplayProps {
  daysRemaining: number;
  progress: number;
  totalDays: number;
  daysPassed: number;
  name: string;
  grade: string;
  soundEnabled: boolean;
}

export function CountdownDisplay({
  daysRemaining,
  progress,
  name,
  grade,
  soundEnabled,
}: CountdownDisplayProps) {
  const hasConfettied = useRef(false);

  useEffect(() => {
    if (daysRemaining <= 10 && daysRemaining > 0 && !hasConfettied.current) {
      hasConfettied.current = true;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4ade80", "#facc15", "#f472b6", "#60a5fa", "#c084fc"],
      });
    }
  }, [daysRemaining]);

  const greeting = name
    ? `Only ${daysRemaining} days left, ${name}! 🎉${name.toLowerCase() === "mountfuji" ? " 👑" : ""}`
    : `Only ${daysRemaining} school days left! 🎉`;

  const emoji = daysRemaining <= 5 ? "🥳" : daysRemaining <= 10 ? "🎊" : daysRemaining <= 30 ? "😄" : "📚";

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Big emoji */}
      <div
        className="text-7xl md:text-8xl"
        style={{ animation: "bounce-slow 2s ease-in-out infinite" }}
      >
        {emoji}
      </div>

      {/* Big number */}
      <div className="relative">
        <span
          className="text-8xl md:text-9xl font-extrabold bg-gradient-to-br from-primary via-accent to-sky bg-clip-text text-transparent"
          style={{
            WebkitBackgroundClip: "text",
            animation: daysRemaining <= 10 ? "pulse-glow 2s ease-in-out infinite" : undefined,
          }}
        >
          {daysRemaining}
        </span>
      </div>

      <p className="text-xl md:text-2xl font-bold text-foreground">
        school days remaining
      </p>

      {/* Personalized greeting */}
      {(name || daysRemaining <= 10) && (
        <p
          className="text-lg md:text-xl font-semibold text-accent"
          style={{ animation: "wiggle 3s ease-in-out infinite" }}
        >
          {greeting}
        </p>
      )}

      {grade && (
        <span className="inline-block rounded-full bg-secondary px-4 py-1 text-sm font-medium text-secondary-foreground">
          Grade {grade}
        </span>
      )}

      {/* Progress bar */}
      <div className="w-full max-w-md mt-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>School year progress</span>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-sky to-accent transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}