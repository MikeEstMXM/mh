"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppLogo } from "@/components/brand/app-logo";
import { visibleApplets } from "@/config/applets";
import { siteConfig } from "@/config/site";
import { cx } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-outline)] bg-[rgba(244,241,234,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-3 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
          >
            <AppLogo className="h-11 w-11 shrink-0" title="" />
            <span>
              <span className="block text-lg font-semibold tracking-[-0.04em]">
                {siteConfig.name}
              </span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
                Launch + applets
              </span>
            </span>
          </Link>
          <span className="rounded-full border border-[var(--color-outline)] bg-white/70 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Vercel ready
          </span>
        </div>

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
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
        "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition",
        isActive
          ? "border-transparent bg-[var(--color-accent)] text-white shadow-[0_10px_24px_rgba(52,113,104,0.24)]"
          : "border-[var(--color-outline)] bg-white/75 text-[var(--color-muted)] hover:border-[var(--color-outline-strong)] hover:text-[var(--color-ink)]",
      )}
    >
      {label}
    </Link>
  );
}
