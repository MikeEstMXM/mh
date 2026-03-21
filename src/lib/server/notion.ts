import "server-only";

export function getNotionConfig() {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const databaseId = process.env.NOTION_RECIPES_DATABASE_ID?.trim();

  if (!apiKey || !databaseId) {
    return null;
  }

  return { apiKey, databaseId };
}

type RecipeData = {
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

export async function createNotionRecipe(config: { apiKey: string; databaseId: string }, recipe: RecipeData) {
  const properties: Record<string, unknown> = {
    Name: {
      title: [{ text: { content: recipe.title } }],
    },
    Category: {
      select: { name: recipe.category || "Dinner" },
    },
    Cuisine: {
      select: { name: recipe.cuisine || "Other" },
    },
    Status: {
      select: { name: recipe.status || "To Try" },
    },
    "Prep Time": {
      number: recipe.prepTime || null,
    },
    "Cook Time": {
      number: recipe.cookTime || null,
    },
    Servings: {
      number: recipe.servings || null,
    },
    Difficulty: {
      select: { name: recipe.difficulty || "Medium" },
    },
    "Dietary Tags": {
      multi_select: recipe.dietaryTags
        ? recipe.dietaryTags.split(",").map((tag) => ({ name: tag.trim() }))
        : [],
    },
    Rating: {
      select: { name: `${recipe.rating} (${recipe.ratingLabel})` },
    },
  };

  if (recipe.photoUrl) {
    properties["Photo(s)"] = {
      files: [{ type: "external", name: "Recipe Photo", external: { url: recipe.photoUrl } }],
    };
  }

  const children = [];

  if (recipe.description) {
    children.push(
      { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "Description" } }] } },
      { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: recipe.description } }] } },
    );
  }

  if (recipe.ingredients.length > 0) {
    children.push(
      { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "Ingredients List" } }] } },
    );
    for (const ingredient of recipe.ingredients) {
      children.push({
        object: "block",
        type: "to_do",
        to_do: { rich_text: [{ type: "text", text: { content: ingredient } }], checked: false },
      });
    }
  }

  if (recipe.instructions.length > 0) {
    children.push(
      { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "Instructions" } }] } },
    );
    for (const step of recipe.instructions) {
      children.push({
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: { rich_text: [{ type: "text", text: { content: step } }] },
      });
    }
  }

  if (recipe.notes) {
    children.push(
      { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "Notes" } }] } },
      { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: recipe.notes } }] } },
    );
  }

  if (recipe.nutrition) {
    children.push(
      { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "Nutrition" } }] } },
      { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: recipe.nutrition } }] } },
    );
  }

  if (recipe.sourceUrl) {
    children.push(
      { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: "Source" } }] } },
      { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: recipe.sourceUrl, link: { url: recipe.sourceUrl } } }] } },
    );
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: config.databaseId },
      properties,
      children,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error (${response.status}): ${error}`);
  }

  return response.json();
}
