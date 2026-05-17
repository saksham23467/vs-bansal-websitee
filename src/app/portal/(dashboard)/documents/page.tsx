import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentWorkspace } from "@/components/documents/document-workspace";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Documents",
  description: "Upload and download your secure documents",
  path: "/portal/documents",
  noIndex: true,
});

export default function PortalDocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Documents</h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          Upload and download files for your engagement. Your CA team sees the same shared folder
          for your account — other clients cannot access your files.
        </p>
      </div>

      <Card className="border-royal-200/60 bg-royal-50/40 dark:border-navy-800 dark:bg-navy-900/40">
        <CardContent className="flex gap-3 p-4 text-sm text-navy-700 dark:text-navy-300">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
          <p>
            You stay signed in for 30 days. Upload PDFs, spreadsheets, and images up to 15 MB each.
          </p>
        </CardContent>
      </Card>

      <DocumentWorkspace mode="client" theme="light" />
    </div>
  );
}
