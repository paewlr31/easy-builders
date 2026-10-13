import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { DatabaseMissingError, listMessages } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Zaloguj się." }, { status: 401 });
  }
  try {
    const messages = await listMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    if (error instanceof DatabaseMissingError) {
      return NextResponse.json(
        { error: "Baza Neon nie jest podłączona. Wiadomości pojawią się po ustawieniu DATABASE_URL." },
        { status: 503 },
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Nie udało się pobrać wiadomości." }, { status: 500 });
  }
}
