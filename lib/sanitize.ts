import { defaultContent } from "./default-content";
import { safeImage } from "./links";
import type { AboutItem, Colors, NavItem, ProjectItem, ServiceItem, SiteContent } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return {};
}

function asString(value: unknown, fallback: string, max: number) {
  if (typeof value !== "string") return fallback;
  return value.slice(0, max);
}

function asBool(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function asColor(value: unknown, fallback: string) {
  if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value.trim())) return value.trim().toLowerCase();
  return fallback;
}

function asHref(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const raw = value.trim().slice(0, 500);
  if (!raw) return "";
  if (
    raw.startsWith("#") ||
    raw.startsWith("/") ||
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:") ||
    raw.startsWith("https://") ||
    raw.startsWith("http://")
  ) {
    return raw;
  }
  if (/^[a-z0-9.-]+\.[a-z]{2,}([/?#].*)?$/i.test(raw)) return `https://${raw}`;
  return fallback;
}

function asId(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim().slice(0, 80);
  return crypto.randomUUID();
}

function uniqueIds<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.map((item, index) => {
    let id = item.id || `id-${index + 1}`;
    while (seen.has(id)) id = `${id}-${index + 1}`;
    seen.add(id);
    return { ...item, id };
  });
}

function asService(row: unknown): ServiceItem | null {
  const item = asRecord(row);
  if (!Object.keys(item).length) return null;
  return {
    id: asId(item.id),
    number: asString(item.number, "", 12),
    title: asString(item.title, "Usługa", 160),
    description: asString(item.description, "", 2000),
    image: safeImage(asString(item.image, "", 400_000)),
    imageAlt: asString(item.imageAlt, "", 300),
  };
}

function asAbout(row: unknown): AboutItem | null {
  const item = asRecord(row);
  if (!Object.keys(item).length) return null;
  return {
    id: asId(item.id),
    number: asString(item.number, "", 12),
    title: asString(item.title, "Punkt", 160),
    description: asString(item.description, "", 4000),
    image: safeImage(asString(item.image, "", 400_000)),
    imageAlt: asString(item.imageAlt, "", 300),
  };
}

function asProject(row: unknown): ProjectItem | null {
  const item = asRecord(row);
  if (!Object.keys(item).length) return null;
  return {
    id: asId(item.id),
    number: asString(item.number, "", 12),
    title: asString(item.title, "Realizacja", 160),
    description: asString(item.description, "", 4000),
    image: safeImage(asString(item.image, "", 400_000)),
    imageAlt: asString(item.imageAlt, "", 300),
  };
}

function asNav(row: unknown): NavItem | null {
  const item = asRecord(row);
  if (!Object.keys(item).length) return null;
  return {
    id: asId(item.id),
    label: asString(item.label, "", 80),
    href: asHref(item.href, "#"),
  };
}

function asList<T>(value: unknown, map: (row: unknown) => T | null, limit = 30) {
  if (!Array.isArray(value)) return [] as T[];
  return value
    .slice(0, limit)
    .map(map)
    .filter((item): item is T => item !== null);
}

function colorsFrom(value: unknown): Colors {
  const input = asRecord(value);
  const fallback = defaultContent.colors;
  const next = { ...fallback };
  (Object.keys(fallback) as (keyof Colors)[]).forEach((key) => {
    next[key] = asColor(input[key], fallback[key]);
  });
  return next;
}

export function sanitizeContent(input: unknown): SiteContent {
  let source = input;
  if (typeof source === "string") {
    try {
      source = JSON.parse(source) as unknown;
    } catch {
      source = {};
    }
  }
  const root = asRecord(source);
  const header = asRecord(root.header);
  const hero = asRecord(root.hero);
  const services = asRecord(root.services);
  const about = asRecord(root.about);
  const projects = asRecord(root.projects);
  const contact = asRecord(root.contact);
  const seo = asRecord(root.seo);
  const base = defaultContent;

  return {
    colors: colorsFrom(root.colors),
    header: {
      brand: asString(header.brand, base.header.brand, 80),
      nav: header.nav === undefined ? base.header.nav : uniqueIds(asList(header.nav, asNav, 12)),
    },
    hero: {
      visible: asBool(hero.visible, true),
      title: asString(hero.title, base.hero.title, 120),
      subtitle: asString(hero.subtitle, base.hero.subtitle, 80),
      image: hero.image === undefined ? base.hero.image : safeImage(asString(hero.image, "", 400_000)),
      imageAlt: asString(hero.imageAlt, base.hero.imageAlt, 300),
    },
    services: {
      visible: asBool(services.visible, true),
      title: asString(services.title, base.services.title, 120),
      intro: asString(services.intro, base.services.intro, 2000),
      items: services.items === undefined ? base.services.items : uniqueIds(asList(services.items, asService)),
    },
    about: {
      visible: asBool(about.visible, true),
      bandTitle: asString(about.bandTitle, base.about.bandTitle, 120),
      bandText: asString(about.bandText, base.about.bandText, 2000),
      bandButtonLabel: asString(about.bandButtonLabel, base.about.bandButtonLabel, 80),
      bandButtonHref: asHref(about.bandButtonHref, base.about.bandButtonHref),
      title: asString(about.title, base.about.title, 120),
      intro: asString(about.intro, base.about.intro, 2000),
      items: about.items === undefined ? base.about.items : uniqueIds(asList(about.items, asAbout)),
    },
    projects: {
      visible: asBool(projects.visible, true),
      title: asString(projects.title, base.projects.title, 120),
      intro: asString(projects.intro, base.projects.intro, 2000),
      items: projects.items === undefined ? base.projects.items : uniqueIds(asList(projects.items, asProject)),
    },
    contact: {
      visible: asBool(contact.visible, true),
      brand: asString(contact.brand, base.contact.brand, 80),
      subtitle: asString(contact.subtitle, base.contact.subtitle, 80),
      tagline: asString(contact.tagline, base.contact.tagline, 300),
      companyName: asString(contact.companyName, base.contact.companyName, 160),
      street: asString(contact.street, base.contact.street, 160),
      postalCode: asString(contact.postalCode, base.contact.postalCode, 20),
      city: asString(contact.city, base.contact.city, 80),
      mapsUrl: asHref(contact.mapsUrl, base.contact.mapsUrl),
      phone: asString(contact.phone, base.contact.phone, 40),
      phoneLabel: asString(contact.phoneLabel, base.contact.phoneLabel, 40),
      email: asString(contact.email, base.contact.email, 160),
      emailLabel: asString(contact.emailLabel, base.contact.emailLabel, 40),
      facebookUrl: asHref(contact.facebookUrl, base.contact.facebookUrl),
      facebookLabel: asString(contact.facebookLabel, base.contact.facebookLabel, 40),
      instagramUrl: asHref(contact.instagramUrl, base.contact.instagramUrl),
      instagramLabel: asString(contact.instagramLabel, base.contact.instagramLabel, 40),
      whatsappNumber: asString(contact.whatsappNumber, base.contact.whatsappNumber, 40),
      whatsappLabel: asString(contact.whatsappLabel, base.contact.whatsappLabel, 40),
      formTitle: asString(contact.formTitle, base.contact.formTitle, 120),
      formNameLabel: asString(contact.formNameLabel, base.contact.formNameLabel, 80),
      formEmailLabel: asString(contact.formEmailLabel, base.contact.formEmailLabel, 80),
      formMessageLabel: asString(contact.formMessageLabel, base.contact.formMessageLabel, 80),
      formSubmitLabel: asString(contact.formSubmitLabel, base.contact.formSubmitLabel, 40),
      formSuccess: asString(contact.formSuccess, base.contact.formSuccess, 300),
      formNote: asString(contact.formNote, base.contact.formNote, 500),
    },
    seo: {
      title: asString(seo.title, base.seo.title, 160),
      description: asString(seo.description, base.seo.description, 300),
    },
  };
}
