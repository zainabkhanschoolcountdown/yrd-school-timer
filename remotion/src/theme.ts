import { loadFont as loadTitan } from "@remotion/google-fonts/TitanOne";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpace } from "@remotion/google-fonts/SpaceGrotesk";

export const display = loadTitan("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const body = loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin"] }).fontFamily;
export const mono = loadSpace("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;

export const C = {
  bg: "#0B1020",
  bgSoft: "#141A33",
  ink: "#0B1020",
  chalk: "#F5F1E8",
  yellow: "#FFD23F",
  pink: "#FF3D8A",
  mint: "#4DE2C0",
  blue: "#5B8DEF",
};