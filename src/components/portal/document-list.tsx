"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DocumentRow = {
  id: string;
  title: string;
  fileName: string;
  fileType: string | null;
  fileSize: number | null;
  category: string | null;
  uploadedAt: string;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DocumentList({ emptyMessage }: { emptyMessage?: string }) {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not load documents");
        setDocuments([]);
        return;
      }
      setDocuments(data.documents ?? []);
    } catch {
      setError("Could not load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-navy-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your documents…
      </div>
    );
  }

  if (error) {
    return <p className="py-4 text-sm text-red-600">{error}</p>;
  }

  if (documents.length === 0) {
    return (
      <p className="py-4 text-sm text-navy-600 dark:text-navy-300">
        {emptyMessage ??
          "No documents yet. When your CA uploads files for you, they will appear here for secure download."}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-navy-100 dark:divide-navy-800">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-royal-50 dark:bg-navy-800">
              <FileText className="h-5 w-5 text-royal-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-navy-900 dark:text-white">{doc.title}</p>
              <p className="truncate text-sm text-navy-500">{doc.fileName}</p>
              <p className="mt-1 text-xs text-navy-400">
                {formatDate(doc.uploadedAt)} · {formatSize(doc.fileSize)}
                {doc.category ? ` · ${doc.category}` : ""}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {doc.category && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {doc.category}
              </Badge>
            )}
            <Button asChild size="sm" variant="outline">
              <a href={`/api/documents/${doc.id}/download`} download>
                <Download className="h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
