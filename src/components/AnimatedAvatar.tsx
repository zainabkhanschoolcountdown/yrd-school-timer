import type { AvatarConfig } from "@/lib/avatar";

interface Props {
  config: AvatarConfig;
  size?: number;
  animate?: boolean;
}

export function AnimatedAvatar({ config, size = 48, animate = true }: Props) {
  const animClass = animate
    ? {
        bounce: "avatar-bounce",
        spin: "avatar-spin",
        pulse: "avatar-pulse",
        wiggle: "avatar-wiggle",
        float: "avatar-float",
        none: "",
      }[config.animation]
    : "";

  const shape = config.shape ?? "face";

  return (
    <div
      className={`inline-block ${animClass}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill={config.bg} />
        {shape === "face" ? (
          <>
            <circle cx="50" cy="52" r="32" fill={config.face} />
            <Eyes type={config.eyes} />
            <Mouth type={config.mouth} />
            <Accessory type={config.accessory} />
          </>
        ) : (
          <Shape type={shape} body={config.face} />
        )}
      </svg>
    </div>
  );
}

function Shape({ type, body }: { type: NonNullable<AvatarConfig["shape"]>; body: string }) {
  const ink = "#1e1b4b";
  switch (type) {
    case "cat":
      return (
        <g>
          <polygon points="28,30 36,14 44,30" fill={body} />
          <polygon points="56,30 64,14 72,30" fill={body} />
          <circle cx="50" cy="54" r="28" fill={body} />
          <circle cx="42" cy="50" r="3" fill={ink} />
          <circle cx="58" cy="50" r="3" fill={ink} />
          <polygon points="47,58 53,58 50,62" fill="#ec4899" />
          <path d="M50 62 Q44 68 40 64" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M50 62 Q56 68 60 64" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="20" y1="54" x2="36" y2="56" stroke={ink} strokeWidth="1.5" />
          <line x1="64" y1="56" x2="80" y2="54" stroke={ink} strokeWidth="1.5" />
        </g>
      );
    case "dog":
      return (
        <g>
          <ellipse cx="30" cy="40" rx="10" ry="16" fill={body} />
          <ellipse cx="70" cy="40" rx="10" ry="16" fill={body} />
          <circle cx="50" cy="56" r="28" fill={body} />
          <circle cx="42" cy="52" r="3.5" fill={ink} />
          <circle cx="58" cy="52" r="3.5" fill={ink} />
          <ellipse cx="50" cy="64" rx="5" ry="4" fill={ink} />
          <path d="M50 68 Q45 74 42 70 M50 68 Q55 74 58 70" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "bear":
      return (
        <g>
          <circle cx="28" cy="30" r="10" fill={body} />
          <circle cx="72" cy="30" r="10" fill={body} />
          <circle cx="28" cy="30" r="5" fill="#fcd5b5" />
          <circle cx="72" cy="30" r="5" fill="#fcd5b5" />
          <circle cx="50" cy="56" r="30" fill={body} />
          <circle cx="50" cy="62" r="14" fill="#fcd5b5" />
          <circle cx="42" cy="50" r="3.5" fill={ink} />
          <circle cx="58" cy="50" r="3.5" fill={ink} />
          <ellipse cx="50" cy="60" rx="4" ry="3" fill={ink} />
          <path d="M50 64 Q46 70 44 66 M50 64 Q54 70 56 66" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "bunny":
      return (
        <g>
          <ellipse cx="38" cy="22" rx="6" ry="18" fill={body} />
          <ellipse cx="62" cy="22" rx="6" ry="18" fill={body} />
          <ellipse cx="38" cy="24" rx="3" ry="12" fill="#f9a8d4" />
          <ellipse cx="62" cy="24" rx="3" ry="12" fill="#f9a8d4" />
          <circle cx="50" cy="60" r="26" fill={body} />
          <circle cx="42" cy="56" r="3" fill={ink} />
          <circle cx="58" cy="56" r="3" fill={ink} />
          <ellipse cx="50" cy="64" rx="3" ry="2" fill="#ec4899" />
          <path d="M44 70 Q50 74 56 70" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "fox":
      return (
        <g>
          <polygon points="22,28 32,12 40,32" fill={body} />
          <polygon points="60,32 68,12 78,28" fill={body} />
          <polygon points="50,36 22,60 40,72 50,80 60,72 78,60" fill={body} />
          <polygon points="50,40 38,58 50,68 62,58" fill="#fef3c7" />
          <circle cx="42" cy="54" r="3" fill={ink} />
          <circle cx="58" cy="54" r="3" fill={ink} />
          <ellipse cx="50" cy="66" rx="3" ry="2.5" fill={ink} />
        </g>
      );
    case "panda":
      return (
        <g>
          <circle cx="28" cy="28" r="9" fill={ink} />
          <circle cx="72" cy="28" r="9" fill={ink} />
          <circle cx="50" cy="56" r="30" fill="#ffffff" />
          <ellipse cx="40" cy="52" rx="7" ry="9" fill={ink} />
          <ellipse cx="60" cy="52" rx="7" ry="9" fill={ink} />
          <circle cx="40" cy="53" r="2.5" fill="#ffffff" />
          <circle cx="60" cy="53" r="2.5" fill="#ffffff" />
          <ellipse cx="50" cy="62" rx="3.5" ry="2.5" fill={ink} />
          <path d="M50 66 Q46 72 44 68 M50 66 Q54 72 56 68" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "mountain":
      return (
        <g>
          <circle cx="75" cy="28" r="8" fill="#fde68a" />
          <polygon points="10,82 38,38 56,68 70,50 92,82" fill={body} />
          <polygon points="38,38 32,50 44,50" fill="#ffffff" />
          <polygon points="70,50 66,58 74,58" fill="#ffffff" />
          <rect x="6" y="80" width="88" height="6" fill="#22c55e" />
        </g>
      );
    case "tree":
      return (
        <g>
          <rect x="44" y="58" width="12" height="28" fill="#8b5a2b" />
          <circle cx="50" cy="42" r="22" fill={body === "#fde68a" ? "#22c55e" : body} />
          <circle cx="34" cy="46" r="14" fill={body === "#fde68a" ? "#16a34a" : body} />
          <circle cx="66" cy="46" r="14" fill={body === "#fde68a" ? "#16a34a" : body} />
          <circle cx="44" cy="36" r="3" fill="#ef4444" />
          <circle cx="58" cy="48" r="3" fill="#ef4444" />
        </g>
      );
    case "sun":
      return (
        <g>
          <g stroke="#fbbf24" strokeWidth="4" strokeLinecap="round">
            <line x1="50" y1="8" x2="50" y2="20" />
            <line x1="50" y1="80" x2="50" y2="92" />
            <line x1="8" y1="50" x2="20" y2="50" />
            <line x1="80" y1="50" x2="92" y2="50" />
            <line x1="20" y1="20" x2="28" y2="28" />
            <line x1="72" y1="72" x2="80" y2="80" />
            <line x1="80" y1="20" x2="72" y2="28" />
            <line x1="28" y1="72" x2="20" y2="80" />
          </g>
          <circle cx="50" cy="50" r="22" fill="#fbbf24" />
          <circle cx="42" cy="48" r="2.5" fill={ink} />
          <circle cx="58" cy="48" r="2.5" fill={ink} />
          <path d="M42 56 Q50 64 58 56" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "moon":
      return (
        <g>
          <circle cx="50" cy="50" r="34" fill="#e5e7eb" />
          <path d="M62 24 A34 34 0 1 0 78 64 A26 26 0 1 1 62 24 Z" fill="#cbd5e1" />
          <circle cx="38" cy="40" r="4" fill="#94a3b8" />
          <circle cx="56" cy="62" r="3" fill="#94a3b8" />
          <circle cx="44" cy="58" r="2" fill="#94a3b8" />
        </g>
      );
    case "star":
      return (
        <g>
          <polygon points="50,8 60,38 92,38 66,56 76,86 50,68 24,86 34,56 8,38 40,38" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="44" cy="50" r="2.5" fill={ink} />
          <circle cx="56" cy="50" r="2.5" fill={ink} />
          <path d="M44 58 Q50 64 56 58" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "heart":
      return (
        <g>
          <path d="M50 84 C 14 60, 14 28, 32 22 C 42 18, 50 28, 50 36 C 50 28, 58 18, 68 22 C 86 28, 86 60, 50 84 Z" fill="#ef4444" />
          <ellipse cx="38" cy="38" rx="6" ry="4" fill="#ffffff" opacity="0.6" />
        </g>
      );
    case "robot":
      return (
        <g>
          <line x1="50" y1="14" x2="50" y2="22" stroke={ink} strokeWidth="2" />
          <circle cx="50" cy="12" r="3" fill="#ef4444" />
          <rect x="22" y="22" width="56" height="44" rx="6" fill={body} stroke={ink} strokeWidth="2" />
          <rect x="32" y="34" width="14" height="10" rx="2" fill="#06b6d4" />
          <rect x="54" y="34" width="14" height="10" rx="2" fill="#06b6d4" />
          <rect x="38" y="54" width="24" height="4" rx="2" fill={ink} />
          <rect x="34" y="66" width="32" height="14" rx="3" fill={body} stroke={ink} strokeWidth="2" />
          <circle cx="42" cy="73" r="2" fill="#22c55e" />
          <circle cx="50" cy="73" r="2" fill="#facc15" />
          <circle cx="58" cy="73" r="2" fill="#ef4444" />
        </g>
      );
    case "ghost":
      return (
        <g>
          <path d="M22 50 Q22 18 50 18 Q78 18 78 50 L78 84 L70 78 L62 84 L54 78 L46 84 L38 78 L30 84 L22 78 Z" fill="#ffffff" stroke={ink} strokeWidth="2" />
          <ellipse cx="40" cy="48" rx="4" ry="6" fill={ink} />
          <ellipse cx="60" cy="48" rx="4" ry="6" fill={ink} />
          <ellipse cx="50" cy="62" rx="4" ry="3" fill={ink} />
        </g>
      );
    case "alien":
      return (
        <g>
          <ellipse cx="50" cy="48" rx="30" ry="36" fill={body === "#fde68a" ? "#22c55e" : body} />
          <ellipse cx="38" cy="50" rx="6" ry="10" fill={ink} />
          <ellipse cx="62" cy="50" rx="6" ry="10" fill={ink} />
          <circle cx="38" cy="46" r="2" fill="#ffffff" />
          <circle cx="62" cy="46" r="2" fill="#ffffff" />
          <line x1="42" y1="68" x2="58" y2="68" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

function Eyes({ type }: { type: AvatarConfig["eyes"] }) {
  switch (type) {
    case "happy":
      return (
        <g fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round">
          <path d="M36 48 Q40 42 44 48" />
          <path d="M56 48 Q60 42 64 48" />
        </g>
      );
    case "stars":
      return (
        <g fill="#1e1b4b">
          <text x="40" y="52" fontSize="14" textAnchor="middle">★</text>
          <text x="60" y="52" fontSize="14" textAnchor="middle">★</text>
        </g>
      );
    case "sleepy":
      return (
        <g fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round">
          <line x1="35" y1="48" x2="45" y2="48" />
          <line x1="55" y1="48" x2="65" y2="48" />
        </g>
      );
    case "wink":
      return (
        <g fill="#1e1b4b" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round">
          <circle cx="40" cy="48" r="3" />
          <line x1="55" y1="48" x2="65" y2="48" fill="none" />
        </g>
      );
    case "dots":
    default:
      return (
        <g fill="#1e1b4b">
          <circle cx="40" cy="48" r="3.5" />
          <circle cx="60" cy="48" r="3.5" />
        </g>
      );
  }
}

function Mouth({ type }: { type: AvatarConfig["mouth"] }) {
  switch (type) {
    case "grin":
      return (
        <path
          d="M38 62 Q50 76 62 62 Z"
          fill="#1e1b4b"
        />
      );
    case "neutral":
      return (
        <line x1="42" y1="66" x2="58" y2="66" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
      );
    case "ohh":
      return <ellipse cx="50" cy="66" rx="5" ry="6" fill="#1e1b4b" />;
    case "tongue":
      return (
        <g>
          <path d="M40 62 Q50 72 60 62" stroke="#1e1b4b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="70" rx="5" ry="3" fill="#ec4899" />
        </g>
      );
    case "smile":
    default:
      return (
        <path d="M40 62 Q50 72 60 62" stroke="#1e1b4b" strokeWidth="3" fill="none" strokeLinecap="round" />
      );
  }
}

function Accessory({ type }: { type: AvatarConfig["accessory"] }) {
  switch (type) {
    case "hat":
      return (
        <g>
          <rect x="30" y="18" width="40" height="6" fill="#1e1b4b" />
          <rect x="36" y="6" width="28" height="14" fill="#1e1b4b" />
          <rect x="36" y="14" width="28" height="3" fill="#ef4444" />
        </g>
      );
    case "crown":
      return (
        <g fill="#facc15" stroke="#b45309" strokeWidth="1.5">
          <path d="M30 22 L36 8 L42 18 L50 4 L58 18 L64 8 L70 22 Z" />
          <circle cx="36" cy="8" r="2" fill="#ef4444" />
          <circle cx="50" cy="4" r="2" fill="#22c55e" />
          <circle cx="64" cy="8" r="2" fill="#3b82f6" />
        </g>
      );
    case "bow":
      return (
        <g fill="#ec4899">
          <path d="M22 22 L34 16 L34 28 Z" />
          <path d="M46 22 L34 16 L34 28 Z" />
          <circle cx="34" cy="22" r="3" fill="#be185d" />
        </g>
      );
    case "glasses":
      return (
        <g fill="none" stroke="#1e1b4b" strokeWidth="2.5">
          <circle cx="40" cy="48" r="7" />
          <circle cx="60" cy="48" r="7" />
          <line x1="47" y1="48" x2="53" y2="48" />
        </g>
      );
    case "headphones":
      return (
        <g>
          <path d="M20 50 Q20 18 50 18 Q80 18 80 50" stroke="#1e1b4b" strokeWidth="4" fill="none" />
          <rect x="14" y="48" width="10" height="16" rx="3" fill="#1e1b4b" />
          <rect x="76" y="48" width="10" height="16" rx="3" fill="#1e1b4b" />
        </g>
      );
    case "none":
    default:
      return null;
  }
}