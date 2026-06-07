import Link from "next/link";
import {
  Award,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Layers,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CareersProvider } from "@/components/careers/careers-provider";
import { ApplyButton } from "@/components/careers/apply-button";
import { JobBoard } from "@/components/careers/job-board";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublicJobs } from "@/lib/careers";
import {
  buildMetadata,
  breadcrumbJsonLd,
  combineJsonLd,
  jobPostingJsonLd,
} from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Careers — CA Jobs, Articleship & Internships in Delhi",
  description:
    "Build your career with V S bansal & associates. Explore CA jobs in Delhi, CA Articleship, CA internships and Chartered Accountant opportunities across India. Apply online.",
  path: "/careers",
  keywords: [
    "CA Jobs in Delhi",
    "CA Articleship Delhi",
    "CA Internship Delhi",
    "Chartered Accountant Jobs India",
    "Articleship Opportunities",
    "CA firm careers",
  ],
});

export const dynamic = "force-dynamic";

const whyJoin: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description:
      "Structured training on GST, income tax, audit and ROC compliance with real client work from day one.",
  },
  {
    icon: Users,
    title: "Mentorship by Experienced CAs",
    description:
      "Learn directly from qualified Chartered Accountants who guide your technical and professional growth.",
  },
  {
    icon: Layers,
    title: "Exposure to Diverse Industries",
    description:
      "Work with startups, SMEs and established businesses across manufacturing, services, tech and retail.",
  },
  {
    icon: Sparkles,
    title: "Growth-Oriented Culture",
    description:
      "A merit-first environment where curiosity, ownership and initiative are recognised and rewarded.",
  },
  {
    icon: HeartHandshake,
    title: "Flexible Work Environment",
    description:
      "A supportive, collaborative team that values balance alongside high professional standards.",
  },
  {
    icon: TrendingUp,
    title: "Performance-Based Growth",
    description:
      "Clear progression paths with performance incentives and leadership opportunities as you excel.",
  },
];

const cultureValues = [
  { icon: Award, label: "Integrity" },
  { icon: GraduationCap, label: "Continuous learning" },
  { icon: HeartHandshake, label: "Client-first service" },
  { icon: Sparkles, label: "Professional excellence" },
];

export default async function CareersPage() {
  const jobs = await getPublicJobs();
  const positions = jobs.map((j) => ({ id: j.id, title: j.title }));
  const now = new Date().toISOString();

  const jobSchemas = jobs.map((job) =>
    jobPostingJsonLd({
      title: job.title,
      slug: job.slug,
      type: job.type,
      location: job.location,
      overview: job.overview,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      datePosted: now,
    })
  );

  return (
    <CareersProvider positions={positions}>
      <JsonLd
        data={combineJsonLd(
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Careers", url: "/careers" },
          ]),
          ...jobSchemas
        )}
      />

      <div className="pb-24">
        {/* Hero */}
        <section className="gradient-hero relative overflow-hidden border-b border-navy-100 pb-16 pt-28 dark:border-navy-800 lg:pb-24 lg:pt-36">
          <div
            className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-25"
            aria-hidden
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <FadeIn>
                <span className="inline-flex items-center gap-2 rounded-full bg-royal-500/10 px-4 py-1.5 text-sm font-semibold text-royal-700 dark:text-royal-300">
                  <Briefcase className="h-4 w-4" />
                  We&apos;re hiring across Delhi NCR
                </span>
                <h1 className="mt-5 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl dark:text-white">
                  Build Your Career With Industry Experts
                </h1>
                <p className="mt-5 max-w-xl text-lg text-navy-600 dark:text-navy-300">
                  Join a team of professionals helping businesses navigate
                  taxation, compliance, audit, and financial growth.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link href="#positions">View Open Positions</Link>
                  </Button>
                  <ApplyButton size="lg" variant="outline" />
                </div>
                <div className="mt-8 flex flex-wrap gap-6 text-sm text-navy-600 dark:text-navy-300">
                  <div>
                    <p className="text-2xl font-bold text-navy-900 dark:text-white">
                      {jobs.length}+
                    </p>
                    <p>Open roles</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy-900 dark:text-white">
                      ICAI
                    </p>
                    <p>Registered firm</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy-900 dark:text-white">
                      Pan-India
                    </p>
                    <p>Client exposure</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1} className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-royal-500/20 to-navy-500/10 blur-2xl" />
                  <Card className="relative space-y-5 p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal-500/10">
                        <GraduationCap className="h-6 w-6 text-royal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy-900 dark:text-white">
                          Learn from qualified CAs
                        </p>
                        <p className="text-sm text-navy-600 dark:text-navy-300">
                          Hands-on mentorship & real client work
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-navy-100 dark:bg-navy-800" />
                    <div className="grid grid-cols-2 gap-4">
                      {cultureValues.map((v) => (
                        <div
                          key={v.label}
                          className="flex items-center gap-2 rounded-xl bg-navy-50 px-3 py-3 dark:bg-navy-800/50"
                        >
                          <v.icon className="h-5 w-5 text-royal-600" />
                          <span className="text-sm font-medium text-navy-800 dark:text-navy-200">
                            {v.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why join us"
            title="Grow faster with the right team behind you"
            description="We invest in our people with mentorship, diverse exposure, and a clear path to leadership."
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {whyJoin.map((item, i) => (
              <FadeIn key={item.title} delay={(i % 3) * 0.05}>
                <Card className="h-full p-6 transition-all hover:border-royal-500/40 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-royal-500/10">
                    <item.icon className="h-6 w-6 text-royal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">
                    {item.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Company Culture */}
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="overflow-hidden rounded-3xl bg-navy-900 px-6 py-14 text-white sm:px-12 lg:px-16 dark:bg-navy-800">
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-royal-300">
                    Our culture
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    A practice built on trust and excellence
                  </h2>
                  <p className="mt-5 text-lg text-slate-300">
                    We believe in integrity, continuous learning, client-first
                    service, and professional excellence. Our team works closely
                    with startups, SMEs, and growing businesses across India.
                  </p>
                  <div className="mt-8">
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="#positions">Explore open roles</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {cultureValues.map((v) => (
                    <div
                      key={v.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <v.icon className="h-7 w-7 text-royal-300" />
                      <p className="mt-3 font-semibold">{v.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Open Positions */}
        <section id="positions" className="mx-auto mt-20 max-w-5xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Open positions"
            title="Find your next opportunity"
            description="Explore our current openings and apply in minutes."
            className="mb-12"
          />
          <JobBoard jobs={jobs} />
        </section>

        {/* CTA */}
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Card className="flex flex-col items-center gap-6 p-10 text-center sm:p-14">
              <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl dark:text-white">
                Don&apos;t see the right role?
              </h2>
              <p className="max-w-2xl text-navy-600 dark:text-navy-300">
                We&apos;re always looking for talented people. Send us your resume
                and we&apos;ll reach out when a matching opportunity opens up.
              </p>
              <ApplyButton size="lg">Submit your resume</ApplyButton>
            </Card>
          </FadeIn>
        </section>
      </div>
    </CareersProvider>
  );
}
