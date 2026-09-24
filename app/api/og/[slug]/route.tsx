import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { getProductCard } from "@/lib/cards";
import { cardDescription, clip } from "@/lib/format";
import { storageUrl } from "@/lib/site";

export const revalidate = 60;

const fontPromise = readFile(
  join(process.cwd(), "node_modules/@fontsource/fustat/files/fustat-latin-400-normal.woff"),
);

async function coverDataUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const type = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${type};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const card = await getProductCard(slug);
  if (!card) return new Response("Not found", { status: 404 });

  if (card.og_image_path) {
    return NextResponse.redirect(storageUrl(card.og_image_path));
  }

  const description = clip(cardDescription(card), card.cover_image_url ? 120 : 160);
  const nameSize = card.name.length > 22 ? (card.cover_image_url ? 48 : 60) : card.cover_image_url ? 64 : 84;
  const font = await fontPromise;
  const cover = card.cover_image_url ? await coverDataUrl(card.cover_image_url) : null;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#101010",
          color: "white",
          fontFamily: "Fustat",
        }}
      >
        <div style={{ width: 14, background: "#6405FF" }} />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: cover ? "56px 48px" : "68px 76px",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 6 }}>SALO</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {card.category ? (
              <div style={{ display: "flex", marginBottom: 18, color: "#b5b5b5", fontSize: 28 }}>
                {card.category}
              </div>
            ) : null}
            <div style={{ display: "flex", fontSize: nameSize, lineHeight: 1.05, letterSpacing: -1 }}>
              {card.name}
            </div>
            {description ? (
              <div
                style={{
                  display: "flex",
                  maxWidth: cover ? 480 : 920,
                  marginTop: 28,
                  color: "#b5b5b5",
                  fontSize: cover ? 26 : 32,
                  lineHeight: 1.35,
                }}
              >
                {description}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", color: "#b5b5b5", fontSize: 26 }}>salo.uk</div>
        </div>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" width={600} height={630} style={{ width: 600, height: 630, objectFit: "cover" }} />
        ) : null}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Fustat", data: font, weight: 400, style: "normal" }],
    },
  );
}
