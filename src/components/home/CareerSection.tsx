import Image from "next/image";
import Link from "next/link";
import { careerPrograms, careerThemes, programsByTheme } from "@/content/career-programs";
import { photos } from "@/content/photos.generated";
import "./CareerSection.css";

/** 메인 진로·직업체험 — 대표 6개 분야 (2026 운영계획 기준, 나머지 분야는 /career 에서) */
const featured = careerThemes.filter((t) => t.featured);

export function CareerSection() {
  return (
    <section aria-labelledby="career-title" className="career-section">
      <div className="container-site">
        <div className="career-heading">
          <h2 id="career-title">진로·직업체험</h2>
          <p>
            {careerThemes.length}개 분야 {careerPrograms.length}개 프로그램 — 직접 날리고, 만들고, 코딩하며 만나는 미래의 직업{" "}
            <Link href="/career" className="whitespace-nowrap font-semibold text-green underline-offset-4 hover:underline">
              전체 보기 →
            </Link>
          </p>
        </div>
        <ul className="career-cards">
          {featured.map((t) => (
            <li key={t.slug}>
              <Link href={`/career/${t.slug}`} className="career-card">
                <div className="career-visual">
                  <Image
                    src={photos[t.image].src}
                    alt={`${t.title} 진로·직업체험`}
                    fill
                    sizes="(min-width: 1440px) 414px, (min-width: 1024px) 30vw, (min-width: 600px) 45vw, 90vw"
                    className="career-photo"
                  />
                </div>
                <div className="career-cardBody">
                  <div className="career-cardHeading">
                    <h3>
                      {t.title} <span className="text-[15px] font-medium text-muted">{programsByTheme(t.slug).length}개</span>
                    </h3>
                    <svg className="career-cardArrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </div>
                  <p>{t.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
