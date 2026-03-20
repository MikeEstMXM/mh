import { ImageResponse } from "next/og";
import { AppLogo } from "@/components/brand/app-logo";

export const contentType = "image/png";
export const dynamic = "force-static";
export const size = {
  width: 512,
  height: 512,
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#ffffff",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <AppLogo className="h-full w-full" title="" />
      </div>
    ),
    size,
  );
}
