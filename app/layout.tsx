import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

// Nagłówki: Public Sans. Treść: Arial (ustawione w globals.css).
const heading = Public_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Easy Builders",
  description: "Instalacje. Easy Builders sp. z o.o., Wrocław.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={heading.variable}>
      <body>{children}</body>
    </html>
  );
}
