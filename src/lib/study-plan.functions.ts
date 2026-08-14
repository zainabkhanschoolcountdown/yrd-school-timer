import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const inputSchema = z.object({
  subjects: z.array(z.string().min(1).max(60)).min(1).max(12),
  daysPerWeek: z.number().int().min(1).max(7),
  minutesPerDay: z.number().int().min(10).max(240),
  goal: z.string().max(500).default(""),
  grade: z.string().max(20).default(""),
  daysRemaining: z.number().min(0).max(400).default(0),
});

export type StudyBlock = { subject: string; minutes: number; focus: string };
export type StudyDay = { day: string; blocks: StudyBlock[] };
export type StudyPlan = { title: string; summary: string; tips: string[]; days: StudyDay[] };

export const generateStudyPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data, context }): Promise<StudyPlan> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured");

    const prompt = `Create a weekly study schedule for an elementary/middle school student.
Grade: ${data.grade || "unknown"}
School days left this year: ${data.daysRemaining}
Subjects: ${data.subjects.join(", ")}
Study days per week: ${data.daysPerWeek}
Minutes available each study day: ${data.minutesPerDay}
Student's goal: ${data.goal || "general improvement"}

Rules: exactly ${data.daysPerWeek} day entries. Each day's blocks must total about ${data.minutesPerDay} minutes (include a short break block if over 45 minutes). Keep language simple, encouraging and kid-friendly.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a friendly study coach for kids. Always answer with the requested tool call." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_plan",
              description: "Return the study plan",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  tips: { type: "array", items: { type: "string" } },
                  days: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "string" },
                        blocks: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              subject: { type: "string" },
                              minutes: { type: "number" },
                              focus: { type: "string" },
                            },
                            required: ["subject", "minutes", "focus"],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ["day", "blocks"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["title", "summary", "tips", "days"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_plan" } },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Too many requests — try again in a minute.");
      if (res.status === 402) throw new Error("AI credits are exhausted. Please top up in Settings.");
      console.error(`AI gateway failed [${res.status}]: ${body}`);
      throw new Error("Could not generate a study plan right now.");
    }

    const json = (await res.json()) as {
      choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
    };
    const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("The AI returned an unexpected response.");
    const plan = JSON.parse(args) as StudyPlan;

    await context.supabase.from("study_plans").insert({
      user_id: context.userId,
      title: plan.title ?? "My Study Plan",
      subjects: data.subjects,
      days_per_week: data.daysPerWeek,
      minutes_per_day: data.minutesPerDay,
      goal: data.goal,
      plan: plan as unknown as Record<string, unknown>,
    });

    return plan;
  });
