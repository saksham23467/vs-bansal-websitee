import {
  BlogPreview,
  ClientLogos,
  FAQSection,
  IndustryExpertise,
  ProcessSection,
  ServicesPreview,
  StatsSection,
  Testimonials,
  WhyChooseUs,
} from "@/components/home/home-sections";
import { ReviewsSection } from "@/components/seo/reviews-section";
import { LocalBusinessBlock } from "@/components/seo/local-business-block";
import { Hero } from "@/components/home/hero";
import { getAllPosts } from "@/lib/blog";
import { LocalSeoStrip } from "@/components/seo/local-seo-strip";
import { buildMetadata, combineJsonLd, faqJsonLd, reviewJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Best CA in Delhi & India | Chartered Accountant Near Me",
  description: siteConfig.description,
  path: "/",
  keywords: [...siteConfig.keywords],
});

const homeFaqs = [
  {
    question: "Who is the best CA in Delhi for GST and income tax?",
    answer: `${siteConfig.name} is an ICAI-registered firm in Pitampura (Netaji Subhash Place) led by ${siteConfig.partners[0].name} (GST & tax) and ${siteConfig.partners[1].name} (audit & ROC)—trusted by 500+ businesses for timely filings and partner-led review.`,
  },
  {
    question: "Do you serve clients looking for a chartered accountant near me in Delhi?",
    answer: `Yes. Our office is at ${siteConfig.address.full}—easy to reach from Rohini, Pitampura, and NSP metro. We also support pan-India clients via video and our secure portal.`,
  },
  {
    question: "Are you among the best chartered accountants in India for startups?",
    answer:
      "We incorporate companies, register GST, maintain ROC compliance, and prepare investor-ready books for startups across metros and tier-2 cities, with Delhi HQ oversight.",
  },
  {
    question: "What services do you offer?",
    answer: "GST filing, income tax returns, TDS, company registration, ROC/MCA compliance, payroll, audit & assurance, Virtual CFO, and startup fundraise support.",
  },
];

const homeReviews = [
  {
    author: "Rahul M.",
    rating: 5,
    text: "Best CA team in Delhi for our GST and ITR—clear advice and on-time filings.",
  },
  {
    author: "Priya S.",
    rating: 5,
    text: "Found them searching CA near me in Pitampura. Professional and responsive.",
  },
];

export default function HomePage() {
  const previewPosts = getAllPosts().slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    category: p.category,
    readingTime: p.readingTime,
  }));

  return (
    <>
      <JsonLd
        data={combineJsonLd(faqJsonLd(homeFaqs), ...reviewJsonLd(homeReviews))}
      />
      <Hero />
      <LocalSeoStrip />
      <StatsSection />
      <ClientLogos />
      <ServicesPreview />
      <WhyChooseUs />
      <ProcessSection />
      <Testimonials />
      <ReviewsSection />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LocalBusinessBlock />
        </div>
      </section>
      <IndustryExpertise />
      <BlogPreview posts={previewPosts} />
      <FAQSection />
    </>
  );
}
