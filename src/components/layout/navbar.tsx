"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/site-config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappUrl = getWhatsAppUrl();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-navy-100 bg-white/95 shadow-sm backdrop-blur-xl dark:border-navy-800 dark:bg-navy-950/95"
          : "bg-white/80 backdrop-blur-md dark:bg-navy-950/80"
      )}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-royal-600",
                pathname === link.href
                  ? "text-royal-600"
                  : "text-navy-800 dark:text-slate-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-navy-600 hover:bg-navy-100 dark:text-navy-300 dark:hover:bg-navy-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/portal/login">Client Portal</Link>
          </Button>
          <Button variant="whatsapp" size="sm" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Phone className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button asChild>
            <Link href="/contact">Book Consultation</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-navy-700 lg:hidden dark:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-navy-100 bg-white lg:hidden dark:border-navy-800 dark:bg-navy-950"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium",
                    pathname === link.href
                      ? "bg-royal-50 text-royal-700"
                      : "text-navy-800 dark:text-slate-200"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-navy-100 pt-4 dark:border-navy-800">
                <Button variant="outline" asChild>
                  <Link href="/portal/login" onClick={() => setOpen(false)}>
                    Client Portal
                  </Link>
                </Button>
                <Button variant="whatsapp" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Talk on WhatsApp
                  </a>
                </Button>
                <Button asChild>
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Book Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
