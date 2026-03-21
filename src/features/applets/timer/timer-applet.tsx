"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/utils";

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
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]">
      <div>
        <p className="text-xs text-[var(--color-muted)]">focus timer</p>
        <p className="mt-8 text-7xl font-light tabular-nums tracking-tight text-[var(--color-ink)]">
          {minutes}:{seconds}
        </p>
        <div className="mt-8 flex items-center gap-5">
          <button
            type="button"
            onClick={() => setIsRunning((v) => !v)}
            className="text-sm text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)]"
          >
            {isRunning ? "pause" : "start"}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            reset
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--color-outline)] pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
        <p className="text-xs text-[var(--color-muted)]">presets</p>
        <div className="mt-4 border-t border-[var(--color-outline)]">
          {presets.map((preset) => {
            const isSelected = selectedMinutes === preset;

            return (
              <button
                key={preset}
                type="button"
                onClick={() => selectPreset(preset)}
                className={cx(
                  "flex w-full items-center justify-between border-b border-[var(--color-outline)] py-3 text-sm transition-colors",
                  isSelected
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                )}
              >
                <span>{preset} min</span>
                {isSelected && (
                  <span className="text-[10px] text-[var(--color-accent)]">selected</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
