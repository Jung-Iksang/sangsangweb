"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteGalleryItem, updateGalleryItem } from "@/actions/admin";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatDate } from "@/lib/format";

type Item = { id: number; title: string; description: string; imageUrl: string; imageCount: number; createdAt: string; programTitle?: string | null };

export function GalleryItemCard({ item }: { item: Item }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <li className="overflow-hidden rounded-md bg-white border border-line">
      <div className="relative aspect-[4/3] bg-cream">
        <SmartImage src={item.imageUrl} alt={item.title} fill sizes="(min-width:1024px) 340px, 50vw" className="object-cover" />
        <span className="absolute right-2 top-2 rounded-sm bg-ink/85 px-1.5 py-0.5 text-[12px] font-semibold text-white">{item.imageCount}장</span>
      </div>
      <div className="space-y-2 p-4">
        {editing ? (
          <>
            <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="제목" className="w-full rounded-lg border border-line px-3 py-2 text-[14px] outline-none focus:border-blue" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="앨범 설명 (선택)" aria-label="설명" className="w-full resize-none rounded-lg border border-line px-3 py-2 text-[14px] outline-none focus:border-blue" />
            {error && <p className="text-[13px] text-red">{error}</p>}
            <div className="flex justify-end gap-1.5">
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-line px-3 py-1.5 text-[13px]">취소</button>
              <button
                type="button"
                disabled={pending}
                onClick={() => start(async () => {
                  const r = await updateGalleryItem(item.id, { title, description });
                  if (!r.ok) return setError(r.error);
                  setEditing(false);
                  router.refresh();
                })}
                className="rounded-lg bg-blue px-3 py-1.5 text-[13px] font-bold text-white disabled:opacity-60"
              >
                저장
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="truncate font-bold text-ink">{item.title}</p>
            <p className="text-[13px] text-muted">
              {formatDate(item.createdAt)}
              {item.programTitle && <span className="ml-2 rounded-sm bg-blue-soft px-1.5 py-0.5 text-[12px] font-semibold text-blue">{item.programTitle}</span>}
            </p>
            <div className="flex justify-end gap-1.5 pt-1">
              <Link href={`/community/gallery/${item.id}`} target="_blank" className="rounded-lg border border-line px-3 py-1.5 text-[13px] hover:border-blue">보기</Link>
              <Link href={`/admin/gallery/${item.id}`} className="rounded-lg border border-line px-3 py-1.5 text-[13px] hover:border-blue">사진 관리</Link>
              <button type="button" onClick={() => setEditing(true)} className="rounded-lg border border-line px-3 py-1.5 text-[13px] hover:border-blue">수정</button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (!confirm(`이 앨범(사진 ${item.imageCount}장)을 삭제할까요?`)) return;
                  start(async () => { await deleteGalleryItem(item.id); router.refresh(); });
                }}
                className="rounded-lg border border-line px-3 py-1.5 text-[13px] text-red hover:border-brand-red"
              >
                삭제
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}
