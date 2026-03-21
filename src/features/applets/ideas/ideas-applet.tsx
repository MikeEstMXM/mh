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
      { id: crypto.randomUUID(), text: trimmedDraft },
      ...currentIdeas,
    ]);
    setDraft("");
  }

  function removeIdea(id: string) {
    setIdeas((currentIdeas) => currentIdeas.filter((idea) => idea.id !== id));
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <form onSubmit={handleSubmit}>
        <p className="text-xs text-[var(--color-muted)] mb-3">new idea</p>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Describe an idea in one or two sentences."
          rows={7}
          className="w-full border border-[var(--color-outline)] bg-[var(--color-panel)] px-3 py-3 text-sm leading-6 outline-none transition-colors resize-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          className="mt-3 text-xs text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)]"
        >
          save →
        </button>
      </form>

      <div className="border-t border-[var(--color-outline)] pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
        <p className="text-xs text-[var(--color-muted)]">
          {ideas.length} {ideas.length === 1 ? "idea" : "ideas"}
        </p>
        <div className="mt-4 border-t border-[var(--color-outline)]">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="group flex items-start gap-4 border-b border-[var(--color-outline)] py-3"
            >
              <p className="flex-1 text-sm leading-6 text-[var(--color-ink)]">{idea.text}</p>
              <button
                type="button"
                onClick={() => removeIdea(idea.id)}
                className="shrink-0 text-[10px] text-[var(--color-muted)] opacity-0 transition-all group-hover:opacity-100 hover:text-[var(--color-ink)]"
              >
                remove
              </button>
            </div>
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
