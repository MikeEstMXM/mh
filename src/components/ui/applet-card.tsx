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
      className="group flex items-center justify-between gap-3 bg-[var(--color-canvas)] px-4 py-3 transition-colors hover:bg-[var(--color-panel)]"
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <AppletIcon name={applet.iconName} className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" />
        <span className="text-sm font-medium truncate">{applet.name}</span>
      </div>
      <StatusBadge status={applet.status} />
    </Link>
  );
}
