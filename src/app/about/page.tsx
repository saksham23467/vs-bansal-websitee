import Link from "next/link";
import { Award, Building2, Clock, Target } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "About V S bansal & associates",
  description: `Meet ${siteConfig.partners.map((p) => p.name).join(" and ")} — ICAI chartered accountants in Pitampura, Delhi. GST, tax, audit & startup advisory since ${siteConfig.founded}.`,
  path: "/about",
  keywords: ["V S bansal associates", "CA Sumit Bansal", "CA Vineeta Bansal", "chartered accountant Pitampura"],
});

const timeline = [
  { year: "1998", label: "Practice established", detail: "V S bansal & associates founded in Delhi with a focus on tax and assurance for local businesses." },
  { year: "2014", label: "GST readiness", detail: "Helped hundreds of clients transition to GST with training and systems." },
  { year: "2019", label: "Next-gen leadership", detail: "CA Sumit Bansal and CA Vineeta Bansal joined as partners, expanding startup and ROC practices." },
  { year: "2024", label: "Digital client portal", detail: "Secure portal for documents, compliance tracking, and partner communication." },
];

const certifications = [
  "ICAI registered practicing firm",
  "Peer-reviewed audit processes",
  "ISO-aligned document controls (internal)",
  "Data protection & confidentiality charter",
];

const team = siteConfig.partners.map((p) => ({
  name: p.name,
  role: p.role,
  focus: p.expertise,
}));

export default function AboutPage() {
  return (
    <>
      <section className="gradient-hero relative overflow-hidden border-b border-navy-100 pb-16 pt-28 dark:border-navy-800 lg:pb-24 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Badge variant="navy" className="mb-4">
              Since {siteConfig.founded}
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl dark:text-slate-50">
              A practice built for{" "}
              <span className="text-royal-600 dark:text-royal-400">
                precision, pace, and partnership
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-navy-700 dark:text-slate-300">
              {siteConfig.name} couples ICAI rigour with operator empathy—so compliance becomes a backbone, not a
              bottleneck.
            </p>
            <Button className="mt-8" asChild>
              <Link href="/contact">Talk to a partner</Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <SectionHeading
              eyebrow="Story"
              title="From neighbourhood CA firm to national growth partner"
              description={`From our head office at ${siteConfig.address.full}, we serve Delhi NCR and clients pan-India. ${siteConfig.partners[0].name} and ${siteConfig.partners[1].name} personally oversee filings, notices, and advisory—so you always know who is accountable.`}
              align="left"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FadeIn>
                <Card>
                  <CardHeader>
                    <Target className="mb-2 h-8 w-8 text-royal-600" />
                    <CardTitle className="text-lg">Vision</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-navy-600 dark:text-navy-300">
                    Make world-class finance, tax, and compliance accessible to every ambitious Indian business—without
                    enterprise-scale bureaucracy.
                  </CardContent>
                </Card>
              </FadeIn>
              <FadeIn delay={0.08}>
                <Card>
                  <CardHeader>
                    <Building2 className="mb-2 h-8 w-8 text-royal-600" />
                    <CardTitle className="text-lg">Mission</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-navy-600 dark:text-navy-300">
                    Deliver timely filings, defendable positions, and strategic clarity—measured by uptime on your
                    compliance calendar.
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-navy-100 bg-navy-50/50 py-20 dark:border-navy-800 dark:bg-navy-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Timeline" title="Milestones that shaped us" align="center" className="mb-14" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((item, i) => (
              <FadeIn key={item.year} delay={i * 0.06}>
                <Card className="h-full">
                  <CardHeader>
                    <p className="font-mono text-sm text-royal-600">{item.year}</p>
                    <CardTitle className="text-lg">{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-navy-600 dark:text-navy-300">{item.detail}</CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeIn>
              <div className="rounded-3xl bg-gradient-to-br from-navy-900 to-navy-800 p-10 text-white shadow-xl">
                <div className="flex items-center gap-3">
                  <Clock className="h-10 w-10 text-royal-300" />
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wider text-royal-300">Founder note</p>
                    <p className="text-xl font-semibold">Discipline scales kindness</p>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-navy-100">
                  Clients trust us when stakes are high—fundraises, assessments, board meetings. We return that trust
                  with preparation you can trace: working papers, clause-level reasoning, and deadlines you can set your
                  watch to.
                </p>
                <p className="mt-4 text-sm font-medium text-white">— {siteConfig.partners[0].name}, Partner</p>
              </div>
            </FadeIn>
            <SectionHeading
              eyebrow="Standards"
              title="Certifications, charters & how we work"
              description={`${siteConfig.icaiMembership}. We maintain strict independence on audits, documented sign-offs on tax positions, and a confidentiality regime aligned with enterprise expectations.`}
              align="left"
            />
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Assurance" title="What our charter covers" align="center" className="mb-12" />
          <div className="mx-auto grid max-w-3xl gap-3">
            {certifications.map((line, i) => (
              <FadeIn key={line} delay={i * 0.05}>
                <div className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3 dark:border-navy-800 dark:bg-navy-900/40">
                  <Award className="h-5 w-5 text-royal-600" />
                  <span className="text-sm font-medium text-navy-800 dark:text-navy-100">{line}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-navy-100 bg-white py-20 dark:border-navy-800 dark:bg-navy-950 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Team" title="Partner-led, specialist bench" align="center" className="mb-14" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.06}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm font-medium text-royal-600">{member.role}</p>
                  </CardHeader>
                  <CardContent className="text-sm text-navy-600 dark:text-navy-300">{member.focus}</CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
