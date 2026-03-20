"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type IdeaCard = {
  id: string;
  text: string;
};

const storageKey = "ideas-applet-items";
const starterIdeas = [
  "Build a meal planner with a drag-and-drop weekly view.",
  "Turn saved notes into a searchable reference shelf.",
];

export function IdeasApplet() {
  const hasLoadedStoredIdeas = useRef(false);
  const [draft, setDraft] = useState("");
  const [ideas, setIdeas] = useState<IdeaCard[]>(starterIdeasToCards);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const storedValue = window.localStorage.getItem(storageKey);

      if (storedValue) {
        try {
          const parsed: unknown = JSON.parse(storedValue);

          if (
            Array.isArray(parsed) &&
            parsed.every(
              (item) =>
                item !== null &&
                typeof item === "object" &&
                typeof (item as IdeaCard).id === "string" &&
                typeof (item as IdeaCard).text === "string",
            )
          ) {
            setIdeas(parsed as IdeaCard[]);
          }
        } catch {
          setIdeas([]);
        }
      }

      hasLoadedStoredIdeas.current = true;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredIdeas.current) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(ideas));
  }, [ideas]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedDraft = draft.trim();

    if (!trimmedDraft) {
      return;
    }

    setIdeas((currentIdeas) => [
      {
        id: crypto.randomUUID(),
        text: trimmedDraft,
      },
      ...currentIdeas,
    ]);
    setDraft("");
  }

  function removeIdea(id: string) {
    setIdeas((currentIdeas) => currentIdeas.filter((idea) => idea.id !== id));
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[var(--color-panel)] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]"
      >
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
          Add idea
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
          Capture a future applet or project concept.
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          This is a local-state foundation. Later you can plug in persistence, categories, or collaboration.
        </p>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Describe an idea in one or two sentences."
          rows={6}
          className="mt-5 w-full rounded-[1.4rem] border border-[var(--color-outline)] bg-white px-4 py-3 text-base outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[rgba(52,113,104,0.12)]"
        />
        <button
          type="submit"
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(52,113,104,0.22)] transition hover:brightness-105"
        >
          Save idea
        </button>
      </form>

      <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.76))] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Idea list
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{ideas.length} saved</h2>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {ideas.map((idea) => (
            <article
              key={idea.id}
              className="rounded-[1.4rem] border border-[var(--color-outline)] bg-white px-4 py-4"
            >
              <p className="text-sm leading-6 text-[var(--color-ink)]">{idea.text}</p>
              <button
                type="button"
                onClick={() => removeIdea(idea.id)}
                className="mt-4 inline-flex min-h-10 items-center rounded-full border border-[var(--color-outline)] px-3 text-sm font-medium text-[var(--color-muted)] transition hover:border-[var(--color-outline-strong)] hover:text-[var(--color-ink)]"
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function starterIdeasToCards() {
  return starterIdeas.map((idea, index) => ({
    id: `starter-${index}`,
    text: idea,
  }));
}
