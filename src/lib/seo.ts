import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type SEOProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "",
  image,
  noIndex = false,
  keywords,
}: SEOProps = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.shortName}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;
  const url = `${siteConfig.url}${path}`;
  const ogImage =
    image ??
    `${siteConfig.url}/api/og?title=${encodeURIComponent(title ?? siteConfig.shortName)}`;

  return {
    title: pageTitle,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    authors: siteConfig.partners.map((p) => ({ name: p.name })),
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}

function postalAddress() {
  return {
    "@type": "PostalAddress" as const,
    streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/ca-india-logo.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    foundingDate: String(siteConfig.founded),
    address: postalAddress(),
    sameAs: Object.values(siteConfig.social),
    employee: siteConfig.partners.map((p) => ({
      "@type": "Person",
      name: p.name,
      jobTitle: p.role,
      knowsAbout: p.expertise,
    })),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    image: `${siteConfig.url}/api/og`,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "₹₹",
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: siteConfig.businessHours
      .filter((b) => b.hours !== "Closed")
      .map((b) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: b.day,
        opens: "10:00",
        closes: b.day === "Saturday" ? "15:00" : "19:00",
      })),
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.rating.value,
      reviewCount: siteConfig.rating.count,
    },
    parentOrganization: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceJsonLd(params: {
  name: string;
  description: string;
  url: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    url: params.url,
    provider: { "@id": `${siteConfig.url}/#localbusiness` },
    areaServed: params.areaServed ?? "India",
    serviceType: "Accounting and Tax Services",
  };
}

export function articleJsonLd(params: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: params.url,
    datePublished: params.datePublished,
    author: { "@type": "Person", name: params.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/ca-india-logo.png` },
    },
    image: params.image ?? `${siteConfig.url}/api/og`,
    mainEntityOfPage: params.url,
  };
}

export function reviewJsonLd(
  reviews: { author: string; rating: number; text: string; date?: string }[]
) {
  return reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: r.author },
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.text,
    datePublished: r.date,
    itemReviewed: { "@id": `${siteConfig.url}/#localbusiness` },
  }));
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function combineJsonLd(...schemas: object[]) {
  return schemas;
}
