import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, display, body, mono } from "../theme";

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const head = spring({ frame: frame - 2, fps, config: { damping: 16 } });
  const url = spring({ frame: frame - 22, fps, config: { damping: 12, stiffness: 130 } });
  const arrow = Math.sin(frame / 10) * 14;
  const sweep = interpolate(frame, [40, 100], [-100, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Backdrop tone="dark" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontFamily: display,
            fontSize: 160,
            color: C.chalk,
            opacity: head,
            transform: `translateY(${interpolate(head, [0, 1], [40, 0])}px)`,
            textAlign: "center",
            lineHeight: 0.95,
          }}
        >
          Start your <span style={{ color: C.mint }}>countdown.</span>
        </div>

        {/* URL pill */}
        <div
          style={{
            marginTop: 80,
            position: "relative",
            overflow: "hidden",
            background: C.yellow,
            color: C.ink,
            padding: "40px 80px",
            borderRadius: 999,
            opacity: url,
            transform: `scale(${interpolate(url, [0, 1], [0.8, 1])})`,
            boxShadow: `12px 12px 0 ${C.pink}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sweep}%`,
              width: 180,
              background: `linear-gradient(110deg, transparent, ${C.chalk}66, transparent)`,
              transform: "skewX(-20deg)",
            }}
          />
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 78, position: "relative" }}>
            school-timer-games.lovable.app
          </div>
        </div>

        <div
          style={{
            marginTop: 50,
            fontFamily: body,
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: 4,
            color: C.chalk,
            opacity: 0.85,
            transform: `translateX(${arrow}px)`,
          }}
        >
          GO PLAY →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};