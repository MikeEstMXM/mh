import { AppletPageFrame } from "@/components/layout/applet-page-frame";
import { TimerApplet } from "@/features/applets/timer/timer-applet";
import { buildAppletMetadata } from "@/lib/metadata";

export const metadata = buildAppletMetadata("timer");

export default function TimerPage() {
  return (
    <AppletPageFrame slug="timer">
      <TimerApplet />
    </AppletPageFrame>
  );
}
