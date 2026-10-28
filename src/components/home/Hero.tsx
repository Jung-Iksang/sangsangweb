import Image from "next/image";
import Link from "next/link";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";
import { PhoneIcon } from "@/components/layout/Header";
import { HeroSlides, type HeroSlide } from "./HeroSlides";

const slides: HeroSlide[] = [
  { src: photos["hero-education"].src, alt: "창의공학실에서 코딩 수업을 듣는 학생들", caption: "창의공학실 코딩 수업" },
  { src: photos["drone-class"].src, alt: "드론 수업에 참여한 학생들", caption: "드론 수업" },
  { src: photos["events-hanoi"].src, alt: "하노이탑대회 체험부스", caption: "하노이탑대회 체험부스" },
];

/**
 * 메인 첫 화면 — 한 겹 에디토리얼 히어로.
 * 데스크톱: 왼쪽 5/12 크림(캘리그라피·헤드라인·소개·버튼) | 오른쪽 7/12 사진 1장(교차 페이드, 화면 끝까지).
 * 모바일: 사진 → 글. 사진 위 글자는 작은 캡션 라벨뿐.
 */
export function Hero() {
  const calli = photos["brand-calligraphy"];
  return (
    <section aria-labelledby="hero-title" className="flex flex-col bg-cream lg:grid lg:min-h-[clamp(560px,78vh,800px)] lg:grid-cols-2 xl:grid-cols-[5fr_7fr]">
      <div className="flex items-center px-5 py-12 sm:px-[clamp(20px,5.2vw,80px)] lg:py-14 lg:pl-[max(clamp(20px,5.2vw,80px),calc((100vw-1680px)/2+80px))] lg:pr-12">
        <div className="max-w-[600px]">
          <Image src={calli.src} alt={site.slogan} width={calli.width} height={calli.height} className="h-12 w-auto md:h-14" />
          <h1 id="hero-title" className="t-display mt-7 text-balance">
            <span className="sr-only">{site.name} — 익산 진로·직업체험 교육 전문기관. </span>
            아이들을 <span className="hl">꿈의 시대 주인공</span>으로 키웁니다
          </h1>
          <p className="t-lead mt-6">
            익산의 교육부 인증 교육기부 진로체험기관. 로봇·드론·코딩·3D프린팅 교육과 진로·직업체험, 문화예술 체험을 학교와 지역사회에 전합니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/experience/school" className="btn btn-primary">
              프로그램 둘러보기 <span aria-hidden>→</span>
            </Link>
            <a href={`tel:${site.contact.phone}`} className="btn btn-outline">
              <PhoneIcon /> 교육문의 {site.contact.phone}
            </a>
          </div>
        </div>
      </div>
      <div className="order-first lg:order-none lg:h-full">
        <HeroSlides slides={slides} />
      </div>
    </section>
  );
}
