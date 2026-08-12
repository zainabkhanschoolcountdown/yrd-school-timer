import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_chat_messages",
  title: "List chat messages",
  description: "Read the most recent messages from the app's live chat room.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(25).describe("How many recent messages to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, author, text, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const messages = (data ?? []).reverse();
    return {
      content: [{ type: "text", text: JSON.stringify(messages) }],
      structuredContent: { messages },
    };
  },
});
