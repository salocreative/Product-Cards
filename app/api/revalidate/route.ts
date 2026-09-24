import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";

function unauthorized() {
  return new Response(null, { status: 401 });
}

function authorized(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret || !header) return false;

  const actual = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${secret}`);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export async function POST(request: Request) {
  if (!authorized(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return unauthorized();
  }

  const slug =
    body && typeof body === "object" && "slug" in body ? (body as { slug?: unknown }).slug : null;

  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) {
    return unauthorized();
  }

  revalidatePath(`/${slug}`);
  revalidatePath("/");
  revalidatePath(`/api/og/${slug}`);

  return Response.json({ revalidated: true });
}

export function GET() {
  return unauthorized();
}

export function PUT() {
  return unauthorized();
}

export function PATCH() {
  return unauthorized();
}

export function DELETE() {
  return unauthorized();
}
