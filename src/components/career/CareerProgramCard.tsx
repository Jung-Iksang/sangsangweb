import Image from "next/image";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatLabel, programPhotos, type CareerProgram } from "@/content/career-programs";
import { photos } from "@/content/photos.generated";
import type { FieldPhoto } from "@/lib/data";
import { formatDate } from "@/lib/format";

/** 진로·직업체험 분류 페이지의 프로그램 한 개 — 자료 사진 + 수업 내용 + 강사 현장 사진(누적) */
export function CareerProgramCard({ program: p, no, field }: { program: CareerProgram; no: number; field: FieldPhoto[] }) {
  const [cover, ...rest] = programPhotos(p);
  const thumbs = rest.slice(0, 2);
  const num = String(no).padStart(2, "0");

  return (
    <article id={p.slug} aria-labelledby={`${p.slug}-title`} className="scroll-mt-[calc(var(--header-h)+72px)] border-b border-line py-10 first:pt-8">
      <div className={cover ? "grid gap-7 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-10" : ""}>
        {cover && (
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-cream">
              <Image src={photos[cover].src} alt={`${p.title} 체험 사진`} fill sizes="(min-width:768px) 320px, 100vw" className="object-cover" />
            </div>
            {thumbs.length > 0 && (
              <ul className="mt-2 grid grid-cols-2 gap-2">
                {thumbs.map((name, i) => (
                  <li key={name} className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line bg-cream">
                    <Image src={photos[name].src} alt={`${p.title} 체험 사진 ${i + 2}`} fill sizes="(min-width:768px) 160px, 50vw" className="object-cover" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="min-w-0">
          <p className="num">{num}</p>
          <h2 id={`${p.slug}-title`} className="mt-1.5 text-[22px] font-bold leading-snug tracking-tight text-ink md:text-[24px]">
            {p.title}
          </h2>
          {(p.job || p.tagline) && (
            <p className="mt-1.5 text-[16px] text-muted">
              {p.job && <span className="font-semibold text-green">{p.job}</span>}
              {p.job && p.tagline && <span aria-hidden className="mx-2 inline-block h-3 w-px bg-line-strong align-middle" />}
              {p.tagline}
            </p>
          )}
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="운영 형태">
            {(p.formats ?? []).map((f) => (
              <li key={f} className="rounded-sm border border-line-strong bg-white px-2.5 py-1 text-[14px] font-semibold text-ink">
                {formatLabel[f]}
              </li>
            ))}
            {!p.formats && <li className="rounded-sm border border-line bg-cream px-2.5 py-1 text-[14px] text-body">운영 시간 학교와 협의</li>}
          </ul>
          {p.outline.length > 0 ? (
            <ul className="mt-5 space-y-1.5 text-[16px] leading-relaxed text-body">
              {p.outline.map((o) => (
                <li key={o} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-green" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-[16px] leading-relaxed text-muted">세부 내용은 학년·인원·시간에 맞춰 학교와 협의해 구성합니다.</p>
          )}
        </div>
      </div>

      {field.length > 0 && (
        <section aria-labelledby={`${p.slug}-field`} className="mt-8">
          <h3 id={`${p.slug}-field`} className="flex items-baseline gap-2 text-[17px] font-bold text-ink">
            현장 사진 <span className="text-[14px] font-medium tabular-nums text-muted">최근 {field.length}장</span>
          </h3>
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {field.map((f, i) => (
              <li key={f.imageUrl + i}>
                <Link href={`/community/gallery/${f.albumId}`} className="group block" title={`${f.albumTitle} (${formatDate(f.createdAt)})`}>
                  <div className="relative aspect-square overflow-hidden rounded-sm bg-cream">
                    <SmartImage
                      src={f.imageUrl}
                      alt={`${p.title} 현장 사진 - ${f.albumTitle}`}
                      fill
                      sizes="(min-width:1024px) 140px, (min-width:640px) 25vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
