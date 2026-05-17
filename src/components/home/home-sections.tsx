"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Calculator,
  CheckCircle2,
  Factory,
  FileCheck,
  Landmark,
  LineChart,
  Quote,
  Receipt,
  Rocket,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { services } from "@/lib/services-data";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

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

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Receipt;
  return <Icon className={cn("h-7 w-7", className)} aria-hidden />;
}

const stats = [
  { label: "Clients served", value: 500, suffix: "+" },
  { label: "GST returns filed", value: 12000, suffix: "+" },
  { label: "Years of practice", value: new Date().getFullYear() - siteConfig.founded, suffix: "" },
  { label: "Retention rate", value: 96, suffix: "%" },
];

export function StatsSection() {
  return (
    <section className="border-y border-navy-100 bg-white py-16 dark:border-navy-800 dark:bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.06} className="text-center lg:text-left">
              <p className="text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-navy-600 dark:text-navy-400">{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

const clientNames = ["Finova", "Gridline", "Northwind", "Saaras", "BluePeak", "Kaveri", "Mosaic", "Orbit"];

export function ClientLogos() {
  return (
    <section className="py-14 dark:bg-navy-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trusted by"
          title="Teams that treat compliance as a growth lever"
          description="From funded startups to established SMEs—we anchor finance ops so leadership can move faster."
          align="center"
          className="mb-12"
        />
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {clientNames.map((name) => (
            <FadeIn key={name}>
              <div className="flex h-14 min-w-[7rem] items-center justify-center rounded-xl border border-navy-100 bg-navy-50/80 px-5 text-sm font-semibold text-navy-500 dark:border-navy-700 dark:bg-navy-900/60 dark:text-navy-300">
                {name}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesPreview() {
  const featured = services.slice(0, 6);
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Compliance and clarity, end to end"
          description="Structured playbooks across tax, MCA, payroll, audit, and strategic finance—so you never trade speed for rigour."
          align="center"
          className="mb-14"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, i) => (
            <FadeIn key={service.slug} delay={(i % 3) * 0.05}>
              <Card className="group h-full transition-all hover:border-royal-500/30 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-royal-500/10 text-royal-600">
                    <ServiceIcon name={service.icon} />
                  </div>
                  <CardTitle className="group-hover:text-royal-600">{service.title}</CardTitle>
                  <CardDescription>{service.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="group/btn px-0 text-royal-600" asChild>
                    <Link href={`/services/${service.slug}`}>
                      Learn more
                      <ArrowRight className="transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/services">
              View all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const differentiators = [
  {
    title: "ICAI-grade discipline",
    body: "Every deliverable is reviewed through a partner-led quality lens—aligned with standards investors and regulators expect.",
  },
  {
    title: "Commercial fluency",
    body: "We translate notices, filings, and statutes into decisions your team can act on the same week.",
  },
  {
    title: "Single relationship owner",
    body: "One partner-backed lead coordinates specialists across tax, ROC, audit, and MIS—no fragmented outsourcing.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-navy-900 py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Why V S bansal & associates"
            title="A partner for regulated scale—not just periodic filings"
            description="We combine technical depth with operating rhythm: calendars, MIS, and proactive nudges before deadlines bite."
            align="left"
            className="[&_h2]:text-white [&_p]:text-navy-200"
          />
          <div className="space-y-6">
            {differentiators.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl bg-navy-800/60 p-6 ring-1 ring-white/10">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-royal-400" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-navy-200">{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const processSteps = [
  { step: "01", title: "Discovery call", detail: "We map entity structure, filings, and risk areas in a single working session." },
  { step: "02", title: "Scope & calendar", detail: "Transparent milestones, owners, and compliance runway for the quarter ahead." },
  { step: "03", title: "Execution", detail: "Document collection, preparation, review, and filing with audit trails." },
  { step: "04", title: "Insight loop", detail: "MIS, variance notes, and planning memos—so leadership sees around corners." },
];

export function ProcessSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="How we onboard and deliver"
          align="center"
          className="mb-14"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <FadeIn key={s.step} delay={i * 0.07}>
              <Card className="h-full border-navy-100 dark:border-navy-800">
                <CardHeader>
                  <Badge variant="outline" className="w-fit font-mono">
                    {s.step}
                  </Badge>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{s.detail}</CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote:
      "V S bansal & associates shifted us from reactive panic-mode filings to a predictable monthly cadence. Their GST desk is surgical.",
    name: "Priya Nair",
    role: "CFO, B2B SaaS",
  },
  {
    quote:
      "ROC, payroll, and audit coordination finally live in one place. Board packs are cleaner and closes are faster.",
    name: "Rahul Mehta",
    role: "Founder, D2C brand",
  },
  {
    quote:
      "They speak founder and CA—critical during our Series A data room. No surprises from diligence.",
    name: "Ananya Krishnan",
    role: "COO, Fintech",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-navy-100 bg-navy-50/50 py-20 dark:border-navy-800 dark:bg-navy-950/50 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="What clients say"
          align="center"
          className="mb-14"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col pt-8">
                  <Quote className="h-8 w-8 text-royal-500/80" />
                  <p className="mt-4 flex-1 text-base leading-relaxed text-navy-700 dark:text-navy-200">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 border-t border-navy-100 pt-6 dark:border-navy-800">
                    <p className="font-semibold text-navy-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-navy-500">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

const industries = [
  "SaaS & platforms",
  "D2C & retail",
  "Manufacturing & MSME",
  "Professional services",
  "Fintech & regulated tech",
  "Hospitality & franchises",
];

export function IndustryExpertise() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Sectors"
            title="Industry depth across growth-stage India Inc."
            description="We bring sector-aware benchmarks—working capital norms, typical margin bridges, and compliance hot-spots—so advice lands in context."
            align="left"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {industries.map((label, i) => (
              <FadeIn key={label} delay={i * 0.05}>
                <div className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3 dark:border-navy-800 dark:bg-navy-900/50">
                  <span className="h-2 w-2 rounded-full bg-royal-500" />
                  <span className="text-sm font-medium text-navy-800 dark:text-navy-100">{label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export type BlogPreviewPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
};

export function BlogPreview({ posts }: { posts: BlogPreviewPost[] }) {
  return (
    <section className="border-t border-navy-100 bg-white py-20 dark:border-navy-800 dark:bg-navy-950 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Insights" title="Latest from our desk" align="left" className="mb-0 max-w-xl" />
          <Button variant="outline" asChild>
            <Link href="/blog">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.06}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-navy-500">
                      <Badge variant="navy">{post.category}</Badge>
                      <span>{post.date}</span>
                      <span className="text-navy-400">·</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <CardTitle className="text-xl leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-royal-600">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="link" className="px-0" asChild>
                      <Link href={`/blog/${post.slug}`}>Read article</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Do you work with companies outside Mumbai?",
    a: "Yes—we operate across India with secure document workflows, video reviews, and on-site support when filings require physical presence.",
  },
  {
    q: "How quickly can we get started?",
    a: "Most engagements kick off within a week after discovery: access, responsibility matrix, and the first compliance calendar are shared immediately.",
  },
  {
    q: "Can you represent us before tax or GST authorities?",
    a: "Our partner team handles notices, assessments, and hearings with documented evidence packs and structured response playbooks.",
  },
  {
    q: "What tooling do you use for collaboration?",
    a: "We meet you where you are—email, WhatsApp Business, secure drives, and client portal updates—with clear versioning for every filing.",
  },
];

export function FAQSection() {
  return (
    <section className="pb-24 pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered upfront"
          align="center"
          className="mb-10"
        />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
