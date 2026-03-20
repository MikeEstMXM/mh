import type { Metadata } from "next";
import { getAppletBySlug } from "@/config/applets";
import { siteConfig } from "@/config/site";
import type { AppletSlug } from "@/types/applet";

export function buildAppletMetadata(slug: AppletSlug): Metadata {
  const applet = getAppletBySlug(slug);

  if (!applet) {
    return {
      title: siteConfig.name,
      description: siteConfig.description,
    };
  }

  return {
    title: applet.name,
    description: applet.description,
  };
}
