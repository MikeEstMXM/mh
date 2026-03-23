<<<<<<< HEAD
import Image from "next/image";
import Link from "next/link";
import { visibleApplets } from "@/config/applets";
import { deploymentConfig, withBasePath } from "@/config/deployment";

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <Image
        src={withBasePath(deploymentConfig.logoPath)}
        alt="MikeEstMXM"
        width={140}
        height={140}
        priority
        className="rounded-full"
      />

      <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
        MikeEstMXM
      </p>

      <div className="mt-6 h-px w-12 bg-[var(--color-outline)]" />

      <nav className="mt-6 flex flex-col items-center gap-1">
        {visibleApplets.map((applet) => (
          <Link
            key={applet.slug}
            href={applet.href}
            className="px-3 py-1.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            {applet.name.toLowerCase()}
          </Link>
        ))}
      </nav>
=======
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
>>>>>>> main
    </div>
  );
}
