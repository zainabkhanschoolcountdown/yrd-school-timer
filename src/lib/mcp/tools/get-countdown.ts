import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import {
  countSchoolDaysRemaining,
  countTotalSchoolDays,
  getCurrentSchoolYear,
  getDefaultHalfDays,
  getDefaultHolidays,
  formatDate,
} from "@/lib/school-days";

export default defineTool({
  name: "get_countdown",
  title: "Get school day countdown",
  description:
    "Get how many school days are left until the last day of school for the signed-in student, using their saved end date and custom days off.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .select("username, grade, custom_end_date, custom_holidays, school_board")
      .eq("user_id", ctx.getUserId()!)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const schoolYear = getCurrentSchoolYear();
    const endDate = data?.custom_end_date ? new Date(`${data.custom_end_date}T00:00:00`) : schoolYear.endDate;
    const holidays = new Set(getDefaultHolidays(schoolYear).map((h) => h.date));
    const custom = Array.isArray(data?.custom_holidays) ? (data!.custom_holidays as unknown[]) : [];
    for (const entry of custom) {
      const date = (entry as { date?: unknown })?.date;
      if (typeof date === "string") holidays.add(date);
    }
    const halfDays = getDefaultHalfDays(schoolYear);
    const daysRemaining = countSchoolDaysRemaining(endDate, holidays, halfDays);
    const totalDays = countTotalSchoolDays(schoolYear.startDate, endDate, holidays, halfDays);

    const result = {
      username: data?.username ?? null,
      grade: data?.grade ?? null,
      schoolBoard: data?.school_board ?? null,
      lastDayOfSchool: formatDate(endDate),
      daysRemaining,
      totalSchoolDays: totalDays,
      daysCompleted: Math.round((totalDays - daysRemaining) * 2) / 2,
    };
    return {
      content: [
        {
          type: "text",
          text: `${result.daysRemaining} school days left until ${result.lastDayOfSchool}.`,
        },
      ],
      structuredContent: result,
    };
  },
});
