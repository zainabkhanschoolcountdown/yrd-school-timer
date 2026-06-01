import { useState } from "react";
import { getDayType, formatDate, type DayType } from "@/lib/school-days";

interface CalendarViewProps {
  holidayDates: Set<string>;
  allHolidays: { date: string; name: string; isCustom?: boolean }[];
  startDate: Date;
  endDate: Date;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dayColors: Record<DayType, string> = {
  school: "bg-school-day text-primary-foreground font-bold",
  weekend: "bg-weekend text-muted-foreground",
  holiday: "bg-holiday text-primary-foreground font-bold",
  "past-school": "bg-mint/40 text-foreground/70",
  today: "bg-sky text-primary-foreground font-bold ring-2 ring-sky ring-offset-2",
};

export function CalendarView({ holidayDates, allHolidays, startDate, endDate }: CalendarViewProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const firstDay = new Date(currentYear, currentMonth, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const holidayMap = new Map(allHolidays.map(h => [h.date, h.name]));

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="rounded-full p-2 hover:bg-muted transition-colors text-xl">
          ◀
        </button>
        <h3 className="text-lg font-bold text-foreground">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h3>
        <button onClick={nextMonth} className="rounded-full p-2 hover:bg-muted transition-colors text-xl">
          ▶
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-xs font-bold text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const date = new Date(currentYear, currentMonth, day);
          const type = getDayType(date, holidayDates, startDate, endDate);
          const dateStr = formatDate(date);
          const holidayName = holidayMap.get(dateStr);

          return (
            <div
              key={dateStr}
              title={holidayName || type}
              className={`relative aspect-square flex items-center justify-center rounded-lg text-sm transition-transform hover:scale-110 cursor-default ${dayColors[type]}`}
            >
              {day}
              {holidayName && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-coral" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-school-day" /> School Day</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-holiday" /> Holiday/PA</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-weekend" /> Weekend</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sky" /> Today</span>
      </div>
    </div>
  );
}