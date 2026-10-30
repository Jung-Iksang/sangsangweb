"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { photos } from "@/content/photos.generated";

/* =========================================================
 * Hero 슬라이드 데이터
 * 기존 상상마루 사진 사용
 * ======================================================= */

type HeroSlide = {
  src: string;
  alt: string;
  caption: string;
  position?: string;
};

const slides: HeroSlide[] = [
  {
    src: photos["drone-class"].src,
    alt: "드론 수업에 참여한 학생들",
    caption: "드론 체험 교육",
    position: "center",
  },
  {
    src: photos["hero-education"].src,
    alt: "창의공학실에서 코딩 수업을 듣는 학생들",
    caption: "창의공학실 코딩 교육",
    position: "center",
  },
  {
    src: photos["events-hanoi"].src,
    alt: "하노이탑대회 체험부스",
    caption: "하노이탑대회 체험부스",
    position: "center",
  },
];

const SLIDE_INTERVAL = 6500;

/* =========================================================
 * Hero Component
 * 상상마루 메인 비주얼
 * ======================================================= */

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  /* 자동 슬라이드 */

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (mediaQuery.matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, []);

  /* 이전 슬라이드 */

  const previousSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  /* 다음 슬라이드 */

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate w-full overflow-hidden bg-[#101820] text-white"
      style={{
        fontFamily:
          '"Pretendard Variable", Pretendard, "Noto Sans KR", sans-serif',
      }}
    >
      {/* =====================================================
          1. 배경 이미지 슬라이드
         ===================================================== */}

      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`
              absolute inset-0
              transition-opacity duration-1000 ease-in-out
              ${
                activeIndex === index
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={90}
              className="object-cover"
              style={{
                objectPosition: slide.position ?? "center",
              }}
            />
          </div>
        ))}
      </div>

      {/* =====================================================
          2. 배경 그라데이션
         ===================================================== */}

      {/* 왼쪽 그라데이션 */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-r
          from-[#08131c]/80
          via-[#08131c]/55
          to-[#08131c]/10
        "
      />

      {/* 아래쪽 그라데이션 */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-t
          from-black/35
          via-transparent
          to-black/5
        "
      />

      {/* =====================================================
          3. 메인 콘텐츠
          기존 높이 유지 + 콘텐츠 위치 아래로 이동
         ===================================================== */}

      <div
        className="
          container-site
          relative z-10
          flex flex-col
          justify-between

          min-h-[600px]
          pt-24 pb-5

          sm:min-h-[650px]
          sm:pt-28 sm:pb-6

          lg:min-h-[740px]
          lg:pt-28 lg:pb-7
        "
      >
        {/* =================================================
            상단 콘텐츠
           ================================================= */}

        {/* 상단 콘텐츠 - 전체 10px 위로 이동 */}

<div className="relative -top-[10px] max-w-[850px]">

          {/* ===============================================
              소제목
             =============================================== */}

          <div className="mb-7 flex items-center gap-4">
            <span
              className="
                h-[2px] w-9
                bg-[#9de18a]
              "
            />

            <span
              className="
                text-[15px]
                font-light
                tracking-[-0.02em]
                text-white/90

                sm:text-[17px]
                lg:text-[19px]
              "
            >
              상상이 경험이 되는 곳
            </span>
          </div>

          {/* ===============================================
              메인 제목
             =============================================== */}

          <h1
            id="hero-title"
            className="
              text-[clamp(32px,4vw,60px)]
              font-black
              leading-[1.25]
              tracking-[-0.055em]
              text-white
            "
          >
            배움이 즐거우면,
            <br />

            <span className="text-[#9de18a]">
              가능성이 커집니다.
            </span>
          </h1>

          {/* ===============================================
              설명 문구
              첫 번째 문장 삭제
             =============================================== */}

          <p
            className="
              mt-8
              text-[15px]
              font-normal
              leading-[1.9]
              tracking-[-0.025em]
              text-white/90

              sm:text-[17px]
              lg:text-[19px]
            "
          >
            다양한 체험과 교육을 통해
            <br />
            아이들의 꿈을 응원합니다.
          </p>

          {/* ===============================================
              버튼 영역
             =============================================== */}

          <div
            className="
              mt-10
              flex flex-wrap
              items-center
              gap-3
              sm:gap-4
            "
          >
            {/* 프로그램 둘러보기 */}

            <Link
              href="/experience/school"
              className="
                inline-flex
                min-h-[52px]
                items-center
                justify-center
                rounded-lg
                bg-[#2f7428]
                px-7
                text-[14px]
                font-semibold
                text-white
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-[#398a31]
                sm:px-8
                sm:text-[15px]
              "
            >
              프로그램 둘러보기
            </Link>

            {/* 상상마루 소개 */}

            <Link
              href="/about/greeting"
              className="
                inline-flex
                min-h-[52px]
                items-center
                justify-center
                rounded-lg
                border border-white/55
                bg-white/10
                px-6
                text-[14px]
                font-medium
                text-white
                backdrop-blur-sm
                transition-all duration-300
                hover:border-white
                hover:bg-white/20
                sm:text-[15px]
              "
            >
              상상마루 소개
            </Link>
          </div>
        </div>

        {/* =================================================
            4. 하단 슬라이드 컨트롤
           ================================================= */}

        <div
          className="
            mt-12
            flex flex-wrap
            items-center
            justify-between
            gap-4
          "
        >
          {/* 왼쪽 슬라이드 정보 */}

          <div className="flex flex-wrap items-center gap-5 sm:gap-7">

            {/* 현재 슬라이드 번호 */}

            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-white">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>

              <span className="text-[13px] text-white/45">
                /
              </span>

              <span className="text-[13px] text-white/60">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            {/* 슬라이드 진행 표시 */}

            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="슬라이드 선택"
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${index + 1}번 슬라이드: ${slide.caption}`}
                  aria-current={
                    activeIndex === index ? "true" : undefined
                  }
                  className="flex h-8 items-center justify-center"
                >
                  <span
                    className={`
                      block h-[3px] rounded-full
                      transition-all duration-500
                      ${
                        activeIndex === index
                          ? "w-12 bg-[#9de18a]"
                          : "w-6 bg-white/40 hover:bg-white/80"
                      }
                    `}
                  />
                </button>
              ))}
            </div>

            {/* 사진 설명 */}

            <span
              className="
                hidden
                text-[13px]
                font-medium
                text-white/75
                md:inline-block
              "
            >
              {slides[activeIndex].caption}
            </span>
          </div>

          {/* 오른쪽 이전/다음 버튼 */}

          <div className="flex items-center gap-2">

            {/* 이전 버튼 */}

            <button
              type="button"
              onClick={previousSlide}
              aria-label="이전 슬라이드"
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-full
                border border-white/40
                bg-black/15
                text-xl
                text-white
                backdrop-blur-sm
                transition-all duration-300
                hover:border-white
                hover:bg-white/20
              "
            >
              <span aria-hidden="true">←</span>
            </button>

            {/* 다음 버튼 */}

            <button
              type="button"
              onClick={nextSlide}
              aria-label="다음 슬라이드"
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-full
                border border-white/40
                bg-black/15
                text-xl
                text-white
                backdrop-blur-sm
                transition-all duration-300
                hover:border-white
                hover:bg-white/20
              "
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}