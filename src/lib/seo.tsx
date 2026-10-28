import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: readonly string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

/** 페이지별 메타데이터 (canonical · Open Graph · Twitter) */
export function pageMetadata(p: PageSeo): Metadata {
  const image = p.image ? (p.image.startsWith("http") ? p.image : absoluteUrl(p.image)) : absoluteUrl("/og-default.png");
  return {
    title: p.title,
    description: p.description,
    keywords: p.keywords ? [...p.keywords, ...site.keywords.slice(0, 3)] : undefined,
    alternates: { canonical: p.path },
    openGraph: {
      type: p.type ?? "website",
      locale: site.locale,
      siteName: site.name,
      url: p.path,
      title: `${p.title} | ${site.name}`,
      description: p.description,
      images: [{ url: image, width: 1200, height: 630, alt: p.title }],
      ...(p.type === "article" ? { publishedTime: p.publishedTime, modifiedTime: p.modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: `${p.title} | ${site.name}`, description: p.description, images: [image] },
    ...(p.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": absoluteUrl("/#organization"),
  name: site.name,
  legalName: site.legalName,
  alternateName: [site.nameEn, site.slogan],
  slogan: site.tagline,
  url: site.url,
  logo: absoluteUrl("/logo.png"),
  image: absoluteUrl("/og-default.png"),
  description: site.description,
  foundingDate: site.foundingDate,
  telephone: site.contact.phone,
  faxNumber: site.contact.fax,
  email: site.contact.email,
  taxID: site.business.registrationNo,
  address: {
    "@type": "PostalAddress",
    addressCountry: "KR",
    addressRegion: site.address.region,
    addressLocality: site.address.locality,
    streetAddress: site.address.street,
    ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
  },
  areaServed: ["전북특별자치도", "익산시"],
  sameAs: [site.store.url],
  hasCredential: site.certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.name,
    recognizedBy: { "@type": "Organization", name: c.issuer },
  })),
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: site.name,
  alternateName: site.nameEn,
  url: site.url,
  inLanguage: "ko-KR",
  publisher: { "@id": absoluteUrl("/#organization") },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "홈", path: "/" }, ...items].map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const articleJsonLd = (a: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  datePublished: string;
  dateModified: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: a.title,
  description: a.description,
  mainEntityOfPage: absoluteUrl(a.path),
  image: [a.image ? (a.image.startsWith("http") ? a.image : absoluteUrl(a.image)) : absoluteUrl("/og-default.png")],
  datePublished: a.datePublished,
  dateModified: a.dateModified,
  author: { "@type": "Organization", name: site.name, url: site.url },
  publisher: { "@id": absoluteUrl("/#organization") },
  inLanguage: "ko-KR",
});

export const courseJsonLd = (c: { name: string; description: string; path: string }) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: c.name,
  description: c.description,
  url: absoluteUrl(c.path),
  inLanguage: "ko-KR",
  provider: { "@type": "EducationalOrganization", name: site.name, sameAs: site.url },
});
