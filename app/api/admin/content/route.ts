import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { DatabaseMissingError, getAdminState, saveContent } from "@/lib/content";
import { sanitizeContent } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Zaloguj się." }, { status: 401 });
  }
  try {
    const state = await getAdminState();
    return NextResponse.json(state);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Nie udało się odczytać bazy." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Zaloguj się." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Brak danych do zapisu." }, { status: 400 });
  }
  const content = sanitizeContent(body);
  try {
    const updatedAt = await saveContent(content);
    return NextResponse.json({ content, updatedAt, db: true });
  } catch (error) {
    if (error instanceof DatabaseMissingError) {
      return NextResponse.json(
        { error: "Baza Neon nie jest podłączona. Ustaw DATABASE_URL i zrób redeploy." },
        { status: 503 },
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Nie udało się zapisać do bazy." }, { status: 500 });
  }
}
