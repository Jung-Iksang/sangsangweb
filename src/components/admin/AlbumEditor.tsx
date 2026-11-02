"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createGalleryAlbum, saveGalleryAlbum, type AlbumImageRef } from "@/actions/admin";
import { uploadImage } from "@/lib/upload-client";

type Existing = { url: string; key: string | null; width: number; height: number };
type Photo =
  | { id: string; kind: "existing"; preview: string; image: Existing }
  | { id: string; kind: "new"; preview: string; file: File; status: "ready" | "uploading" | "error"; error?: string };

type Album = { id: number; title: string; description: string; programSlug: string | null; images: Existing[] };
/** 연결 프로그램 선택지 (분류별) — 서버 페이지가 src/content/career-programs.ts 로 만들어 넘긴다 */
export type ProgramGroup = { label: string; options: { value: string; label: string }[] };

/** 앨범 만들기(album 없음) · 앨범 사진 관리(album 있음) 공용 — 첫 장이 대표 사진 */
export function AlbumEditor({ album, programs }: { album?: Album; programs: ProgramGroup[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const initial = (): Photo[] =>
    album?.images.map((image) => ({ id: crypto.randomUUID(), kind: "existing", preview: image.url, image })) ?? [];
  const [title, setTitle] = useState(album?.title ?? "");
  const [description, setDescription] = useState(album?.description ?? "");
  const [programSlug, setProgramSlug] = useState(album?.programSlug ?? "");
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function add(files: FileList | File[]) {
    const next: Photo[] = Array.from(files)
      .filter((f) => /^image\/(jpeg|png|webp|gif)$/.test(f.type))
      .map((file) => ({ id: crypto.randomUUID(), kind: "new", preview: URL.createObjectURL(file), file, status: "ready" }));
    setPhotos((cur) => [...cur, ...next]);
    setMessage(null);
  }

  const patch = (id: string, p: Partial<Extract<Photo, { kind: "new" }>>) =>
    setPhotos((cur) => cur.map((x) => (x.id === id && x.kind === "new" ? { ...x, ...p } : x)));

  function move(i: number, to: number) {
    setPhotos((cur) => {
      if (to < 0 || to >= cur.length) return cur;
      const next = [...cur];
      const [it] = next.splice(i, 1);
      next.splice(to, 0, it);
      return next;
    });
  }

  async function save() {
    if (!title.trim()) return setMessage({ ok: false, text: "앨범 제목을 입력해 주세요." });
    if (!photos.length) return setMessage({ ok: false, text: "사진을 한 장 이상 넣어 주세요." });
    setBusy(true);
    setMessage(null);
    // 화면 순서대로 업로드해 순서를 유지 (실패한 사진은 빼고 저장)
    const refs: AlbumImageRef[] = [];
    let failed = 0;
    for (const p of photos) {
      if (p.kind === "existing") {
        refs.push({ url: p.image.url, key: p.image.key, width: p.image.width, height: p.image.height });
        continue;
      }
      patch(p.id, { status: "uploading" });
      try {
        const up = await uploadImage(p.file, "gallery");
        refs.push({ key: up.key, url: up.url, width: up.width, height: up.height });
      } catch (e) {
        failed++;
        patch(p.id, { status: "error", error: e instanceof Error ? e.message : "실패" });
      }
    }
    const res = album
      ? await saveGalleryAlbum(album.id, { title, description, programSlug, images: refs })
      : await createGalleryAlbum({ title, description, programSlug, images: refs.filter((r): r is AlbumImageRef & { key: string; url: string } => !!r.key && !!r.url) });
    setBusy(false);
    if (!res.ok) return setMessage({ ok: false, text: res.error });
    const note = failed ? ` (업로드 실패 ${failed}장 제외)` : "";
    if (album) {
      setMessage({ ok: true, text: `저장했습니다${note}.` });
      router.refresh();
    } else {
      setMessage({ ok: true, text: `앨범을 등록했습니다 · 사진 ${refs.length}장${note}` });
      setTitle("");
      setDescription("");
      setPhotos([]);
      router.refresh();
    }
  }

  const input = "w-full rounded-lg border border-line px-3 py-2 text-[14px] outline-none focus:border-green";

  return (
    <section className="space-y-4 rounded-md border border-line bg-white p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_1.4fr]">
        <input value={title} onChange={(e) => setTitle(e.target.value)} disabled={busy} placeholder="앨범 제목 (예: 2026 드론축구 페스티벌)" aria-label="앨범 제목" className={input} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} disabled={busy} placeholder="설명 (선택)" aria-label="앨범 설명" className={input} />
      </div>

      <label className="block">
        <span className="mb-1 block text-[13px] font-semibold text-ink">연결 프로그램 (선택)</span>
        <select value={programSlug} onChange={(e) => setProgramSlug(e.target.value)} disabled={busy} className={`${input} bg-white`}>
          <option value="">연결 안 함 — 포토갤러리에만 올리기</option>
          {programs.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <span className="mt-1 block text-[12.5px] text-muted">
          프로그램을 고르면 이 사진들이 진로·직업체험의 해당 프로그램 아래 &lsquo;현장 사진&rsquo;에 최신순으로 쌓이고, 포토갤러리에도 함께 올라갑니다.
        </span>
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-8 text-center transition ${drag ? "border-green bg-green-soft" : "border-line hover:border-green/60"}`}
      >
        <p className="text-[16px] font-bold text-ink">사진을 끌어다 놓거나 클릭해서 선택하세요</p>
        <p className="mt-1 text-[13px] text-muted">JPG · PNG · WEBP · GIF, 여러 장 동시 선택 가능 · 첫 번째 사진이 대표 사진이 됩니다</p>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={(e) => { if (e.target.files) add(e.target.files); e.target.value = ""; }} />
      </div>

      {photos.length > 0 && (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {photos.map((p, i) => (
            <li key={p.id} className="overflow-hidden rounded-md border border-line">
              <div className="relative aspect-[3/2] bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className="h-full w-full object-cover" />
                <span className={`absolute left-1.5 top-1.5 rounded-sm px-1.5 py-0.5 text-[11.5px] font-bold ${i === 0 ? "bg-green text-white" : "bg-ink/85 text-white"}`}>
                  {i === 0 ? "대표" : i + 1}
                </span>
                {p.kind === "new" && (
                  <span className={`absolute bottom-1.5 left-1.5 rounded-sm px-1.5 py-0.5 text-[11.5px] ${p.status === "error" ? "bg-red text-white" : "bg-white/90 text-ink"}`}>
                    {{ ready: "새 사진", uploading: "업로드 중…", error: p.error ?? "실패" }[p.status]}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-1.5 text-[12.5px]">
                <div className="flex gap-1">
                  <button type="button" disabled={busy || i === 0} onClick={() => move(i, i - 1)} aria-label="앞으로" className="rounded border border-line px-2 py-1 disabled:opacity-30">←</button>
                  <button type="button" disabled={busy || i === photos.length - 1} onClick={() => move(i, i + 1)} aria-label="뒤로" className="rounded border border-line px-2 py-1 disabled:opacity-30">→</button>
                  {i > 0 && (
                    <button type="button" disabled={busy} onClick={() => move(i, 0)} className="rounded border border-line px-2 py-1 disabled:opacity-30">대표로</button>
                  )}
                </div>
                <button type="button" disabled={busy} onClick={() => setPhotos((cur) => cur.filter((x) => x.id !== p.id))} className="px-1 text-red underline disabled:opacity-30">
                  빼기
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {message && (
          <p role="status" className={`mr-auto rounded-lg px-4 py-2.5 text-[14px] ${message.ok ? "bg-green-soft text-green" : "bg-red/10 text-red"}`}>
            {message.text}
          </p>
        )}
        {album && (
          <button type="button" disabled={busy} onClick={() => { setPhotos(initial()); setTitle(album.title); setDescription(album.description); setProgramSlug(album.programSlug ?? ""); setMessage(null); }} className="h-11 rounded-btn border border-line px-5 text-[14px] disabled:opacity-60">
            되돌리기
          </button>
        )}
        <button type="button" onClick={save} disabled={busy} className="h-11 rounded-btn bg-green px-7 font-bold text-white hover:bg-green-dark disabled:opacity-60">
          {busy ? "저장 중…" : album ? "저장" : `앨범 등록 (${photos.length}장)`}
        </button>
      </div>
    </section>
  );
}
