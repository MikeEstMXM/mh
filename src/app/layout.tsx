import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { deploymentConfig, withBasePath } from "@/config/deployment";
import { PwaRegistrar } from "@/components/pwa/pwa-registrar";
import { siteConfig } from "@/config/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(deploymentConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: withBasePath("/manifest.webmanifest"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  icons: {
    icon: [
      {
        url: withBasePath("/icon"),
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: withBasePath("/apple-icon"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-canvas)] text-[var(--color-ink)]">
        <PwaRegistrar />
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(52,113,104,0.18),_transparent_65%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-24 h-80 bg-[radial-gradient(circle_at_center,_rgba(211,141,84,0.14),_transparent_70%)]" />
          <SiteHeader />
          <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
