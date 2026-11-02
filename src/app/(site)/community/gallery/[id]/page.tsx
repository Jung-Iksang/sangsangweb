import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailHead } from "@/components/community/DetailHead";
import { PrevNext } from "@/components/community/PrevNext";
import { SubPage } from "@/components/layout/SubPage";
import { SmartImage } from "@/components/ui/SmartImage";
import { getGalleryIndex, getGalleryItem } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { imageGalleryJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { careerProgramHref, getCareerProgram, getTheme } from "@/content/career-programs";

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
    description: g.description || `상상마루 포토갤러리 - ${g.title} (${formatDate(g.createdAt)})`,
    path: `/community/gallery/${g.id}`,
    image: g.imageUrl.endsWith(".svg") ? null : g.imageUrl,
  });
}

export default async function Page({ params }: PageProps<"/community/gallery/[id]">) {
  const g = await load(params);
  const base = "/community/gallery";
  const path = `${base}/${g.id}`;
  const program = g.programSlug ? getCareerProgram(g.programSlug) : undefined;
  return (
    <SubPage path={path} title={g.title} bandTitle="포토갤러리">
      <JsonLd
        data={imageGalleryJsonLd({ title: g.title, description: g.description, path, datePublished: g.createdAt, images: g.images })}
      />
      <article>
        <DetailHead title={g.title} createdAt={g.createdAt} />
        <div className="border-b border-line px-1 py-10 md:px-4">
          {g.description && <p className="mb-8 text-[1.0625rem] leading-relaxed text-body">{g.description}</p>}
          {program && (
            <p className="mb-8">
              <Link href={careerProgramHref(program)} className="link-more">
                진로·직업체험 {getTheme(program.theme)?.title} · {program.title} 프로그램 보기 <span aria-hidden>→</span>
              </Link>
            </p>
          )}
          <div className="mx-auto max-w-[880px] space-y-2">
            {g.images.map((im, i) => (
              <SmartImage
                key={im.imageUrl + i}
                src={im.imageUrl}
                alt={g.images.length > 1 ? `${g.title} (${i + 1}/${g.images.length})` : g.title}
                width={im.width}
                height={im.height}
                priority={i === 0}
                sizes="(min-width:1024px) 880px, 100vw"
                className="h-auto w-full bg-cream"
              />
            ))}
          </div>
        </div>
      </article>
      <div className="mt-10 flex justify-center">
        <Link href={base} className="btn btn-dark px-10">
          목록
        </Link>
      </div>
      <PrevNext prev={g.prev} next={g.next} base={base} />
    </SubPage>
  );
}
