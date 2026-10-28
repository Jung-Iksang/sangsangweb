"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 화면에 보이면 숫자가 from → to 로 올라가는 효과.
 * - 서버 HTML 에는 최종 값이 들어가므로 검색엔진은 최종 값을 읽는다 (중복 텍스트 없이 숫자 하나만 출력).
 * - '동작 줄이기' 설정 사용자에게는 애니메이션 없이 최종 값만 보여 준다.
 */
export function CountUp({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  duration = 1600,
}: {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    // 하이드레이션 직후 시작값으로 되돌려 두고, 보일 때 올라가게 한다
    raf = requestAnimationFrame(() => setValue(from));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          setValue(Math.round(from + (to - from) * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [from, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value.toLocaleString("ko-KR")}
      {suffix}
    </span>
  );
}

/**
 * "시즌 7", "23종", "+1" 같은 문자열에서 숫자 부분만 올라가게 한다.
 * 연도(1900 이상)나 숫자가 없는 값은 그대로 보여 준다.
 */
export function AnimatedStat({ value }: { value: string }) {
  const m = value.match(/^(\D*)(\d[\d,]*)(\D*)$/);
  if (!m) return <>{value}</>;
  const n = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(n) || n >= 1900) return <>{value}</>;
  return <CountUp to={n} prefix={m[1]} suffix={m[3]} duration={n > 50 ? 1800 : 1200} />;
}
