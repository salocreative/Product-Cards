import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product-page";
import { Shell } from "@/components/shell";
import { getProductCard, listProductCards } from "@/lib/cards";
import { cardDescription, cardTitle } from "@/lib/format";
import { CANONICAL_ORIGIN, storageUrl } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const cards = await listProductCards();
  return cards.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = await getProductCard(slug);
  if (!card) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  const title = cardTitle(card);
  const description = cardDescription(card);
  const indexable = card.indexable && card.status === "published";
  const image = card.og_image_path ? storageUrl(card.og_image_path) : `/api/og/${card.slug}`;

  return {
    title: card.meta_title?.trim() ? { absolute: card.meta_title.trim() } : card.name,
    description,
    alternates: { canonical: `${CANONICAL_ORIGIN}/${card.slug}` },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `${CANONICAL_ORIGIN}/${card.slug}`,
      siteName: "Salo",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: card.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = await getProductCard(slug);
  if (!card) notFound();

  return (
    <Shell>
      <ProductPage card={card} />
    </Shell>
  );
}
