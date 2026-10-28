import { getLatestGallery } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { GalleryCarousel } from "./GalleryCarousel";
import { SectionHead } from "./SectionHead";

export async function GallerySection() {
  const items = await getLatestGallery(10);
  const dates = Object.fromEntries(items.map((g) => [g.id, formatDate(g.createdAt)]));
  return (
    <section aria-labelledby="gallery-title" className="py-20 md:py-28">
      <div className="container-site">
        <SectionHead id="gallery-title" eyebrow="Gallery" title="포토갤러리" desc="상상마루 교육 현장의 생생한 순간들" moreHref="/community/gallery" />
        {items.length === 0 ? (
          <p className="rounded-card bg-surface py-16 text-center text-muted">등록된 사진이 없습니다.</p>
        ) : (
          <GalleryCarousel items={items} dates={dates} />
        )}
      </div>
    </section>
  );
}
