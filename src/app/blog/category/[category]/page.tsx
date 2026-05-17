import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories, getPostsByCategory } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return buildMetadata({
    title: `${decoded} — Tax & Compliance Insights`,
    description: `Articles on ${decoded} from V S bansal & associates, chartered accountants in Delhi.`,
    path: `/blog/category/${category}`,
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const posts = getPostsByCategory(decoded);

  if (posts.length === 0) notFound();

  return (
    <div className="pb-24">
      <section className="border-b border-navy-100 bg-white py-12 dark:border-navy-800 dark:bg-navy-950 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: "Blog", href: "/blog" },
              { name: decoded, href: `/blog/category/${category}` },
            ]}
          />
          <h1 className="mt-4 text-3xl font-bold capitalize text-navy-900 dark:text-white">
            {decoded}
          </h1>
          <p className="mt-2 text-navy-600">{posts.length} articles</p>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <Badge variant="navy" className="mb-2">
                    {post.category}
                  </Badge>
                  <h2 className="text-xl font-semibold text-navy-900 group-hover:text-royal-600 dark:text-white">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-navy-600 dark:text-navy-300">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
