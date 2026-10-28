const dateFmt = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** 2026.10.28 형식 (한국 시간) */
export function formatDate(iso: string | Date) {
  const parts = dateFmt.formatToParts(typeof iso === "string" ? new Date(iso) : iso);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")}`;
}

/** 작성 후 N일 이내 → 새 글 배지 */
export const NEW_BADGE_DAYS = 7;
export function isRecent(iso: string, now: number, days = NEW_BADGE_DAYS) {
  return now - new Date(iso).getTime() < days * 24 * 60 * 60 * 1000;
}

export const boardLabel = { notice: "공지사항", press: "보도자료" } as const;
