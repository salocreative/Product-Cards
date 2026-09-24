import type { MetadataRoute } from "next";
import { getProductCard, listProductCards } from "@/lib/cards";
import { CANONICAL_ORIGIN } from "@/lib/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const summaries = await listProductCards();
  const cards = await Promise.all(summaries.map((item) => getProductCard(item.slug)));

  return cards.flatMap((card) => {
    if (!card || !card.indexable || card.status !== "published") return [];
    return [
      {
        url: `${CANONICAL_ORIGIN}/${card.slug}`,
        lastModified: card.updated_at,
      },
    ];
  });
}
