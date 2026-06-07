import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/services-data";
import { getAllPostSlugs } from "@/lib/blog";
import { getAllSeoSlugs } from "@/lib/programmatic-seo";
import { getAllCategories, getAllTags } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/blog",
    "/contact",
    "/expertise",
    "/locations",
    "/guides",
    "/careers",
    "/portal/login",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.85,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const keywordSlugs = new Set([
    "best-ca-in-delhi",
    "best-chartered-accountant-india",
    "chartered-accountant-near-me",
  ]);

  const seoRoutes: MetadataRoute.Sitemap = getAllSeoSlugs().map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: keywordSlugs.has(slug)
      ? 0.99
      : slug.startsWith("chartered-accountant-delhi")
        ? 0.98
        : slug.startsWith("chartered-accountant")
          ? 0.95
          : 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map((cat) => ({
    url: `${base}/blog/category/${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${base}/blog/tag/${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...seoRoutes,
    ...blogRoutes,
    ...categoryRoutes,
    ...tagRoutes,
  ];
}
