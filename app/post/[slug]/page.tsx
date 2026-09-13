import { BlogShell } from "../../BlogShell";
import { posts } from "../../content.generated";
import { notFound } from "next/navigation";
import { site } from "../../site.config";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find(item => item.slug === slug);
  if (!post) notFound();
  return { title: post.title, description: post.excerpt, alternates: { canonical: `${site.url}/post/${slug}/` }, openGraph: { title: post.title, description: post.excerpt, type: "article", images: [`${site.url}/og.png`] } };
}

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!posts.some(post => post.slug === slug)) notFound();
  return <BlogShell view="post" slug={slug} />;
}
