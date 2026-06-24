import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

export const Backdrop: React.FC<{ tone?: "dark" | "yellow" | "pink" | "mint" }> = ({ tone = "dark" }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 80) * 30;
  const base =
    tone === "yellow" ? C.yellow : tone === "pink" ? C.pink : tone === "mint" ? C.mint : C.bg;
  const accent =
    tone === "dark" ? C.bgSoft : "#ffffff";
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      {/* Subtle radial wash */}
      <AbsoluteFill
        style={{
          background:
            tone === "dark"
              ? `radial-gradient(1200px 800px at ${50 + drift}% 30%, ${C.blue}22, transparent 60%)`
              : `radial-gradient(1400px 900px at ${50 - drift}% 70%, ${accent}33, transparent 65%)`,
        }}
      />
      {/* Grid lines like notebook paper */}
      <AbsoluteFill
        style={{
          opacity: tone === "dark" ? 0.08 : 0.12,
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          color: tone === "dark" ? C.chalk : C.ink,
          transform: `translate(${drift}px, ${-drift}px)`,
        }}
      />
    </AbsoluteFill>
  );
};