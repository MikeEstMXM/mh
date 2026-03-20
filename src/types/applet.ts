export type AppletStatus = "ready" | "beta" | "coming-soon";
export type AppletVisibility = "public" | "hidden";
export type AppletIconName = "hub" | "ideas" | "notes" | "timer";
export type AppletSlug = "ideas" | "notes" | "timer";

export type AppletRegistryEntry = {
  name: string;
  slug: AppletSlug;
  description: string;
  status: AppletStatus;
  iconName: AppletIconName;
  category: string;
  visibility: AppletVisibility;
};

export type AppletDefinition = AppletRegistryEntry & {
  href: `/apps/${AppletSlug}`;
};
