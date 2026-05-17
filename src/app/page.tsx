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
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Chartered Accountant in Delhi | GST & Tax Consultant",
  description: siteConfig.description,
  path: "/",
  keywords: [...siteConfig.keywords],
});

const homeFaqs = [
  {
    question: "Who are the partners at V S bansal & associates?",
    answer: "The firm is led by CA Sumit Bansal (GST & Income Tax) and CA Vineeta Bansal (Audit, ROC & Startup Advisory), both ICAI-registered chartered accountants.",
  },
  {
    question: "Where is your office located?",
    answer: `Our head office is at ${siteConfig.address.full}. We serve Delhi NCR and clients across India via office visits, video calls, and our client portal.`,
  },
  {
    question: "What services do you offer?",
    answer: "GST filing, income tax returns, TDS, company registration, ROC/MCA compliance, payroll, audit & assurance, Virtual CFO, and startup fundraise support.",
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
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <Hero />
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
