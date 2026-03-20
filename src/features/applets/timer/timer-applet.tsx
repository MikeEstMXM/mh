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
      <div className="rounded-2xl border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.76))] p-5">
        <p className="text-xs text-[var(--color-muted)]">Focus timer</p>
        <div className="mt-4 rounded-2xl bg-[var(--color-accent-soft)] px-5 py-8 text-center">
          <p className="text-5xl font-medium tracking-tight text-[var(--color-ink)]">
            {minutes}:{seconds}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsRunning((currentValue) => !currentValue)}
            className="inline-flex min-h-9 items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-xs font-medium text-white transition hover:brightness-105"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--color-outline)] bg-white px-4 text-xs font-medium text-[var(--color-ink)] transition hover:border-[var(--color-outline-strong)]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-panel)] p-5">
        <p className="text-xs text-[var(--color-muted)]">Presets</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {presets.map((preset) => {
            const isSelected = selectedMinutes === preset;

            return (
              <button
                key={preset}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`min-h-12 rounded-xl border text-sm font-medium transition ${
                  isSelected
                    ? "border-transparent bg-[var(--color-warm)] text-white"
                    : "border-[var(--color-outline)] bg-white text-[var(--color-ink)] hover:border-[var(--color-outline-strong)]"
                }`}
              >
                {preset}m
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
