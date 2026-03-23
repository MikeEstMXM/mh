import Link from "next/link";
import { AppletIcon } from "@/components/ui/applet-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AppletDefinition } from "@/types/applet";

type AppletCardProps = {
  applet: AppletDefinition;
};

export function AppletCard({ applet }: AppletCardProps) {
  return (
    <Link
      href={applet.href}
<<<<<<< HEAD
      className="group flex items-center justify-between gap-3 bg-[var(--color-canvas)] px-4 py-3 transition-colors hover:bg-[var(--color-panel)]"
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <AppletIcon name={applet.iconName} className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" />
        <span className="text-sm font-medium truncate">{applet.name}</span>
      </div>
      <StatusBadge status={applet.status} />
=======
      className="group flex flex-col bg-[var(--color-canvas)] p-4 transition-colors hover:bg-[var(--color-panel)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <AppletIcon name={applet.iconName} className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" />
          <span className="text-sm font-medium truncate">{applet.name}</span>
        </div>
        <StatusBadge status={applet.status} />
      </div>

      <p className="mt-2.5 text-xs leading-5 text-[var(--color-muted)]">{applet.description}</p>

      <span className="mt-5 text-[10px] text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)]">
        open →
      </span>
>>>>>>> main
    </Link>
  );
}
