import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, FileText, LogOut, Shield } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin#leads", label: "Leads", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="mx-auto flex max-w-7xl gap-0 px-4 py-8 sm:px-6 lg:gap-10 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 space-y-3 rounded-2xl border border-navy-800 bg-navy-900/80 p-4">
            <div className="flex items-center gap-2 px-2">
              <Shield className="h-5 w-5 text-royal-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-navy-300">Admin</p>
            </div>
            <nav className="flex flex-col gap-1">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-navy-200 hover:bg-navy-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4 text-royal-400" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full justify-start gap-2 border-navy-600 bg-transparent text-white hover:bg-navy-800"
                size="sm"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
