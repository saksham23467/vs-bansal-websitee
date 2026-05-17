import Link from "next/link";
import { UserRole } from "@prisma/client";
import { Shield } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentWorkspace } from "@/components/documents/document-workspace";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Documents",
  description: "Upload and download your secure documents",
  path: "/portal/documents",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function PortalDocumentsPage() {
  const session = await auth();
  const isAdmin =
    session?.user?.role === UserRole.ADMIN || session?.user?.role === UserRole.STAFF;

  const clients = isAdmin
    ? await prisma.user.findMany({
        where: { role: UserRole.CLIENT },
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Documents</h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          {isAdmin
            ? "Select a client, then upload or download files for their account. Each client's documents stay private."
            : "Upload and download files for your engagement. Your CA team sees the same shared folder — other clients cannot access your files."}
        </p>
      </div>

      {isAdmin && clients.length === 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40">
          <CardContent className="p-4 text-sm text-amber-900 dark:text-amber-200">
            No client accounts found. Run <code className="rounded bg-amber-100 px-1">prisma/seed-users.sql</code>{" "}
            in Neon, or use{" "}
            <Button asChild variant="link" className="h-auto p-0 text-amber-900">
              <Link href="/admin/documents">Admin document manager</Link>
            </Button>
            .
          </CardContent>
        </Card>
      )}

      <Card className="border-royal-200/60 bg-royal-50/40 dark:border-navy-800 dark:bg-navy-900/40">
        <CardContent className="flex gap-3 p-4 text-sm text-navy-700 dark:text-navy-300">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
          <p>
            {isAdmin
              ? "As admin, pick the client from the dropdown before uploading. You can also use the dedicated admin panel."
              : "You stay signed in for 30 days. Upload PDFs, spreadsheets, and images up to 15 MB each."}
          </p>
        </CardContent>
      </Card>

      {isAdmin ? (
        <DocumentWorkspace mode="admin" clients={clients} theme="light" />
      ) : (
        <DocumentWorkspace mode="client" theme="light" />
      )}

      {isAdmin && (
        <Button asChild variant="outline">
          <Link href="/admin/documents">Open admin document manager</Link>
        </Button>
      )}
    </div>
  );
}
