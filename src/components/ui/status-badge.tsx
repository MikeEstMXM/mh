import { cx } from "@/lib/utils";
import type { AppletStatus } from "@/types/applet";

type StatusBadgeProps = {
  status: AppletStatus;
  children?: React.ReactNode;
};

const dotColor: Record<AppletStatus, string> = {
  ready: "bg-[var(--color-ready-ink)]",
  beta: "bg-[var(--color-beta-ink)]",
  "coming-soon": "bg-[var(--color-coming-soon-ink)]",
};

const textColor: Record<AppletStatus, string> = {
  ready: "text-[var(--color-ready-ink)]",
  beta: "text-[var(--color-beta-ink)]",
  "coming-soon": "text-[var(--color-coming-soon-ink)]",
};

const label: Record<AppletStatus, string> = {
  ready: "ready",
  beta: "beta",
  "coming-soon": "soon",
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span className={cx("flex items-center gap-1 shrink-0 text-[10px]", textColor[status])}>
      <span className={cx("h-1.5 w-1.5 rounded-full shrink-0", dotColor[status])} />
      {children ?? label[status]}
    </span>
  );
}
