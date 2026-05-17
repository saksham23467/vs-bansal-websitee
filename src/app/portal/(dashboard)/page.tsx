import Link from "next/link";
import { auth } from "@/lib/auth";
import { FileText, Upload, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Client portal",
  description: "Your V S bansal & associates client workspace",
  path: "/portal",
});

export default async function PortalDashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white">
          Welcome{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          Upload documents, track compliance, and stay connected with your CA team.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-royal-200 bg-gradient-to-br from-royal-50 to-white dark:border-navy-800 dark:from-navy-900 dark:to-navy-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-royal-600" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-navy-600 dark:text-navy-300">
              Upload bank statements, invoices, or KYC — your CA downloads them from the same secure
              folder. Other clients cannot see your files.
            </p>
            <Button asChild className="w-full gap-2 sm:w-auto">
              <Link href="/portal/documents">
                <Upload className="h-4 w-4" />
                Upload & view documents
              </Link>
            </Button>
          </CardContent>
        </Card>

        {session?.user?.role === "ADMIN" && (
          <Card className="border-royal-500/30 bg-royal-50/50 dark:bg-navy-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-royal-600" />
                Administrator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-navy-600 dark:text-navy-300">
                Manage client documents and view leads.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="/portal/admin/clients">Add clients</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/portal/admin/documents">Client documents</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/portal/admin">Admin overview</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div id="compliance" className="grid gap-6 scroll-mt-28 md:grid-cols-2">
        <Card id="messages">
          <CardHeader>
            <CardTitle className="text-lg">Compliance calendar</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-navy-600 dark:text-navy-300">
            Filing statuses and due dates are shared by your relationship manager on email. Portal
            calendar sync is coming soon.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-navy-600 dark:text-navy-300">
            For urgent queries, use WhatsApp or email — we attach replies to your matter file.
          </CardContent>
        </Card>
      </div>

      <Button asChild variant="outline">
        <Link href="/contact">Contact desk</Link>
      </Button>
    </div>
  );
}
