import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, MessageSquare, ClipboardList } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/portal", label: "Overview", icon: LayoutDashboard },
  { href: "/portal/documents", label: "Documents", icon: FileText },
  { href: "/portal#compliance", label: "Compliance", icon: ClipboardList },
  { href: "/portal#messages", label: "Messages", icon: MessageSquare },
];

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }

  return (
    <div className="min-h-screen bg-navy-50/80 dark:bg-navy-950">
      <div className="mx-auto flex max-w-7xl gap-0 px-4 py-8 sm:px-6 lg:gap-8 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 space-y-2 rounded-2xl border border-navy-100 bg-white p-4 dark:border-navy-800 dark:bg-navy-900/60">
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-navy-400">Portal</p>
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800"
                  )}
                >
                  <item.icon className="h-4 w-4 text-royal-600" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <form
              className="pt-4"
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="outline" className="w-full justify-start gap-2" size="sm">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
