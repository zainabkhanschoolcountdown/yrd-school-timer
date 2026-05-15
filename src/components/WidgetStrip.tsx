import { useWidgets } from "@/lib/use-widgets";

export function WidgetStrip() {
  const { widgets, loading } = useWidgets();
  if (loading || widgets.length === 0) return null;
  return (
    <div className="w-full mt-6">
      <p className="text-xs text-muted-foreground mb-2 text-center">✨ Featured</p>
      <div className="flex flex-wrap justify-center gap-2">
        {widgets.map((w) => (
          <div
            key={w.id}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
          >
            <span className="text-lg">{w.emoji}</span>
            <span>{w.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}