import { SubPage } from "@/components/layout/SubPage";
import { site } from "@/config/site";
import { transport } from "@/content/about";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "오시는 길",
  description: `${site.address.full}. 상상마루 위치와 버스·KTX·자가용 교통 안내, 연락처를 확인하세요.`,
  path: "/about/location",
  keywords: ["상상마루 위치", "익산 영등동", "동서로49길", "익산 진로체험센터"],
});

const mapQuery = encodeURIComponent("익산시 동서로49길 24-1");

export default function Page() {
  const info = [
    { label: "주소", value: site.address.full },
    { label: "전화", value: site.contact.phone, href: `tel:${site.contact.phone}` },
    { label: "팩스", value: site.contact.fax },
    { label: "이메일", value: site.contact.email, href: `mailto:${site.contact.email}` },
  ];
  return (
    <SubPage path="/about/location" title="오시는 길" description="상상마루는 익산시 영등동 동서로49길에 있습니다.">
      <div className="space-y-20">
        {/* 지도: 네이버 지도 퍼가기 iframe 코드를 받으면 이 영역을 교체 */}
        <div className="flex aspect-[16/8] flex-col items-center justify-center gap-5 rounded-md border border-line bg-cream p-6 text-center">
          <p className="t-h3">{site.address.full}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <a href={`https://map.naver.com/p/search/${mapQuery}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm bg-[#03c75a] text-[#06210f] hover:brightness-95">
              네이버 지도에서 보기
            </a>
            <a href={`https://map.kakao.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm bg-[#fee500] text-[#191919] hover:brightness-95">
              카카오맵에서 보기
            </a>
          </div>
        </div>

        <section aria-labelledby="contact-info">
          <p className="num">01</p>
          <h2 id="contact-info" className="type-subsection-title mb-6 mt-2 text-ink">연락처</h2>
          <dl className="border-t border-ink">
            {info.map((i) => (
              <div key={i.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-8">
                <dt className="font-bold text-ink">{i.label}</dt>
                <dd className="text-body">
                  {i.href ? <a href={i.href} className="underline decoration-line-strong underline-offset-4 hover:text-green">{i.value}</a> : i.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="transport">
          <p className="num">02</p>
          <h2 id="transport" className="type-subsection-title mb-6 mt-2 text-ink">교통 안내</h2>
          <dl className="border-t border-ink">
            {transport.map((t) => (
              <div key={t.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-8">
                <dt className="font-bold text-ink">{t.label}</dt>
                <dd className="text-body">{t.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </SubPage>
  );
}
