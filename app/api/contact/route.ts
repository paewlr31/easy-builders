import { NextResponse } from "next/server";
import { addMessage, DatabaseMissingError, getContent } from "@/lib/content";
import { ResendMissingError, ResendSendError, sendContactEmail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    email?: unknown;
    message?: unknown;
    website?: unknown;
  } | null;

  if (!body) return NextResponse.json({ error: "Brak danych." }, { status: 400 });
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!email || !message) {
    return NextResponse.json({ error: "Uzupełnij e-mail i treść." }, { status: 400 });
  }
  if (name.length > 120 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Wiadomość jest za długa." }, { status: 400 });
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  }

  try {
    const content = await getContent();
    await sendContactEmail({ to: content.contact.email, name: name || "Formularz", email, message });
  } catch (error) {
    if (error instanceof ResendMissingError) {
      return NextResponse.json(
        { error: "Formularz nie jest jeszcze podłączony do Resend. Ustaw RESEND_API_KEY." },
        { status: 503 },
      );
    }
    if (error instanceof ResendSendError) {
      console.error(error);
      return NextResponse.json(
        { error: "Nie udało się wysłać maila. Sprawdź klucz Resend i domenę nadawcy." },
        { status: 502 },
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Nie udało się wysłać wiadomości." }, { status: 500 });
  }

  try {
    await addMessage(name || "Formularz", email, message);
  } catch (error) {
    if (!(error instanceof DatabaseMissingError)) console.error(error);
  }

  return NextResponse.json({ ok: true });
}
