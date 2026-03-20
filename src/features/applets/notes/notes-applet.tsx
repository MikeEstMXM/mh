"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const storageKey = "notes-applet-content";

export function NotesApplet() {
  const hasLoadedStoredNote = useRef(false);
  const saveTimestampTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [note, setNote] = useState("");
  const [lastSavedLabel, setLastSavedLabel] = useState("waiting for your first note");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const storedNote = window.localStorage.getItem(storageKey);

      if (storedNote) {
        setNote(storedNote);
        setLastSavedLabel("loaded from this browser");
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
          ? `saved at ${new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "waiting for your first note",
      );
      saveTimestampTimer.current = null;
    }, 600);
  }, []);

  function handleChange(nextNote: string) {
    setNote(nextNote);
    scheduleTimestampUpdate(nextNote);
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[var(--color-muted)]">quick note</p>
          <span className="text-[10px] text-[var(--color-accent)]">local</span>
        </div>
        <textarea
          value={note}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Write anything you want to keep visible."
          rows={16}
          className="w-full border border-[var(--color-outline)] bg-[var(--color-panel)] px-3 py-3 text-sm leading-6 outline-none transition-colors resize-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
        />
      </div>

      <div className="border-t border-[var(--color-outline)] pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
        <p className="text-xs text-[var(--color-muted)]">snapshot</p>
        <p className="mt-6 text-3xl font-light tabular-nums">{note.trim().length}</p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">characters</p>
        <p className="mt-6 text-[10px] text-[var(--color-muted)]">{lastSavedLabel}</p>
      </div>
    </section>
  );
}
