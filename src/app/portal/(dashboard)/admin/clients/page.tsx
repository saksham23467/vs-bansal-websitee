"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddClientForm, ClientList } from "@/components/admin/add-client-form";

export default function PortalAdminClientsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Manage clients</h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          Create portal logins for clients. They can sign in at{" "}
          <Link href="/portal/login" className="font-medium text-royal-600 hover:underline">
            /portal/login
          </Link>{" "}
          with the email and password you set.
        </p>
      </div>

      <AddClientForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <ClientList refreshKey={refreshKey} />

      <Button asChild variant="outline">
        <Link href="/portal/admin">Back to admin overview</Link>
      </Button>
    </div>
  );
}
