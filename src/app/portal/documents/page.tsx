import Link from "next/link";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentList } from "@/components/portal/document-list";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Your documents",
  description: "Secure access to your tax, GST, and compliance documents",
  path: "/portal/documents",
  noIndex: true,
});

export default function PortalDocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Your documents</h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          Download files shared by VS Bansal & Associates. Only you can access documents linked to
          your account.
        </p>
      </div>

      <Card className="border-royal-200/60 bg-royal-50/40 dark:border-navy-800 dark:bg-navy-900/40">
        <CardContent className="flex gap-3 p-4 text-sm text-navy-700 dark:text-navy-300">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
          <p>
            Documents are private to your login. Other clients cannot view your files. Downloads
            are logged and served over an encrypted connection.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available files</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList />
        </CardContent>
      </Card>

      <Button asChild variant="outline">
        <Link href="/portal">Back to portal</Link>
      </Button>
    </div>
  );
}
