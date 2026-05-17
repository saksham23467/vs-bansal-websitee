import Link from "next/link";
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
import { services } from "@/lib/services-data";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Services",
  description: "GST, income tax, ROC, audit, Virtual CFO, payroll, and more—structured CA services for Indian businesses.",
  path: "/services",
});

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

function Icon({ name }: { name: string }) {
  const Comp = iconMap[name] ?? Receipt;
  return <Comp className="h-7 w-7 text-royal-600" aria-hidden />;
}

export default function ServicesPage() {
  return (
    <div className="pb-24">
      <section className="gradient-hero relative overflow-hidden border-b border-navy-100 pb-14 pt-28 dark:border-navy-800 lg:pb-20 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl dark:text-white">Our services</h1>
            <p className="mt-4 max-w-2xl text-lg text-navy-600 dark:text-navy-300">
              End-to-end compliance and finance support—organized into clear offerings with transparent playbooks.
            </p>
          </FadeIn>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Practice areas"
          title="Everything you need to stay filed, funded, and audit-ready"
          align="center"
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => (
            <FadeIn key={service.slug} delay={(i % 3) * 0.05}>
              <Card className="flex h-full flex-col transition-all hover:border-royal-500/40 hover:shadow-md">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-royal-500/10">
                    <Icon name={service.icon} />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button variant="outline" className={cn("w-full")} asChild>
                    <Link href={`/services/${service.slug}`}>Explore service</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
