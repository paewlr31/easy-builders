import "server-only";
import { resendApiKey, resendFrom, resendTo } from "./config";

export class ResendMissingError extends Error {
  constructor() {
    super("NO_RESEND");
    this.name = "ResendMissingError";
  }
}

export class ResendSendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResendSendError";
  }
}

type ContactMail = {
  to: string;
  name: string;
  email: string;
  message: string;
};

export async function sendContactEmail({ to, name, email, message }: ContactMail) {
  const key = resendApiKey;
  if (!key) throw new ResendMissingError();

  const from = resendFrom;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [resendTo],
      reply_to: email,
      subject: `Wiadomość ze strony — ${name}`,
      text: [`Imię: ${name}`, `E-mail: ${email}`, to.trim() ? `Adres ze strony: ${to.trim()}` : "", "", message]
        .filter((line) => line !== undefined)
        .join("\n"),
    }),
  });

  const data = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
  if (!response.ok) {
    const detail = data?.message || data?.error || "Resend odrzucił wiadomość.";
    throw new ResendSendError(detail);
  }
}
