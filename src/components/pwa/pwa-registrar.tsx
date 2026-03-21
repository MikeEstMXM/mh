"use client";

import { useEffect } from "react";
import { withBasePath } from "@/config/deployment";

export function PwaRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register(withBasePath("/sw.js"), { updateViaCache: "none" })
      .then((reg) => {
        // Check for updates immediately on every page load
        void reg.update();
      });
  }, []);

  return null;
}
