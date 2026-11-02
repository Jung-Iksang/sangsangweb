import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubPage } from "@/components/layout/SubPage";
import { SmartImage } from "@/components/ui/SmartImage";
import { getGalleryIndex, getGalleryItem } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

// 검색엔진에 완성된 HTML·정확한 404 상태를 주기 위해 URL 값을 기다려 서버에서 완전히 렌더링
export const instant = false;

export async function generateStaticParams() {
  const index = await getGalleryIndex();
  return index.length ? index.map((g) => ({ id: String(g.id) })) : [{ id: "0" }];
}

async function load(params: Promise<{ id: string }>) {
  const item = await getGalleryItem(Number((await params).id));
  if (!item) notFound();
  return item;
}

export async function generateMetadata({ params }: PageProps<"/community/gallery/[id]">): Promise<Metadata> {
  const g = await load(params);
  return pageMetadata({
    title: g.title,
    description: g.description || `상상마루 갤러리 - ${g.title} (${formatDate(g.createdAt)})`,
    path: `/community/gallery/${g.id}`,
    image: g.imageUrl.endsWith(".svg") ? null : g.imageUrl,
  });
}

export default async function Page({ params }: PageProps<"/community/gallery/[id]">) {
  const g = await load(params);
  const base = "/community/gallery";
  return (
    <SubPage path={`${base}/${g.id}`} title={g.title}>
      <figure>
        <div className="overflow-hidden rounded-md bg-cream">
          <SmartImage
            src={g.imageUrl}
            alt={g.title}
            width={g.width}
            height={g.height}
            priority
            sizes="(min-width:1024px) 880px, 100vw"
            className="mx-auto h-auto max-h-[78vh] w-auto object-contain"
          />
        </div>
        <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[0.9375rem] text-body">{g.description}</span>
          <time dateTime={g.createdAt} className="text-[0.875rem] text-muted">{formatDate(g.createdAt)}</time>
        </figcaption>
      </figure>
      <nav aria-label="이전·다음 사진" className="mt-10 grid grid-cols-2 gap-3">
        {g.prev ? (
          <Link href={`${base}/${g.prev.id}`} className="group border-t border-ink py-4">
            <span className="text-[0.8125rem] text-muted">‹ 이전 사진</span>
            <p className="truncate font-semibold text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">{g.prev.title}</p>
          </Link>
        ) : <span />}
        {g.next ? (
          <Link href={`${base}/${g.next.id}`} className="group border-t border-ink py-4 text-right">
            <span className="text-[0.8125rem] text-muted">다음 사진 ›</span>
            <p className="truncate font-semibold text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">{g.next.title}</p>
          </Link>
        ) : <span />}
      </nav>
      <div className="mt-8 flex justify-center">
        <Link href={base} className="btn btn-outline px-10">
          목록으로
        </Link>
      </div>
    </SubPage>
  );
}
