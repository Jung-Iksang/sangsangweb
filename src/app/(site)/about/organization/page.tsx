import Image from "next/image";
import { SubPage } from "@/components/layout/SubPage";
import { mous, organization } from "@/content/about";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "조직·인증",
  description:
    "상상마루 조직도와 인증 현황 — 교육부 교육기부 진로체험 인증기관, 전북 예비사회적기업, 벤처기업, 기업부설연구소 상상연구소, 익산시 우수 진로체험기관, 업무협약 기관.",
  path: "/about/organization",
  keywords: ["상상마루 인증", "교육기부 진로체험 인증기관", "예비사회적기업", "벤처기업", "기업부설연구소"],
});

export default function Page() {
  return (
    <SubPage path="/about/organization" title="조직·인증" description="상상마루의 조직과 공식 인증·지정 현황입니다.">
      <div className="space-y-20">
        <Block no="01" id="org" title="조직도">
          <div className="flex flex-col items-center">
            <div className="rounded-sm bg-ink px-12 py-4 text-[1.0625rem] font-bold text-on-ink">{organization.ceo}</div>
            <div aria-hidden className="h-7 w-px bg-line-strong" />
            <div className="rounded-sm border border-green bg-white px-6 py-3 text-[0.9375rem] font-bold text-green">{organization.lab}</div>
            <div aria-hidden className="h-7 w-px bg-line-strong" />
            <ul className="grid w-full grid-cols-2 gap-3 border-t border-line-strong pt-7 sm:grid-cols-3 lg:grid-cols-5">
              {organization.teams.map((t) => (
                <li key={t} className="rounded-sm border border-line bg-white px-3 py-3.5 text-center text-[0.9375rem] font-semibold text-ink">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Block>

        <Block no="02" id="certs" title="인증 · 지정">
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {site.certifications.map((c) => {
              const img = photos[c.photo];
              return (
                <li key={c.name}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-white">
                    <Image src={img.src} alt={`${c.name} 인증서`} fill sizes="(min-width:1024px) 280px, 50vw" className="object-contain p-4" />
                  </div>
                  <p className="num mt-4">{c.period}</p>
                  <h3 className="mt-1 text-[1.0625rem] font-bold text-ink">{c.name}</h3>
                  <p className="mt-1 text-[0.84375rem] text-muted">{c.issuer}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-8 border-t border-line pt-6 text-[0.875rem] leading-relaxed text-muted">
            이 밖에 중소기업(소상공인) 확인, 통신판매업 신고({site.business.mailOrderNo}), 출판사 신고, 소프트웨어사업자 신고를 마쳤습니다.
          </p>
        </Block>

        <Block no="03" id="mou" title="업무협약 (MOU)">
          <ul className="grid border-t border-ink sm:grid-cols-2 sm:gap-x-10">
            {mous.items.map((m) => (
              <li key={m.partner} className="flex items-center justify-between border-b border-line py-4">
                <span className="font-bold text-ink">{m.partner}</span>
                <span className="text-[0.875rem] text-muted">{m.kind}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.875rem] text-muted">대학·기관·기업과 총 {mous.total}건의 협약을 맺고 함께 교육 프로그램을 운영합니다.</p>
        </Block>

        <Block no="04" id="info" title="기관 정보">
          <dl className="border-t border-ink">
            {[
              ["단체명", site.legalName],
              ["대표", site.business.ceo],
              ["등록일", "2013년 2월 1일 (전신: 창의융합교육연구회, 2012년 3월 2일 창립)"],
              ["사업자등록번호", site.business.registrationNo],
              ["법인등록번호", site.business.corporateNo],
              ["설립목적", "취약계층에게 지속적인 일자리를 제공하고 지역사회와의 연대활동 및 공익활동에 적극 기여하여 지역주민의 경제적 안정과 자립기반을 높임"],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <dt className="font-bold text-ink">{k}</dt>
                <dd className="text-body">{v}</dd>
              </div>
            ))}
          </dl>
        </Block>
      </div>
    </SubPage>
  );
}

function Block({ no, id, title, children }: { no: string; id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <p className="num">{no}</p>
      <h2 id={id} className="type-subsection-title mb-8 mt-2 text-ink">{title}</h2>
      {children}
    </section>
  );
}
