import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { DatabaseMissingError, deleteMessage } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> | { id: string } };

export async function DELETE(_request: Request, context: Context) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Zaloguj się." }, { status: 401 });
  }
  const { id: raw } = await context.params;
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Zły numer wiadomości." }, { status: 400 });
  }
  try {
    await deleteMessage(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof DatabaseMissingError) {
      return NextResponse.json({ error: "Baza Neon nie jest podłączona." }, { status: 503 });
    }
    console.error(error);
    return NextResponse.json({ error: "Nie udało się usunąć wiadomości." }, { status: 500 });
  }
}
