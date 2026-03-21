import Link from "next/link";
import { notFound } from "next/navigation";
import { AppletIcon } from "@/components/ui/applet-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAppletBySlug } from "@/config/applets";
import type { AppletSlug } from "@/types/applet";

type AppletPageFrameProps = {
  slug: AppletSlug;
  children: React.ReactNode;
};

export function AppletPageFrame({ slug, children }: AppletPageFrameProps) {
  const applet = getAppletBySlug(slug);

  if (!applet) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="border border-[var(--color-outline)] bg-[var(--color-panel)] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
            >
              <span aria-hidden="true">←</span>
              back
            </Link>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-[var(--color-outline)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <AppletIcon name={applet.iconName} className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-base font-medium">{applet.name}</h1>
                  <StatusBadge status={applet.status} />
                </div>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {applet.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--color-muted)]">
              {applet.category}
            </span>
            <span className="text-[10px] text-[var(--color-outline-strong)]">
              ·
            </span>
            <span className="text-[10px] text-[var(--color-muted)]">
              {applet.href}
            </span>
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
