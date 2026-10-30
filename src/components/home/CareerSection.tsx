import Image from "next/image";
import Link from "next/link";
import { careerSchools } from "@/content/career";
import { photos, type PhotoName } from "@/content/photos.generated";
import "./CareerSection.css";

// 기존 직업세계의 현장 사진을 여섯 스쿨 카드에 재사용합니다.
const schoolPhotos: Record<string, { photo: PhotoName; alt: string }> = {
  "01": { photo: "drone-class", alt: "드론 조종 교육 현장" },
  "02": { photo: "career-maker", alt: "부품을 조립하는 메이커 교실" },
  "03": { photo: "hero-education", alt: "노트북으로 코딩을 배우는 학생들" },
  "04": { photo: "career-startup", alt: "4차산업 창의융합 진로체험 안내" },
  "05": { photo: "career-robot", alt: "직접 만든 로봇을 조종하는 학생" },
  "06": { photo: "career-maker", alt: "전자 부품으로 작품을 만드는 학생들" },
};

export function CareerSection() {
  return (
    <section aria-labelledby="career-title" className="career-section">
      <div className="container-site">
        <div className="career-heading">
          <h2 id="career-title">6가지 직업세계</h2>
          <p>직접 날리고, 만들고, 코딩하며 만나는 미래의 직업</p>
        </div>
        <ul className="career-cards">
          {careerSchools.map((school) => (
            <li key={school.no}>
              <Link href={`/career#school-${school.no}`} className="career-card">
                <div className="career-visual">
                  <Image
                    src={photos[schoolPhotos[school.no].photo].src}
                    alt={schoolPhotos[school.no].alt}
                    fill
                    sizes="(min-width: 1440px) 414px, (min-width: 1024px) 30vw, (min-width: 600px) 45vw, 90vw"
                    className="career-photo"
                  />
                </div>
                <div className="career-cardBody">
                  <div className="career-cardHeading">
                    <h3>{school.name}</h3>
                    <svg className="career-cardArrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </div>
                  <p>{school.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
