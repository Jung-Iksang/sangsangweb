import { careerThemes, programsByTheme } from "@/content/career-programs";
import type { ProgramGroup } from "@/components/admin/AlbumEditor";

/** 관리자 앨범 편집기의 "연결 프로그램" 선택지 (분류별) */
export function programOptions(): ProgramGroup[] {
  return careerThemes.map((t) => ({
    label: t.title,
    options: programsByTheme(t.slug).map((p) => ({ value: p.slug, label: p.title })),
  }));
}
