import { NextResponse } from "next/server";
import { getNotionConfig, createNotionRecipe } from "@/lib/server/notion";

export async function POST(request: Request) {
  const config = getNotionConfig();
  if (!config) {
    return NextResponse.json(
      { ok: false, error: "Notion API is not configured. Set NOTION_API_KEY and NOTION_RECIPES_DATABASE_ID." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const { url } = body as { url?: string };
  if (!url || typeof url !== "string") {
    return NextResponse.json({ ok: false, error: "A 'url' field is required." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid URL." }, { status: 400 });
  }

  // Fetch the recipe page HTML
  let html: string;
  try {
    const res = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RecipeImporter/1.0)",
        Accept: "text/html",
      },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Failed to fetch URL (${res.status}).` }, { status: 502 });
    }
    html = await res.text();
  } catch (err) {
    return NextResponse.json({ ok: false, error: `Could not reach URL: ${(err as Error).message}` }, { status: 502 });
  }

  // Extract JSON-LD structured recipe data
  const recipe = parseRecipeFromHtml(html, url);

  if (!recipe.title) {
    return NextResponse.json(
      { ok: false, error: "Could not extract a recipe from that page. No structured recipe data (JSON-LD) found." },
      { status: 422 },
    );
  }

  try {
    const page = await createNotionRecipe(config, recipe);
    return NextResponse.json({ ok: true, notionPageId: page.id, recipe });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 502 });
  }
}

function parseRecipeFromHtml(html: string, sourceUrl: string) {
  const recipe = {
    title: "",
    category: "Dinner",
    cuisine: "",
    status: "To Try",
    prepTime: 0,
    cookTime: 0,
    servings: 0,
    difficulty: "Medium",
    dietaryTags: "",
    rating: 0,
    ratingLabel: "Unrated",
    photoUrl: "",
    description: "",
    ingredients: [] as string[],
    instructions: [] as string[],
    notes: "",
    nutrition: "",
    sourceUrl,
  };

  // Find all JSON-LD script blocks
  const jsonLdRegex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  let recipeData: Record<string, unknown> | null = null;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      const found = findRecipeInJsonLd(parsed);
      if (found) {
        recipeData = found;
        break;
      }
    } catch {
      // skip malformed JSON-LD
    }
  }

  if (!recipeData) {
    // Fallback: try to parse from meta tags and HTML structure
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      recipe.title = decodeHtmlEntities(titleMatch[1].split(/[|\-–—]/)[0].trim());
    }
    return recipe;
  }

  recipe.title = getString(recipeData, "name");
  recipe.description = getString(recipeData, "description");
  recipe.photoUrl = extractImage(recipeData);
  recipe.prepTime = parseDuration(getString(recipeData, "prepTime"));
  recipe.cookTime = parseDuration(getString(recipeData, "cookTime"));
  recipe.servings = parseServings(recipeData.recipeYield);
  recipe.cuisine = getString(recipeData, "recipeCuisine");
  recipe.category = getString(recipeData, "recipeCategory") || "Dinner";

  // Ingredients
  if (Array.isArray(recipeData.recipeIngredient)) {
    recipe.ingredients = recipeData.recipeIngredient.map((i: unknown) => String(i).trim()).filter(Boolean);
  }

  // Instructions
  recipe.instructions = extractInstructions(recipeData.recipeInstructions);

  // Nutrition
  if (recipeData.nutrition && typeof recipeData.nutrition === "object") {
    const n = recipeData.nutrition as Record<string, unknown>;
    const parts: string[] = [];
    if (n.calories) parts.push(`Calories: ${n.calories}`);
    if (n.proteinContent) parts.push(`Protein: ${n.proteinContent}`);
    if (n.carbohydrateContent) parts.push(`Carbs: ${n.carbohydrateContent}`);
    if (n.fatContent) parts.push(`Fat: ${n.fatContent}`);
    if (n.fiberContent) parts.push(`Fiber: ${n.fiberContent}`);
    recipe.nutrition = parts.join(" | ");
  }

  // Rating
  if (recipeData.aggregateRating && typeof recipeData.aggregateRating === "object") {
    const r = recipeData.aggregateRating as Record<string, unknown>;
    const val = parseFloat(String(r.ratingValue || "0"));
    recipe.rating = Math.round(val);
    recipe.ratingLabel = ratingToLabel(recipe.rating);
  }

  // Dietary tags from keywords
  const keywords = getString(recipeData, "keywords");
  const dietaryKeywords = ["vegetarian", "vegan", "gluten-free", "dairy-free", "keto", "paleo", "low-carb", "nut-free"];
  if (keywords) {
    const matched = dietaryKeywords.filter((d) => keywords.toLowerCase().includes(d));
    if (matched.length > 0) {
      recipe.dietaryTags = matched.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(", ");
    }
  }

  return recipe;
}

function findRecipeInJsonLd(data: unknown): Record<string, unknown> | null {
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
    return null;
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (obj["@type"] === "Recipe" || (Array.isArray(obj["@type"]) && (obj["@type"] as string[]).includes("Recipe"))) {
      return obj;
    }
    if (obj["@graph"] && Array.isArray(obj["@graph"])) {
      return findRecipeInJsonLd(obj["@graph"]);
    }
  }

  return null;
}

function getString(obj: Record<string, unknown>, key: string): string {
  const val = obj[key];
  if (typeof val === "string") return val.trim();
  if (Array.isArray(val) && val.length > 0) return String(val[0]).trim();
  return "";
}

function extractImage(data: Record<string, unknown>): string {
  const img = data.image;
  if (typeof img === "string") return img;
  if (Array.isArray(img) && img.length > 0) {
    const first = img[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "url" in first) return String((first as Record<string, unknown>).url);
  }
  if (img && typeof img === "object" && "url" in img) return String((img as Record<string, unknown>).url);
  return "";
}

function parseDuration(iso: string): number {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return (parseInt(match[1] || "0") * 60) + parseInt(match[2] || "0");
}

function parseServings(val: unknown): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = parseInt(val);
    return isNaN(n) ? 0 : n;
  }
  if (Array.isArray(val) && val.length > 0) {
    return parseServings(val[0]);
  }
  return 0;
}

function extractInstructions(data: unknown): string[] {
  if (!data) return [];
  if (typeof data === "string") return data.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(data)) {
    const steps: string[] = [];
    for (const item of data) {
      if (typeof item === "string") {
        steps.push(item.trim());
      } else if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        if (obj["@type"] === "HowToStep" && obj.text) {
          steps.push(String(obj.text).trim());
        } else if (obj["@type"] === "HowToSection" && Array.isArray(obj.itemListElement)) {
          steps.push(...extractInstructions(obj.itemListElement));
        }
      }
    }
    return steps.filter(Boolean);
  }
  return [];
}

function ratingToLabel(rating: number): string {
  if (rating >= 5) return "Amazing";
  if (rating >= 4) return "Great";
  if (rating >= 3) return "Good";
  if (rating >= 2) return "Okay";
  if (rating >= 1) return "Poor";
  return "Unrated";
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}
