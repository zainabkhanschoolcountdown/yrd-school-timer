import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, display, body } from "../theme";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 140 } });
  const line2 = spring({ frame: frame - 22, fps, config: { damping: 16, stiffness: 140 } });
  const tick = Math.max(0, 142 - Math.floor((frame / 90) * 142));
  const half = (frame % 6) < 3 ? "5" : "0";
  const bob = Math.sin(frame / 8) * 6;

  return (
    <AbsoluteFill>
      <Backdrop tone="dark" />
      <AbsoluteFill style={{ padding: "0 180px", justifyContent: "center", alignItems: "flex-start" }}>
        <div
          style={{
            fontFamily: body,
            fontWeight: 800,
            fontSize: 56,
            color: C.mint,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: line1,
            transform: `translateX(${interpolate(line1, [0, 1], [-40, 0])}px)`,
          }}
        >
          For every kid counting…
        </div>
        <div
          style={{
            fontFamily: display,
            fontSize: 220,
            lineHeight: 0.95,
            color: C.chalk,
            marginTop: 30,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [40, 0])}px)`,
          }}
        >
          How many days
          <br />
          <span style={{ color: C.yellow }}>until summer?</span>
        </div>

        {/* Ticker block, lower right */}
        <div
          style={{
            position: "absolute",
            right: 120,
            bottom: 80 + bob,
            transform: `rotate(-4deg)`,
            background: C.bgSoft,
            border: `4px solid ${C.pink}`,
            borderRadius: 24,
            padding: "22px 36px",
            boxShadow: `12px 12px 0 ${C.pink}`,
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div style={{ fontFamily: body, fontWeight: 600, fontSize: 22, color: C.chalk, opacity: 0.7, letterSpacing: 2 }}>
            DAYS LEFT
          </div>
          <div style={{ fontFamily: display, fontSize: 120, color: C.pink, lineHeight: 1 }}>
            {tick}.{half}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};