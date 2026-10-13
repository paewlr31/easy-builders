import Link from "next/link";

export default function NotFound() {
  return (
    <main className="missing">
      <p className="missing-brand">easy builders</p>
      <h1>Nie ma takiej strony</h1>
      <Link href="/">Wróć na stronę główną</Link>
    </main>
  );
}
