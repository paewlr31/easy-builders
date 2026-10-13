export function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

export function mailHref(email: string) {
  const value = email.trim();
  return value ? `mailto:${value}` : "";
}

export function waHref(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 9) digits = `48${digits}`;
  return `https://wa.me/${digits}`;
}

export function mapsLink(street: string, postalCode: string, city: string) {
  const query = encodeURIComponent([street, postalCode, city].filter(Boolean).join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function safeHref(href: string) {
  const value = href.trim();
  if (!value) return "";
  if (
    value.startsWith("#") ||
    value.startsWith("/") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("https://") ||
    value.startsWith("http://")
  ) {
    return value;
  }
  return "";
}

export function safeImage(src: string) {
  const value = src.trim();
  if (!value) return "";
  if (value.startsWith("https://") || value.startsWith("http://")) return value.slice(0, 2000);
  if (
    value.startsWith("data:image/jpeg;base64,") ||
    value.startsWith("data:image/png;base64,") ||
    value.startsWith("data:image/webp;base64,")
  ) {
    return value.length <= 400_000 ? value : "";
  }
  return "";
}

export function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}
