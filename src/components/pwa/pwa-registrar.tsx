"use client";

import { useEffect } from "react";
import { withBasePath } from "@/config/deployment";

export function PwaRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    void navigator.serviceWorker.register(withBasePath("/sw.js"));
  }, []);

  return null;
}
