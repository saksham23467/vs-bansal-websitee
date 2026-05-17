import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

type Props = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return buildMetadata({
    title: `Tag: ${decoded}`,
    description: `Blog posts tagged "${decoded}" — V S bansal & associates.`,
    path: `/blog/tag/${tag}`,
  });
}

export default async function BlogTagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) notFound();

  return (
    <div className="pb-24">
      <section className="border-b border-navy-100 bg-white py-12 dark:border-navy-800 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: "Blog", href: "/blog" },
              { name: `#${decoded}`, href: `/blog/tag/${tag}` },
            ]}
          />
          <h1 className="mt-4 text-3xl font-bold text-navy-900 dark:text-white">#{decoded}</h1>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="text-xl font-semibold text-royal-600 hover:underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
