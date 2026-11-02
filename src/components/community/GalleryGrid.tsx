import Link from "next/link";
import { notFound } from "next/navigation";
import { SubPage } from "@/components/layout/SubPage";
import { SmartImage } from "@/components/ui/SmartImage";
import { getGalleryPage } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getCareerProgram } from "@/content/career-programs";
import { ListMeta } from "./ListMeta";
import { Pagination } from "./Pagination";

export const galleryDescription = "방과후·늘봄, SW·AI, 드론축구, 과학·문화예술 체험까지 상상마루 교육 현장을 사진으로 만나보세요.";

export async function GalleryGrid({ page }: { page: number }) {
  const data = await getGalleryPage(page);
  if (page > 1 && page > data.totalPages) notFound();
  const base = "/community/gallery";
  return (
    <SubPage path={page === 1 ? base : `${base}/page/${page}`} title="포토갤러리" description={galleryDescription}>
      <ListMeta total={data.total} page={page} totalPages={data.totalPages} />
      {data.items.length === 0 ? (
        <p className="border-y border-line py-20 text-center text-muted">등록된 사진이 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 border-t-2 border-ink pt-8 md:grid-cols-3 md:gap-x-6">
          {data.items.map((g, i) => (
            <li key={g.id}>
              <Link href={`${base}/${g.id}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-line">
                  <SmartImage
                    src={g.imageUrl}
                    alt={g.title}
                    fill
                    priority={i < 3}
                    sizes="(min-width:1024px) 300px, (min-width:768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  {g.imageCount > 1 && (
                    <span className="absolute right-2 top-2 rounded-sm bg-ink/85 px-1.5 py-0.5 text-[13px] font-semibold tabular-nums text-white">
                      {g.imageCount}장
                    </span>
                  )}
                </div>
                <h2 className="mt-4 line-clamp-2 min-h-[2.8em] text-[17px] font-semibold leading-[1.4] text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
                  {g.title}
                </h2>
                <p className="mt-2 flex items-center gap-2 text-[14px] text-muted">
                  등록일
                  <span aria-hidden className="h-2.5 w-px bg-line-strong" />
                  <time dateTime={g.createdAt} className="tabular-nums">{formatDate(g.createdAt)}</time>
                  {g.programSlug && getCareerProgram(g.programSlug) && (
                    <>
                      <span aria-hidden className="h-2.5 w-px bg-line-strong" />
                      <span className="truncate font-medium text-green">{getCareerProgram(g.programSlug)!.title}</span>
                    </>
                  )}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Pagination base={base} page={page} totalPages={data.totalPages} />
    </SubPage>
  );
}
