import { AppletCard } from "@/components/ui/applet-card";
import { visibleApplets } from "@/config/applets";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-base font-medium">{siteConfig.name}</h1>

      <div className="grid gap-px bg-[var(--color-outline)] border border-[var(--color-outline)] sm:grid-cols-2 xl:grid-cols-3">
        {visibleApplets.map((applet) => (
          <AppletCard key={applet.slug} applet={applet} />
        ))}
      </div>
    </div>
  );
}
