import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { BrandMark } from "@/components/layout/brand-mark";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      <div className="relative shrink-0 transition-transform group-hover:scale-105">
        <BrandMark size={48} priority className="drop-shadow-sm" />
      </div>
      <div className="hidden sm:block">
        <p className="text-base font-bold leading-tight text-navy-900 dark:text-slate-50">
          {siteConfig.shortName}
        </p>
        <p className="text-xs font-medium text-navy-600 dark:text-slate-400">Chartered Accountants</p>
      </div>
    </Link>
  );
}
