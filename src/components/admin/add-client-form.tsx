"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ClientRow = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  portalPassword: string | null;
  createdAt: string;
  _count?: { documents: number };
};

export function AddClientForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Client@123");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, phone, company }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Could not create client");
        return;
      }
      toast.success(`Client ${data.client.email} created`);
      setName("");
      setEmail("");
      setPassword("Client@123");
      setPhone("");
      setCompany("");
      onCreated?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5 text-royal-600" />
          Add new client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="client-name">Full name</Label>
            <Input
              id="client-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">Login email</Label>
            <Input
              id="client-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-password">Portal password</Label>
            <Input
              id="client-password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-navy-500">Stored for your reference and used for client login.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-phone">Phone (optional)</Label>
            <Input
              id="client-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 …"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="client-company">Company (optional)</Label>
            <Input
              id="client-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Pvt Ltd name"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create client account
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ClientRowActions({
  client,
  onUpdated,
}: {
  client: ClientRow;
  onUpdated: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const passwordLabel =
    client.portalPassword ??
    "(not on file — set a new password to store it for reference)";

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Could not update password");
        return;
      }
      toast.success(`Password updated for ${client.email}`);
      setNewPassword("");
      setEditingPassword(false);
      onUpdated();
    } finally {
      setSaving(false);
    }
  }

  async function deleteClient() {
    const docCount = client._count?.documents ?? 0;
    const msg =
      docCount > 0
        ? `Delete ${client.email}? This removes their account and ${docCount} document(s) permanently.`
        : `Delete ${client.email}? This cannot be undone.`;
    if (!window.confirm(msg)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Could not delete client");
        return;
      }
      toast.success(`Removed ${client.email}`);
      onUpdated();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:items-end">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-navy-500">Portal password:</span>
        <code className="rounded bg-navy-50 px-2 py-1 text-xs text-navy-800 dark:bg-navy-800 dark:text-navy-100">
          {showPassword ? passwordLabel : "••••••••"}
        </code>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2"
          onClick={() => setShowPassword((v) => !v)}
          disabled={!client.portalPassword}
          title={client.portalPassword ? "Show or hide password" : "No password on file"}
        >
          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showPassword ? "Hide" : "View"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2"
          onClick={() => {
            setEditingPassword((v) => !v);
            setNewPassword("");
          }}
        >
          <KeyRound className="h-3.5 w-3.5" />
          Change
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={deleteClient}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          Delete
        </Button>
      </div>

      {editingPassword && (
        <form
          onSubmit={changePassword}
          className="flex w-full flex-col gap-2 sm:max-w-xs sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <Label htmlFor={`pw-${client.id}`} className="text-xs">
              New password
            </Label>
            <Input
              id={`pw-${client.id}`}
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              minLength={6}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setEditingPassword(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export function ClientList({ refreshKey }: { refreshKey: number }) {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients", { credentials: "include" });
      const data = await res.json();
      setClients(res.ok ? (data.clients ?? []) : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Portal clients ({clients.length})</CardTitle>
        <p className="text-sm text-navy-500">
          Passwords are saved when you create or reset them. Older accounts may need a password reset
          once to appear here.
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-navy-500">Loading…</p>
        ) : clients.length === 0 ? (
          <p className="text-sm text-navy-500">No clients yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-navy-100 dark:divide-navy-800">
            {clients.map((c) => (
              <li key={c.id} className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-navy-900 dark:text-white">{c.name ?? "—"}</p>
                    <p className="text-sm text-navy-600 dark:text-navy-300">{c.email}</p>
                    {c.company && <p className="text-xs text-navy-500">{c.company}</p>}
                    <p className="mt-1 text-xs text-navy-400">
                      {c._count?.documents ?? 0} document(s)
                    </p>
                  </div>
                  <ClientRowActions client={c} onUpdated={load} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
