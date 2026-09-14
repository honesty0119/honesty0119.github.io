import { notFound } from "next/navigation";
import { BlogShell } from "../../BlogShell";
import { experiences } from "../../content.generated";
import { site } from "../../site.config";

export function generateStaticParams() {
  return experiences.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = experiences.find(item => item.slug === slug);
  if (!detail) notFound();
  return { title: `${detail.title} · 实习经历`, description: detail.excerpt, alternates: { canonical: `${site.url}/experience/${slug}/` } };
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!experiences.some(item => item.slug === slug)) notFound();
  return <BlogShell view="experience" slug={slug} />;
}
