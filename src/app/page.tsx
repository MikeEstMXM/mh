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
    </div>
  );
}
