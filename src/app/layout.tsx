import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingCta } from "@/components/layout/floating-cta";
import { Providers } from "@/components/providers";
import { Analytics } from "@/components/analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildMetadata,
  combineJsonLd,
  localBusinessJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1220" },
  ],
  width: "device-width",
  initialScale: 1,
};

const globalSchemas = combineJsonLd(
  organizationJsonLd(),
  localBusinessJsonLd(),
  websiteJsonLd()
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen antialiased">
        <JsonLd data={globalSchemas} />
        <Analytics />
        <VercelAnalytics />
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-18">{children}</main>
          <Footer />
          <FloatingCta />
        </Providers>
      </body>
    </html>
  );
}
