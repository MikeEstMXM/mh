"use client";

import { useState } from "react";
import { withBasePath } from "@/config/deployment";

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
      const res = await fetch(withBasePath("/api/recipes"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok && res.headers.get("content-type")?.includes("text/html")) {
        setResult({
          ok: false,
          error:
            "Recipe import requires a server deployment. This feature is not available on static sites (GitHub Pages).",
        });
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        ok: false,
        error:
          "Could not reach the recipe API. If this is a static deployment (GitHub Pages), recipe import requires a server.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[var(--color-muted)]">import recipe</p>
          <span className="text-[10px] text-[var(--color-accent)]">
            notion api
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.allrecipes.com/recipe/..."
            required
            className="w-full border border-[var(--color-outline)] bg-[var(--color-panel)] px-3 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-3 text-xs text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)] disabled:opacity-50"
          >
            {loading ? "importing..." : "import →"}
          </button>
        </form>

        {result && !result.ok && (
          <div className="mt-6 border-t border-[var(--color-outline)] pt-4">
            <p className="text-xs text-[var(--color-beta-ink)]">error</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {result.error}
            </p>
          </div>
        )}

        {result?.ok && result.recipe && (
          <div className="mt-6 border-t border-[var(--color-outline)] pt-4">
            <p className="text-xs text-[var(--color-ready-ink)]">
              added to notion
            </p>
            <p className="mt-3 text-lg font-light">{result.recipe.title}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-[var(--color-muted)]">
              {result.recipe.category && (
                <span>{result.recipe.category}</span>
              )}
              {result.recipe.cuisine && <span>{result.recipe.cuisine}</span>}
              {result.recipe.prepTime > 0 && (
                <span>prep {result.recipe.prepTime}m</span>
              )}
              {result.recipe.cookTime > 0 && (
                <span>cook {result.recipe.cookTime}m</span>
              )}
              {result.recipe.servings > 0 && (
                <span>serves {result.recipe.servings}</span>
              )}
            </div>
            {result.recipe.description && (
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                {result.recipe.description}
              </p>
            )}
            {result.recipe.ingredients.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-[var(--color-muted)]">
                  {result.recipe.ingredients.length} ingredients
                </p>
                <div className="mt-2 border-t border-[var(--color-outline)]">
                  {result.recipe.ingredients.slice(0, 8).map((ing, i) => (
                    <p
                      key={i}
                      className="border-b border-[var(--color-outline)] py-2 text-sm leading-6"
                    >
                      {ing}
                    </p>
                  ))}
                  {result.recipe.ingredients.length > 8 && (
                    <p className="py-2 text-[10px] text-[var(--color-muted)]">
                      + {result.recipe.ingredients.length - 8} more
                    </p>
                  )}
                </div>
              </div>
            )}
            {result.recipe.instructions.length > 0 && (
              <p className="mt-3 text-[10px] text-[var(--color-muted)]">
                {result.recipe.instructions.length} steps imported
              </p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-[var(--color-outline)] pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
        <p className="text-xs text-[var(--color-muted)]">how it works</p>
        <div className="mt-4 border-t border-[var(--color-outline)]">
          <p className="border-b border-[var(--color-outline)] py-3 text-sm leading-6 text-[var(--color-muted)]">
            Paste a recipe URL from any popular cooking site.
          </p>
          <p className="border-b border-[var(--color-outline)] py-3 text-sm leading-6 text-[var(--color-muted)]">
            The server fetches the page and extracts structured recipe data.
          </p>
          <p className="border-b border-[var(--color-outline)] py-3 text-sm leading-6 text-[var(--color-muted)]">
            Title, ingredients, instructions, and times are mapped to your
            Notion database.
          </p>
          <p className="border-b border-[var(--color-outline)] py-3 text-sm leading-6 text-[var(--color-muted)]">
            A new page is created in your Notion recipes database automatically.
          </p>
        </div>

        <p className="mt-8 text-xs text-[var(--color-muted)]">
          supported sites
        </p>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Works with any site using schema.org Recipe structured data —
          AllRecipes, Serious Eats, Food Network, NYT Cooking, Epicurious,
          Budget Bytes, and most food blogs.
        </p>

        <p className="mt-8 text-xs text-[var(--color-muted)]">setup</p>
        <div className="mt-4 border-t border-[var(--color-outline)]">
          <p className="border-b border-[var(--color-outline)] py-3 text-sm leading-6 text-[var(--color-muted)]">
            Set{" "}
            <code className="text-xs text-[var(--color-ink)]">
              NOTION_API_KEY
            </code>{" "}
            to your Notion integration token.
          </p>
          <p className="border-b border-[var(--color-outline)] py-3 text-sm leading-6 text-[var(--color-muted)]">
            Set{" "}
            <code className="text-xs text-[var(--color-ink)]">
              NOTION_RECIPES_DATABASE_ID
            </code>{" "}
            to the ID of your recipes database.
          </p>
          <p className="border-b border-[var(--color-outline)] py-3 text-sm leading-6 text-[var(--color-muted)]">
            Share the database with your Notion integration.
          </p>
        </div>
      </div>
    </section>
  );
}
