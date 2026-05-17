"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DOCUMENT_CATEGORIES } from "@/lib/documents";
import { cn } from "@/lib/utils";

type ClientOption = { id: string; name: string | null; email: string };

type DocumentRow = {
  id: string;
  title: string;
  fileName: string;
  fileSize: number | null;
  category: string | null;
  uploadedAt: string;
};

type Props = {
  mode: "client" | "admin";
  clients?: ClientOption[];
  theme?: "light" | "dark";
};

const fetchOpts: RequestInit = { credentials: "include" };

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

export function DocumentWorkspace({ mode, clients = [], theme = "light" }: Props) {
  const isDark = theme === "dark";
  const [userId, setUserId] = useState(
    mode === "admin" ? (clients[0]?.id ?? "") : undefined
  );
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const listUrl =
    mode === "admin" && userId
      ? `/api/documents?userId=${encodeURIComponent(userId)}`
      : "/api/documents";

  const loadDocuments = useCallback(async () => {
    if (mode === "admin" && !userId) {
      setDocuments([]);
      setLoadingDocs(false);
      return;
    }
    setLoadingDocs(true);
    try {
      const res = await fetch(listUrl, fetchOpts);
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Could not load documents");
        setDocuments([]);
        return;
      }
      setDocuments(data.documents ?? []);
    } catch {
      toast.error("Could not load documents");
    } finally {
      setLoadingDocs(false);
    }
  }, [listUrl, mode, userId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !file) {
      toast.error("Add a title and choose a file");
      return;
    }
    if (mode === "admin" && !userId) {
      toast.error("Select a client");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("file", file);
    if (category) formData.append("category", category);
    if (mode === "admin" && userId) formData.append("userId", userId);

    setUploading(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Upload failed");
        return;
      }
      toast.success(mode === "client" ? "Document uploaded" : "Uploaded for client");
      setTitle("");
      setCategory("");
      setFile(null);
      const input = document.getElementById(
        mode === "admin" ? "admin-doc-file" : "client-doc-file"
      ) as HTMLInputElement | null;
      if (input) input.value = "";
      await loadDocuments();
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Remove this document?")) return;
    const res = await fetch(`/api/documents/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(typeof data.error === "string" ? data.error : "Could not delete");
      return;
    }
    toast.success("Document removed");
    await loadDocuments();
  }

  const labelClass = isDark ? "text-navy-200" : "text-navy-700";
  const inputClass = isDark
    ? "border-navy-700 bg-navy-950 text-white"
    : "border-navy-200 bg-white text-navy-900";
  const selectClass = cn(
    "flex h-11 w-full rounded-xl border px-4 text-sm",
    inputClass
  );
  const panelClass = isDark
    ? "border-navy-800 bg-navy-900/60"
    : "border-navy-100 bg-white shadow-sm";

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className={cn("space-y-4 rounded-2xl border p-6", panelClass)}
      >
        <div>
          <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-navy-900")}>
            Upload document
          </h2>
          <p className={cn("mt-1 text-sm", isDark ? "text-navy-400" : "text-navy-600")}>
            {mode === "client"
              ? "Share files with your CA team. Only you and VS Bansal & Associates can access them."
              : "Upload to a client's secure folder. Only that client (and admins) can view these files."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "admin" && (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="client" className={labelClass}>
                Client account
              </Label>
              <select
                id="client"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={selectClass}
              >
                {clients.length === 0 ? (
                  <option value="">No clients — run database seed</option>
                ) : (
                  clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name ?? c.email} ({c.email})
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="doc-title" className={labelClass}>
              Title
            </Label>
            <Input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bank statement March 2026"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-category" className={labelClass}>
              Category
            </Label>
            <select
              id="doc-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              <option value="">Select category</option>
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor={mode === "admin" ? "admin-doc-file" : "client-doc-file"}
              className={labelClass}
            >
              File (PDF, images, Excel, Word — max 15 MB)
            </Label>
            <Input
              id={mode === "admin" ? "admin-doc-file" : "client-doc-file"}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.doc,.docx,.csv,.txt"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className={cn(
                inputClass,
                "file:mr-4 file:rounded-lg file:border-0 file:bg-royal-600 file:px-4 file:py-2 file:text-sm file:text-white"
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={uploading || (mode === "admin" && !userId)} className="gap-2">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </form>

      <div className={cn("rounded-2xl border p-6", panelClass)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-navy-900")}>
            {mode === "client" ? "Your files" : "Client files"}
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadDocuments()}
            className={cn("gap-2", isDark && "border-navy-600 text-white")}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {loadingDocs ? (
          <div className="flex items-center gap-2 py-6 text-sm text-navy-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : documents.length === 0 ? (
          <p className={cn("py-4 text-sm", isDark ? "text-navy-400" : "text-navy-600")}>
            No documents yet. Upload your first file above.
          </p>
        ) : (
          <ul className={cn("divide-y", isDark ? "divide-navy-800" : "divide-navy-100")}>
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className={cn("font-medium", isDark ? "text-white" : "text-navy-900")}>
                    {doc.title}
                  </p>
                  <p className="truncate text-sm text-navy-500">{doc.fileName}</p>
                  <p className="mt-1 text-xs text-navy-400">
                    {formatDate(doc.uploadedAt)} · {formatSize(doc.fileSize)}
                    {doc.category ? ` · ${doc.category}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {doc.category && <Badge variant="outline">{doc.category}</Badge>}
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className={isDark ? "border-navy-600" : undefined}
                  >
                    <a href={`/api/documents/${doc.id}/download`}>
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400"
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
