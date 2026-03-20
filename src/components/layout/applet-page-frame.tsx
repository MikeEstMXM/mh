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
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] p-6 shadow-[0_18px_60px_rgba(22,33,38,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-outline)] bg-white/75 px-4 text-sm font-medium text-[var(--color-muted)] transition hover:border-[var(--color-outline-strong)] hover:text-[var(--color-ink)]"
            >
              <span aria-hidden="true">←</span>
              Back to launch screen
            </Link>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <AppletIcon name={applet.iconName} className="h-7 w-7" />
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                    {applet.category}
                  </p>
                  <StatusBadge status={applet.status} />
                </div>
                <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  {applet.name}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
                  {applet.description}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--color-outline)] bg-[var(--color-panel)] px-4 py-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
              Route
            </p>
            <p className="mt-2 text-sm font-medium">{applet.href}</p>
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
