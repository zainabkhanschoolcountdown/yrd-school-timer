import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, display, body } from "../theme";

export const Scene4Stat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const label = spring({ frame: frame - 2, fps, config: { damping: 18 } });
  const num = spring({ frame: frame - 14, fps, config: { damping: 9, stiffness: 110 } });
  const sub = spring({ frame: frame - 46, fps, config: { damping: 20 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.015;

  return (
    <AbsoluteFill>
      <Backdrop tone="pink" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div
          style={{
            fontFamily: body,
            fontWeight: 800,
            fontSize: 60,
            letterSpacing: 8,
            color: C.chalk,
            opacity: label,
            transform: `translateY(${interpolate(label, [0, 1], [-30, 0])}px)`,
          }}
        >
          RIGHT NOW
        </div>
        <div
          style={{
            fontFamily: display,
            fontSize: 620,
            lineHeight: 0.9,
            color: C.yellow,
            opacity: num,
            transform: `scale(${interpolate(num, [0, 1], [0.5, pulse])})`,
            textShadow: `14px 14px 0 ${C.ink}`,
          }}
        >
          2.5
        </div>
        <div
          style={{
            fontFamily: display,
            fontSize: 110,
            color: C.chalk,
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [30, 0])}px)`,
            marginTop: -20,
          }}
        >
          days of school left.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};