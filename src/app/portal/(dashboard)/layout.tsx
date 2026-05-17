import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { PortalShell } from "@/components/portal/portal-shell";

async function signOutPortal() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }

  return <PortalShell signOutAction={signOutPortal}>{children}</PortalShell>;
}
