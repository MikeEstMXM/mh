import type { MetadataRoute } from "next";
import { withBasePath } from "@/config/deployment";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "App Hub",
    description: siteConfig.description,
    start_url: withBasePath("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f1ea",
    theme_color: "#f4f1ea",
    icons: [
      {
        src: withBasePath("/icon"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: withBasePath("/icon"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
