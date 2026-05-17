import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DocumentWorkspace } from "@/components/documents/document-workspace";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Client documents",
  description: "Upload and manage secure client documents",
  path: "/admin/documents",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const clients = await prisma.user.findMany({
    where: { role: UserRole.CLIENT },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Client documents</h1>
        <p className="mt-2 text-sm text-navy-400">
          Upload files for a client. They will see them in their portal after signing in. Each
          client&apos;s documents are completely private from other clients.
        </p>
      </div>

      {clients.length === 0 ? (
        <p className="rounded-xl border border-navy-800 bg-navy-900/60 p-6 text-sm text-navy-300">
          No client accounts yet. Run{" "}
          <code className="rounded bg-navy-800 px-1">prisma/seed-users.sql</code> in Neon or{" "}
          <code className="rounded bg-navy-800 px-1">npm run db:seed</code> locally.
        </p>
      ) : (
        <DocumentWorkspace mode="admin" clients={clients} theme="dark" />
      )}
    </div>
  );
}
