import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getBlessings } from "./store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const COOKIE = "khramam-visitor";
const headers = { "Cache-Control": "private, no-store, max-age=0" };

async function handle(request: NextRequest, claim: boolean) {
  const existing = request.cookies.get(COOKIE)?.value;
  const valid = existing && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing);
  if (claim && !valid) return NextResponse.json({ error: "Обнови страницу и разреши cookie для получения благословения." }, { status: 400, headers });
  const visitor = valid ? existing : randomUUID();
  try {
    const result = await getBlessings(visitor, claim);
    const response = NextResponse.json(result, { headers });
    response.cookies.set(COOKIE, visitor, {
      httpOnly: true, sameSite: "lax", secure: request.nextUrl.protocol === "https:",
      path: "/", maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Общий счётчик временно недоступен. Попробуй немного позже." }, { status: 503, headers });
  }
}

export async function GET(request: NextRequest) { return handle(request, false); }
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Недопустимый источник запроса." }, { status: 403, headers });
  }
  return handle(request, true);
}
