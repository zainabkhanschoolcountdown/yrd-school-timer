import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { containsProfanity, censorText } from "@/lib/profanity-filter";

export default defineTool({
  name: "post_chat_message",
  title: "Post a chat message",
  description:
    "Post a message to the app's live chat as the signed-in user. Swear words are automatically censored.",
  inputSchema: {
    text: z.string().trim().min(1).max(300).describe("The message to send (max 300 characters)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ text }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId()!;
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar")
      .eq("user_id", userId)
      .maybeSingle();
    const clean = containsProfanity(text) ? censorText(text) : text;
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        author: profile?.username ?? "Anonymous",
        text: clean,
        avatar: (profile?.avatar ?? null) as never,
      })
      .select("id, author, text, created_at")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Sent: ${clean}` }],
      structuredContent: { message: data },
    };
  },
});
