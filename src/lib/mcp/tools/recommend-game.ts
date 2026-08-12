import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "recommend_game",
  title: "Recommend a game",
  description: "Submit a game recommendation for the app's creator and admins to review.",
  inputSchema: {
    game_name: z.string().trim().min(1).max(80).describe("Name of the game to recommend."),
    game_url: z.string().url().max(500).optional().describe("Optional link to the game."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ game_name, game_url }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("game_recommendations")
      .insert({ user_id: ctx.getUserId()!, game_name, game_url: game_url ?? null })
      .select("id, game_name, game_url, created_at")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Recommended "${game_name}".` }],
      structuredContent: { recommendation: data },
    };
  },
});
