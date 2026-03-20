import { AppletCard } from "@/components/ui/applet-card";
import { visibleApplets } from "@/config/applets";
import { siteConfig } from "@/config/site";

const readyCount = visibleApplets.filter((applet) => applet.status === "ready").length;
const betaCount = visibleApplets.filter((applet) => applet.status === "beta").length;

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.7))] p-6">
        <h1 className="text-xl font-semibold tracking-tight">{siteConfig.name}</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{siteConfig.description}</p>
        <div className="mt-6 flex gap-8">
          <div>
            <p className="text-xs text-[var(--color-muted)]">applets</p>
            <p className="mt-1 text-xl font-medium">{visibleApplets.length}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-muted)]">ready</p>
            <p className="mt-1 text-xl font-medium">{readyCount}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-muted)]">beta</p>
            <p className="mt-1 text-xl font-medium">{betaCount}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs text-[var(--color-muted)]">Apps</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleApplets.map((applet) => (
            <AppletCard key={applet.slug} applet={applet} />
          ))}
        </div>
      </section>
    </div>
  );
}
