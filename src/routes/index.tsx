import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSchoolStore } from "@/lib/use-school-store";
import { CountdownDisplay } from "@/components/CountdownDisplay";
import { SettingsPanel } from "@/components/SettingsPanel";
import { CreatorPanel } from "@/components/CreatorPanel";
import { GamesTab } from "@/components/GamesTab";
import { ChatRoom } from "@/components/ChatRoom";
import { WidgetStrip } from "@/components/WidgetStrip";
import { RoleBadge } from "@/components/RoleBadge";
import { useRoles } from "@/lib/use-roles";
import { useAuth } from "@/lib/use-auth";
import { AuthScreen } from "@/components/AuthScreen";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "YRDSB School Countdown 🎒" },
      { name: "description", content: "Count down the remaining school days for YRDSB elementary schools!" },
    ],
  }),
});

type Tab = "countdown" | "calendar" | "games" | "chat" | "settings" | "creator";

function Index() {
  const { session, loading } = useAuth();
  const userId = session?.user?.id ?? null;
  const store = useSchoolStore(userId);
  const [tab, setTab] = useState<Tab>("countdown");
  const { isAdmin } = useRoles();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!session) {
    return <AuthScreen />;
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "countdown", label: "Countdown", icon: "⏳" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "games", label: "Games", icon: "🎮" },
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const isCreator = store.settings.isCreator === true;
  const meIsAdmin = isAdmin(store.settings.name);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="text-center pt-8 pb-4 px-4">
        <h1
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary via-sky to-accent bg-clip-text text-transparent inline-flex items-center gap-2 justify-center"
          style={{ WebkitBackgroundClip: "text" }}
        >
          <span>🎒 School Day Countdown</span>
        </h1>
        {(isCreator || meIsAdmin) && (
          <div className="mt-2 flex justify-center">
            <RoleBadge role={isCreator ? "creator" : "admin"} size={14} />
          </div>
        )}
        <p className="text-white/70 mt-1 text-sm">YRDSB Elementary</p>
      </header>

      {/* Tab bar */}
      <nav className="flex justify-center gap-2 px-4 mb-6 flex-wrap">
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
        {isCreator && (
          <button
            onClick={() => setTab("creator")}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
              tab === "creator"
                ? "bg-[var(--color-creator-gold)] text-amber-900 shadow-lg scale-105"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <span>👑</span>
            <span className="hidden sm:inline">Creator</span>
          </button>
        )}
      </nav>

      {/* Content */}
      <main className="flex-1 px-4 pb-12 max-w-2xl mx-auto w-full">
        <div className="rounded-3xl bg-card shadow-xl border p-6 md:p-10">
          {tab === "countdown" && (
            <>
            <CountdownDisplay
              daysRemaining={store.daysRemaining}
              progress={store.progress}
              totalDays={store.totalDays}
              daysPassed={store.daysPassed}
              name={store.settings.name}
              grade={store.settings.grade}
              soundEnabled={store.settings.soundEnabled}
            />
            <WidgetStrip />
            </>
          )}
          {tab === "calendar" && (
            <CalendarView
              holidayDates={store.holidayDates}
              allHolidays={store.allHolidays}
              startDate={store.schoolYear.startDate}
              endDate={store.endDate}
            />
          )}
          {tab === "games" && <GamesTab />}
          {tab === "chat" && <ChatRoom userName={store.settings.name} isCreator={isCreator} avatar={store.settings.avatar} />}
          {tab === "settings" && (
            <SettingsPanel
              name={store.settings.name}
              grade={store.settings.grade}
              customEndDate={store.settings.customEndDate}
              soundEnabled={store.settings.soundEnabled}
              customHolidays={store.settings.customHolidays}
              isCreator={isCreator}
              avatar={store.settings.avatar}
              onUpdate={store.updateSettings}
              onAddHoliday={store.addCustomHoliday}
              onRemoveHoliday={store.removeCustomHoliday}
            />
          )}
          {tab === "creator" && isCreator && <CreatorPanel />}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-white/60 space-y-1">
        <p>Made with 💚 for YRDSB students</p>
        <p className="font-bold text-white/80">Created by mountfuji 🏔️</p>
      </footer>
    </div>
  );
}
