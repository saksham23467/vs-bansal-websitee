import { MapPin, Phone, Mail } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { getTelHref, siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Our Offices — Delhi NCR & Punjab",
  description:
    "V S bansal & associates has offices in Delhi NCR (Pitampura) and Punjab (Baltana), serving businesses across India with GST, income tax, ROC, audit, and Virtual CFO services.",
  path: "/locations",
  keywords: [
    "CA firm Delhi NCR",
    "CA firm Punjab",
    "chartered accountant Pitampura",
    "chartered accountant Baltana Punjab",
    "GST consultant Delhi NCR",
  ],
});

export default function LocationsPage() {
  return (
    <div className="pb-24">
      <section className="gradient-hero border-b border-navy-100 pb-12 pt-28 dark:border-navy-800 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Locations", href: "/locations" }]} />
          <h1 className="mt-4 text-4xl font-bold text-navy-900 dark:text-white">
            Our offices
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-600 dark:text-navy-300">
            Visit us at our offices in Delhi NCR and Punjab. We support clients
            across India with GST, income tax, ROC, audit, and Virtual CFO
            services—in person and remotely.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {siteConfig.offices.map((office) => (
              <Card key={office.region} className="overflow-hidden">
                <CardContent className="space-y-5 p-6 sm:p-8">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-royal-600">
                      {office.label}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-white">
                      {office.region}
                    </h2>
                  </div>

                  <div className="flex gap-3 text-sm text-navy-600 dark:text-navy-300">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
                    <div>
                      <p>{office.line1}</p>
                      <p>{office.line2}</p>
                      <p>
                        {office.city}, {office.state} {office.postalCode}
                      </p>
                      <p>{office.country}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <a
                      href={getTelHref()}
                      className="inline-flex items-center gap-2 font-medium text-royal-600 hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      {siteConfig.phoneDisplay}
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="inline-flex items-center gap-2 text-royal-600 hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {siteConfig.email}
                    </a>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-navy-100 dark:border-navy-800">
                    <iframe
                      title={`${siteConfig.name} — ${office.region} office`}
                      src={office.mapsEmbed}
                      className="aspect-video w-full border-0"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="border-t border-navy-100 p-3 dark:border-navy-800">
                      <a
                        href={office.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-royal-600 hover:underline"
                      >
                        <MapPin className="h-4 w-4" />
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
