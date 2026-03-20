"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { visibleApplets } from "@/config/applets";
import { siteConfig } from "@/config/site";
import { cx } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-outline)] bg-[rgba(244,241,234,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
        >
          <span className="text-sm font-medium">{siteConfig.name}</span>
        </Link>

        <nav className="flex gap-1 overflow-x-auto">
          <NavLink href="/" label="Home" isActive={pathname === "/"} />
          {visibleApplets.map((applet) => (
            <NavLink
              key={applet.slug}
              href={applet.href}
              label={applet.name}
              isActive={pathname === applet.href}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}

type NavLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
};

function NavLink({ href, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex min-h-8 items-center rounded-md px-3 text-xs whitespace-nowrap transition",
        isActive
          ? "bg-[var(--color-accent)] text-white"
          : "text-[var(--color-muted)] hover:bg-[var(--color-outline)] hover:text-[var(--color-ink)]",
      )}
    >
      {label}
    </Link>
  );
}
