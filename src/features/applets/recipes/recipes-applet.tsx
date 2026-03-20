"use client";

import { useState } from "react";

type RecipeResult = {
  ok: boolean;
  error?: string;
  notionPageId?: string;
  recipe?: {
    title: string;
    category: string;
    cuisine: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    ingredients: string[];
    instructions: string[];
    description: string;
    photoUrl: string;
    nutrition: string;
  };
};

export function RecipesApplet() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecipeResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ ok: false, error: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.76))] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
                Import recipe
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                Paste a recipe URL to import it to Notion.
              </h2>
            </div>
            <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Notion API
            </span>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.allrecipes.com/recipe/..."
              required
              className="flex-1 rounded-2xl border border-[var(--color-outline)] bg-white px-4 py-3 text-base outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[rgba(52,113,104,0.12)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[var(--color-accent)] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Importing..." : "Import"}
            </button>
          </form>
        </div>

        {result && !result.ok && (
          <div className="rounded-[1.75rem] border border-red-200 bg-red-50 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-red-400">Error</p>
            <p className="mt-2 text-sm leading-6 text-red-700">{result.error}</p>
          </div>
        )}

        {result?.ok && result.recipe && (
          <div className="rounded-[1.75rem] border border-green-200 bg-green-50 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-green-600">
              Added to Notion
            </p>
            <h3 className="mt-2 text-lg font-semibold">{result.recipe.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {result.recipe.category && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">{result.recipe.category}</span>
              )}
              {result.recipe.cuisine && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">{result.recipe.cuisine}</span>
              )}
              {result.recipe.prepTime > 0 && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">Prep: {result.recipe.prepTime}m</span>
              )}
              {result.recipe.cookTime > 0 && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">Cook: {result.recipe.cookTime}m</span>
              )}
              {result.recipe.servings > 0 && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">Serves {result.recipe.servings}</span>
              )}
            </div>
            {result.recipe.description && (
              <p className="mt-3 text-sm leading-6 text-green-800">{result.recipe.description}</p>
            )}
            {result.recipe.ingredients.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-green-600">
                  {result.recipe.ingredients.length} ingredients
                </p>
                <ul className="mt-2 space-y-1 text-sm text-green-800">
                  {result.recipe.ingredients.slice(0, 8).map((ing, i) => (
                    <li key={i}>- {ing}</li>
                  ))}
                  {result.recipe.ingredients.length > 8 && (
                    <li className="text-green-600">+ {result.recipe.ingredients.length - 8} more</li>
                  )}
                </ul>
              </div>
            )}
            {result.recipe.instructions.length > 0 && (
              <p className="mt-3 text-xs text-green-600">
                {result.recipe.instructions.length} steps imported
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[var(--color-panel)] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
            How it works
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
            <li><strong>1.</strong> Paste a recipe URL from any popular cooking site.</li>
            <li><strong>2.</strong> The server fetches the page and extracts structured recipe data (JSON-LD).</li>
            <li><strong>3.</strong> Title, ingredients, instructions, times, and nutrition are mapped to your Notion database format.</li>
            <li><strong>4.</strong> A new page is created in your Notion recipes database automatically.</li>
          </ul>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[var(--color-panel)] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
            Supported sites
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Works with any site that uses schema.org Recipe structured data, including AllRecipes, Serious Eats, Food Network, NYT Cooking, Epicurious, Budget Bytes, and most food blogs.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--color-outline)] bg-[var(--color-panel)] p-5 shadow-[0_18px_36px_rgba(22,33,38,0.05)]">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
            Setup
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
            <li>Set <code className="rounded bg-white/60 px-1.5 py-0.5 text-xs">NOTION_API_KEY</code> to your Notion integration token.</li>
            <li>Set <code className="rounded bg-white/60 px-1.5 py-0.5 text-xs">NOTION_RECIPES_DATABASE_ID</code> to the ID of your recipes database.</li>
            <li>Share the database with your Notion integration.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
