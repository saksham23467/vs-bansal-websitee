"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ClientOption = { id: string; name: string | null; email: string };

type DocumentRow = {
  id: string;
  title: string;
  fileName: string;
  fileSize: number | null;
  category: string | null;
  uploadedAt: string;
};

const CATEGORIES = [
  "ITR",
  "GST",
  "ROC",
  "Audit",
  "Financials",
  "Agreements",
  "Other",
];

export function DocumentUploadForm({ clients }: { clients: ClientOption[] }) {
  const [userId, setUserId] = useState(clients[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  async function loadDocuments(clientId: string) {
    if (!clientId) return;
    setLoadingDocs(true);
    try {
      const res = await fetch(`/api/documents?userId=${encodeURIComponent(clientId)}`);
      const data = await res.json();
      setDocuments(res.ok ? (data.documents ?? []) : []);
    } finally {
      setLoadingDocs(false);
    }
  }

  useEffect(() => {
    if (userId) loadDocuments(userId);
  }, [userId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !file || !title.trim()) {
      toast.error("Select a client, title, and file");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", title.trim());
    formData.append("file", file);
    if (category) formData.append("category", category);

    setUploading(true);
    try {
      const res = await fetch("/api/documents", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Upload failed");
        return;
      }
      toast.success("Document uploaded for client");
      setTitle("");
      setCategory("");
      setFile(null);
      await loadDocuments(userId);
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this document?")) return;
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete");
      return;
    }
    toast.success("Document removed");
    await loadDocuments(userId);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-navy-800 bg-navy-900/60 p-6">
        <h3 className="text-lg font-semibold text-white">Upload client document</h3>
        <p className="text-sm text-navy-400">
          Only the selected client can view and download this file. Other clients cannot access it.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="client" className="text-navy-200">
              Client
            </Label>
            <select
              id="client"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-navy-700 bg-navy-950 px-4 text-sm text-white"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? c.email} ({c.email})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-title" className="text-navy-200">
              Title
            </Label>
            <Input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FY 2024-25 ITR Acknowledgement"
              className="border-navy-700 bg-navy-950 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-category" className="text-navy-200">
              Category
            </Label>
            <select
              id="doc-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-navy-700 bg-navy-950 px-4 text-sm text-white"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="doc-file" className="text-navy-200">
              File (PDF, images, Excel, Word — max 15 MB)
            </Label>
            <Input
              id="doc-file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.doc,.docx,.csv,.txt"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="border-navy-700 bg-navy-950 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-royal-600 file:px-4 file:py-2 file:text-sm file:text-white"
            />
          </div>
        </div>

        <Button type="submit" disabled={uploading} className="gap-2">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload for client
            </>
          )}
        </Button>
      </form>

      <div className="rounded-2xl border border-navy-800 bg-navy-900/40 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Client&apos;s documents</h3>
        {loadingDocs ? (
          <p className="text-sm text-navy-400">Loading…</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-navy-400">No documents for this client yet.</p>
        ) : (
          <ul className="divide-y divide-navy-800">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-white">{doc.title}</p>
                  <p className="truncate text-sm text-navy-400">{doc.fileName}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button asChild size="sm" variant="outline" className="border-navy-600">
                    <a href={`/api/documents/${doc.id}/download`}>Download</a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-red-900/50 text-red-400 hover:bg-red-950/50"
                    onClick={() => onDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
