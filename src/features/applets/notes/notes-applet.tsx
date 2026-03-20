"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const storageKey = "notes-applet-content";

export function NotesApplet() {
  const hasLoadedStoredNote = useRef(false);
  const saveTimestampTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [note, setNote] = useState("");
  const [lastSavedLabel, setLastSavedLabel] = useState("Waiting for your first note");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const storedNote = window.localStorage.getItem(storageKey);

      if (storedNote) {
        setNote(storedNote);
        setLastSavedLabel("Loaded from this browser");
      }

      hasLoadedStoredNote.current = true;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredNote.current) {
      return;
    }

    window.localStorage.setItem(storageKey, note);
  }, [note]);

  const scheduleTimestampUpdate = useCallback((nextNote: string) => {
    if (saveTimestampTimer.current !== null) {
      clearTimeout(saveTimestampTimer.current);
    }
    saveTimestampTimer.current = setTimeout(() => {
      setLastSavedLabel(
        nextNote.trim()
          ? `Saved locally at ${new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "Waiting for your first note",
      );
      saveTimestampTimer.current = null;
    }, 600);
  }, []);

  function handleChange(nextNote: string) {
    setNote(nextNote);
    scheduleTimestampUpdate(nextNote);
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="rounded-2xl border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.76))] p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-muted)]">Quick note</p>
          <span className="rounded-md bg-[var(--color-accent-soft)] px-2 py-1 text-[10px] text-[var(--color-accent)]">
            local
          </span>
        </div>
        <textarea
          value={note}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Write anything you want to keep visible: a checklist, an address, a rough plan, or a reminder."
          rows={14}
          className="mt-4 w-full rounded-xl border border-[var(--color-outline)] bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(52,113,104,0.1)]"
        />
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-panel)] p-5">
          <p className="text-xs text-[var(--color-muted)]">Snapshot</p>
          <p className="mt-3 text-xs text-[var(--color-muted)]">{lastSavedLabel}</p>
          <p className="mt-4 text-2xl font-medium">{note.trim().length}</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">characters</p>
        </div>
      </div>
    </section>
  );
}
