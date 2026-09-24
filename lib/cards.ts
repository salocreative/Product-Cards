import "server-only";

import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ProductCard, ProductCardSummary } from "@/lib/types";

function supabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const getProductCard = cache(async (slug: string): Promise<ProductCard | null> => {
  const { data, error } = await supabase().rpc("get_product_card", { p_slug: slug });
  if (error) throw new Error(error.message);
  if (!data || typeof data !== "object") return null;
  return data as ProductCard;
});

export const listProductCards = cache(async (): Promise<ProductCardSummary[]> => {
  const { data, error } = await supabase().rpc("list_product_cards");
  if (error) throw new Error(error.message);
  if (!Array.isArray(data)) return [];
  return (data as ProductCardSummary[])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "en-GB"));
});
