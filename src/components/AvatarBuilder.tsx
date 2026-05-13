import { AnimatedAvatar } from "./AnimatedAvatar";
import { type AvatarConfig, PALETTE_BG, PALETTE_FACE, SHAPES } from "@/lib/avatar";

interface Props {
  config: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
}

const EYES: AvatarConfig["eyes"][] = ["dots", "happy", "stars", "sleepy", "wink"];
const MOUTHS: AvatarConfig["mouth"][] = ["smile", "grin", "neutral", "ohh", "tongue"];
const ACCESSORIES: AvatarConfig["accessory"][] = ["none", "hat", "crown", "bow", "glasses", "headphones"];
const ANIMATIONS: AvatarConfig["animation"][] = ["bounce", "spin", "pulse", "wiggle", "float", "none"];

const ANIM_EMOJI: Record<AvatarConfig["animation"], string> = {
  bounce: "⤴️", spin: "🔄", pulse: "💗", wiggle: "👋", float: "🎈", none: "⏸️",
};

export function AvatarBuilder({ config, onChange }: Props) {
  const set = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) =>
    onChange({ ...config, [key]: value });

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex justify-center py-4 bg-muted/40 rounded-2xl border">
        <AnimatedAvatar config={config} size={120} />
      </div>

      {/* Shape preset */}
      <Section label="Shape">
        <ChipRow>
          {SHAPES.map(s => (
            <Chip key={s} active={(config.shape ?? "face") === s} onClick={() => set("shape", s)}>
              <AnimatedAvatar config={{ ...config, shape: s, animation: "none" }} size={40} animate={false} />
            </Chip>
          ))}
        </ChipRow>
      </Section>

      {/* Background color */}
      <Section label="Background">
        <div className="flex flex-wrap gap-2">
          {PALETTE_BG.map(c => (
            <Swatch key={c} color={c} active={config.bg === c} onClick={() => set("bg", c)} />
          ))}
        </div>
      </Section>

      {/* Face color */}
      <Section label="Face">
        <div className="flex flex-wrap gap-2">
          {PALETTE_FACE.map(c => (
            <Swatch key={c} color={c} active={config.face === c} onClick={() => set("face", c)} />
          ))}
        </div>
      </Section>

      {/* Eyes */}
      <Section label="Eyes">
        <ChipRow>
          {EYES.map(e => (
            <Chip key={e} active={config.eyes === e} onClick={() => set("eyes", e)}>
              <AnimatedAvatar config={{ ...config, eyes: e, animation: "none" }} size={40} animate={false} />
            </Chip>
          ))}
        </ChipRow>
      </Section>

      {/* Mouth */}
      <Section label="Mouth">
        <ChipRow>
          {MOUTHS.map(m => (
            <Chip key={m} active={config.mouth === m} onClick={() => set("mouth", m)}>
              <AnimatedAvatar config={{ ...config, mouth: m, animation: "none" }} size={40} animate={false} />
            </Chip>
          ))}
        </ChipRow>
      </Section>

      {/* Accessory */}
      <Section label="Accessory">
        <ChipRow>
          {ACCESSORIES.map(a => (
            <Chip key={a} active={config.accessory === a} onClick={() => set("accessory", a)}>
              <AnimatedAvatar config={{ ...config, accessory: a, animation: "none" }} size={40} animate={false} />
            </Chip>
          ))}
        </ChipRow>
      </Section>

      {/* Animation */}
      <Section label="Animation">
        <div className="grid grid-cols-3 gap-2">
          {ANIMATIONS.map(a => (
            <button
              key={a}
              onClick={() => set("animation", a)}
              className={`rounded-xl px-3 py-2 text-xs font-bold capitalize border transition-all ${
                config.animation === a
                  ? "bg-primary text-primary-foreground border-primary scale-105"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              {ANIM_EMOJI[a]} {a}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl p-1 border-2 transition-all ${
        active ? "border-primary scale-110 bg-primary/10" : "border-transparent bg-muted hover:bg-muted/70"
      }`}
    >
      {children}
    </button>
  );
}

function Swatch({ color, active, onClick }: { color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ background: color }}
      className={`w-9 h-9 rounded-full border-2 transition-all ${
        active ? "border-foreground scale-110 ring-2 ring-primary" : "border-border hover:scale-105"
      }`}
      aria-label={color}
    />
  );
}