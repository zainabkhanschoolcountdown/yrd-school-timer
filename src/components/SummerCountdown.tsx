interface SummerCountdownProps {
  daysLeft: number;
  totalDays: number;
  progress: number;
  firstDayOfSchool: Date;
  lastDayOfSchool: Date;
  name: string;
}

export function SummerCountdown({
  daysLeft,
  totalDays,
  progress,
  firstDayOfSchool,
  lastDayOfSchool,
  name,
}: SummerCountdownProps) {
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const emoji = daysLeft <= 3 ? "🎒" : daysLeft <= 10 ? "🌅" : daysLeft <= 30 ? "🏖️" : "☀️";
  const headline =
    daysLeft <= 0
      ? "School starts today!"
      : name
      ? `${daysLeft} days of summer left, ${name}! ${daysLeft <= 7 ? "😅" : "😎"}`
      : `${daysLeft} days of summer left!`;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="text-7xl md:text-8xl" style={{ animation: "bounce-slow 2s ease-in-out infinite" }}>
        {emoji}
      </div>

      <span className="rounded-full bg-secondary px-4 py-1 text-sm font-bold text-secondary-foreground">
        ☀️ Summer break
      </span>

      <span
        className="text-8xl md:text-9xl font-extrabold bg-gradient-to-br from-accent via-primary to-sky bg-clip-text text-transparent"
        style={{
          WebkitBackgroundClip: "text",
          animation: daysLeft <= 10 ? "pulse-glow 2s ease-in-out infinite" : undefined,
        }}
      >
        {daysLeft}
      </span>

      <p className="text-xl md:text-2xl font-bold text-foreground">days of summer remaining</p>

      <p className="text-lg md:text-xl font-semibold text-accent" style={{ animation: "wiggle 3s ease-in-out infinite" }}>
        {headline}
      </p>

      <div className="w-full max-w-md mt-2">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Summer progress</span>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-sky transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Summer is {totalDays} days long — last day was {fmt(lastDayOfSchool)}, school starts back{" "}
          <span className="font-bold text-foreground">{fmt(firstDayOfSchool)}</span>.
        </p>
      </div>
    </div>
  );
}
