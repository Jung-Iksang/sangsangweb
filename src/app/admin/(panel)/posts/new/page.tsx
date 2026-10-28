import { PostEditor } from "@/components/admin/PostEditor";
import { BOARD_TYPES, type BoardType } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

// 관리자 화면: 매 요청 서버 렌더링 (DB 최신값 · 로그인 확인)
export const instant = false;

export const metadata = { title: "새 글 쓰기" };

export default async function NewPost({ searchParams }: PageProps<"/admin/posts/new">) {
  await requireAdmin();
  const b = (await searchParams).board as BoardType;
  return (
    <div>
      <h1 className="mb-6 text-[26px] font-bold text-ink">새 글 쓰기</h1>
      <PostEditor initial={{ boardType: BOARD_TYPES.includes(b) ? b : "notice", title: "", content: "", isPublished: true }} />
    </div>
  );
}
