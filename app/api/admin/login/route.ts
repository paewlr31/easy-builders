import { NextResponse } from "next/server";
import { createSessionToken, PANEL_PASSWORD, passwordsMatch, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = body?.password;
  if (typeof password !== "string" || password.length === 0 || password.length > 200) {
    return NextResponse.json({ error: "Podaj hasło." }, { status: 400 });
  }

  if (!passwordsMatch(password, PANEL_PASSWORD)) {
    return NextResponse.json({ error: "Złe hasło." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  return response;
}
