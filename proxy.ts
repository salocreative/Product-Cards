import { NextResponse, type NextRequest } from "next/server";

const SKIP_COOKIE = "pc_view";

function referrerHost(value: string | null) {
  if (!value) return null;
  try {
    const host = new URL(value).hostname.toLowerCase().replace(/^www\./, "");
    if (!/^[a-z0-9.-]+$/.test(host) || host.includes("..") || host.length > 255) return null;
    return host;
  } catch {
    return null;
  }
}

function isPrefetch(request: NextRequest) {
  const header = [
    request.headers.get("next-router-prefetch"),
    request.headers.get("next-router-segment-prefetch"),
    request.headers.get("purpose"),
    request.headers.get("sec-purpose"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return header.includes("prefetch") || header === "1";
}

async function logView(slug: string, token: string | null, host: string | null) {
  if (process.env.LOG_VIEWS === "false") return;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return;

  const body: Record<string, string> = { p_slug: slug };
  if (token) body.p_token = token;
  if (host) body.p_referrer_host = host;

  try {
    await fetch(`${url}/rest/v1/rpc/log_product_card_view`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error("Product card view was not logged", error);
  }
}

function skipCookie(path: string, secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path,
    maxAge: 60,
  };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 1) return NextResponse.next();

  const slug = segments[0];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) return NextResponse.next();
  if (isPrefetch(request)) return NextResponse.next();

  const host = referrerHost(request.headers.get("referer"));
  const hasToken = request.nextUrl.searchParams.has("t");

  if (hasToken) {
    const token = request.nextUrl.searchParams.get("t")?.trim() || null;
    if (token) await logView(slug, token, host);

    const url = request.nextUrl.clone();
    url.searchParams.delete("t");
    const response = NextResponse.redirect(url);
    if (token) {
      response.cookies.set(SKIP_COOKIE, "1", skipCookie(pathname, url.protocol === "https:"));
    }
    return response;
  }

  if (request.cookies.get(SKIP_COOKIE)?.value === "1") {
    const response = NextResponse.next();
    response.cookies.set(SKIP_COOKIE, "", { path: pathname, maxAge: 0 });
    return response;
  }

  if (request.method === "GET") {
    await logView(slug, null, host);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
