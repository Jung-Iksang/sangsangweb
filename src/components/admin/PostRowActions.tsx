"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deletePost, setPostPublished } from "@/actions/admin";
import type { BoardType } from "@/db/schema";

export function PostRowActions({ id, board, isPublished }: { id: number; board: BoardType; isPublished: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const btn = "whitespace-nowrap rounded-lg border border-line px-2.5 py-1.5 text-[13px] transition disabled:opacity-50";
  return (
    <div className="flex justify-end gap-1.5">
      {isPublished && (
        <Link href={`/community/${board}/${id}`} target="_blank" className={`${btn} hidden hover:border-primary hover:text-primary sm:inline-block`}>
          보기
        </Link>
      )}
      <Link href={`/admin/posts/${id}/edit`} className={`${btn} hover:border-primary hover:text-primary`}>수정</Link>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => { await setPostPublished(id, !isPublished); router.refresh(); })}
        className={`${btn} hover:border-ink`}
      >
        {isPublished ? "숨기기" : "공개"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("이 글을 삭제할까요? 삭제한 글은 되돌릴 수 없습니다.")) return;
          start(async () => { await deletePost(id); router.refresh(); });
        }}
        className={`${btn} text-brand-red-ink hover:border-brand-red`}
      >
        삭제
      </button>
    </div>
  );
}
