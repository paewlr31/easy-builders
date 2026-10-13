import "server-only";

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
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new ResendMissingError();
  if (!to.trim()) throw new ResendSendError("W panelu brakuje adresu e-mail, na który mają przychodzić wiadomości.");

  const from = process.env.RESEND_FROM?.trim() || "Easy Builders <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to.trim()],
      reply_to: email,
      subject: `Wiadomość ze strony — ${name}`,
      text: [`Imię: ${name}`, `E-mail: ${email}`, "", message].join("\n"),
    }),
  });

  const data = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
  if (!response.ok) {
    const detail = data?.message || data?.error || "Resend odrzucił wiadomość.";
    throw new ResendSendError(detail);
  }
}
