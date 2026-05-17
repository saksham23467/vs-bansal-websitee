"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ClipboardList,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/portal", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/portal/documents", label: "Documents", icon: FileText },
  { href: "/portal#compliance", label: "Compliance", icon: ClipboardList },
  { href: "/portal#messages", label: "Messages", icon: MessageSquare },
];

export function PortalShell({
  children,
  signOutAction,
}: {
  children: React.ReactNode;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-navy-50/80 pb-24 dark:bg-navy-950 lg:pb-8">
      <div className="mx-auto flex max-w-7xl gap-0 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8 lg:py-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 space-y-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm dark:border-navy-800 dark:bg-navy-900/60">
            <div className="border-b border-navy-100 px-2 pb-3 dark:border-navy-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                Client portal
              </p>
              {session?.user?.email && (
                <p className="mt-1 truncate text-sm font-medium text-navy-800 dark:text-navy-200">
                  {session.user.name ?? session.user.email}
                </p>
              )}
            </div>
            <nav className="flex flex-col gap-1">
              {nav.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-royal-600 text-white"
                        : "text-navy-700 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  href="/admin/documents"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-royal-700 hover:bg-royal-50 dark:text-royal-400 dark:hover:bg-navy-800"
                >
                  <Shield className="h-4 w-4" />
                  Admin panel
                </Link>
              )}
            </nav>
            <form action={signOutAction} className="border-t border-navy-100 pt-3 dark:border-navy-800">
              <Button type="submit" variant="outline" className="w-full justify-start gap-2" size="sm">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-navy-200 bg-white/95 backdrop-blur-lg lg:hidden dark:border-navy-800 dark:bg-navy-950/95">
        {nav.slice(0, 2).map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium",
                active ? "text-royal-600" : "text-navy-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin/documents"
            className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium text-royal-600"
          >
            <Shield className="h-5 w-5" />
            Admin
          </Link>
        )}
      </nav>
    </div>
  );
}
