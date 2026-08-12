import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getCountdown from "./tools/get-countdown";
import getProfile from "./tools/get-profile";
import listChatMessages from "./tools/list-chat-messages";
import postChatMessage from "./tools/post-chat-message";
import recommendGame from "./tools/recommend-game";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "school-countdown-timer",
  title: "School Countdown Timer",
  version: "0.1.0",
  instructions:
    "Tools for the School Countdown Timer app. Use `get_countdown` for school days remaining, `get_profile` for the student's saved settings, `list_chat_messages`/`post_chat_message` for the live chat, and `recommend_game` to suggest a game.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getCountdown, getProfile, listChatMessages, postChatMessage, recommendGame],
});
