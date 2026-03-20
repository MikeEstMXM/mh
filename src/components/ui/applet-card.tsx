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
      className="group flex flex-col rounded-2xl border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.7))] p-4 transition hover:border-[var(--color-outline-strong)] hover:shadow-[0_8px_24px_rgba(22,33,38,0.07)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AppletIcon name={applet.iconName} className="h-4 w-4 text-[var(--color-accent)]" />
          <h3 className="text-sm font-medium">{applet.name}</h3>
        </div>
        <StatusBadge status={applet.status} />
      </div>

      <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">{applet.description}</p>

      <div className="mt-auto pt-4">
        <span className="text-xs text-[var(--color-accent)] transition group-hover:text-[var(--color-ink)]">
          Open →
        </span>
      </div>
    </Link>
  );
}
