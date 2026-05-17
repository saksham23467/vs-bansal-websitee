"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
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
            <p className="text-xs text-navy-500">Share this with the client for first login.</p>
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
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-navy-500">Loading…</p>
        ) : clients.length === 0 ? (
          <p className="text-sm text-navy-500">No clients yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-navy-100">
            {clients.map((c) => (
              <li key={c.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-navy-900">{c.name ?? "—"}</p>
                  <p className="text-sm text-navy-600">{c.email}</p>
                  {c.company && <p className="text-xs text-navy-500">{c.company}</p>}
                </div>
                <p className="text-xs text-navy-400">
                  {c._count?.documents ?? 0} document(s)
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
