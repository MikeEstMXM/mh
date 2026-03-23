import type { Metadata } from "next";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-base font-medium">Settings</h1>
      <SettingsForm />
    </div>
  );
}
