"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="missing">
      <p className="missing-brand">easy builders</p>
      <h1>Coś poszło nie tak</h1>
      <button type="button" onClick={() => reset()}>
        Spróbuj ponownie
      </button>
    </main>
  );
}
