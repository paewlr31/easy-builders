"use client";

import { FormEvent, useState } from "react";

type Props = {
  title: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  success: string;
  note: string;
};

export function ContactForm(props: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setStatus("");
    if (!email.trim() || !message.trim()) {
      setError("Uzupełnij e-mail i treść.");
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, website }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; ok?: boolean } | null;
      if (!response.ok) {
        setError(data?.error || "Nie udało się wysłać wiadomości.");
        return;
      }
      setEmail("");
      setMessage("");
      setStatus(props.success);
    } catch {
      setError("Nie udało się wysłać wiadomości.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <h3>{props.title}</h3>
      <div className="hp" aria-hidden="true">
        <label>
          Strona
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
        </label>
      </div>
      {status ? (
        <p className="form-status" role="status">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="form-status error" role="alert">
          {error}
        </p>
      ) : null}
      <label className="field">
        <span>{props.messageLabel}</span>
        <textarea
          name="message"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={sending}
        />
      </label>
      <label className="field">
        <span>{props.emailLabel}</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={sending}
        />
      </label>
      <button className="btn-solid" type="submit" disabled={sending}>
        {sending ? "Wysyłanie…" : props.submitLabel}
      </button>
      {props.note ? <p className="form-note">{props.note}</p> : null}
    </form>
  );
}
