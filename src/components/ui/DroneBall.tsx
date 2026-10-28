/** 드론축구공 — 둥근 보호 케이지(가로·세로 테) 안에 X자 드론(프로펠러 4개) */
export function DroneBall({ ref, className = "h-full w-full drop-shadow-[0_2px_3px_rgb(0_0_0/0.3)]" }: { ref?: React.Ref<SVGSVGElement>; className?: string }) {
  return (
    <svg ref={ref} viewBox="0 0 32 32" className={className} fill="none" stroke="white" strokeLinecap="round">
      {/* 케이지 */}
      <circle cx="16" cy="16" r="14.5" strokeWidth="2" className="fill-green-dark" />
      <ellipse cx="16" cy="16" rx="14.5" ry="5.5" strokeWidth="1" strokeOpacity="0.55" />
      <ellipse cx="16" cy="16" rx="5.5" ry="14.5" strokeWidth="1" strokeOpacity="0.55" />
      {/* 드론: 팔 X + 몸체 + 프로펠러 4개 */}
      <path d="M10.5 10.5l11 11M21.5 10.5l-11 11" strokeWidth="1.6" />
      <rect x="13.8" y="13.8" width="4.4" height="4.4" rx="1" fill="white" stroke="none" />
      <circle cx="10.5" cy="10.5" r="2.4" strokeWidth="1.3" />
      <circle cx="21.5" cy="10.5" r="2.4" strokeWidth="1.3" />
      <circle cx="10.5" cy="21.5" r="2.4" strokeWidth="1.3" />
      <circle cx="21.5" cy="21.5" r="2.4" strokeWidth="1.3" />
    </svg>
  );
}
