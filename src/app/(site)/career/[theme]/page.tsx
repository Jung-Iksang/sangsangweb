import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CareerProgramCard } from "@/components/career/CareerProgramCard";
import { PhoneIcon } from "@/components/layout/Header";
import { SubPage } from "@/components/layout/SubPage";
import { site } from "@/config/site";
import { careerOverview, careerThemes, getTheme, programsByTheme } from "@/content/career-programs";
import { photos } from "@/content/photos.generated";
import { getFieldPhotos } from "@/lib/data";
import { courseJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

// 검색엔진에 완성된 HTML·정확한 404 상태를 주기 위해 URL 값을 기다려 서버에서 완전히 렌더링
export const instant = false;

export function generateStaticParams() {
  return careerThemes.map((t) => ({ theme: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/career/[theme]">): Promise<Metadata> {
  const t = getTheme((await params).theme);
  if (!t) return {};
  const list = programsByTheme(t.slug);
  return pageMetadata({
    title: `${t.title} 진로·직업체험`,
    description: `${t.desc} ${list.map((p) => p.title).slice(0, 6).join(" · ")} 등 ${list.length}개 프로그램.`,
    path: `/career/${t.slug}`,
    image: photos[t.image].src,
    keywords: [...t.keywords, "진로체험", "직업체험", "익산 진로체험", "상상마루"],
  });
}

export default async function Page({ params }: PageProps<"/career/[theme]">) {
  const t = getTheme((await params).theme);
  if (!t) notFound();
  const list = programsByTheme(t.slug);
  const field = await getFieldPhotos(t.slug);
  const path = `/career/${t.slug}`;
  const others = careerThemes.filter((x) => x.slug !== t.slug);

  return (
    <SubPage path={path} title={t.title} description={t.desc}>
      <JsonLd data={list.map((p) => courseJsonLd({ name: p.title, description: p.outline.join(", ") || `${t.title} 진로·직업체험`, path: `${path}#${p.slug}` }))} />

      <div className="flex flex-col gap-5 border-b-2 border-ink pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[20px] font-bold text-ink">{t.tagline}</p>
          <p className="mt-1 text-[15px] text-muted">
            프로그램 <strong className="font-bold tabular-nums text-blue">{list.length}</strong>개 · 체험 40분 · 특강 2시간(2교시) · {careerOverview.fee}
          </p>
        </div>
        <a href={`tel:${site.contact.phone}`} className="btn btn-primary btn-sm shrink-0">
          <PhoneIcon /> 체험 신청 문의
        </a>
      </div>

      <nav aria-label={`${t.title} 프로그램 바로가기`} className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {list.map((p) => (
            <li key={p.slug}>
              <a href={`#${p.slug}`} className="block rounded-sm border border-line bg-white px-3 py-1.5 text-[15px] text-body hover:border-blue hover:text-ink">
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        {list.map((p, i) => (
          <CareerProgramCard key={p.slug} program={p} no={i + 1} field={field[p.slug] ?? []} />
        ))}
      </div>

      <p className="mt-8 text-[15px] text-muted">{careerOverview.request}</p>

      <nav aria-labelledby="other-themes" className="mt-16">
        <h2 id="other-themes" className="border-b border-ink pb-4 text-[18px] font-bold text-ink">
          다른 진로·직업체험 분야
        </h2>
        <ul className="grid sm:grid-cols-2 sm:gap-x-10">
          {others.map((o) => (
            <li key={o.slug} className="border-b border-line">
              <Link href={`/career/${o.slug}`} className="group flex items-center justify-between gap-4 py-4">
                <span className="min-w-0">
                  <span className="block font-bold text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">{o.title}</span>
                  <span className="mt-0.5 block truncate text-[14px] text-muted">{o.tagline}</span>
                </span>
                <span className="shrink-0 text-[14px] tabular-nums text-muted">{programsByTheme(o.slug).length}개 →</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </SubPage>
  );
}
