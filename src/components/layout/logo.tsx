import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

const LOGO_SRC = "/ca-india-logo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-navy-100 transition-transform group-hover:scale-105 dark:ring-navy-700">
        <Image
          src={LOGO_SRC}
          alt={`${siteConfig.shortName} — CA India`}
          width={44}
          height={44}
          className="h-full w-full object-contain p-0.5"
          priority
        />
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
