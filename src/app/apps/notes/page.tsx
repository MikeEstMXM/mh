import { AppletPageFrame } from "@/components/layout/applet-page-frame";
import { NotesApplet } from "@/features/applets/notes/notes-applet";
import { buildAppletMetadata } from "@/lib/metadata";

export const metadata = buildAppletMetadata("notes");

export default function NotesPage() {
  return (
    <AppletPageFrame slug="notes">
      <NotesApplet />
    </AppletPageFrame>
  );
}
