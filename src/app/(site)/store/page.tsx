import Image from "next/image";
import Link from "next/link";
import { SubPage } from "@/components/layout/SubPage";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "스토어",
  description:
    "상상마루샵 — 백제 문화재의 정서를 담은 문화상품과 교육 교구재. 백제문양 LED 한지등, 미륵사지 석탑 크리스탈, 체험 키트를 네이버 스마트스토어에서 만나보세요.",
  path: "/store",
  keywords: ["상상마루샵", "백제 문화상품", "교구재", "체험키트", "LED 한지등", "네이버 스마트스토어"],
});

const products = [
  { photo: "culture" as const, title: "백제문양 LED 주사위·한지등", desc: "백제 문양을 새긴 LED 조명 만들기 키트" },
  { photo: "culture-stringart" as const, title: "전통문양 스트링아트", desc: "미륵사지 사리호 문양 스트링아트" },
  { photo: "culture-hologram" as const, title: "백제문화 홀로그램", desc: "미륵사지 석탑 교육용 홀로그램 콘텐츠" },
];

export default function Page() {
  const shot = photos.store;
  return (
    <SubPage path="/store" title="스토어" description="상상마루샵 — 백제, 세계를 품다">
      <div className="space-y-20">
        <section className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
          <div>
            <p className="num">{site.store.platform}</p>
            <h2 className="t-h2 mt-2">{site.store.name}</h2>
            <p className="mt-4 text-[1.03125rem] leading-[1.85] text-body">
              상상마루샵은 숨겨진 백제 문화재 속에서 백제의 정서를 담아낸 전통과 문화를 널리 알리기 위하여, 교육 콘텐츠·교구재 개발에 앞장서고 있습니다.
              국립부여박물관과 국립공주박물관 문화상품점에도 입점해 있습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#03c75a] text-[#06210f] hover:brightness-95"
              >
                스마트스토어에서 구매하기 <span aria-hidden>↗</span>
              </a>
              <a href={`tel:${site.contact.phone}`} className="btn btn-outline">
                단체·교구 구매 문의
              </a>
            </div>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-cream">
            <Image src={shot.src} alt="네이버 스마트스토어 상상마루샵 화면" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
          </div>
        </section>

        <section aria-labelledby="products">
          <p className="num">01</p>
          <h2 id="products" className="mb-8 mt-2 text-[1.5rem] font-bold tracking-tight text-ink">대표 상품 · 체험 키트</h2>
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-3">
            {products.map((p) => {
              const img = photos[p.photo];
              return (
                <li key={p.title}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-line">
                    <Image src={img.src} alt={p.title} fill sizes="(min-width:640px) 290px, 100vw" className="object-cover" />
                  </div>
                  <h3 className="mt-4 text-[1rem] font-bold text-ink">{p.title}</h3>
                  <p className="mt-1 text-[0.875rem] text-muted">{p.desc}</p>
                </li>
              );
            })}
          </ul>
          <Link href="/experience/culture" className="btn btn-ghost mt-10 text-[1rem]">
            문화예술체험 프로그램 보기 <span aria-hidden>→</span>
          </Link>
        </section>

        <p className="border-t border-line pt-6 text-[0.8125rem] text-muted">
          {site.legalName} · 대표 {site.business.ceo} · 통신판매업신고 {site.business.mailOrderNo} · 사업자등록번호 {site.business.registrationNo}
        </p>
      </div>
    </SubPage>
  );
}
