"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import {
  ChevronRight,
  Download,
  Folder,
  FolderPlus,
  Home,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DOCUMENT_CATEGORIES } from "@/lib/documents";
import { cn } from "@/lib/utils";

type ClientOption = { id: string; name: string | null; email: string };
type DocumentScope = "CLIENT" | "ADMIN";

type FolderRow = {
  id: string;
  name: string;
  parentId: string | null;
  scope: DocumentScope;
  _count?: { documents: number; children: number };
};

type DocumentRow = {
  id: string;
  title: string;
  fileName: string;
  fileSize: number | null;
  category: string | null;
  scope: DocumentScope;
  folderId: string | null;
  uploadedAt: string;
};

type Props = {
  mode: "client" | "admin";
  clients?: ClientOption[];
  theme?: "light" | "dark";
};

const fetchOpts: RequestInit = { credentials: "include" };

const SCOPE_LABELS: Record<DocumentScope, { client: string; admin: string }> = {
  CLIENT: {
    client: "My uploads",
    admin: "Client uploads",
  },
  ADMIN: {
    client: "From CA team",
    admin: "Admin uploads",
  },
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

function buildQuery(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function DocumentWorkspace({ mode: modeProp, clients = [], theme = "light" }: Props) {
  const { data: session } = useSession();
  const isStaffOrAdmin =
    session?.user?.role === UserRole.ADMIN || session?.user?.role === UserRole.STAFF;
  const mode = modeProp === "admin" || isStaffOrAdmin ? "admin" : "client";
  const canManageAdminTree = mode === "admin";

  const isDark = theme === "dark";
  const [userId, setUserId] = useState(mode === "admin" ? (clients[0]?.id ?? "") : undefined);
  const [activeScope, setActiveScope] = useState<DocumentScope>("CLIENT");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Home" },
  ]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mode === "admin" && clients[0]?.id && !userId) {
      setUserId(clients[0].id);
    }
  }, [mode, clients, userId]);

  const baseParams = {
    userId: mode === "admin" ? userId : undefined,
    scope: activeScope,
    parentId: currentFolderId ?? "root",
    folderId: currentFolderId ?? "root",
  };

  const canManageCurrentTree =
    activeScope === "CLIENT" || (activeScope === "ADMIN" && canManageAdminTree);

  const loadAll = useCallback(async () => {
    if (mode === "admin" && !userId) {
      setFolders([]);
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const folderQs = buildQuery({
        userId: baseParams.userId,
        scope: baseParams.scope,
        parentId: baseParams.parentId,
      });
      const docQs = buildQuery({
        userId: baseParams.userId,
        scope: baseParams.scope,
        folderId: baseParams.folderId,
      });

      const [folderRes, docRes] = await Promise.all([
        fetch(`/api/documents/folders${folderQs}`, fetchOpts),
        fetch(`/api/documents${docQs}`, fetchOpts),
      ]);

      const folderData = await folderRes.json();
      const docData = await docRes.json();

      if (!folderRes.ok) {
        toast.error(typeof folderData.error === "string" ? folderData.error : "Could not load folders");
        setFolders([]);
      } else {
        setFolders(folderData.folders ?? []);
      }

      if (!docRes.ok) {
        toast.error(typeof docData.error === "string" ? docData.error : "Could not load files");
        setDocuments([]);
      } else {
        setDocuments(docData.documents ?? []);
      }
    } catch {
      toast.error("Could not load documents");
    } finally {
      setLoading(false);
    }
  }, [mode, userId, activeScope, currentFolderId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  function openFolder(folder: FolderRow) {
    setCurrentFolderId(folder.id);
    setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
  }

  function goToBreadcrumb(index: number) {
    const crumb = folderPath[index];
    setCurrentFolderId(crumb.id);
    setFolderPath(folderPath.slice(0, index + 1));
  }

  function switchScope(scope: DocumentScope) {
    setActiveScope(scope);
    setCurrentFolderId(null);
    setFolderPath([{ id: null, name: "Home" }]);
  }

  async function createFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    if (!canManageCurrentTree) {
      toast.error("You cannot create folders in this area");
      return;
    }
    if (mode === "admin" && !userId) {
      toast.error("Select a client");
      return;
    }

    setCreatingFolder(true);
    try {
      const res = await fetch("/api/documents/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newFolderName.trim(),
          scope: activeScope,
          parentId: currentFolderId,
          userId: mode === "admin" ? userId : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Could not create folder");
        return;
      }
      toast.success("Folder created");
      setNewFolderName("");
      await loadAll();
    } finally {
      setCreatingFolder(false);
    }
  }

  async function deleteFolder(id: string, name: string) {
    if (!confirm(`Delete folder "${name}" and everything inside it?`)) return;
    const res = await fetch(`/api/documents/folders/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(typeof data.error === "string" ? data.error : "Could not delete folder");
      return;
    }
    toast.success("Folder deleted");
    await loadAll();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !file) {
      toast.error("Add a title and choose a file");
      return;
    }
    if (!canManageCurrentTree) {
      toast.error("You can only upload files in your own uploads area");
      return;
    }
    if (mode === "admin" && !userId) {
      toast.error("Select a client");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("file", file);
    formData.append("scope", activeScope);
    if (category) formData.append("category", category);
    if (currentFolderId) formData.append("folderId", currentFolderId);
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
      toast.success("File uploaded");
      setTitle("");
      setCategory("");
      setFile(null);
      const input = document.getElementById("doc-file-input") as HTMLInputElement | null;
      if (input) input.value = "";
      await loadAll();
    } finally {
      setUploading(false);
    }
  }

  async function onDeleteDoc(id: string) {
    if (!confirm("Remove this file?")) return;
    const res = await fetch(`/api/documents/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(typeof data.error === "string" ? data.error : "Could not delete");
      return;
    }
    toast.success("File removed");
    await loadAll();
  }

  const labelClass = isDark ? "text-navy-200" : "text-navy-700";
  const inputClass = isDark
    ? "border-navy-700 bg-navy-950 text-white"
    : "border-navy-200 bg-white text-navy-900";
  const selectClass = cn("flex h-11 w-full rounded-xl border px-4 text-sm", inputClass);
  const panelClass = isDark
    ? "border-navy-800 bg-navy-900/60"
    : "border-navy-100 bg-white shadow-sm";

  return (
    <div className="space-y-8">
      <div className={cn("rounded-2xl border p-4", panelClass)}>
        <div className="flex flex-wrap gap-2">
          {(["CLIENT", "ADMIN"] as DocumentScope[]).map((scope) => (
            <Button
              key={scope}
              type="button"
              size="sm"
              variant={activeScope === scope ? "default" : "outline"}
              onClick={() => switchScope(scope)}
              className={isDark && activeScope !== scope ? "border-navy-600 text-white" : undefined}
            >
              {SCOPE_LABELS[scope][mode]}
            </Button>
          ))}
        </div>
        <p className={cn("mt-3 text-sm", isDark ? "text-navy-400" : "text-navy-600")}>
          {activeScope === "CLIENT"
            ? "Files you upload for your CA. Create folders to organise bank statements, invoices, KYC, etc."
            : mode === "client"
              ? "Files uploaded by VS Bansal & Associates for you. Download only — your CA manages this area."
              : "Files your team uploads for the client. Create folders to organise deliverables and working papers."}
        </p>
      </div>

      {mode === "admin" && (
        <div className={cn("rounded-2xl border p-4", panelClass)}>
          <Label htmlFor="client" className={labelClass}>
            Client account
          </Label>
          <select
            id="client"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              switchScope(activeScope);
            }}
            className={cn(selectClass, "mt-2")}
          >
            {clients.length === 0 ? (
              <option value="">No clients — add clients in admin</option>
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

      <div className={cn("rounded-2xl border p-4", panelClass)}>
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm">
          {folderPath.map((crumb, i) => (
            <span key={`${crumb.id ?? "root"}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-4 w-4 text-navy-400" />}
              <button
                type="button"
                onClick={() => goToBreadcrumb(i)}
                className={cn(
                  "flex items-center gap-1 rounded px-1.5 py-0.5 font-medium hover:bg-navy-50 dark:hover:bg-navy-800",
                  i === folderPath.length - 1
                    ? isDark
                      ? "text-white"
                      : "text-navy-900"
                    : "text-royal-600"
                )}
              >
                {i === 0 ? <Home className="h-3.5 w-3.5" /> : <Folder className="h-3.5 w-3.5" />}
                {crumb.name}
              </button>
            </span>
          ))}
        </nav>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-navy-900")}>
            Folders & files
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadAll()}
            className={cn("gap-2", isDark && "border-navy-600 text-white")}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {canManageCurrentTree && (
          <form
            onSubmit={createFolder}
            className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <Label htmlFor="new-folder" className={labelClass}>
                New folder
              </Label>
              <Input
                id="new-folder"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. GST FY 2025-26"
                className={inputClass}
              />
            </div>
            <Button type="submit" disabled={creatingFolder} className="gap-2 shrink-0">
              {creatingFolder ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FolderPlus className="h-4 w-4" />
              )}
              Create folder
            </Button>
          </form>
        )}

        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-navy-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : (
          <>
            {folders.length > 0 && (
              <ul className={cn("mb-6 divide-y", isDark ? "divide-navy-800" : "divide-navy-100")}>
                {folders.map((folder) => (
                  <li
                    key={folder.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => openFolder(folder)}
                      className="flex min-w-0 items-center gap-2 text-left font-medium text-royal-600 hover:underline"
                    >
                      <Folder className="h-5 w-5 shrink-0" />
                      <span className="truncate">{folder.name}</span>
                      <span className="text-xs font-normal text-navy-400">
                        {(folder._count?.documents ?? 0) + (folder._count?.children ?? 0)} items
                      </span>
                    </button>
                    {canManageCurrentTree && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600"
                        onClick={() => deleteFolder(folder.id, folder.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {folders.length === 0 && documents.length === 0 && (
              <p className={cn("py-4 text-sm", isDark ? "text-navy-400" : "text-navy-600")}>
                {canManageCurrentTree
                  ? "No folders or files here yet. Create a folder or upload a file below."
                  : "No files here yet. Your CA team will upload documents in this area."}
              </p>
            )}

            {documents.length > 0 && (
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
                      {canManageCurrentTree && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600"
                          onClick={() => onDeleteDoc(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {canManageCurrentTree && (
        <form onSubmit={onSubmit} className={cn("space-y-4 rounded-2xl border p-6", panelClass)}>
          <div>
            <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-navy-900")}>
              Upload file
            </h2>
            <p className={cn("mt-1 text-sm", isDark ? "text-navy-400" : "text-navy-600")}>
              Uploads go into the current folder:{" "}
              <strong>{folderPath[folderPath.length - 1]?.name ?? "Home"}</strong>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
              <Label htmlFor="doc-file-input" className={labelClass}>
                File (PDF, ZIP, images, Excel, Word — max 15 MB)
              </Label>
              <Input
                id="doc-file-input"
                type="file"
                accept=".pdf,.zip,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.doc,.docx,.csv,.txt"
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
                Upload to this folder
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
