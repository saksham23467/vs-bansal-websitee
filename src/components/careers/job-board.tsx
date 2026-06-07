"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Briefcase,
  CalendarClock,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/shared/fade-in";
import { useCareers } from "@/components/careers/careers-provider";
import { JOB_TYPE_LABELS, type CareerJob } from "@/lib/careers-data";

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-royal-600">
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-sm text-navy-700 dark:text-navy-300"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-royal-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function JobCard({ job, index }: { job: CareerJob; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { openApply } = useCareers();

  return (
    <FadeIn delay={(index % 3) * 0.06} id={job.slug}>
      <Card className="scroll-mt-28 overflow-hidden hover:border-royal-500/40 hover:shadow-md">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white">
                {job.title}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="default">{JOB_TYPE_LABELS[job.type]}</Badge>
                <span className="inline-flex items-center gap-1.5 text-sm text-navy-600 dark:text-navy-300">
                  <MapPin className="h-4 w-4 text-royal-500" />
                  {job.location}
                </span>
                {(job.duration || job.experience) && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-navy-600 dark:text-navy-300">
                    <CalendarClock className="h-4 w-4 text-royal-500" />
                    {job.duration ?? job.experience}
                  </span>
                )}
                {job.compensation && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 dark:text-navy-200">
                    <Banknote className="h-4 w-4 text-emerald-500" />
                    {job.compensation}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden sm:block">
              <Button onClick={() => openApply(job.title)}>Apply Now</Button>
            </div>
          </div>

          <p className="mt-5 text-navy-700 dark:text-navy-300">{job.overview}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setExpanded((v) => !v)}
              className="gap-2"
            >
              {expanded ? "Hide details" : "View details"}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </Button>
            <Button className="sm:hidden" onClick={() => openApply(job.title)}>
              Apply Now
            </Button>
          </div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid gap-6 border-t border-navy-100 pt-6 dark:border-navy-800 md:grid-cols-2">
                  <DetailList title="Responsibilities" items={job.responsibilities} />
                  <DetailList title="Requirements" items={job.requirements} />
                  <DetailList title="Preferred" items={job.preferred} />
                  <DetailList title="Exposure areas" items={job.exposureAreas} />
                  <DetailList title="Benefits" items={job.benefits} />
                </div>
                <div className="mt-6">
                  <Button size="lg" onClick={() => openApply(job.title)}>
                    Apply for {job.title}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </FadeIn>
  );
}

export function JobBoard({ jobs }: { jobs: CareerJob[] }) {
  if (jobs.length === 0) {
    return (
      <Card className="p-10 text-center">
        <Briefcase className="mx-auto h-10 w-10 text-navy-400" />
        <p className="mt-4 text-navy-600 dark:text-navy-300">
          We don&apos;t have any open positions right now. Check back soon or send
          your resume to{" "}
          <a
            href="mailto:vsbansalassociates@gmail.com"
            className="font-medium text-royal-600 hover:underline"
          >
            vsbansalassociates@gmail.com
          </a>
          .
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job, i) => (
        <JobCard key={job.id} job={job} index={i} />
      ))}
    </div>
  );
}
