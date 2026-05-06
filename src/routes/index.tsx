import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSchoolStore } from "@/lib/use-school-store";
import { CountdownDisplay } from "@/components/CountdownDisplay";
import { CalendarView } from "@/components/CalendarView";
import { SettingsPanel } from "@/components/SettingsPanel";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "YRDSB School Countdown 🎒" },
      { name: "description", content: "Count down the remaining school days for YRDSB elementary schools!" },
    ],
  }),
});

type Tab = "countdown" | "calendar" | "settings";

function Index() {
  const store = useSchoolStore();
  const [tab, setTab] = useState<Tab>("countdown");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "countdown", label: "Countdown", icon: "⏳" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="text-center pt-8 pb-4 px-4">
        <h1
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary via-sky to-accent bg-clip-text text-transparent"
          style={{ WebkitBackgroundClip: "text" }}
        >
          🎒 School Day Countdown
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">YRDSB Elementary</p>
      </header>

      {/* Tab bar */}
      <nav className="flex justify-center gap-2 px-4 mb-6">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 px-4 pb-12 max-w-2xl mx-auto w-full">
        <div className="rounded-3xl bg-card shadow-xl border p-6 md:p-10">
          {tab === "countdown" && (
            <CountdownDisplay
              daysRemaining={store.daysRemaining}
              progress={store.progress}
              totalDays={store.totalDays}
              daysPassed={store.daysPassed}
              name={store.settings.name}
              grade={store.settings.grade}
              soundEnabled={store.settings.soundEnabled}
            />
          )}
          {tab === "calendar" && (
            <CalendarView
              holidayDates={store.holidayDates}
              allHolidays={store.allHolidays}
              startDate={store.schoolYear.startDate}
              endDate={store.endDate}
            />
          )}
          {tab === "settings" && (
            <SettingsPanel
              name={store.settings.name}
              grade={store.settings.grade}
              customEndDate={store.settings.customEndDate}
              soundEnabled={store.settings.soundEnabled}
              customHolidays={store.settings.customHolidays}
              onUpdate={store.updateSettings}
              onAddHoliday={store.addCustomHoliday}
              onRemoveHoliday={store.removeCustomHoliday}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        Made with 💚 for YRDSB students
      </footer>
    </div>
  );
}
