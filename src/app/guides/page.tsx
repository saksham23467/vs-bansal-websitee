import Link from "next/link";
import { getAllSeoPages } from "@/lib/programmatic-seo";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "Tax & Compliance Guides",
  description:
    "Free GST, income tax, and startup compliance guides from V S bansal & associates — ICAI-registered chartered accountants in Delhi.",
  path: "/guides",
});

export default function GuidesPage() {
  const guides = getAllSeoPages().filter((p) => p.type === "guide");

  return (
    <div className="pb-24">
      <section className="gradient-hero border-b border-navy-100 pb-12 pt-28 dark:border-navy-800 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Guides", href: "/guides" }]} />
          <h1 className="mt-4 text-4xl font-bold text-navy-900 dark:text-white">
            Tax & compliance guides
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-600 dark:text-navy-300">
            Expert-written resources for founders, finance teams, and salaried professionals.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <Card key={g.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href={`/${g.slug}`} className="hover:text-royal-600">
                      {g.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-navy-600 dark:text-navy-300">{g.intro.slice(0, 140)}…</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
