export type PricingModel = "fixed" | "flexi";
export type CtaKind = "book_call" | "reply_email" | "flexi_brief";
export type ItemSection = "choose_when" | "approach" | "outcome" | "terms" | "faq";
export type ExampleKind = "image" | "video" | "logo" | "case_study" | "quote";
export type CardStatus = "unlisted" | "published" | "retired";
export type CoverImageSource = "sample" | "client" | string;

export interface ProductCardItem {
  section: ItemSection;
  title: string;
  body: string;
  sort_order: number;
}

export interface ProductCardExample {
  kind: ExampleKind;
  title: string;
  caption: string;
  storage_path: string | null;
  url: string | null;
  company_name: string | null;
  case_study_path: string | null;
  sort_order: number;
}

export interface CoverImageFields {
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_source: CoverImageSource | null;
}

export interface RelatedCard {
  slug: string;
  name: string;
  category: string;
  summary: string;
  sort_order: number;
  cover_image_url?: string | null;
  cover_image_alt?: string | null;
  cover_image_source?: CoverImageSource | null;
}

export interface ProductCard extends CoverImageFields {
  slug: string;
  name: string;
  category: string;
  status: CardStatus;
  decision_statement: string;
  summary: string;
  pricing_model: PricingModel;
  price_amount: number | string | null;
  currency: "GBP" | "USD" | string;
  price_basis: string;
  payment_terms: string;
  price_note: string | null;
  credit_estimate: number | string | null;
  flexi_service_title: string | null;
  flexi_service_category: string | null;
  timeline_text: string;
  cta_kind: CtaKind;
  cta_target: string;
  indexable: boolean;
  meta_title: string | null;
  meta_description: string | null;
  og_image_path: string | null;
  published_at: string | null;
  updated_at: string;
  items: ProductCardItem[];
  examples: ProductCardExample[];
  related: RelatedCard[];
}

export interface ProductCardSummary extends CoverImageFields {
  slug: string;
  name: string;
  category: string;
  summary: string;
  pricing_model: PricingModel;
  price_amount: number | string | null;
  currency: string;
  price_basis: string;
  price_note: string | null;
  credit_estimate: number | string | null;
  flexi_service_title: string | null;
  timeline_text: string;
  sort_order: number;
}
