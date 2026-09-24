export const SITE_NAME = "Salo";
export const CANONICAL_ORIGIN = "https://products.salo.uk";
export const SALO_HOME = "https://salo.uk";
export const SALO_CONTACT = "https://salo.uk/contact";
export const BOOK_CALL_URL = "https://cal.com/carlcahill/salo-product";
export const SALO_PRIVACY = "https://salo.uk/privacy";
/** Public Flexi-Design page. Packs are explained there until a dedicated packs URL is confirmed. */
export const FLEXI_PACKS_URL = "https://salo.uk/services/flexi-design";

export const WHO_WE_ARE =
  "Salo is a design studio. Senior design expertise, embedded in your team.";

export const STORAGE_BASE =
  "https://hlmfxwgbmrlmaueyyskn.supabase.co/storage/v1/object/public/product-cards";

export function siteUrl() {
  const configured = process.env.SITE_URL?.replace(/\/$/, "");
  return configured || CANONICAL_ORIGIN;
}

export function metadataBaseUrl() {
  if (process.env.NODE_ENV === "production") return CANONICAL_ORIGIN;
  return siteUrl();
}

export function storageUrl(path: string) {
  const encoded = path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${STORAGE_BASE}/${encoded}`;
}
