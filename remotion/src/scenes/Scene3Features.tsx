import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, display, body } from "../theme";

const tiles = [
  { emoji: "⏳", title: "Live Countdown", sub: "Down to the half-day.", bg: C.mint, fg: C.ink },
  { emoji: "🎮", title: "Built-in Games", sub: "Chess, arcade & more.", bg: C.pink, fg: C.chalk },
  { emoji: "💬", title: "Class Chat", sub: "Talk with your school.", bg: C.yellow, fg: C.ink },
  { emoji: "✨", title: "Custom Widgets", sub: "Featured by the creator.", bg: C.blue, fg: C.chalk },
];

export const Scene3Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const title = spring({ frame: frame - 2, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <Backdrop tone="dark" />
      <AbsoluteFill style={{ padding: "100px 160px" }}>
        <div
          style={{
            fontFamily: display,
            fontSize: 130,
            color: C.chalk,
            opacity: title,
            transform: `translateY(${interpolate(title, [0, 1], [40, 0])}px)`,
            lineHeight: 1,
          }}
        >
          Everything in <span style={{ color: C.mint }}>one tab.</span>
        </div>

        <div
          style={{
            marginTop: 80,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 36,
          }}
        >
          {tiles.map((t, i) => {
            const s = spring({ frame: frame - 18 - i * 9, fps, config: { damping: 14, stiffness: 160 } });
            const float = Math.sin((frame + i * 18) / 14) * 6;
            return (
              <div
                key={t.title}
                style={{
                  background: t.bg,
                  color: t.fg,
                  borderRadius: 36,
                  padding: "44px 50px",
                  display: "flex",
                  gap: 32,
                  alignItems: "center",
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [60, float])}px) scale(${interpolate(s, [0, 1], [0.92, 1])})`,
                  boxShadow: `10px 10px 0 ${C.ink}`,
                }}
              >
                <div style={{ fontSize: 110, lineHeight: 1 }}>{t.emoji}</div>
                <div>
                  <div style={{ fontFamily: display, fontSize: 64, lineHeight: 1 }}>{t.title}</div>
                  <div style={{ fontFamily: body, fontWeight: 600, fontSize: 32, marginTop: 10, opacity: 0.85 }}>
                    {t.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};