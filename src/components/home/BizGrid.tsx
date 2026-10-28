import Image from "next/image";
import Link from "next/link";
import { photos } from "@/content/photos.generated";
import { categoryLabel, getProgram } from "@/content/programs";
import { SectionHead } from "./SectionHead";

const featured = [
  ["education", "afterschool"],
  ["experience", "school"],
  ["experience", "drone-soccer"],
  ["experience", "culture"],
] as const;

export function BizGrid() {
  const items = featured.map(([c, s]) => getProgram(c, s)!);
  return (
    <section aria-labelledby="biz-title" className="bg-cream py-20 md:py-28">
      <div className="container-site">
        <SectionHead
          no="02"
          id="biz-title"
          title="주요 사업"
          desc="2012년부터 학교·지역사회와 함께 운영해 온 상상마루의 대표 프로그램입니다."
          moreHref="/education/afterschool"
          moreLabel="전체 프로그램"
        />
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/${p.category}/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-line">
                  <Image
                    src={photos[p.image].src}
                    alt={p.title}
                    fill
                    sizes="(min-width:1024px) 270px, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="num mt-5">
                  {String(i + 1).padStart(2, "0")} <span className="ml-1.5 text-muted">{categoryLabel[p.category]}</span>
                </p>
                <h3 className="t-h3 mt-2 group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-[6px]">{p.title}</h3>
                <p className="mt-3 line-clamp-3 text-[14.5px] leading-relaxed text-muted">{p.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
