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
      <div className="space-y-16">
        <section aria-labelledby="org">
          <h2 id="org" className="mb-8 text-[24px] font-bold text-ink">조직도</h2>
          <div className="flex flex-col items-center">
            <div className="rounded-2xl bg-brand-green-ink px-10 py-4 text-[18px] font-bold text-white">{organization.ceo}</div>
            <div aria-hidden className="h-6 w-0.5 bg-line" />
            <div className="flex w-full items-center justify-center gap-4">
              <div aria-hidden className="hidden h-0.5 flex-1 sm:block" />
              <div className="rounded-2xl border-2 border-brand-red-ink bg-white px-6 py-3 text-[15px] font-bold text-brand-red-ink">
                {organization.lab}
              </div>
            </div>
            <div aria-hidden className="h-6 w-0.5 bg-line" />
            <ul className="grid w-full grid-cols-2 gap-3 border-t-2 border-line pt-6 sm:grid-cols-3 lg:grid-cols-5">
              {organization.teams.map((t) => (
                <li key={t} className="rounded-xl bg-brand-yellow/20 px-3 py-3 text-center text-[15px] font-bold text-brand-yellow-ink">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="certs">
          <h2 id="certs" className="mb-6 text-[24px] font-bold text-ink">인증 · 지정</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {site.certifications.map((c) => {
              const img = photos[c.photo];
              return (
                <li key={c.name} className="overflow-hidden rounded-card border border-line bg-white">
                  <div className="relative aspect-[4/3] bg-surface">
                    <Image src={img.src} alt={`${c.name} 인증서`} fill sizes="(min-width:1024px) 280px, 50vw" className="object-contain p-3" />
                  </div>
                  <div className="p-5">
                    <p className="text-[12.5px] font-bold text-primary">{c.period}</p>
                    <h3 className="mt-1 text-[16.5px] font-bold text-ink">{c.name}</h3>
                    <p className="mt-1 text-[13.5px] text-muted">{c.issuer}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[14px] text-muted">
            이 밖에 중소기업(소상공인) 확인, 통신판매업 신고({site.business.mailOrderNo}), 출판사 신고, 소프트웨어사업자 신고를 마쳤습니다.
          </p>
        </section>

        <section aria-labelledby="mou">
          <h2 id="mou" className="mb-6 text-[24px] font-bold text-ink">업무협약 (MOU)</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {mous.items.map((m) => (
              <li key={m.partner} className="flex items-center justify-between rounded-2xl bg-surface px-5 py-4">
                <span className="font-bold text-ink">{m.partner}</span>
                <span className="text-[14px] text-muted">{m.kind}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] text-muted">대학·기관·기업과 총 {mous.total}건의 협약을 맺고 함께 교육 프로그램을 운영합니다.</p>
        </section>

        <section aria-labelledby="info">
          <h2 id="info" className="mb-6 text-[24px] font-bold text-ink">기관 정보</h2>
          <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {[
              ["단체명", site.legalName],
              ["대표", site.business.ceo],
              ["등록일", "2013년 2월 1일 (전신: 창의융합교육연구회, 2012년 3월 2일 창립)"],
              ["사업자등록번호", site.business.registrationNo],
              ["법인등록번호", site.business.corporateNo],
              ["설립목적", "취약계층에게 지속적인 일자리를 제공하고 지역사회와의 연대활동 및 공익활동에 적극 기여하여 지역주민의 경제적 안정과 자립기반을 높임"],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                <dt className="font-bold text-ink">{k}</dt>
                <dd className="text-body">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </SubPage>
  );
}
