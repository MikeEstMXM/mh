"use client";

import { useEffect, useState } from "react";

const presets = [5, 15, 25];

export function TimerApplet() {
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((currentValue) => {
        if (currentValue <= 1) {
          window.clearInterval(intervalId);
          setIsRunning(false);
          return 0;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  function selectPreset(minutes: number) {
    setSelectedMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setIsRunning(false);
  }

  function resetTimer() {
    setSecondsRemaining(selectedMinutes * 60);
    setIsRunning(false);
  }

  const minutes = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsRemaining % 60).toString().padStart(2, "0");

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.76))] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
          Focus timer
        </p>
        <div className="mt-4 rounded-[1.75rem] bg-[var(--color-accent-soft)] px-5 py-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Session
          </p>
          <p className="mt-4 text-6xl font-semibold tracking-[-0.08em] text-[var(--color-ink)] sm:text-7xl">
            {minutes}:{seconds}
          </p>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Future extension point: sounds, notifications, or completed-session history.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsRunning((currentValue) => !currentValue)}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(52,113,104,0.22)] transition hover:brightness-105"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-outline)] bg-white px-5 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-outline-strong)]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[var(--color-panel)] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
            Presets
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {presets.map((preset) => {
              const isSelected = selectedMinutes === preset;

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={`min-h-14 rounded-2xl border px-3 text-sm font-semibold transition ${
                    isSelected
                      ? "border-transparent bg-[var(--color-warm)] text-white shadow-[0_14px_24px_rgba(211,141,84,0.24)]"
                      : "border-[var(--color-outline)] bg-white text-[var(--color-ink)] hover:border-[var(--color-outline-strong)]"
                  }`}
                >
                  {preset} min
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[var(--color-panel)] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
            Extend later
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
            <li>Add push notifications through the service worker once the PWA is fully hardened.</li>
            <li>Store preset preferences per device if you want the timer to reopen with your default session.</li>
            <li>Move timer history into a server route only when you actually need cross-device tracking.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
