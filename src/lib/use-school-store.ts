import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
  getCurrentSchoolYear,
  getDefaultHolidays,
  countSchoolDaysRemaining,
  countTotalSchoolDays,
  type HolidayEntry,
} from "./school-days";
import { type AvatarConfig, DEFAULT_AVATAR } from "./avatar";

interface UserSettings {
  name: string;
  grade: string;
  customEndDate: string | null;
  customHolidays: HolidayEntry[];
  soundEnabled: boolean;
  isCreator: boolean;
  avatar: AvatarConfig;
}

const CREATOR_USERNAMES = new Set(["mountfuji"]);

const emptySettings: UserSettings = {
  name: "",
  grade: "",
  customEndDate: null,
  customHolidays: [],
  soundEnabled: false,
  isCreator: false,
  avatar: DEFAULT_AVATAR,
};

export function useSchoolStore(userId: string | null) {
  const [settings, setSettings] = useState<UserSettings>(emptySettings);
  const [loaded, setLoaded] = useState(false);
  const schoolYear = getCurrentSchoolYear();
  const skipSave = useRef(true);

  // Load profile from DB
  useEffect(() => {
    if (!userId) {
      setSettings(emptySettings);
      setLoaded(false);
      skipSave.current = true;
      return;
    }
    skipSave.current = true;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username, grade, custom_end_date, custom_holidays, sound_enabled, avatar")
        .eq("user_id", userId)
        .maybeSingle();
      if (data) {
        const uname = data.username || "";
        setSettings({
          name: uname,
          grade: data.grade || "",
          customEndDate: data.custom_end_date,
          customHolidays: Array.isArray(data.custom_holidays) ? (data.custom_holidays as unknown as HolidayEntry[]) : [],
          soundEnabled: !!data.sound_enabled,
          isCreator: CREATOR_USERNAMES.has(uname.toLowerCase()),
          avatar: { ...DEFAULT_AVATAR, ...((data.avatar as Partial<AvatarConfig>) || {}) },
        });
      }
      setLoaded(true);
      // Allow saves on next change
      setTimeout(() => { skipSave.current = false; }, 50);
    })();
  }, [userId]);

  // Persist on change
  useEffect(() => {
    if (!userId || !loaded || skipSave.current) return;
    const payload = {
      grade: settings.grade,
      custom_end_date: settings.customEndDate,
      custom_holidays: settings.customHolidays as unknown as Json,
      sound_enabled: settings.soundEnabled,
      avatar: settings.avatar as unknown as Json,
    };
    supabase.from("profiles").update(payload).eq("user_id", userId).then(() => {});
  }, [settings, userId, loaded]);

  const endDate = settings.customEndDate
    ? new Date(settings.customEndDate + "T00:00:00")
    : schoolYear.endDate;
  const defaultHolidays = getDefaultHolidays(schoolYear);
  const allHolidays = [...defaultHolidays, ...settings.customHolidays];
  const holidayDates = new Set(allHolidays.map(h => h.date));
  const daysRemaining = countSchoolDaysRemaining(endDate, holidayDates);
  const totalDays = countTotalSchoolDays(schoolYear.startDate, endDate, holidayDates);
  const daysPassed = totalDays - daysRemaining;
  const progress = totalDays > 0 ? Math.round((daysPassed / totalDays) * 100) : 0;

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const addCustomHoliday = useCallback((entry: HolidayEntry) => {
    setSettings(prev => ({ ...prev, customHolidays: [...prev.customHolidays, { ...entry, isCustom: true }] }));
  }, []);

  const removeCustomHoliday = useCallback((date: string) => {
    setSettings(prev => ({ ...prev, customHolidays: prev.customHolidays.filter(h => h.date !== date) }));
  }, []);

  return {
    settings,
    updateSettings,
    addCustomHoliday,
    removeCustomHoliday,
    schoolYear,
    endDate,
    allHolidays,
    holidayDates,
    daysRemaining,
    totalDays,
    daysPassed,
    progress,
  };
}
