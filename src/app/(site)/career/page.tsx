import Image from "next/image";
import Link from "next/link";
import { SubPage } from "@/components/layout/SubPage";
import { PhoneIcon } from "@/components/layout/Header";
import { careerCredentials } from "@/content/career";
import { careerOverview, careerProgramHref, careerPrograms, careerThemes, formatLabel, getTheme, programsByTheme } from "@/content/career-programs";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "진로·직업체험",
  description: `교육부 인증 교육기부 진로체험기관 상상마루의 진로·진학·직업체험. AI·코딩, 드론, 3D·메이커, VR·AR, 백제문화유산, 공예, 직업탐색, 과학까지 ${careerThemes.length}개 분야 ${careerPrograms.length}개 프로그램을 체험(40분)·특강(2시간)으로 운영합니다.`,
  path: "/career",
  keywords: ["진로체험", "직업체험", "진로특강", "교육기부 진로체험기관", "익산 진로체험", "찾아가는 진로체험", "4차산업 진로체험", "자유학기 진로체험"],
});

export default function Page() {
  return (
    <SubPage path="/career" title="진로·직업체험" description={careerOverview.mission}>
      <div className="space-y-20">
        <section aria-labelledby="goal">
          <p className="num">목표</p>
          <h2 id="goal" className="t-h2 mt-2">{careerOverview.goal}</h2>
          <dl className="mt-8 grid grid-cols-2 divide-line border-y border-line md:grid-cols-4 md:divide-x">
            {[
              { k: `${careerPrograms.length}개`, v: "진로·직업체험 프로그램" },
              { k: `${careerThemes.length}개 분야`, v: "AI·드론·메이커·VR·문화유산·공예·직업·과학" },
              { k: "40분 · 2시간", v: "체험 1차시 · 특강 2교시" },
              { k: `${careerOverview.instructors}명`, v: "전문 강사진" },
            ].map((s) => (
              <div key={s.v} className="py-6 pr-4 md:px-6 md:first:pl-0">
                <dt className="sr-only">{s.v}</dt>
                <dd className="text-[26px] font-extrabold tracking-tight text-blue">{s.k}</dd>
                <dd className="mt-1 text-[15px] leading-snug text-muted">{s.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Block no="01" id="themes" title="분야별 프로그램" desc="분야를 고르면 프로그램별 수업 내용과 사진, 강사들이 올린 현장 사진을 볼 수 있습니다.">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
            {careerThemes.map((t, i) => (
              <li key={t.slug}>
                <Link href={`/career/${t.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-cream">
                    <Image
                      src={photos[t.image].src}
                      alt={`${t.title} 진로·직업체험`}
                      fill
                      priority={i < 3}
                      sizes="(min-width:1024px) 290px, (min-width:768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="mt-4 flex items-baseline justify-between gap-2 text-[19px] font-bold text-ink">
                    <span className="group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">{t.title}</span>
                    <span className="shrink-0 text-[14px] font-medium tabular-nums text-muted">{programsByTheme(t.slug).length}개</span>
                  </h3>
                  <p className="mt-1 text-[15px] leading-snug text-muted">{t.tagline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Block>

        <Block no="02" id="all-programs" title="전체 프로그램" desc={`${careerOverview.fee} ${careerOverview.request}`}>
          <div className="overflow-x-auto border-t-2 border-ink">
            <table className="w-full text-left text-[16px]">
              <caption className="sr-only">진로·직업체험 전체 프로그램</caption>
              <thead className="bg-cream text-[14px] text-muted">
                <tr className="border-b border-line-strong">
                  <th scope="col" className="w-14 py-3 pl-3 font-semibold">번호</th>
                  <th scope="col" className="py-3 pr-3 font-semibold">프로그램</th>
                  <th scope="col" className="hidden py-3 pr-3 font-semibold sm:table-cell">분야</th>
                  <th scope="col" className="hidden py-3 pr-3 font-semibold md:table-cell">운영</th>
                </tr>
              </thead>
              <tbody>
                {careerThemes.flatMap((t) => programsByTheme(t.slug)).map((p, i) => (
                  <tr key={p.slug} className="border-b border-line hover:bg-cream">
                    <td className="py-3 pl-3 tabular-nums text-muted">{i + 1}</td>
                    <td className="py-3 pr-3">
                      <Link href={careerProgramHref(p)} className="font-semibold text-ink hover:underline hover:decoration-line-strong hover:underline-offset-4">
                        {p.title}
                      </Link>
                      {p.job && <span className="ml-2 text-[14px] text-muted">{p.job}</span>}
                      <span className="mt-0.5 block text-[14px] text-muted sm:hidden">{getTheme(p.theme)?.title}</span>
                    </td>
                    <td className="hidden py-3 pr-3 text-body sm:table-cell">{getTheme(p.theme)?.title}</td>
                    <td className="hidden whitespace-nowrap py-3 pr-3 text-[15px] text-body md:table-cell">
                      {p.formats ? p.formats.map((f) => formatLabel[f]).join(" · ") : "학교와 협의"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block no="03" id="credentials" title="믿을 수 있는 진로체험기관">
          <ul className="grid border-t border-ink sm:grid-cols-2 sm:gap-x-10">
            {careerCredentials.map((c) => {
              const img = photos[c.photo];
              return (
                <li key={c.title} className="flex gap-5 border-b border-line py-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-line bg-white">
                    <Image src={img.src} alt={c.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-ink">{c.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{c.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Block>

        <div className="flex flex-col items-start gap-5 rounded-md border border-line bg-cream p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="t-h3">학교·기관 맞춤 진로·직업체험 상담</p>
            <p className="mt-1 text-muted">{careerOverview.request}</p>
          </div>
          <a href={`tel:${site.contact.phone}`} className="btn btn-primary">
            <PhoneIcon /> {site.contact.phone}
          </a>
        </div>
      </div>
    </SubPage>
  );
}

function Block({ no, id, title, desc, children }: { no: string; id: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <p className="num">{no}</p>
      <h2 id={id} className="mt-2 text-[24px] font-bold tracking-tight text-ink">{title}</h2>
      {desc && <p className="mt-2 text-muted">{desc}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}
