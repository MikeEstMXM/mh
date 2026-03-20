import { AppletPageFrame } from "@/components/layout/applet-page-frame";
import { IdeasApplet } from "@/features/applets/ideas/ideas-applet";
import { buildAppletMetadata } from "@/lib/metadata";

export const metadata = buildAppletMetadata("ideas");

export default function IdeasPage() {
  return (
    <AppletPageFrame slug="ideas">
      <IdeasApplet />
    </AppletPageFrame>
  );
}
