import { cx } from "@/lib/utils";
import type { AppletStatus } from "@/types/applet";

type StatusBadgeProps = {
  status: AppletStatus;
  children?: React.ReactNode;
};

const statusStyles: Record<AppletStatus, string> = {
  ready: "bg-[var(--color-ready)] text-[var(--color-ready-ink)]",
  beta: "bg-[var(--color-beta)] text-[var(--color-beta-ink)]",
  "coming-soon": "bg-[var(--color-coming-soon)] text-[var(--color-coming-soon-ink)]",
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex min-h-9 items-center rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em]",
        statusStyles[status],
      )}
    >
      {children ?? status.replace("-", " ")}
    </span>
  );
}
