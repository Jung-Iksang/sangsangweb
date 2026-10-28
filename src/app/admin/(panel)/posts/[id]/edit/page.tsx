import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { adminGetPost } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

// 관리자 화면: 매 요청 서버 렌더링 (DB 최신값 · 로그인 확인)
export const instant = false;

export const metadata = { title: "글 수정" };

export default async function EditPost({ params }: PageProps<"/admin/posts/[id]/edit">) {
  await requireAdmin();
  const post = await adminGetPost(Number((await params).id));
  if (!post) notFound();
  return (
    <div>
      <h1 className="mb-6 text-[26px] font-bold text-ink">글 수정</h1>
      <PostEditor
        initial={{ id: post.id, boardType: post.boardType, title: post.title, content: post.content, isPublished: post.isPublished }}
      />
    </div>
  );
}
