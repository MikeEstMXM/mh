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

  // Try site-specific API first, then fall back to HTML scraping
  let recipe = await tryHelloFreshApi(parsedUrl);

  if (!recipe) {
    let html: string;
    try {
      const res = await fetch(parsedUrl.toString(), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (!res.ok) {
        return NextResponse.json({ ok: false, error: `Failed to fetch URL (${res.status}).` }, { status: 502 });
      }
      html = await res.text();
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: `Could not reach URL: ${(err as Error).message}` },
        { status: 502 },
      );
    }

    recipe = parseRecipeFromHtml(html, url);
  }

  if (!recipe || !recipe.title) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not extract a recipe from that page. The site may require JavaScript rendering or block automated requests.",
      },
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

// ---------------------------------------------------------------------------
// HelloFresh has a public content API that returns structured JSON —
// far more reliable than scraping their JS-rendered pages.
// Supported domains: hellofresh.co.uk, hellofresh.com, hellofresh.de, etc.
// ---------------------------------------------------------------------------
async function tryHelloFreshApi(parsedUrl: URL) {
  if (!parsedUrl.hostname.match(/^www\.hellofresh\./)) return null;

  // URL pattern: /recipes/{slug}-{id}  — the id is the last 24-char hex segment
  const idMatch = parsedUrl.pathname.match(/-([0-9a-f]{24})(?:\/|$)/);
  if (!idMatch) return null;

  const recipeId = idMatch[1];
  const country = parsedUrl.hostname.replace("www.hellofresh.", "").replace(/\..+/, "");
  // Map TLD to locale: co.uk → GB, com → US, de → DE, etc.
  const localeMap: Record<string, string> = {
    co: "GB", // .co.uk
    com: "US",
    de: "DE",
    at: "AT",
    nl: "NL",
    be: "BE",
    fr: "FR",
    ch: "CH",
    ie: "IE",
    ca: "CA",
    "com.au": "AU",
    se: "SE",
    dk: "DK",
    lu: "LU",
    nz: "NZ",
  };
  const locale = localeMap[country] ?? "GB";

  const apiUrl = `https://www.hellofresh.${country === "co" ? "co.uk" : country}/gw/recipes/recipes/${recipeId}?country=${locale}&locale=en-${locale}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    return mapHelloFreshToRecipe(data, parsedUrl.toString());
  } catch {
    return null;
  }
}

function mapHelloFreshToRecipe(data: Record<string, unknown>, sourceUrl: string) {
  const yields = Array.isArray(data.yields) ? (data.yields as Record<string, unknown>[]) : [];
  const firstYield = yields[0] as Record<string, unknown> | undefined;
  const servings = firstYield ? Number(firstYield.yields ?? 0) : 0;

  const ingredients = Array.isArray(data.ingredients)
    ? (data.ingredients as Record<string, unknown>[]).map((ing) => {
        const name = String(ing.name ?? "");
        // Try to find the amount for the first yield
        const yieldIngredients = firstYield && Array.isArray(firstYield.ingredients)
          ? (firstYield.ingredients as Record<string, unknown>[])
          : [];
        const matched = yieldIngredients.find((yi) => String(yi.id) === String(ing.id));
        if (matched) {
          const amount = matched.amount ? String(matched.amount) : "";
          const unit = matched.unit ? String(matched.unit) : "";
          if (amount) return `${amount}${unit ? " " + unit : ""} ${name}`.trim();
        }
        return name;
      }).filter(Boolean)
    : [];

  const steps = Array.isArray(data.steps)
    ? (data.steps as Record<string, unknown>[])
        .sort((a, b) => Number(a.index ?? 0) - Number(b.index ?? 0))
        .map((s) => String(s.instructions ?? "").trim())
        .filter(Boolean)
    : [];

  const tags = Array.isArray(data.tags)
    ? (data.tags as Record<string, unknown>[]).map((t) => String(t.name ?? "")).filter(Boolean)
    : [];

  const cuisines = Array.isArray(data.cuisines)
    ? (data.cuisines as Record<string, unknown>[]).map((c) => String(c.name ?? "")).filter(Boolean)
    : [];

  const allergens = Array.isArray(data.allergens)
    ? (data.allergens as Record<string, unknown>[]).map((a) => String(a.name ?? "")).filter(Boolean)
    : [];

  // Nutrition
  const nutritionEntries = Array.isArray(data.nutrition)
    ? (data.nutrition as Record<string, unknown>[])
    : [];
  const nutritionParts = nutritionEntries.map((n) => {
    const name = String(n.name ?? "");
    const amount = String(n.amount ?? "");
    const unit = String(n.unit ?? "");
    return `${name}: ${amount}${unit}`;
  });

  const imageLink = String(
    (data.imagePath as string) ?? "",
  );
  const photoUrl = imageLink
    ? `https://img.hellofresh.com/hellofresh_s3${imageLink}`
    : "";

  const difficulty = Number(data.difficulty ?? 1);
  const difficultyLabel = difficulty <= 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard";

  const prepTime = Number(data.prepTime ?? 0);
  const totalTime = Number(data.totalTime ?? 0);
  const cookTime = totalTime > prepTime ? totalTime - prepTime : 0;

  const dietaryKeywords = ["vegetarian", "vegan", "gluten-free", "dairy-free", "keto", "paleo", "low-carb", "nut-free"];
  const matchedDietary = tags
    .filter((t) => dietaryKeywords.some((d) => t.toLowerCase().includes(d)))
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1));

  return {
    title: String(data.name ?? ""),
    category: String((data.category && typeof data.category === "object" ? (data.category as Record<string, unknown>).name : null) ?? tags[0] ?? "Dinner"),
    cuisine: cuisines[0] ?? "",
    status: "To Try",
    prepTime: Math.round(prepTime / 60) || prepTime, // API may return seconds
    cookTime: Math.round(cookTime / 60) || cookTime,
    servings,
    difficulty: difficultyLabel,
    dietaryTags: matchedDietary.join(", "),
    rating: 0,
    ratingLabel: "Unrated",
    photoUrl,
    description: String(data.description ?? data.descriptionMarkdown ?? ""),
    ingredients,
    instructions: steps,
    notes: allergens.length > 0 ? `Allergens: ${allergens.join(", ")}` : "",
    nutrition: nutritionParts.join(" | "),
    sourceUrl,
  };
}

// ---------------------------------------------------------------------------
// Generic HTML parsing — works for sites that embed JSON-LD or microdata
// ---------------------------------------------------------------------------
type ParsedRecipe = {
  title: string;
  category: string;
  cuisine: string;
  status: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  dietaryTags: string;
  rating: number;
  ratingLabel: string;
  photoUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  notes: string;
  nutrition: string;
  sourceUrl: string;
};

function parseRecipeFromHtml(html: string, sourceUrl: string): ParsedRecipe {
  const recipe: ParsedRecipe = {
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
    ingredients: [],
    instructions: [],
    notes: "",
    nutrition: "",
    sourceUrl,
  };

  // Strategy 1: JSON-LD (most reliable)
  const recipeData = extractJsonLdRecipe(html);
  if (recipeData) {
    return mapJsonLdToRecipe(recipeData, recipe);
  }

  // Strategy 2: Look for recipe data inside __NEXT_DATA__ (Next.js sites)
  const nextDataRecipe = extractFromNextData(html);
  if (nextDataRecipe) {
    return mapJsonLdToRecipe(nextDataRecipe, recipe);
  }

  // Strategy 3: Fallback to meta tags for title only
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    recipe.title = decodeHtmlEntities(titleMatch[1].split(/[|\-–—]/)[0].trim());
  }

  const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (ogDesc) {
    recipe.description = decodeHtmlEntities(ogDesc[1]);
  }

  const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (ogImage) {
    recipe.photoUrl = ogImage[1];
  }

  return recipe;
}

function extractJsonLdRecipe(html: string): Record<string, unknown> | null {
  const jsonLdRegex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      const found = findRecipeInJsonLd(parsed);
      if (found) return found;
    } catch {
      // skip malformed JSON-LD
    }
  }
  return null;
}

function extractFromNextData(html: string): Record<string, unknown> | null {
  const nextDataMatch = html.match(/<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!nextDataMatch) return null;

  try {
    const nextData = JSON.parse(nextDataMatch[1]);
    // Recursively search for an object with recipeIngredient (a strong Recipe signal)
    return findRecipeObject(nextData);
  } catch {
    return null;
  }
}

function findRecipeObject(obj: unknown, depth = 0): Record<string, unknown> | null {
  if (depth > 10 || !obj || typeof obj !== "object") return null;

  if (!Array.isArray(obj)) {
    const record = obj as Record<string, unknown>;
    if (record["@type"] === "Recipe" || (Array.isArray(record["@type"]) && (record["@type"] as string[]).includes("Recipe"))) {
      return record;
    }
    if (Array.isArray(record.recipeIngredient) && record.name) {
      return record;
    }
  }

  const items = Array.isArray(obj) ? obj : Object.values(obj);
  for (const val of items) {
    if (val && typeof val === "object") {
      const found = findRecipeObject(val, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

function mapJsonLdToRecipe(
  recipeData: Record<string, unknown>,
  recipe: ParsedRecipe,
): ParsedRecipe {
  recipe.title = getString(recipeData, "name");
  recipe.description = getString(recipeData, "description");
  recipe.photoUrl = extractImage(recipeData);
  recipe.prepTime = parseDuration(getString(recipeData, "prepTime"));
  recipe.cookTime = parseDuration(getString(recipeData, "cookTime"));
  recipe.servings = parseServings(recipeData.recipeYield);
  recipe.cuisine = getString(recipeData, "recipeCuisine");
  recipe.category = getString(recipeData, "recipeCategory") || "Dinner";

  if (Array.isArray(recipeData.recipeIngredient)) {
    recipe.ingredients = recipeData.recipeIngredient.map((i: unknown) => String(i).trim()).filter(Boolean);
  }

  recipe.instructions = extractInstructions(recipeData.recipeInstructions);

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

  if (recipeData.aggregateRating && typeof recipeData.aggregateRating === "object") {
    const r = recipeData.aggregateRating as Record<string, unknown>;
    const val = parseFloat(String(r.ratingValue || "0"));
    recipe.rating = Math.round(val);
    recipe.ratingLabel = ratingToLabel(recipe.rating);
  }

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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
  return parseInt(match[1] || "0") * 60 + parseInt(match[2] || "0");
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
  if (typeof data === "string")
    return data
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
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
