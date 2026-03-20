import { cx } from "@/lib/utils";
import type { AppletIconName } from "@/types/applet";

type AppletIconProps = {
  name: AppletIconName;
  className?: string;
};

export function AppletIcon({ name, className }: AppletIconProps) {
  const sharedProps = {
    className: cx("h-5 w-5", className),
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "notes":
      return (
        <svg {...sharedProps}>
          <path d="M7 4.75h10a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.75a2 2 0 0 1 2-2Z" />
          <path d="M8.5 9.5h7" />
          <path d="M8.5 13h7" />
          <path d="M8.5 16.5h4" />
        </svg>
      );
    case "timer":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="13" r="7" />
          <path d="M9.25 3.75h5.5" />
          <path d="M12 13V9.5" />
          <path d="m12 13 2.25 2.25" />
        </svg>
      );
    case "ideas":
      return (
        <svg {...sharedProps}>
          <path d="M9.5 18.25h5" />
          <path d="M10 21h4" />
          <path d="M8 13.25c-1.36-1.03-2.25-2.66-2.25-4.5a6.25 6.25 0 1 1 12.5 0c0 1.84-.89 3.47-2.25 4.5-.62.46-1 .99-1 1.58V16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.17c0-.59-.38-1.12-1-1.58Z" />
        </svg>
      );
    case "hub":
      return (
        <svg {...sharedProps}>
          <path d="M5.5 5.5h5v5h-5z" />
          <path d="M13.5 5.5h5v5h-5z" />
          <path d="M5.5 13.5h5v5h-5z" />
          <path d="M13.5 13.5h5v5h-5z" />
        </svg>
      );
  }
}
