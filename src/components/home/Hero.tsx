import Image from "next/image";
import Link from "next/link";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";
import { PhoneIcon } from "@/components/layout/Header";

/** 사진 패널 바로 아래 크림 띠 — 캘리그라피 · 헤드라인 · 소개 · 버튼 */
export function Hero() {
  const calli = photos["brand-calligraphy"];
  return (
    <section aria-labelledby="hero-title" className="border-b border-line bg-cream">
      <div className="container-site grid gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
        <div>
          <Image src={calli.src} alt={site.slogan} width={calli.width} height={calli.height} className="h-12 w-auto md:h-16" />
          <h1 id="hero-title" className="t-display mt-7">
            <span className="sr-only">{site.name} — 익산 진로·직업체험 교육 전문기관. </span>
            아이들을 <span className="hl">꿈의 시대 주인공</span>으로 키웁니다
          </h1>
        </div>
        <div>
          <p className="t-lead">
            익산의 교육부 인증 교육기부 진로체험기관. 로봇·드론·코딩·3D프린팅 교육과 진로·직업체험, 문화예술 체험을 학교와 지역사회에 전합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/experience/school" className="btn btn-primary">
              프로그램 둘러보기 <span aria-hidden>→</span>
            </Link>
            <a href={`tel:${site.contact.phone}`} className="btn btn-outline">
              <PhoneIcon /> 교육문의 {site.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
