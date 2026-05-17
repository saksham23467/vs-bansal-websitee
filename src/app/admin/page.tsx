import Link from "next/link";
import { FileText, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin",
  description: "VS Bansal & Associates internal dashboard",
  path: "/admin",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [leadCount, clientCount] = await Promise.all([
    prisma.lead.count(),
    prisma.user.count({ where: { role: "CLIENT" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Operations overview</h1>
        <p className="mt-2 text-sm text-navy-300">
          Manage leads and upload documents for clients.
        </p>
      </div>

      <Card className="border-royal-500/40 bg-gradient-to-br from-royal-950/40 to-navy-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <FileText className="h-5 w-5 text-royal-400" />
            Client documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-navy-300">
            Upload ITR acknowledgements, financials, or letters for a client. They appear instantly
            in that client&apos;s portal. Files are never visible to other clients.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/admin/documents">
              <FileText className="h-4 w-4" />
              Open document manager
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card id="leads" className="scroll-mt-28 border-navy-800 bg-navy-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Users className="h-5 w-5 text-royal-400" />
              Website leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-royal-400">{leadCount}</p>
            <p className="mt-2 text-sm text-navy-400">Contact form submissions</p>
          </CardContent>
        </Card>
        <Card className="border-navy-800 bg-navy-900/60">
          <CardHeader>
            <CardTitle className="text-lg text-white">Client accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-royal-400">{clientCount}</p>
            <p className="mt-2 text-sm text-navy-400">Portal logins</p>
          </CardContent>
        </Card>
      </div>

      <Button asChild variant="outline" className="border-navy-600 text-white hover:bg-navy-800">
        <Link href="/portal">Back to portal</Link>
      </Button>
    </div>
  );
}
