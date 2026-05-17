import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { getTelHref, getWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

const whatsappUrl = getWhatsAppUrl("Hello, I would like to consult V S bansal & associates.");

export function LocalBusinessBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-navy-100 bg-white p-6 dark:border-navy-800 dark:bg-navy-900"
          : "rounded-3xl border border-navy-100 bg-gradient-to-br from-navy-50 to-white p-8 lg:p-10 dark:border-navy-800 dark:from-navy-900 dark:to-navy-950"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <span className="text-sm font-semibold text-navy-800 dark:text-white">
          {siteConfig.rating.value}/5 · {siteConfig.rating.count}+ Google reviews
        </span>
      </div>
      <h2 className="mt-4 text-xl font-bold text-navy-900 dark:text-white">
        Visit our Delhi head office
      </h2>
      <ul className="mt-4 space-y-3 text-sm text-navy-600 dark:text-navy-300">
        <li className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" />
          <span>{siteConfig.address.full}</span>
        </li>
        <li className="flex gap-3">
          <Phone className="h-4 w-4 shrink-0 text-royal-600" />
          <a href={getTelHref()} className="hover:text-royal-600">
            {siteConfig.phoneDisplay}
          </a>
        </li>
        <li className="flex gap-3">
          <Mail className="h-4 w-4 shrink-0 text-royal-600" />
          <a href={`mailto:${siteConfig.email}`} className="hover:text-royal-600">
            {siteConfig.email}
          </a>
        </li>
        <li className="flex gap-3">
          <Clock className="h-4 w-4 shrink-0 text-royal-600" />
          <span>Mon–Fri 10 AM–7 PM · Sat 10 AM–3 PM</span>
        </li>
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <a href={getTelHref()}>Call now</a>
        </Button>
        <Button variant="whatsapp" asChild>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Book consultation</Link>
        </Button>
      </div>
    </div>
  );
}
