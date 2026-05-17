import Link from "next/link";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DocumentWorkspace } from "@/components/documents/document-workspace";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Client documents",
  description: "Upload documents for clients",
  path: "/portal/admin/documents",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function PortalAdminDocumentsPage() {
  const clients = await prisma.user.findMany({
    where: { role: UserRole.CLIENT },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Client documents</h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          Select a client, then upload or download files. Each client only sees their own documents.
        </p>
      </div>

      {clients.length === 0 ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          No clients yet.{" "}
          <Link href="/portal/admin/clients" className="font-medium underline">
            Add a client
          </Link>{" "}
          first.
        </p>
      ) : (
        <DocumentWorkspace mode="admin" clients={clients} theme="light" />
      )}

      <Button asChild variant="outline">
        <Link href="/portal/admin">Back to admin overview</Link>
      </Button>
    </div>
  );
}
