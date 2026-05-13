export interface AvatarConfig {
  bg: string;
  face: string;
  eyes: "dots" | "happy" | "stars" | "sleepy" | "wink";
  mouth: "smile" | "grin" | "neutral" | "ohh" | "tongue";
  accessory: "none" | "hat" | "crown" | "bow" | "glasses" | "headphones";
  animation: "bounce" | "spin" | "pulse" | "wiggle" | "float" | "none";
  shape?: "face" | "cat" | "dog" | "bear" | "bunny" | "fox" | "panda" | "mountain" | "tree" | "sun" | "moon" | "star" | "heart" | "robot" | "ghost" | "alien";
}

export const DEFAULT_AVATAR: AvatarConfig = {
  bg: "#7c3aed",
  face: "#fde68a",
  eyes: "dots",
  mouth: "smile",
  accessory: "none",
  animation: "bounce",
  shape: "face",
};

export const SHAPES: NonNullable<AvatarConfig["shape"]>[] = [
  "face", "cat", "dog", "bear", "bunny", "fox", "panda",
  "mountain", "tree", "sun", "moon", "star", "heart",
  "robot", "ghost", "alien",
];

export const PALETTE_BG = [
  "#7c3aed", "#ec4899", "#f97316", "#facc15",
  "#22c55e", "#06b6d4", "#3b82f6", "#ef4444",
  "#0f172a", "#f5f5f5",
];

export const PALETTE_FACE = [
  "#fde68a", "#fbbf24", "#f59e0b", "#fcd5b5",
  "#d6a77a", "#8b5a2b", "#5d3a1a", "#c084fc",
  "#34d399", "#f9a8d4",
];