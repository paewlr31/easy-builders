import type { CSSProperties } from "react";
import type { Colors } from "./types";

export const colorFields = [
  { key: "headerBg", group: "Pasek górny", label: "Tło paska" },
  { key: "headerText", group: "Pasek górny", label: "Kolor linków menu" },
  { key: "headerBrand", group: "Pasek górny", label: "Napis easy builders po lewej stronie paska" },
  { key: "pageBg", group: "Tło i tekst", label: "Tło strony" },
  { key: "heading", group: "Tło i tekst", label: "Nagłówki sekcji" },
  { key: "text", group: "Tło i tekst", label: "Tekst akapitów" },
  { key: "muted", group: "Tło i tekst", label: "Drobne podpisy i numery usług" },
  { key: "serviceTitle", group: "Tło i tekst", label: "Nazwy usług" },
  { key: "heroText", group: "Hero", label: "Napis easy builders na zdjęciu" },
  { key: "heroScrim", group: "Hero", label: "Przyciemnienie zdjęcia, żeby biały napis był czytelny" },
  { key: "bandBg", group: "Pas O nas", label: "Tło pasa" },
  { key: "bandText", group: "Pas O nas", label: "Tekst pasa" },
  { key: "cardBg", group: "Karty Dlaczego my", label: "Tło kart" },
  { key: "cardText", group: "Karty Dlaczego my", label: "Tekst na kartach" },
  { key: "cardNumber", group: "Karty Dlaczego my", label: "Numer na karcie" },
  { key: "lineButtonText", group: "Przyciski", label: "Przycisk obrysowany — tekst" },
  { key: "lineButtonBorder", group: "Przyciski", label: "Przycisk obrysowany — obrys" },
  { key: "lineButtonHoverText", group: "Przyciski", label: "Przycisk obrysowany — tekst po najechaniu" },
  { key: "solidButtonBg", group: "Przyciski", label: "Przycisk pełny (Wyślij) — tło" },
  { key: "solidButtonText", group: "Przyciski", label: "Przycisk pełny (Wyślij) — tekst" },
  { key: "footerBg", group: "Stopka i formularz", label: "Tło stopki" },
  { key: "footerText", group: "Stopka i formularz", label: "Tekst stopki" },
  { key: "footerMuted", group: "Stopka i formularz", label: "Podpisy i dopisek pod formularzem" },
  { key: "inputBg", group: "Stopka i formularz", label: "Pola formularza — tło" },
  { key: "inputText", group: "Stopka i formularz", label: "Pola formularza — tekst" },
  { key: "inputBorder", group: "Stopka i formularz", label: "Pola formularza — obrys" },
  { key: "whatsappBg", group: "WhatsApp", label: "Tło pływającego przycisku" },
  { key: "whatsappText", group: "WhatsApp", label: "Tekst pływającego przycisku" },
  { key: "projectNumber", group: "Realizacje", label: "Numer przy realizacji" },
] as const;

type MissingColor = Exclude<keyof Colors, (typeof colorFields)[number]["key"]>;
type ColorsComplete = [MissingColor] extends [never] ? true : MissingColor;
const colorFieldsCoverAll: ColorsComplete = true;
void colorFieldsCoverAll;

const cssVar: Record<keyof Colors, `--${string}`> = {
  headerBg: "--header-bg",
  headerText: "--header-text",
  headerBrand: "--header-brand",
  pageBg: "--page-bg",
  heading: "--heading",
  text: "--text",
  muted: "--muted",
  serviceTitle: "--service-title",
  heroText: "--hero-text",
  heroScrim: "--hero-scrim",
  bandBg: "--band-bg",
  bandText: "--band-text",
  cardBg: "--card-bg",
  cardText: "--card-text",
  cardNumber: "--card-number",
  lineButtonText: "--line-text",
  lineButtonBorder: "--line-border",
  lineButtonHoverText: "--line-hover-text",
  solidButtonBg: "--solid-bg",
  solidButtonText: "--solid-text",
  footerBg: "--footer-bg",
  footerText: "--footer-text",
  footerMuted: "--footer-muted",
  inputBg: "--input-bg",
  inputText: "--input-text",
  inputBorder: "--input-border",
  whatsappBg: "--wa-bg",
  whatsappText: "--wa-text",
  projectNumber: "--project-number",
};

export function themeStyle(colors: Colors): CSSProperties {
  const vars: Record<string, string> = {};
  (Object.keys(cssVar) as (keyof Colors)[]).forEach((key) => {
    vars[cssVar[key]] = colors[key];
  });
  return vars as CSSProperties;
}
