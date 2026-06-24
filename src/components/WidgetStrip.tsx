import { useWidgets } from "@/lib/use-widgets";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function faviconOf(url: string): string {
  try {
    const h = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${h}&sz=64`;
  } catch {
    return "";
  }
}

export function WidgetStrip() {
  const { widgets, loading } = useWidgets();
  if (loading || widgets.length === 0) return null;
  return (
    <div className="w-full mt-6">
      <p className="text-xs text-muted-foreground mb-2 text-center">✨ Featured</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {widgets.map((w) => {
          const href = w.url ?? undefined;
          const Card = (
            <div className="h-full flex items-center gap-3 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border px-3 py-3 text-left shadow-sm hover:shadow-md hover:scale-[1.02] transition">
              <div className="relative w-10 h-10 shrink-0 rounded-xl bg-card border flex items-center justify-center overflow-hidden">
                <span className="text-xl">{w.emoji}</span>
                {href && (
                  <img
                    src={faviconOf(href)}
                    alt=""
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-sm bg-card border"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground truncate">{w.label}</div>
                {href && (
                  <div className="text-[10px] text-muted-foreground truncate">{hostOf(href)}</div>
                )}
              </div>
            </div>
          );
          return href ? (
            <a key={w.id} href={href} target="_blank" rel="noopener noreferrer" className="block">
              {Card}
            </a>
          ) : (
            <div key={w.id}>{Card}</div>
          );
        })}
      </div>
    </div>
  );
}