import { cities, type City } from "@/lib/cities";
import { siteConfig } from "@/lib/site-config";

export type SeoPageType = "chartered-accountant" | "service-city" | "guide";

export type ServiceSeoTemplate = {
  slugPrefix: string;
  serviceSlug: string;
  serviceName: string;
  shortName: string;
  keywords: string[];
};

export const serviceSeoTemplates: ServiceSeoTemplate[] = [
  {
    slugPrefix: "gst-consultant",
    serviceSlug: "gst-filing",
    serviceName: "GST Filing & Compliance",
    shortName: "GST Consultant",
    keywords: ["GST consultant", "GST filing services", "GSTR filing"],
  },
  {
    slugPrefix: "tax-consultant",
    serviceSlug: "income-tax-filing",
    serviceName: "Income Tax Filing",
    shortName: "Tax Consultant",
    keywords: ["tax consultant", "income tax filing", "ITR filing"],
  },
  {
    slugPrefix: "company-registration",
    serviceSlug: "company-registration",
    serviceName: "Company Registration",
    shortName: "Company Registration",
    keywords: ["company registration", "private limited registration", "LLP registration"],
  },
  {
    slugPrefix: "roc-filing",
    serviceSlug: "roc-compliance",
    serviceName: "ROC Compliance & Filing",
    shortName: "ROC Filing",
    keywords: ["ROC filing", "MCA compliance", "annual filing"],
  },
  {
    slugPrefix: "virtual-cfo",
    serviceSlug: "virtual-cfo",
    serviceName: "Virtual CFO Services",
    shortName: "Virtual CFO",
    keywords: ["virtual CFO", "outsourced CFO", "MIS reporting"],
  },
  {
    slugPrefix: "startup-ca",
    serviceSlug: "startup-advisory",
    serviceName: "Startup CA & Advisory",
    shortName: "Startup CA Services",
    keywords: ["startup CA", "startup advisory", "fundraise compliance"],
  },
  {
    slugPrefix: "income-tax-filing",
    serviceSlug: "income-tax-filing",
    serviceName: "Income Tax Return Filing",
    shortName: "Income Tax Filing",
    keywords: ["income tax filing", "ITR filing", "salary return filing"],
  },
];

export type SeoPage = {
  slug: string;
  type: SeoPageType;
  city?: City;
  service?: ServiceSeoTemplate;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
  sections: { heading: string; content: string }[];
};

function buildCaPage(city: City): SeoPage {
  const isHQ = city.slug === "delhi";
  return {
    slug: `chartered-accountant-${city.slug}`,
    type: "chartered-accountant",
    city,
    title: `Chartered Accountant in ${city.name}`,
    metaTitle: `Chartered Accountant in ${city.name} | ${siteConfig.shortName}`,
    metaDescription: `Looking for a chartered accountant in ${city.name}? ${siteConfig.name} offers GST, income tax, ROC, company registration & Virtual CFO. ${isHQ ? "Head office in Pitampura, Delhi." : "Pan-India service with Delhi HQ."} Book a free consultation.`,
    h1: `Chartered Accountant in ${city.name}`,
    intro: `${siteConfig.name} is a trusted ICAI-registered CA firm serving businesses in ${city.name} and ${city.nearbyAreas.slice(0, 3).join(", ")}. Led by ${siteConfig.partners.map((p) => p.name).join(" and ")}, we deliver GST filing, tax planning, ROC compliance, audits, and startup advisory with partner-led attention.`,
    keywords: [
      `chartered accountant ${city.name}`,
      `CA in ${city.name}`,
      `CA firm ${city.name}`,
      `chartered accountant near me ${city.name}`,
      ...siteConfig.keywords.slice(0, 4),
    ],
    faqs: [
      {
        question: `Do you have a physical office in ${city.name}?`,
        answer: isHQ
          ? `Yes. Our head office is at ${siteConfig.address.full}. We also serve clients across ${city.name} via on-site meetings and secure digital workflows.`
          : `Our head office is in Pitampura, Delhi. For ${city.name} clients we offer video consultations, document portals, and scheduled on-site visits when required.`,
      },
      {
        question: `What services do you offer in ${city.name}?`,
        answer: `GST registration & returns, income tax filing, TDS, company incorporation, ROC/MCA filings, payroll, internal & statutory audit, Virtual CFO, and startup fundraise support.`,
      },
      {
        question: `How quickly can I get a consultation?`,
        answer: `Most enquiries receive a callback within one business day. Use WhatsApp or our contact form for fastest response.`,
      },
    ],
    sections: [
      {
        heading: `Why businesses in ${city.name} choose us`,
        content: `We combine Big-firm rigour with boutique responsiveness—fixed compliance calendars, proactive reminders before due dates, and clear fee structures. Our partners personally review material filings and notices.`,
      },
      {
        heading: "Service areas",
        content: `We actively serve ${city.nearbyAreas.join(", ")}, and surrounding commercial hubs. Remote clients across India use our client portal for document exchange and status tracking.`,
      },
    ],
  };
}

function buildServiceCityPage(city: City, service: ServiceSeoTemplate): SeoPage {
  return {
    slug: `${service.slugPrefix}-${city.slug}`,
    type: "service-city",
    city,
    service,
    title: `${service.shortName} in ${city.name}`,
    metaTitle: `${service.shortName} in ${city.name} | ${siteConfig.shortName}`,
    metaDescription: `Expert ${service.shortName.toLowerCase()} in ${city.name}. ${siteConfig.name} — ${service.serviceName}, ICAI-registered partners, transparent pricing. WhatsApp or book a consultation today.`,
    h1: `${service.shortName} in ${city.name}`,
    intro: `Need a reliable ${service.shortName.toLowerCase()} in ${city.name}? ${siteConfig.name} provides end-to-end ${service.serviceName.toLowerCase()} for SMEs, startups, and growing companies—with ${siteConfig.partners[0].name} and ${siteConfig.partners[1].name} overseeing quality and timelines.`,
    keywords: [
      `${service.shortName} ${city.name}`,
      `${service.keywords[0]} ${city.name}`,
      ...service.keywords,
    ],
    faqs: [
      {
        question: `What is included in your ${service.shortName.toLowerCase()} package?`,
        answer: `Scope is tailored to your entity type and volume. Typically includes compliance calendar setup, filing/review, reconciliation where applicable, and email/WhatsApp support for clarifications.`,
      },
      {
        question: `Can you handle urgent filings in ${city.name}?`,
        answer: `Yes—share your deadline and documents. We prioritise time-sensitive GST, tax, and ROC due dates subject to complete documentation.`,
      },
    ],
    sections: [
      {
        heading: `How we deliver ${service.serviceName} in ${city.name}`,
        content: `Structured onboarding → secure document collection → expert preparation → filing with acknowledgment → post-filing summary. All milestones visible in our client portal.`,
      },
      {
        heading: "Related services",
        content: `Most ${city.name} clients also use our GST, payroll, and annual audit services. Bundled retainers often reduce total cost versus ad-hoc filings.`,
      },
    ],
  };
}

const guidePages: SeoPage[] = [
  {
    slug: "gst-filing-guide-india",
    type: "guide",
    title: "GST Filing Guide India 2026",
    metaTitle: "GST Filing Guide India 2026 | V S bansal & associates",
    metaDescription:
      "Complete GST filing guide for Indian businesses—registration, GSTR-1, GSTR-3B, annual return, penalties, and expert tips from chartered accountants.",
    h1: "GST Filing Guide for Indian Businesses",
    intro:
      "This guide explains GST registration thresholds, return types, due dates, and common mistakes—written by practicing CAs at V S bansal & associates.",
    keywords: ["GST filing guide", "GSTR-1", "GSTR-3B", "GST registration India"],
    faqs: [
      {
        question: "Who must register for GST?",
        answer:
          "Businesses exceeding turnover thresholds, e-commerce sellers, and certain mandatory categories must register. Thresholds vary for goods vs services and special category states.",
      },
    ],
    sections: [
      {
        heading: "Monthly vs quarterly filing",
        content:
          "QRMP scheme allows quarterly GSTR-1/3B with monthly tax payment for eligible taxpayers. Choose based on turnover and cash-flow discipline.",
      },
    ],
  },
  {
    slug: "income-tax-filing-guide",
    type: "guide",
    title: "Income Tax Filing Guide",
    metaTitle: "Income Tax Filing Guide India | ITR Due Dates",
    metaDescription:
      "ITR filing guide—forms, documents, due dates, deductions under old vs new regime, and when to hire a CA.",
    h1: "Income Tax Return Filing Guide",
    intro:
      "Filing the correct ITR form, reconciling AIS/26AS, and claiming legitimate deductions avoids notices and maximises refunds.",
    keywords: ["income tax filing guide", "ITR due date", "tax saving"],
    faqs: [
      {
        question: "Which ITR form should I use?",
        answer:
          "Depends on income sources—salary, business, capital gains, foreign income. A CA can map your profile to ITR-1, 2, 3, or 4 in minutes.",
      },
    ],
    sections: [
      {
        heading: "Documents checklist",
        content: "Form 16, bank statements, capital gains statements, home loan interest certificate, investment proofs, and AIS download.",
      },
    ],
  },
  {
    slug: "startup-compliance-checklist-india",
    type: "guide",
    title: "Startup Compliance Checklist India",
    metaTitle: "Startup Compliance Checklist | ROC, GST, Payroll",
    metaDescription:
      "Essential compliance checklist for Indian startups—incorporation, GST, TDS, ROC, ESOP, and investor-ready financials.",
    h1: "Startup Compliance Checklist in India",
    intro:
      "Founders who systemise compliance early avoid penalty drag during fundraises and due diligence.",
    keywords: ["startup compliance", "ROC compliance startup", "DPIIT registration"],
    faqs: [
      {
        question: "When should a startup register for GST?",
        answer:
          "Upon crossing threshold, voluntary registration for ITC, or e-commerce/marketplace obligations. Many B2B startups register early for input credit.",
      },
    ],
    sections: [
      {
        heading: "First 90 days after incorporation",
        content: "PAN/TAN, bank account, GST evaluation, accounting tool setup, payroll if hiring, and board/shareholder registers.",
      },
    ],
  },
];

export function getAllSeoPages(): SeoPage[] {
  const caPages = cities.map(buildCaPage);
  const servicePages = cities.flatMap((city) =>
    serviceSeoTemplates.map((s) => buildServiceCityPage(city, s))
  );
  return [...caPages, ...servicePages, ...guidePages];
}

export function getSeoPageBySlug(slug: string): SeoPage | undefined {
  return getAllSeoPages().find((p) => p.slug === slug);
}

export function getAllSeoSlugs(): string[] {
  return getAllSeoPages().map((p) => p.slug);
}

export function getRelatedSeoPages(page: SeoPage, limit = 6): SeoPage[] {
  const all = getAllSeoPages();
  if (page.city && page.service) {
    return all
      .filter(
        (p) =>
          p.slug !== page.slug &&
          p.city?.slug === page.city?.slug &&
          p.type === "service-city"
      )
      .slice(0, limit);
  }
  if (page.city) {
    return all
      .filter((p) => p.slug !== page.slug && p.city?.slug === page.city?.slug)
      .slice(0, limit);
  }
  return all.filter((p) => p.type === "guide" && p.slug !== page.slug).slice(0, limit);
}
