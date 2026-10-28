import Link from "next/link";
import { notFound } from "next/navigation";
import { SubPage } from "@/components/layout/SubPage";
import { SmartImage } from "@/components/ui/SmartImage";
import { getGalleryPage } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Pagination } from "./Pagination";

export const galleryDescription = "방과후·늘봄, SW·AI, 드론축구, 과학·문화예술 체험까지 상상마루 교육 현장을 사진으로 만나보세요.";

export async function GalleryGrid({ page }: { page: number }) {
  const data = await getGalleryPage(page);
  if (page > 1 && page > data.totalPages) notFound();
  const base = "/community/gallery";
  return (
    <SubPage path={page === 1 ? base : `${base}/page/${page}`} title="포토갤러리" description={galleryDescription}>
      {data.items.length === 0 ? (
        <p className="rounded-card border border-line py-20 text-center text-muted">등록된 사진이 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
          {data.items.map((g, i) => (
            <li key={g.id}>
              <Link href={`${base}/${g.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                  <SmartImage
                    src={g.imageUrl}
                    alt={g.title}
                    fill
                    priority={i < 3}
                    sizes="(min-width:1024px) 290px, (min-width:768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h2 className="mt-3 truncate text-[15.5px] font-bold text-ink group-hover:text-primary">{g.title}</h2>
                <time dateTime={g.createdAt} className="text-[13px] text-muted">{formatDate(g.createdAt)}</time>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Pagination base={base} page={page} totalPages={data.totalPages} />
    </SubPage>
  );
}
