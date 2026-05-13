import { useState, useEffect, useCallback } from "react";
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

const STORAGE_KEY = "yrdsb-countdown-settings";

function loadSettings(): UserSettings {
  if (typeof window === "undefined") {
    return { name: "", grade: "", customEndDate: null, customHolidays: [], soundEnabled: false, isCreator: false, avatar: DEFAULT_AVATAR };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...{ avatar: DEFAULT_AVATAR }, ...parsed, avatar: { ...DEFAULT_AVATAR, ...(parsed.avatar || {}) } };
    }
  } catch {}
  return { name: "", grade: "", customEndDate: null, customHolidays: [], soundEnabled: false, isCreator: false, avatar: DEFAULT_AVATAR };
}

function saveSettings(settings: UserSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useSchoolStore() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const schoolYear = getCurrentSchoolYear();

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

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const addCustomHoliday = useCallback((entry: HolidayEntry) => {
    setSettings(prev => ({
      ...prev,
      customHolidays: [...prev.customHolidays, { ...entry, isCustom: true }],
    }));
  }, []);

  const removeCustomHoliday = useCallback((date: string) => {
    setSettings(prev => ({
      ...prev,
      customHolidays: prev.customHolidays.filter(h => h.date !== date),
    }));
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