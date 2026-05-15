import { Crown, Shield } from "lucide-react";

export function RoleBadge({ role, size = 14 }: { role: "creator" | "admin" | null; size?: number }) {
  if (!role) return null;
  if (role === "creator") {
    return (
      <span
        title="Creator"
        className="inline-flex items-center justify-center rounded-full bg-[var(--color-creator-gold)] text-amber-900 shadow-sm"
        style={{ width: size + 8, height: size + 8 }}
      >
        <Crown size={size} strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span
      title="Admin"
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-500 to-sky-500 text-white shadow-sm"
      style={{ width: size + 8, height: size + 8 }}
    >
      <Shield size={size} strokeWidth={2.5} />
    </span>
  );
}