import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  BookOpen,
  Building2,
  Calculator,
  Factory,
  FileCheck,
  Landmark,
  LineChart,
  Receipt,
  Rocket,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getServiceBySlug, services } from "@/lib/services-data";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

const iconMap: Record<string, LucideIcon> = {
  Receipt,
  Landmark,
  Building2,
  FileCheck,
  Rocket,
  LineChart,
  ShieldCheck,
  Calculator,
  BookOpen,
  Users,
  Factory,
  BadgeCheck,
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = iconMap[service.icon] ?? Receipt;
  const related = service.relatedSlugs
    .map((s) => getServiceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const faqLd = faqJsonLd(service.faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="pb-24">
        <section className="gradient-hero relative overflow-hidden border-b border-navy-100 pb-14 pt-28 dark:border-navy-800 lg:pb-20 lg:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-25" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-royal-500/15 text-royal-600">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight text-navy-900 dark:text-white">{service.title}</h1>
                  <p className="mt-4 text-lg text-navy-600 dark:text-navy-300">{service.shortDescription}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href="/contact">Get a quote</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/services">All services</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeading
                eyebrow="Overview"
                title="Scope & outcomes"
                description={service.description}
                align="left"
                className="mb-10"
              />
              <h3 className="mb-4 text-xl font-semibold text-navy-900 dark:text-white">Key benefits</h3>
              <ul className="mb-12 space-y-3 text-navy-700 dark:text-navy-300">
                {service.benefits.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-royal-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mb-6 text-xl font-semibold text-navy-900 dark:text-white">How we deliver</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {service.process.map((step, i) => (
                  <FadeIn key={step.step} delay={i * 0.05}>
                    <Card>
                      <CardHeader>
                        <p className="font-mono text-xs text-royal-600">Step {step.step}</p>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </div>

            <div>
              <Card className="sticky top-24 border-royal-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">Related services</CardTitle>
                  <CardDescription>Bundles clients often combine</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {related.map((r) => (
                    <Button key={r.slug} variant="secondary" asChild className="justify-between">
                      <Link href={`/services/${r.slug}`}>
                        {r.title}
                        <span className="text-xs text-navy-400">→</span>
                      </Link>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 max-w-3xl">
            <SectionHeading eyebrow="FAQ" title={`Questions about ${service.title}`} align="left" className="mb-8" />
            <Accordion type="single" collapsible className="w-full">
              {service.faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}
