import { AppletPageFrame } from "@/components/layout/applet-page-frame";
import { RecipesApplet } from "@/features/applets/recipes/recipes-applet";
import { buildAppletMetadata } from "@/lib/metadata";

export const metadata = buildAppletMetadata("recipes");

export default function RecipesPage() {
  return (
    <AppletPageFrame slug="recipes">
      <RecipesApplet />
    </AppletPageFrame>
  );
}
