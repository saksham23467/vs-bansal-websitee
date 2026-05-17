import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { cities } from "@/lib/cities";
import { serviceSeoTemplates } from "@/lib/programmatic-seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "CA Firm Locations — Delhi, Noida, Mumbai & More",
  description:
    "V S bansal & associates serves businesses across Delhi NCR, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Ahmedabad, Jaipur, and pan-India.",
  path: "/locations",
  keywords: ["CA firm locations", "chartered accountant Delhi NCR", "GST consultant near me"],
});

export default function LocationsPage() {
  return (
    <div className="pb-24">
      <section className="gradient-hero border-b border-navy-100 pb-12 pt-28 dark:border-navy-800 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Locations", href: "/locations" }]} />
          <h1 className="mt-4 text-4xl font-bold text-navy-900 dark:text-white">
            Chartered Accountant services by city
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-600 dark:text-navy-300">
            Head office in Pitampura, Delhi. Partner-led GST, tax, ROC, and startup advisory across India.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Card key={city.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{city.name}</CardTitle>
                  <p className="text-sm text-navy-500">
                    {city.state} · {city.region}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Link
                    href={`/chartered-accountant-${city.slug}`}
                    className="block font-medium text-royal-600 hover:underline"
                  >
                    Chartered Accountant in {city.name}
                  </Link>
                  {serviceSeoTemplates.slice(0, 3).map((s) => (
                    <Link
                      key={s.slugPrefix}
                      href={`/${s.slugPrefix}-${city.slug}`}
                      className="block text-navy-600 hover:text-royal-600 dark:text-navy-300"
                    >
                      {s.shortName} in {city.name}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
