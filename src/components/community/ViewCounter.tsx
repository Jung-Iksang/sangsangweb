"use client";

import { useEffect } from "react";
import { incrementViews } from "@/actions/public";

/** 조회수 증가 (페이지는 캐시된 정적 HTML이므로 클라이언트에서 1회 호출) */
export function ViewCounter({ id }: { id: number }) {
  useEffect(() => {
    const key = `viewed-post-${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    incrementViews(id).catch(() => {});
  }, [id]);
  return null;
}
