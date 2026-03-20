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
        className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-panel)] p-5"
      >
        <p className="text-xs text-[var(--color-muted)]">New idea</p>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Describe an idea in one or two sentences."
          rows={6}
          className="mt-3 w-full rounded-xl border border-[var(--color-outline)] bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(52,113,104,0.1)]"
        />
        <button
          type="submit"
          className="mt-3 inline-flex min-h-9 items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-xs font-medium text-white transition hover:brightness-105"
        >
          Save
        </button>
      </form>

      <div className="rounded-2xl border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.76))] p-5">
        <p className="text-xs text-[var(--color-muted)]">{ideas.length} saved</p>
        <div className="mt-4 space-y-2">
          {ideas.map((idea) => (
            <article
              key={idea.id}
              className="rounded-xl border border-[var(--color-outline)] bg-white px-4 py-3"
            >
              <p className="text-sm leading-6 text-[var(--color-ink)]">{idea.text}</p>
              <button
                type="button"
                onClick={() => removeIdea(idea.id)}
                className="mt-2 text-xs text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
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
