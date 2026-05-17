import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { LocalBusinessBlock } from "@/components/seo/local-business-block";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAllSeoSlugs,
  getRelatedSeoPages,
  getSeoPageBySlug,
} from "@/lib/programmatic-seo";
import {
  buildMetadata,
  combineJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { services } from "@/lib/services-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle.replace(` | ${siteConfig.shortName}`, ""),
    description: page.metaDescription,
    path: `/${slug}`,
    keywords: page.keywords,
  });
}

const whatsappUrl = getWhatsAppUrl("Hello, I found you on your website and need CA services.");

export default async function ProgrammaticSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);
  if (!page) notFound();

  const related = getRelatedSeoPages(page);
  const serviceLink = page.service
    ? services.find((s) => s.slug === page.service?.serviceSlug)
    : null;

  const schemas = combineJsonLd(
    localBusinessJsonLd(),
    faqJsonLd(page.faqs),
    page.service
      ? serviceJsonLd({
          name: page.title,
          description: page.metaDescription,
          url: `${siteConfig.url}/${slug}`,
          areaServed: page.city?.name,
        })
      : {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: page.title,
          description: page.metaDescription,
          areaServed: page.city?.name ?? "India",
        }
  );

  const breadcrumbItems = [
    ...(page.type === "guide"
      ? [{ name: "Guides", href: "/guides" }]
      : page.city
        ? [{ name: page.city.name, href: `/${page.slug}` }]
        : []),
    { name: page.title, href: `/${slug}` },
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <article>
        <section className="gradient-hero border-b border-navy-100 pb-16 pt-28 dark:border-navy-800 lg:pb-20 lg:pt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
            <FadeIn>
              {page.city && (
                <Badge variant="navy" className="mb-4">
                  Serving {page.city.name} & {page.city.region}
                </Badge>
              )}
              <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl dark:text-white">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-navy-600 dark:text-navy-300">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/contact">Book free consultation</Link>
                </Button>
                <Button size="lg" variant="whatsapp" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    WhatsApp now
                  </a>
                </Button>
                {serviceLink && (
                  <Button size="lg" variant="outline" asChild>
                    <Link href={`/services/${serviceLink.slug}`}>Service details</Link>
                  </Button>
                )}
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-12">
                {page.sections.map((section) => (
                  <FadeIn key={section.heading}>
                    <h2 className="text-2xl font-bold text-navy-900 dark:text-white">
                      {section.heading}
                    </h2>
                    <p className="mt-4 text-navy-600 leading-relaxed dark:text-navy-300">
                      {section.content}
                    </p>
                  </FadeIn>
                ))}

                {page.city && (
                  <FadeIn>
                    <h2 className="text-2xl font-bold text-navy-900 dark:text-white">
                      Areas we serve in {page.city.name}
                    </h2>
                    <p className="mt-4 flex flex-wrap gap-2">
                      {page.city.nearbyAreas.map((area) => (
                        <Badge key={area} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </p>
                  </FadeIn>
                )}

                <FadeIn>
                  <SectionHeading
                    title="Frequently asked questions"
                    align="left"
                    className="mb-6"
                  />
                  <Accordion type="single" collapsible className="w-full">
                    {page.faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </FadeIn>

                {page.city && page.city.slug !== "delhi" && (
                  <FadeIn>
                    <h2 className="text-2xl font-bold text-navy-900 dark:text-white">
                      Google Maps — Head office (Delhi)
                    </h2>
                    <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">
                      Pan-India clients welcome. Primary office at Pitampura for in-person meetings.
                    </p>
                    <iframe
                      title="V S bansal & associates office location"
                      src={siteConfig.googleMapsEmbed}
                      className="mt-4 h-72 w-full rounded-2xl border border-navy-100 dark:border-navy-800"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </FadeIn>
                )}
              </div>
              <aside className="space-y-6">
                <LocalBusinessBlock />
                {related.length > 0 && (
                  <div className="rounded-2xl border border-navy-100 bg-white p-6 dark:border-navy-800 dark:bg-navy-900">
                    <h3 className="font-semibold text-navy-900 dark:text-white">Related pages</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                      {related.map((r) => (
                        <li key={r.slug}>
                          <Link
                            href={`/${r.slug}`}
                            className="text-royal-600 hover:underline"
                          >
                            {r.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
