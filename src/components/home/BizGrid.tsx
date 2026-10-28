import Link from "next/link";
import Image from "next/image";
import { photos } from "@/content/photos.generated";
import { categoryLabel, getProgram } from "@/content/programs";
import { SectionHead } from "./SectionHead";

const featured = [
  ["education", "afterschool"],
  ["experience", "school"],
  ["experience", "drone-soccer"],
  ["experience", "culture"],
] as const;

const accents = ["text-primary", "text-brand-green-ink", "text-brand-yellow-ink", "text-brand-red-ink"];

export function BizGrid() {
  const items = featured.map(([c, s]) => getProgram(c, s)!);
  return (
    <section aria-labelledby="biz-title" className="bg-surface py-20 md:py-28">
      <div className="container-site">
        <SectionHead
          id="biz-title"
          eyebrow="Programs"
          title="주요 사업"
          desc="2012년부터 학교·지역사회와 함께 운영해 온 상상마루의 대표 프로그램입니다."
          moreHref="/education/afterschool"
          moreLabel="전체 프로그램"
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/${p.category}/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-[0_1px_0_rgb(0_0_0/0.04)] ring-1 ring-line transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={photos[p.image].src} alt={p.title} fill sizes="(min-width:1024px) 280px, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-2 text-[12.5px] font-bold">
                    <span className={accents[i]}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="rounded-full bg-surface px-2.5 py-1 text-muted">{categoryLabel[p.category]}</span>
                  </div>
                  <h3 className="text-[19px] font-bold text-ink group-hover:text-primary">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted">{p.summary}</p>
                  <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-[13.5px] text-body">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex gap-2">
                        <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
