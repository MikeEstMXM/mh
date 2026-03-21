import type { AppletDefinition, AppletRegistryEntry, AppletSlug } from "@/types/applet";

const appletRegistry = [
  {
    name: "Notes",
    slug: "notes",
    description:
      "Capture quick thoughts in a single focused note. Easy to extend into tags, sync, or richer storage later.",
    status: "ready",
    iconName: "notes",
    category: "Capture",
    visibility: "public",
  },
  {
    name: "Timer",
    slug: "timer",
    description:
      "Run a simple focus timer with large touch controls. Good starting point for presets, sounds, or history.",
    status: "beta",
    iconName: "timer",
    category: "Focus",
    visibility: "public",
  },
  {
    name: "Ideas",
    slug: "ideas",
    description:
      "Collect rough ideas in lightweight cards. Extend this into themes, voting, or archived lists when needed.",
    status: "ready",
    iconName: "ideas",
    category: "Planning",
    visibility: "public",
  },
  {
    name: "Recipes",
    slug: "recipes",
    description:
      "Import recipes from any URL into your Notion cookbook. Extracts ingredients, instructions, and metadata automatically.",
    status: "beta",
    iconName: "recipes",
    category: "Kitchen",
    visibility: "public",
  },
] satisfies AppletRegistryEntry[];

export const applets: AppletDefinition[] = appletRegistry.map((applet) => ({
  ...applet,
  href: `/apps/${applet.slug}`,
}));

export const visibleApplets = applets.filter((applet) => applet.visibility === "public");

export function getAppletBySlug(slug: AppletSlug) {
  return applets.find((applet) => applet.slug === slug);
}
