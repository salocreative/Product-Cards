import type { CtaKind, ItemSection, PricingModel, ProductCard, ProductCardItem } from "@/lib/types";

type PriceFields = {
  pricing_model: PricingModel;
  price_amount: number | string | null;
  currency: string;
  price_basis: string;
  credit_estimate: number | string | null;
};

function asNumber(value: number | string | null): number | null {
  if (value == null || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatMoney(amount: number, currency: string) {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
}

export function formatCredits(value: number | string | null) {
  const credits = asNumber(value);
  if (credits == null) return null;
  const rounded = Math.round(credits);
  return rounded === 1 ? "1 credit" : `${rounded} credits`;
}

export function priceLabel(card: PriceFields) {
  if (card.pricing_model === "flexi") return formatCredits(card.credit_estimate);
  const amount = asNumber(card.price_amount);
  if (amount == null) return null;
  const money = formatMoney(amount, card.currency);
  return card.price_basis ? `${money} ${card.price_basis}` : money;
}

export function ctaLabel(kind: CtaKind) {
  switch (kind) {
    case "book_call":
      return "Book a call";
    case "reply_email":
      return "Reply by email";
    case "flexi_brief":
      return "Open a Flexi-Design brief";
  }
}

export function ctaHref(kind: CtaKind, target: string) {
  const value = target.trim();
  if (kind === "reply_email") {
    return value.startsWith("mailto:") ? value : `mailto:${value}`;
  }
  return value;
}

export function sectionItems(items: ProductCardItem[], section: ItemSection) {
  return items
    .filter((item) => item.section === section)
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function cardDescription(card: Pick<ProductCard, "meta_description" | "summary" | "decision_statement">) {
  return card.meta_description?.trim() || card.summary?.trim() || card.decision_statement?.trim() || "";
}

export function cardTitle(card: Pick<ProductCard, "meta_title" | "name">) {
  return card.meta_title?.trim() || card.name;
}

export function clip(text: string, max = 180) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}
