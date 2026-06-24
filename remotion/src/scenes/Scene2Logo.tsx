import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, display, body } from "../theme";

export const Scene2Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badge = spring({ frame: frame - 2, fps, config: { damping: 9, stiffness: 130 } });
  const word1 = spring({ frame: frame - 14, fps, config: { damping: 14 } });
  const word2 = spring({ frame: frame - 28, fps, config: { damping: 14 } });
  const tag = spring({ frame: frame - 50, fps, config: { damping: 20 } });
  const spin = interpolate(frame, [0, 90], [-12, 8]);

  return (
    <AbsoluteFill>
      <Backdrop tone="yellow" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* Backpack emoji badge */}
        <div
          style={{
            transform: `scale(${badge}) rotate(${spin}deg)`,
            background: C.ink,
            color: C.yellow,
            borderRadius: 40,
            padding: "20px 40px",
            fontFamily: body,
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: 4,
            marginBottom: 30,
            boxShadow: `10px 10px 0 ${C.pink}`,
          }}
        >
          🎒 YRDSB EDITION
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 280,
              lineHeight: 0.9,
              color: C.ink,
              transform: `translateY(${interpolate(word1, [0, 1], [80, 0])}px)`,
              opacity: word1,
            }}
          >
            SCHOOL
          </div>
          <div
            style={{
              fontFamily: display,
              fontSize: 280,
              lineHeight: 0.9,
              color: C.pink,
              transform: `translateY(${interpolate(word2, [0, 1], [80, 0])}px)`,
              opacity: word2,
              textShadow: `8px 8px 0 ${C.ink}`,
            }}
          >
            COUNTDOWN
          </div>
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: body,
            fontWeight: 600,
            fontSize: 42,
            color: C.ink,
            opacity: tag,
            transform: `translateY(${interpolate(tag, [0, 1], [20, 0])}px)`,
          }}
        >
          The last bell can't come fast enough.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};