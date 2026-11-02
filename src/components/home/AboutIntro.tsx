import Image from "next/image";

import { historyHighlights } from "@/content/about";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";

import { AboutIntroStats } from "./AboutIntroStats";
import { AboutIntroReveal } from "./AboutIntroReveal";

import "./AboutIntro.css";

/* =========================================================
 * AboutIntro
 * 상상마루 소개 영역
 * ======================================================= */

export function AboutIntro() {
  /* 통계 데이터 */

  const facts = [
    {
      n: 23,
      suffix: "종",
      v: "주무부처 등록 민간자격",
    },
    {
      n: site.certifications.length,
      suffix: "개",
      v: "교육·기업 인증 및 지정",
    },
  ];

  /* 기존 사진 */

  const img = photos.about;

  return (
    <AboutIntroReveal>
      <div className="site-content-frame about-intro-grid">

        {/* =====================================================
            1. 왼쪽 사진
           ===================================================== */}

        <div
          className="about-intro-visual"
          data-reveal-item
        >
          {/* 사진 뒤의 연한 회색 오프셋 레이어 */}

          <div
            className="about-intro-backdrop"
            aria-hidden="true"
          />

          {/* 사진 */}

          <div className="about-intro-photo">
            <Image
              src={img.src}
              alt="상상마루 진로캠프를 수료한 학생들의 단체사진"
              width={img.width}
              height={img.height}
              sizes="(min-width:1550px) 708px, (min-width:1024px) 46vw, (min-width:768px) 688px, calc(100vw - 48px)"
            />
          </div>

        </div>

        {/* =====================================================
            2. 오른쪽 소개 영역
           ===================================================== */}

        <div className="about-intro-copy">

          {/* 제목 */}

          <h2
            id="about-title"
            className="about-intro-title"
            data-reveal-item
          >
            <span>상상마루는</span>
          </h2>

          {/* 소개 문구 */}

          <p
            className="about-intro-lead"
            data-reveal-item
          >
            2012년부터,
            <br />
            익산의 학교와 함께.
          </p>

          {/* 상세 설명 */}

          <div
            className="about-intro-description"
            data-reveal-item
          >
            <p>
              창의융합교육연구회로 시작한 상상마루는
              로봇·드론·코딩·3D프린팅부터
              진로·직업체험, 문화예술까지
              학교와 지역사회에 다양한 배움의 경험을
              전합니다.
            </p>

            <p>
              전북 예비사회적기업으로서 지역의 일자리와
              교육 기회를 함께 만듭니다.
            </p>
          </div>

          {/* =================================================
              3. 연혁 및 통계
             ================================================= */}

          <AboutIntroStats
            history={historyHighlights}
            facts={facts}
          />

        </div>
      </div>
    </AboutIntroReveal>
  );
}
