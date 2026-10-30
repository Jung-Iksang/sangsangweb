"use client";

import { useEffect, useMemo, useState } from "react";

/* =========================================================
 * Types
 * ======================================================= */

type Fact = {
  n: number;
  suffix: string;
  v: string;
};

type HistoryEntry = {
  year: string;
  text: string;
};

type AboutIntroStatsProps = {
  history: readonly unknown[];
  facts: readonly Fact[];
};

/* =========================================================
 * 연혁 데이터 변환
 * ======================================================= */

function normalizeHistory(
  history: readonly unknown[]
): HistoryEntry[] {
  const entries: HistoryEntry[] = [];

  for (const item of history) {
    if (
      typeof item !== "object" ||
      item === null ||
      Array.isArray(item)
    ) {
      continue;
    }

    const record = item as Record<string, unknown>;

    const rawYear =
      record.year ??
      record.date ??
      record.y;

    const yearMatch = String(rawYear ?? "").match(
      /(?:19|20)\d{2}/
    );

    if (!yearMatch) {
      continue;
    }

    const rawText =
      record.text ??
      record.achievement ??
      record.description ??
      record.content ??
      record.title ??
      record.summary ??
      record.event ??
      record.detail ??
      record.headline;

    let description = "";

    if (typeof rawText === "string") {
      description = rawText.trim();
    } else if (Array.isArray(rawText)) {
      description = rawText
        .filter(
          (value): value is string =>
            typeof value === "string"
        )
        .join(" · ");
    }

    if (!description) {
      continue;
    }

    entries.push({
      year: yearMatch[0],
      text: description,
    });
  }

  // 연도 오름차순 정렬
  entries.sort(
    (a, b) => Number(a.year) - Number(b.year)
  );

  // 최신 연혁을 가장 먼저 표시
  if (entries.length > 1) {
    const latest = entries.pop();

    if (latest) {
      entries.unshift(latest);
    }
  }

  return entries;
}

/* =========================================================
 * AboutIntroStats Component
 * ======================================================= */

export function AboutIntroStats({
  history,
  facts,
}: AboutIntroStatsProps) {
  /* 연혁 데이터 */

  const milestones = useMemo(
    () => normalizeHistory(history),
    [history]
  );

  /* 현재 연혁 인덱스 */

  const [activeIndex, setActiveIndex] = useState(0);

  /* 자동 재생 상태 */

  const [isPlaying, setIsPlaying] = useState(true);

  /* 사용자 모션 설정 */

  const [reducedMotion, setReducedMotion] =
    useState(false);

  const interval = 4500;

  /* =========================================================
   * 사용자 모션 설정 확인
   * ======================================================= */

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateMotion = () => {
      setReducedMotion(media.matches);
    };

    updateMotion();

    media.addEventListener("change", updateMotion);

    return () => {
      media.removeEventListener(
        "change",
        updateMotion
      );
    };
  }, []);

  /* =========================================================
   * 자동 연혁 순환
   * ======================================================= */

  useEffect(() => {
    if (!isPlaying) return;

    if (reducedMotion) return;

    if (milestones.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => {
        return (prev + 1) % milestones.length;
      });
    }, interval);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    isPlaying,
    reducedMotion,
    milestones.length,
  ]);

  /* =========================================================
   * 현재 연혁
   * ======================================================= */

  const current =
    milestones[activeIndex] ??
    milestones[0] ??
    null;

  /* =========================================================
   * 자동 재생 제어
   * ======================================================= */

  const togglePlaying = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div
      className="about-intro-stats"
      data-about-reveal
    >
      <dl className="about-intro-facts">

        {/* ===============================================
            1. 연혁 영역
           =============================================== */}

        <div className="about-intro-year">

          {/* 연도 */}

          <dd className="about-intro-value">
            <span
              key={`${current?.year}-${activeIndex}`}
              className="about-intro-year-step"
            >
              {current?.year ?? "—"}
            </span>

            <span className="about-intro-unit">
              년
            </span>
          </dd>

          {/* 제목 */}

          <dt>
            상상마루의 발자취
          </dt>

          {/* 연혁 내용 */}

          <dd className="about-intro-year-history">

            <div
              className="about-intro-history-content"
              aria-live="off"
            >
              {current ? (
                <p
                  key={`${activeIndex}-${current.text}`}
                  className="about-intro-history-text"
                >
                  {current.text}
                </p>
              ) : (
                <p className="about-intro-history-text">
                  등록된 연혁이 없습니다.
                </p>
              )}
            </div>

            {/* 재생 및 일시정지 */}

            {milestones.length > 1 &&
              !reducedMotion && (
                <button
                  type="button"
                  className="about-intro-history-control"
                  onClick={togglePlaying}
                  aria-label={
                    isPlaying
                      ? "연혁 자동 재생 일시정지"
                      : "연혁 자동 재생 시작"
                  }
                  title={
                    isPlaying
                      ? "일시정지"
                      : "재생"
                  }
                >
                  {isPlaying ? (
                    <span aria-hidden="true">
                      Ⅱ
                    </span>
                  ) : (
                    <span aria-hidden="true">
                      ▶
                    </span>
                  )}
                </button>
              )}
          </dd>
        </div>

        {/* ===============================================
            2. 나머지 통계
           =============================================== */}

        {facts.map((fact) => (
          <div key={fact.suffix}>

            {/* 숫자 */}

            <dd className="about-intro-value">
              <span>
                {fact.n}
              </span>

              <span className="about-intro-unit">
                {fact.suffix}
              </span>
            </dd>

            {/* 설명 */}

            <dt>
              {fact.v}
            </dt>

          </div>
        ))}

      </dl>

      {/* 스크린리더용 전체 연혁 */}

      <ul className="sr-only">
        {milestones.map((item, index) => (
          <li key={`${item.year}-${index}`}>
            {item.year}년: {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}