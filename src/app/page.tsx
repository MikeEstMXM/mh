import { AppletCard } from "@/components/ui/applet-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { visibleApplets } from "@/config/applets";
import { siteConfig } from "@/config/site";

const readyCount = visibleApplets.filter((applet) => applet.status === "ready").length;
const betaCount = visibleApplets.filter((applet) => applet.status === "beta").length;

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.74))] p-6 shadow-[0_18px_60px_rgba(22,33,38,0.08)] sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status="ready">Platform ready</StatusBadge>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
              Rename in src/config/site.ts
            </span>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-accent)]">
              Personal web app platform
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              {siteConfig.name}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">
              {siteConfig.description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-[var(--color-outline)] bg-[var(--color-panel)] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
                Applets
              </p>
              <p className="mt-2 text-3xl font-semibold">{visibleApplets.length}</p>
            </div>
            <div className="rounded-3xl border border-[var(--color-outline)] bg-[var(--color-panel)] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
                Ready now
              </p>
              <p className="mt-2 text-3xl font-semibold">{readyCount}</p>
            </div>
            <div className="rounded-3xl border border-[var(--color-outline)] bg-[var(--color-panel)] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
                In beta
              </p>
              <p className="mt-2 text-3xl font-semibold">{betaCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Launch screen</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)] sm:text-base">
            Every applet is defined once in the registry, then surfaced here and in navigation.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleApplets.map((applet) => (
            <AppletCard key={applet.slug} applet={applet} />
          ))}
        </div>
      </section>
    </div>
  );
}
