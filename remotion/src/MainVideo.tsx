import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Logo } from "./scenes/Scene2Logo";
import { Scene3Features } from "./scenes/Scene3Features";
import { Scene4Stat } from "./scenes/Scene4Stat";
import { Scene5CTA } from "./scenes/Scene5CTA";

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene1Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={95}>
          <Scene2Logo />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <Scene3Features />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={90}>
          <Scene4Stat />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <Scene5CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};