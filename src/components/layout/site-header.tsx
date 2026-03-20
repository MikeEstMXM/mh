"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { visibleApplets } from "@/config/applets";
import { siteConfig } from "@/config/site";
import { cx } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--color-outline)]">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-1 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mr-3 py-3 text-sm font-medium shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          {siteConfig.name}
        </Link>

        <span className="text-[var(--color-outline-strong)] select-none mr-2">/</span>

        <nav className="flex overflow-x-auto">
          <NavLink href="/" label="home" isActive={pathname === "/"} />
          {visibleApplets.map((applet) => (
            <NavLink
              key={applet.slug}
              href={applet.href}
              label={applet.name.toLowerCase()}
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
        "px-3 py-3 text-xs whitespace-nowrap transition-colors",
        isActive
          ? "text-[var(--color-ink)]"
          : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
      )}
    >
      {label}
    </Link>
  );
}
