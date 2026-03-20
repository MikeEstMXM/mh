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
      className="group flex min-h-52 flex-col rounded-[1.75rem] border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))] p-5 shadow-[0_18px_40px_rgba(22,33,38,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--color-outline-strong)] hover:shadow-[0_24px_48px_rgba(22,33,38,0.1)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          <AppletIcon name={applet.iconName} className="h-7 w-7" />
        </div>
        <StatusBadge status={applet.status} />
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
            {applet.category}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{applet.name}</h3>
        </div>
        <p className="text-sm leading-6 text-[var(--color-muted)]">{applet.description}</p>
      </div>

      <div className="mt-auto pt-5">
        <span className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-outline)] bg-white/75 px-4 text-sm font-medium text-[var(--color-ink)] transition group-hover:border-transparent group-hover:bg-[var(--color-accent)] group-hover:text-white">
          Open applet
        </span>
      </div>
    </Link>
  );
}
