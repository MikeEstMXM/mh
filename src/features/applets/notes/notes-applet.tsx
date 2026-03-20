"use client";

import { useEffect, useRef, useState } from "react";

const storageKey = "notes-applet-content";

export function NotesApplet() {
  const hasLoadedStoredNote = useRef(false);
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

  function handleChange(nextNote: string) {
    setNote(nextNote);
    setLastSavedLabel(
      nextNote.trim()
        ? `Saved locally at ${new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : "Waiting for your first note",
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.76))] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Quick note
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              Keep one useful note close at hand.
            </h2>
          </div>
          <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Local state
          </span>
        </div>
        <textarea
          value={note}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Write anything you want to keep visible: a checklist, an address, a rough plan, or a reminder."
          rows={14}
          className="mt-5 w-full rounded-[1.5rem] border border-[var(--color-outline)] bg-white px-4 py-4 text-base leading-7 outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[rgba(52,113,104,0.12)]"
        />
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[var(--color-panel)] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
            Snapshot
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{lastSavedLabel}</p>
          <p className="mt-4 text-3xl font-semibold">{note.trim().length}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">characters stored in this browser</p>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[var(--color-panel)] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
            Extend later
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
            <li>Replace local storage with a server-backed note API when you need syncing.</li>
            <li>Add tags or pin multiple notes without changing the overall page structure.</li>
            <li>Wire a save indicator to real API responses if persistence moves server-side.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
