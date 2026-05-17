import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Tax, GST, ROC, and startup compliance insights from V S bansal & associates.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pb-24">
      <section className="gradient-hero relative overflow-hidden border-b border-navy-100 pb-14 pt-28 dark:border-navy-800 lg:pb-20 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl dark:text-white">Insights</h1>
            <p className="mt-4 max-w-2xl text-lg text-navy-600 dark:text-navy-300">
              Practical notes for founders, finance leads, and operators navigating Indian regulation.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Library" title="Latest articles" align="left" className="mb-12" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={(i % 3) * 0.05}>
              <Card className="h-full transition-all hover:border-royal-500/35 hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-navy-500">
                    <Badge variant="navy">{post.category}</Badge>
                    <span>{post.date}</span>
                    <span className="text-navy-400">·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <CardTitle className="text-xl leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-royal-600">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-base">{post.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
