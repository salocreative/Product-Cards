import { CoverImage } from "@/components/cover-image";
import { priceLabel } from "@/lib/format";
import type { CoverImageSource, ProductCardSummary, RelatedCard } from "@/lib/types";

type Card = Pick<ProductCardSummary, "slug" | "name" | "category" | "summary"> &
  Partial<
    Pick<
      ProductCardSummary,
      "pricing_model" | "price_amount" | "currency" | "price_basis" | "credit_estimate" | "timeline_text"
    >
  > &
  Partial<Pick<RelatedCard, "summary">> & {
    cover_image_url?: string | null;
    cover_image_alt?: string | null;
    cover_image_source?: CoverImageSource | null;
  };

export function SummaryCard({ card }: { card: Card }) {
  const price =
    card.pricing_model != null
      ? priceLabel({
          pricing_model: card.pricing_model,
          price_amount: card.price_amount ?? null,
          currency: card.currency ?? "GBP",
          price_basis: card.price_basis ?? "",
          credit_estimate: card.credit_estimate ?? null,
        })
      : null;

  return (
    <article className="summary">
      <div className="frame">
        <div className="frame-inner">
          {card.cover_image_url ? (
            <CoverImage
              url={card.cover_image_url}
              alt={card.cover_image_alt ?? null}
              source={card.cover_image_source ?? null}
              sizes="(min-width: 800px) 72rem, calc(100vw - 2.5rem)"
              className="summary-cover"
            />
          ) : null}
          <div className="summary-inner">
            {card.category ? <p className="eyebrow">{card.category}</p> : null}
            <h2>
              <a href={`/${card.slug}`}>{card.name}</a>
            </h2>
            {card.summary ? <p className="summary-text">{card.summary}</p> : null}
            {price || card.timeline_text ? (
              <p className="summary-meta">
                {price ? <span>{price}</span> : null}
                {card.timeline_text ? <span>{card.timeline_text}</span> : null}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
