import type { Metadata } from "next";
import { connection } from "next/server";
import { SiteView } from "@/components/SiteView";
import { getContent } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      locale: "pl_PL",
      type: "website",
    },
  };
}

function profileUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.pathname || parsed.pathname === "/") return null;
    return url;
  } catch {
    return null;
  }
}

export default async function Page() {
  await connection();
  const content = await getContent();
  const sameAs = [profileUrl(content.contact.facebookUrl), profileUrl(content.contact.instagramUrl)].filter(
    (item): item is string => Boolean(item),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: content.contact.companyName,
    telephone: content.contact.phone,
    email: content.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.contact.street,
      postalCode: content.contact.postalCode,
      addressLocality: content.contact.city,
      addressCountry: "PL",
    },
    areaServed: content.contact.city,
    sameAs,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteView content={content} />
    </>
  );
}
