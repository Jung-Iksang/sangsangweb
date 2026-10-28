"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { addGalleryItems } from "@/actions/admin";
import { uploadImage, type Uploaded } from "@/lib/upload-client";

type Pending = { id: string; file: File; preview: string; title: string; status: "ready" | "uploading" | "done" | "error"; error?: string };

export function GalleryUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Pending[]>([]);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function add(files: FileList | File[]) {
    const next = Array.from(files)
      .filter((f) => /^image\/(jpeg|png|webp|gif)$/.test(f.type))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        title: file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
        status: "ready" as const,
      }));
    setItems((cur) => [...cur, ...next]);
    setMessage(null);
  }

  const update = (id: string, patch: Partial<Pending>) => setItems((cur) => cur.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  async function uploadAll() {
    setBusy(true);
    setMessage(null);
    const done: (Uploaded & { title: string })[] = [];
    for (const it of items.filter((i) => i.status !== "done")) {
      update(it.id, { status: "uploading" });
      try {
        const up = await uploadImage(it.file, "gallery");
        done.push({ ...up, title: it.title });
        update(it.id, { status: "done" });
      } catch (e) {
        update(it.id, { status: "error", error: e instanceof Error ? e.message : "실패" });
      }
    }
    if (done.length) {
      const res = await addGalleryItems(done.map((d) => ({ title: d.title, key: d.key, width: d.width, height: d.height })));
      if (res.ok) {
        setMessage(`${done.length}장의 사진을 등록했습니다.`);
        setItems((cur) => cur.filter((i) => i.status !== "done"));
        router.refresh();
      } else setMessage(res.error);
    }
    setBusy(false);
  }

  return (
    <section className="rounded-card bg-white p-5 ring-1 ring-line">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${drag ? "border-primary bg-primary-50" : "border-line hover:border-primary/60"}`}
      >
        <p className="text-[16px] font-bold text-ink">사진을 끌어다 놓거나 클릭해서 선택하세요</p>
        <p className="mt-1 text-[13px] text-muted">JPG · PNG · WEBP · GIF, 여러 장 동시 선택 가능 (자동으로 최적화되어 업로드됩니다)</p>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={(e) => { if (e.target.files) add(e.target.files); e.target.value = ""; }} />
      </div>

      {items.length > 0 && (
        <>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <li key={it.id} className="flex gap-3 rounded-xl border border-line p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.preview} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <input
                    value={it.title}
                    onChange={(e) => update(it.id, { title: e.target.value })}
                    disabled={busy}
                    aria-label="사진 제목"
                    className="w-full rounded-lg border border-line px-2.5 py-1.5 text-[14px] outline-none focus:border-primary"
                  />
                  <p className={`mt-1.5 text-[12.5px] ${it.status === "error" ? "text-brand-red-ink" : "text-muted"}`}>
                    {{ ready: "대기", uploading: "업로드 중…", done: "완료", error: it.error }[it.status]}
                  </p>
                  {!busy && (
                    <button type="button" onClick={() => setItems((cur) => cur.filter((x) => x.id !== it.id))} className="text-[12.5px] text-muted underline">
                      빼기
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={uploadAll} disabled={busy} className="h-11 rounded-full bg-primary px-7 font-bold text-white hover:bg-primary-dark disabled:opacity-60">
              {busy ? "업로드 중…" : `${items.length}장 등록하기`}
            </button>
          </div>
        </>
      )}
      {message && <p role="status" className="mt-4 rounded-lg bg-primary-50 px-4 py-3 text-[14px] text-primary">{message}</p>}
    </section>
  );
}
