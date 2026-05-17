import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";
import { buildMetadata } from "@/lib/seo";
import { getTelHref, getWhatsAppUrl, siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Book a consultation with V S bansal & associates—GST, tax, ROC, audit, and Virtual CFO support across India.",
  path: "/contact",
});

const whatsappUrl = getWhatsAppUrl();

export default function ContactPage() {
  return (
    <div className="pb-24">
      <section className="gradient-hero relative overflow-hidden border-b border-navy-100 pb-14 pt-28 dark:border-navy-800 lg:pb-20 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl dark:text-slate-50">
              Let&apos;s map your next filing window
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-navy-700 dark:text-slate-300">
              Share a short note about your entity and timelines—our desk responds within one business day.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Write to us" title="Tell us what you need" align="left" className="mb-8" />
            <Card>
              <CardContent className="p-6 sm:p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <FadeIn>
              <Card>
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-semibold text-navy-900 dark:text-white">Office</h3>
                  <div className="flex gap-3 text-sm text-navy-600 dark:text-navy-300">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
                    <div>
                      <p>{siteConfig.address.line1}</p>
                      <p>{siteConfig.address.line2}</p>
                      <p>
                        {siteConfig.address.city}, {siteConfig.address.state}
                      </p>
                      <p>{siteConfig.address.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-5 w-5 text-royal-600" />
                    <a href={getTelHref()} className="font-medium text-royal-600 hover:underline">
                      {siteConfig.phoneDisplay}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-5 w-5 text-royal-600" />
                    <a href={`mailto:${siteConfig.email}`} className="text-royal-600 hover:underline">
                      {siteConfig.email}
                    </a>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:underline"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp us
                  </a>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn delay={0.05}>
              <Card className="overflow-hidden">
                <div className="flex aspect-video items-center justify-center bg-navy-100 text-sm text-navy-500 dark:bg-navy-800 dark:text-navy-400">
                  <div className="px-6 text-center">
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-royal-600" />
                    Map placeholder — embed Google Maps with your workspace coordinates.
                  </div>
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
