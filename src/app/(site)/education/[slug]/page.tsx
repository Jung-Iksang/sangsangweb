import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProgramPage } from "@/components/ProgramPage";
import { getProgram, programsBy } from "@/content/programs";
import { pageMetadata } from "@/lib/seo";

// 검색엔진에 완성된 HTML·정확한 404 상태를 주기 위해 URL 값을 기다려 서버에서 완전히 렌더링
export const instant = false;

export function generateStaticParams() {
  return programsBy("education").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/education/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProgram("education", slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.summary, path: `/education/${p.slug}`, keywords: p.keywords });
}

export default async function Page({ params }: PageProps<"/education/[slug]">) {
  const { slug } = await params;
  const program = getProgram("education", slug);
  if (!program) notFound();
  return <ProgramPage program={program} />;
}
