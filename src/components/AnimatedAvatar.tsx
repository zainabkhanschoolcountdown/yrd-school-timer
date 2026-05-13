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

  return (
    <div
      className={`inline-block ${animClass}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill={config.bg} />
        {/* Face */}
        <circle cx="50" cy="52" r="32" fill={config.face} />
        {/* Eyes */}
        <Eyes type={config.eyes} />
        {/* Mouth */}
        <Mouth type={config.mouth} />
        {/* Accessory */}
        <Accessory type={config.accessory} />
      </svg>
    </div>
  );
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