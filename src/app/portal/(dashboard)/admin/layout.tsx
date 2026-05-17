import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";

export default async function PortalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login?callbackUrl=/portal/admin");
  }
  if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.STAFF) {
    redirect("/portal");
  }
  return <>{children}</>;
}
