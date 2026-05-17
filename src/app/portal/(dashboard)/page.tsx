import Link from "next/link";
import { auth } from "@/lib/auth";
import { DocumentList } from "@/components/portal/document-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Client portal",
  description: "Your VS Bansal & Associates client workspace for compliance and documents.",
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
          Track filings, uploads, and messages from your engagement team.
        </p>
      </div>

      {session?.user?.role === "ADMIN" && (
        <Card className="border-royal-500/30 bg-royal-50/50 dark:bg-navy-900/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Administrator</CardTitle>
            <Button asChild size="sm">
              <Link href="/admin">Open admin</Link>
            </Button>
          </CardHeader>
        </Card>
      )}

      <div id="documents" className="grid gap-6 scroll-mt-28 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Documents</CardTitle>
            <Button asChild size="sm" variant="secondary">
              <Link href="/portal/documents">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <DocumentList emptyMessage="No documents yet. Your CA will upload files here for you to download." />
          </CardContent>
        </Card>
        <Card id="compliance">
          <CardHeader>
            <CardTitle className="text-lg">Compliance calendar</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-navy-600 dark:text-navy-300">
            Filing statuses and due dates sync from our practice management tools. Your relationship owner shares monthly
            summaries on email.
          </CardContent>
        </Card>
      </div>

      <Card id="messages">
        <CardHeader>
          <CardTitle className="text-lg">Messages</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-navy-600 dark:text-navy-300">
          Portal messaging is rolling out—until then, reply on email or WhatsApp and we thread it to your matter file.
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/contact">Contact desk</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/services">Services</Link>
        </Button>
      </div>
    </div>
  );
}
