import Link from "next/link";
import { FileText, UserPlus, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin overview",
  description: "Manage clients, documents, and leads",
  path: "/portal/admin",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function PortalAdminOverviewPage() {
  const [leadCount, clientCount, docCount] = await Promise.all([
    prisma.lead.count(),
    prisma.user.count({ where: { role: UserRole.CLIENT } }),
    prisma.document.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Admin overview</h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          Manage portal clients, upload documents, and review website leads.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-navy-500">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-royal-600">{clientCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-navy-500">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-royal-600">{docCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-navy-500">Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-royal-600">{leadCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-royal-200 bg-royal-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="h-5 w-5 text-royal-600" />
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-navy-600">Create login accounts for new clients.</p>
            <Button asChild>
              <Link href="/portal/admin/clients">Manage clients</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-royal-200 bg-royal-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-royal-600" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-navy-600">Upload files for any client account.</p>
            <Button asChild>
              <Link href="/portal/admin/documents">Client documents</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-royal-600" />
            Website leads
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-navy-600">
          {leadCount} contact form submission(s). View details in your database or add a leads page
          later.
        </CardContent>
      </Card>

      <Button asChild variant="outline">
        <Link href="/portal">Back to portal home</Link>
      </Button>
    </div>
  );
}
