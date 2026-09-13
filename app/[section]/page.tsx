import { notFound } from "next/navigation";
import { BlogShell } from "../BlogShell";

const valid = ["archives", "categories", "tags", "about"] as const;
type Section = (typeof valid)[number];
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const titles: Record<string, string> = { archives: "项目与笔记", categories: "分类", tags: "标签", about: "关于我" };
  return { title: titles[section] || "页面未找到" };
}

export function generateStaticParams() {
  return valid.map((section) => ({ section }));
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!valid.includes(section as Section)) notFound();
  return <BlogShell view={section as Section} />;
}
