"use client";

import { useEffect, useState } from "react";
import {
  getApiPassword,
  setApiPassword,
  clearApiPassword,
} from "@/lib/client/api-password";

export function SettingsForm() {
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasStored, setHasStored] = useState(false);

  useEffect(() => {
    const stored = getApiPassword();
    if (stored) {
      setPassword(stored);
      setHasStored(true);
    }
  }, []);

  function handleSave() {
    setApiPassword(password.trim());
    setSaved(true);
    setHasStored(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClear() {
    clearApiPassword();
    setPassword("");
    setHasStored(false);
  }

  return (
    <section className="max-w-md">
      <p className="text-xs text-[var(--color-muted)] mb-3">api password</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your API password"
        className="w-full border border-[var(--color-outline)] bg-[var(--color-panel)] px-3 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
      />
      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="text-xs text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)]"
        >
          {saved ? "saved" : "save"}
        </button>
        {hasStored && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            clear
          </button>
        )}
      </div>
      <p className="mt-6 text-[10px] leading-4 text-[var(--color-muted)]">
        Stored in this browser only. Used to authenticate API requests.
      </p>
    </section>
  );
}
