import type { SeoPage } from "@/lib/programmatic-seo";
import { siteConfig } from "@/lib/site-config";

/** High-intent keyword landing pages (best CA Delhi, India, near me). */
export const keywordLandingPages: SeoPage[] = [
  {
    slug: "best-ca-in-delhi",
    type: "keyword-landing",
    title: "Best CA in Delhi",
    metaTitle: "Best CA in Delhi | Chartered Accountant Pitampura & NCR",
    metaDescription: `Looking for the best CA in Delhi? ${siteConfig.name} — ICAI partners in Pitampura (NSP). GST, ITR, ROC, audit & Virtual CFO. 4.9★ rated. Book a free consultation.`,
    h1: "Best Chartered Accountant (CA) in Delhi",
    intro: `${siteConfig.name} is among Delhi's most trusted ICAI-registered CA firms for SMEs, startups, and growing companies. From our Pitampura office at Netaji Subhash Place, ${siteConfig.partners[0].name} and ${siteConfig.partners[1].name} lead GST filing, income tax, ROC compliance, and Virtual CFO services across Delhi NCR and India.`,
    keywords: [
      "best CA in Delhi",
      "best chartered accountant in Delhi",
      "top CA firm Delhi",
      "CA in Pitampura",
      "chartered accountant Delhi NCR",
      "best tax consultant Delhi",
      "GST CA Delhi",
      "CA near me Delhi",
    ],
    faqs: [
      {
        question: "Who is the best CA in Delhi for startups?",
        answer: `${siteConfig.name} supports startups with incorporation, GST registration, ROC filings, cap-table friendly accounting, and investor-ready MIS—led by partners with deep startup and audit experience.`,
      },
      {
        question: "Where is your Delhi office?",
        answer: `We are at ${siteConfig.address.full}. In-person meetings at Pitampura; video consults for clients across Delhi, Gurgaon, Noida, and pan-India.`,
      },
      {
        question: "What makes a CA firm the “best” choice in Delhi?",
        answer:
          "Look for ICAI registration, partner-led review, clear timelines, proactive compliance calendars, and responsive support on WhatsApp/email. We publish filing reminders and maintain a secure client portal for documents.",
      },
      {
        question: "Do you handle GST and income tax both?",
        answer:
          "Yes—GSTR-1/3B, annual returns, reconciliation, income tax returns (salary, business, capital gains), TDS, and notices under one relationship manager.",
      },
    ],
    sections: [
      {
        heading: "Why Delhi businesses choose us",
        content:
          "Partner-led practice since 1998, 500+ active clients, structured compliance desk, and transparent pricing for GST, tax, ROC, and audit engagements.",
      },
      {
        heading: "Areas we serve in Delhi NCR",
        content:
          "Pitampura, Rohini, Dwarka, Karol Bagh, Connaught Place, and nearby NCR cities—Noida, Gurgaon—with the same quality standards as our head office.",
      },
    ],
  },
  {
    slug: "best-chartered-accountant-india",
    type: "keyword-landing",
    title: "Best Chartered Accountant in India",
    metaTitle: "Best Chartered Accountant in India | Pan-India CA Services",
    metaDescription: `Best chartered accountant in India for GST, income tax, ROC & Virtual CFO. ${siteConfig.name} — Delhi HQ, remote clients nationwide. ICAI registered. Book consultation.`,
    h1: "Best Chartered Accountant in India",
    intro: `Businesses across India work with ${siteConfig.name} for reliable tax and compliance. While our head office is in Delhi (Pitampura), we serve Mumbai, Bangalore, Pune, Hyderabad, Chennai, Ahmedabad, Jaipur, and remote clients via secure portal, video calls, and structured document workflows—ideal when you want a best-in-class CA team without limiting yourself to one city.`,
    keywords: [
      "best CA in India",
      "best chartered accountant in India",
      "top CA firm India",
      "chartered accountant India online",
      "pan India CA services",
      "GST consultant India",
      "Virtual CFO India",
    ],
    faqs: [
      {
        question: "Can I hire your CA firm if I am outside Delhi?",
        answer:
          "Yes. Most deliverables—GST, ITR, ROC, payroll, MIS—are handled digitally. We schedule video reviews and use our client portal for secure file exchange.",
      },
      {
        question: "Which industries do you serve across India?",
        answer:
          "Trading, manufacturing, SaaS, D2C, professional services, and family businesses. We tailor compliance calendars to your entity type and state registrations.",
      },
      {
        question: "How do you compare to large national CA networks?",
        answer:
          "You get direct partner oversight, faster turnaround on queries, and a single desk for tax + ROC + advisory—without rotating junior-only teams.",
      },
    ],
    sections: [
      {
        heading: "Pan-India services",
        content:
          "GST filing, income tax, TDS, company/LLP registration, ROC/MCA annual filings, statutory audit support, internal controls, and Virtual CFO reporting.",
      },
      {
        heading: "Delhi headquarters, India reach",
        content: `Our ICAI-registered partners operate from ${siteConfig.address.city} with standardized processes for clients in every major metro and tier-2 city.`,
      },
    ],
  },
  {
    slug: "chartered-accountant-near-me",
    type: "keyword-landing",
    title: "Chartered Accountant Near Me",
    metaTitle: "CA Near Me | Chartered Accountant Pitampura Delhi",
    metaDescription: `CA near me in Delhi? ${siteConfig.name} at PP Trade Centre, Pitampura (NSP). Walk-in & video consults. GST, ITR, ROC. Call ${siteConfig.phoneDisplay}.`,
    h1: "Chartered Accountant Near Me — Pitampura, Delhi",
    intro: `Searching “CA near me” in Delhi NCR? Our office is at ${siteConfig.address.line1}, ${siteConfig.address.line2}—minutes from Netaji Subhash Place metro. ${siteConfig.name} offers same-week consultations for GST, tax returns, company compliance, and audit support, with evening slots on request.`,
    keywords: [
      "CA near me",
      "chartered accountant near me",
      "CA near me Delhi",
      "tax consultant near me",
      "GST consultant near Pitampura",
      "CA office near Netaji Subhash Place",
      "chartered accountant near Rohini",
    ],
    faqs: [
      {
        question: "How do I find a CA near me in Pitampura or Rohini?",
        answer: `Visit us at ${siteConfig.address.full} or WhatsApp ${siteConfig.phoneDisplay} to book. We serve Pitampura, Rohini, Shalimar Bagh, and wider Delhi NCR.`,
      },
      {
        question: "Do you offer home or office visits?",
        answer:
          "For select engagements in Delhi NCR, partner visits can be arranged. Most clients prefer our office or video meetings for efficiency.",
      },
      {
        question: "What should I bring to a first meeting?",
        answer:
          "PAN, GSTIN (if any), last filed returns, bank statements, and incorporation documents. We will share a tailored checklist after booking.",
      },
    ],
    sections: [
      {
        heading: "Local office, national expertise",
        content:
          "Neighbourhood accessibility with the depth of a full-service CA practice—GST, direct tax, ROC, payroll, and startup advisory.",
      },
      {
        heading: "Get directions",
        content: `Open Google Maps for PP Trade Centre, Netaji Subhash Place, or call ${siteConfig.phoneDisplay} for landmark directions.`,
      },
    ],
  },
];
