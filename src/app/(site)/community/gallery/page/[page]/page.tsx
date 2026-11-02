import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryGrid, galleryDescription } from "@/components/community/GalleryGrid";
import { getGalleryPage } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

// 검색엔진에 완성된 HTML·정확한 404 상태를 주기 위해 URL 값을 기다려 서버에서 완전히 렌더링
export const instant = false;

export async function generateStaticParams() {
  const { totalPages } = await getGalleryPage(1);
  const params = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }));
  return params.length ? params : [{ page: "2" }];
}

function parse(page: string) {
  const n = Number(page);
  if (!Number.isInteger(n) || n < 2) notFound();
  return n;
}

export async function generateMetadata({ params }: PageProps<"/community/gallery/page/[page]">): Promise<Metadata> {
  const page = parse((await params).page);
  return pageMetadata({ title: `갤러리 ${page}페이지`, description: galleryDescription, path: `/community/gallery/page/${page}` });
}

export default async function Page({ params }: PageProps<"/community/gallery/page/[page]">) {
  const page = parse((await params).page);
  return <GalleryGrid page={page} />;
}
