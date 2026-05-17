import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DocumentUploadForm } from "@/components/admin/document-upload-form";
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
        <h1 className="text-3xl font-bold">Client documents</h1>
        <p className="mt-2 text-sm text-navy-400">
          Upload returns, acknowledgements, and working papers. Each file is visible only to the
          assigned client after they sign in.
        </p>
      </div>
      {clients.length === 0 ? (
        <p className="rounded-xl border border-navy-800 bg-navy-900/60 p-6 text-sm text-navy-300">
          No client accounts yet. Run the database seed or create client users first.
        </p>
      ) : (
        <DocumentUploadForm clients={clients} />
      )}
    </div>
  );
}
