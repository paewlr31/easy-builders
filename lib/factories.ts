import type { AboutItem, NavItem, ProjectItem, ServiceItem } from "./types";

export function newId() {
  return crypto.randomUUID();
}

export function moveItem<T>(list: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

export function blankNav(): NavItem {
  return { id: newId(), label: "Nowa sekcja", href: "#kontakt" };
}

export function blankService(): ServiceItem {
  return {
    id: newId(),
    number: "",
    title: "Nowa usługa",
    description: "",
    image: "",
    imageAlt: "",
  };
}

export function blankAbout(): AboutItem {
  return {
    id: newId(),
    number: "",
    title: "Nowy punkt",
    description: "",
    image: "",
    imageAlt: "",
  };
}

export function blankProject(): ProjectItem {
  return {
    id: newId(),
    number: "",
    title: "Nowa realizacja",
    description: "",
    image: "",
    imageAlt: "",
  };
}
