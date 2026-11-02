import Image from "next/image";
import Link from "next/link";
import { careerSchools } from "@/content/career";
import { photos, type PhotoName } from "@/content/photos.generated";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import "./CareerSection.css";

// Use available education photos that match each program; avoid unrelated event banners.
const schoolPhotos: Record<string, { photo: PhotoName; alt: string }> = {
  "01": { photo: "drone-class", alt: "드론 교육에 참여한 학생들과 강사" },
  "02": { photo: "career-maker", alt: "메이커 교육 활동 사진" },
  "03": { photo: "hero-education", alt: "노트북으로 코딩을 배우는 학생들" },
  "04": { photo: "hero-education", alt: "노트북으로 교육 활동에 참여하는 학생들" },
  "05": { photo: "career-robot", alt: "직접 로봇을 조종하며 배우는 학생들" },
  "06": { photo: "afterschool", alt: "방과후 창의교육 활동 사진" },
};

export function CareerSection() {
  return (
    <section aria-labelledby="career-title" className="career-section">
      <ScrollReveal className="site-content-frame">
        <div className="career-heading" data-reveal-item>
          <div><h2 id="career-title">6가지 직업세계</h2></div>
        </div>
        <ul className="career-cards">
          {careerSchools.map((school) => {
            const photo = schoolPhotos[school.no];
            return <li key={school.no} data-reveal-item>
              <Link href={`/career#school-${school.no}`} className="career-card" aria-label={`${school.name} 교육과정 자세히 보기`}>
                <div className="career-visual">
                  <Image src={photos[photo.photo].src} alt={photo.alt} fill
                    sizes="(min-width:1600px) 30rem, (min-width:1024px) 30vw, (min-width:600px) 45vw, 90vw" className="career-photo" />
                </div>
                <div className="career-cardBody">
                  <div className="career-cardHeading"><h3>{school.name}</h3><span className="career-tech">{school.tech}</span></div>
                  <p className="career-tagline">{school.tagline}</p>
                  <p className="career-description">{school.desc}</p>
                  <ul className="career-tags" aria-label="배우는 내용">{school.tags.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}</ul>
                  <span className="career-cardCta">교육과정 알아보기 <svg className="career-cardArrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
                </div>
              </Link>
            </li>;
          })}
        </ul>
      </ScrollReveal>
    </section>
  );
}

