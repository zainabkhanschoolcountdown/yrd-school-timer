import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, display, body } from "../theme";

const Hourglass: React.FC<{ c: string }> = ({ c }) => (
  <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
    <path d="M6 3h12M6 21h12M7 3v3l5 6-5 6v3M17 3v3l-5 6 5 6v3" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const Pad: React.FC<{ c: string }> = ({ c }) => (
  <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="20" height="11" rx="5" stroke={c} strokeWidth="2"/>
    <circle cx="8" cy="12.5" r="1.2" fill={c}/><circle cx="16" cy="11" r="1.2" fill={c}/><circle cx="16.5" cy="14" r="1.2" fill={c}/><circle cx="18" cy="12.5" r="1.2" fill={c}/>
  </svg>
);
const Chat: React.FC<{ c: string }> = ({ c }) => (
  <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
    <path d="M4 5h16v11H9l-5 4V5z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);
const Spark: React.FC<{ c: string }> = ({ c }) => (
  <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" fill={c}/>
    <circle cx="19" cy="5" r="1.2" fill={c}/><circle cx="5" cy="19" r="1.2" fill={c}/>
  </svg>
);

const tiles = [
  { Icon: Hourglass, title: "Live Countdown", sub: "Down to the half-day.", bg: C.mint, fg: C.ink },
  { Icon: Pad, title: "Built-in Games", sub: "Chess, arcade & more.", bg: C.pink, fg: C.chalk },
  { Icon: Chat, title: "Class Chat", sub: "Talk with your school.", bg: C.yellow, fg: C.ink },
  { Icon: Spark, title: "Custom Widgets", sub: "Featured by the creator.", bg: C.blue, fg: C.chalk },
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <t.Icon c={t.fg} />
                </div>
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