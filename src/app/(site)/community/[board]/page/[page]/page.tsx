import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BoardList, boardDescription } from "@/components/community/BoardList";
import { BOARD_TYPES, type BoardType } from "@/db/schema";
import { getPostsPage } from "@/lib/data";
import { boardLabel } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

// 검색엔진에 완성된 HTML·정확한 404 상태를 주기 위해 URL 값을 기다려 서버에서 완전히 렌더링
export const instant = false;

export async function generateStaticParams() {
  const params: { board: string; page: string }[] = [];
  for (const board of BOARD_TYPES) {
    const { totalPages } = await getPostsPage(board, 1);
    for (let n = 2; n <= totalPages; n++) params.push({ board, page: String(n) });
  }
  // Cache Components 는 최소 1개의 예시 값이 필요 (없는 페이지는 404 처리)
  return params.length ? params : [{ board: "notice", page: "2" }];
}

function parse(board: string, page: string) {
  const n = Number(page);
  if (!BOARD_TYPES.includes(board as BoardType) || !Number.isInteger(n) || n < 2) notFound();
  return { board: board as BoardType, page: n };
}

export async function generateMetadata({ params }: PageProps<"/community/[board]/page/[page]">): Promise<Metadata> {
  const p = await params;
  const { board, page } = parse(p.board, p.page);
  return pageMetadata({
    title: `${boardLabel[board]} ${page}페이지`,
    description: boardDescription[board],
    path: `/community/${board}/page/${page}`,
  });
}

export default async function Page({ params }: PageProps<"/community/[board]/page/[page]">) {
  const p = await params;
  const { board, page } = parse(p.board, p.page);
  return <BoardList board={board} page={page} />;
}
