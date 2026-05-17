import Link from "next/link";
import { Award, GraduationCap, Shield } from "lucide-react";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Our Partners & Expertise",
  description: `Meet ${siteConfig.partners.map((p) => p.name).join(" and ")} — ICAI chartered accountants specializing in GST, audit, ROC, and startup advisory at V S bansal & associates, Delhi.`,
  path: "/expertise",
  keywords: ["CA Sumit Bansal", "CA Vineeta Bansal", "chartered accountant Delhi", "ICAI registered CA"],
});

export default function ExpertisePage() {
  return (
  <>
    <JsonLd data={organizationJsonLd()} />
    <div className="pb-24">
      <section className="gradient-hero border-b border-navy-100 pb-12 pt-28 dark:border-navy-800 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Expertise", href: "/expertise" }]} />
          <h1 className="mt-4 text-4xl font-bold text-navy-900 dark:text-white">
            Partner-led expertise you can trust
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-600 dark:text-navy-300">
            {siteConfig.icaiMembership}. Every engagement is overseen by our partners—not delegated to anonymous juniors.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {siteConfig.partners.map((partner) => (
              <Card key={partner.slug} id={partner.slug}>
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-700 to-royal-600 text-2xl font-bold text-white">
                    {partner.name.split(" ")[1]?.[0] ?? "C"}
                  </div>
                  <CardTitle className="text-2xl">{partner.name}</CardTitle>
                  <p className="text-royal-600 font-medium">{partner.role}</p>
                </CardHeader>
                <CardContent className="space-y-4 text-navy-600 dark:text-navy-300">
                  <p>
                    <strong className="text-navy-900 dark:text-white">Focus:</strong> {partner.expertise}
                  </p>
                  <p>
                    {partner.name} advises SMEs, startups, and family businesses on complex filings, assessments, and
                    regulatory strategy—with clear communication and ethical practice at the core.
                  </p>
                  <ul className="flex flex-wrap gap-4 text-sm">
                    <li className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-royal-600" /> ICAI Member
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-royal-600" /> {siteConfig.founded}+ years firm legacy
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-royal-600" /> Partner-led delivery
                    </li>
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 rounded-2xl bg-navy-900 p-8 text-center text-white lg:p-12">
            <h2 className="text-2xl font-bold">Work directly with our partners</h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-300">
              Book a consultation at our Pitampura office or via video call.
            </p>
            <Button className="mt-6" variant="secondary" asChild>
              <Link href="/contact">Schedule consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  </>
  );
}
