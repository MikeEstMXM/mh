import { AppletCard } from "@/components/ui/applet-card";
import { visibleApplets } from "@/config/applets";
import { siteConfig } from "@/config/site";

const readyCount = visibleApplets.filter((a) => a.status === "ready").length;
const betaCount = visibleApplets.filter((a) => a.status === "beta").length;

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-base font-medium">{siteConfig.name}</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{siteConfig.description}</p>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          {visibleApplets.length} applets · {readyCount} ready · {betaCount} beta
        </p>
      </section>

      <section>
        <p className="mb-3 text-xs text-[var(--color-muted)]">apps</p>
        <div className="grid gap-px bg-[var(--color-outline)] border border-[var(--color-outline)] sm:grid-cols-2 xl:grid-cols-3">
          {visibleApplets.map((applet) => (
            <AppletCard key={applet.slug} applet={applet} />
          ))}
        </div>
      </section>
    </div>
  );
}
