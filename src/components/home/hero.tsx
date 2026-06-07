"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Shield, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";

const whatsappUrl = getWhatsAppUrl();

export function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden pb-20 pt-28 lg:pb-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="navy" className="mb-6">
              ICAI Registered · Trusted since {siteConfig.founded}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl dark:text-slate-50">
              Helping Businesses Stay{" "}
              <span className="text-royal-600 dark:text-royal-400">
                Compliant, Scalable & Financially Strong
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-navy-700 dark:text-slate-300">
              Among Delhi&apos;s trusted CA firms for &ldquo;best CA in Delhi&rdquo;, &ldquo;CA near me&rdquo;, and
              pan-India compliance—led by {siteConfig.partners[0].name} and {siteConfig.partners[1].name} from
              Pitampura (NSP). GST, income tax, ROC, company registration, audit & Virtual CFO.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Book Consultation
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="whatsapp" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Talk on WhatsApp
                </a>
              </Button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-6 text-sm text-navy-600 dark:text-navy-400"
            >
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-royal-600" /> 100% ICAI Compliant
              </span>
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4 text-royal-600" /> 500+ Clients Served
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-royal-600" /> ₹2,000 Cr+ Advised
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass rounded-3xl p-8 shadow-2xl shadow-navy-900/10">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "GST Returns Filed", value: "12,000+" },
                  { label: "Companies Incorporated", value: "850+" },
                  { label: "Audit Hours", value: "50,000+" },
                  { label: "Client Retention", value: "96%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-gradient-to-br from-navy-50 to-white p-5 dark:from-navy-800 dark:to-navy-900"
                  >
                    <p className="text-2xl font-bold text-navy-900 dark:text-white">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-navy-500">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-navy-900 p-5 text-white">
                <p className="text-sm font-medium text-royal-300">Next filing deadline</p>
                <p className="mt-1 text-lg font-semibold">GSTR-3B — 20th of this month</p>
                <p className="mt-2 text-xs text-navy-300">
                  Our compliance desk sends reminders 7 days in advance.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
