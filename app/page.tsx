import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { SummaryCard } from "@/components/summary-card";
import { listProductCards } from "@/lib/cards";
import { CANONICAL_ORIGIN, WHO_WE_ARE } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Products · Salo" },
  description: WHO_WE_ARE,
  alternates: { canonical: `${CANONICAL_ORIGIN}/` },
  robots: { index: false, follow: false },
};

export default async function HomePage() {
  const cards = await listProductCards();

  return (
    <Shell>
      <div className="wrap">
        <header className="page-intro">
          <p className="eyebrow">Salo</p>
          <h1>Products</h1>
          <p className="lede">Senior design expertise, embedded in your team.</p>
        </header>
        {cards.length > 0 ? (
          <div className="summary-list">
            {cards.map((card) => (
              <SummaryCard card={card} key={card.slug} />
            ))}
          </div>
        ) : (
          <p className="empty">Nothing is published right now.</p>
        )}
      </div>
    </Shell>
  );
}
