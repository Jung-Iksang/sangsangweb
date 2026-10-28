"use client";

import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { savePost } from "@/actions/admin";
import type { BoardType } from "@/db/schema";
import { uploadImage } from "@/lib/upload-client";

type Initial = { id?: number; boardType: BoardType; title: string; content: string; isPublished: boolean };

export function PostEditor({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [boardType, setBoardType] = useState<BoardType>(initial.boardType);
  const [title, setTitle] = useState(initial.title);
  const [isPublished, setIsPublished] = useState(initial.isPublished);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
    ],
    content: initial.content || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "tiptap prose-post px-5 py-4", "aria-label": "본문" },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) => f.type.startsWith("image/"));
        if (!files.length) return false;
        event.preventDefault();
        void insertImages(files);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
        if (!files.length) return false;
        void insertImages(files);
        return true;
      },
    },
  });

  async function insertImages(files: File[]) {
    if (!editor) return;
    setUploading(true);
    setError(null);
    try {
      for (const f of files) {
        const up = await uploadImage(f, "posts");
        editor.chain().focus().setImage({ src: up.url, alt: title || f.name.replace(/\.[^.]+$/, "") }).run();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  function submit() {
    if (!editor) return;
    setError(null);
    start(async () => {
      const res = await savePost({ id: initial.id, boardType, title, content: editor.getHTML(), isPublished });
      if (!res.ok) return setError(res.error);
      router.push(`/admin/posts?board=${boardType}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-md bg-white p-5 border border-line sm:grid-cols-[180px_1fr]">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-ink">게시판</span>
          <select
            value={boardType}
            onChange={(e) => setBoardType(e.target.value as BoardType)}
            className="h-11 w-full rounded-md border border-line bg-white px-3 outline-none focus:border-green"
          >
            <option value="notice">공지사항</option>
            <option value="press">보도자료</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-ink">제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="제목을 입력하세요 (검색 결과에 그대로 노출됩니다)"
            className="h-11 w-full rounded-md border border-line px-4 outline-none focus:border-green"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-md bg-white border border-line">
        <Toolbar editor={editor} onImage={() => fileRef.current?.click()} uploading={uploading} />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) void insertImages(files);
          }}
        />
        <EditorContent editor={editor} />
      </div>
      <p className="text-[13px] text-muted">
        팁: 이미지를 본문에 끌어다 놓거나 붙여넣을 수 있습니다. 본문 첫 이미지가 목록·검색 미리보기 이미지로 쓰입니다.
      </p>

      {error && <p role="alert" className="rounded-lg bg-brand-red/10 px-4 py-3 text-[14px] text-red">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md bg-white p-5 border border-line">
        <label className="flex items-center gap-2 text-[15px] text-ink">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-5 w-5 accent-[var(--color-green)]" />
          홈페이지에 공개
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.back()} className="h-11 rounded-btn border border-line px-6 font-bold text-body hover:border-ink">
            취소
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending || uploading || !editor}
            className="h-11 rounded-btn bg-green px-8 font-bold text-white hover:bg-green-dark disabled:opacity-60"
          >
            {pending ? "저장 중…" : initial.id ? "수정 완료" : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toolbar({ editor, onImage, uploading }: { editor: Editor | null; onImage: () => void; uploading: boolean }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            strike: e.isActive("strike"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            ul: e.isActive("bulletList"),
            ol: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
          }
        : null,
  });
  if (!editor || !s) return <div className="h-12 border-b border-line bg-cream" />;

  const btn = (active: boolean) =>
    `h-9 min-w-9 rounded-lg px-2 text-[14px] font-medium transition ${active ? "bg-green text-white" : "text-body hover:bg-white"}`;
  const c = () => editor.chain().focus();

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-line bg-cream px-3 py-2" role="toolbar" aria-label="서식">
      <button type="button" className={btn(s.h2)} onClick={() => c().toggleHeading({ level: 2 }).run()} title="큰 제목">H2</button>
      <button type="button" className={btn(s.h3)} onClick={() => c().toggleHeading({ level: 3 }).run()} title="작은 제목">H3</button>
      <span className="mx-1 h-5 w-px bg-line" />
      <button type="button" className={`${btn(s.bold)} font-bold`} onClick={() => c().toggleBold().run()} title="굵게">B</button>
      <button type="button" className={`${btn(s.italic)} italic`} onClick={() => c().toggleItalic().run()} title="기울임">I</button>
      <button type="button" className={`${btn(s.underline)} underline`} onClick={() => c().toggleUnderline().run()} title="밑줄">U</button>
      <button type="button" className={`${btn(s.strike)} line-through`} onClick={() => c().toggleStrike().run()} title="취소선">S</button>
      <span className="mx-1 h-5 w-px bg-line" />
      <button type="button" className={btn(s.ul)} onClick={() => c().toggleBulletList().run()} title="글머리 목록">• 목록</button>
      <button type="button" className={btn(s.ol)} onClick={() => c().toggleOrderedList().run()} title="번호 목록">1. 목록</button>
      <button type="button" className={btn(s.quote)} onClick={() => c().toggleBlockquote().run()} title="인용">“ 인용</button>
      <button
        type="button"
        className={btn(s.link)}
        title="링크"
        onClick={() => {
          if (s.link) return c().unsetLink().run();
          const url = prompt("연결할 주소(URL)를 입력하세요", "https://");
          if (url && /^(https?:\/\/|mailto:|tel:)/.test(url)) c().extendMarkRange("link").setLink({ href: url }).run();
        }}
      >
        🔗 링크
      </button>
      <button type="button" className={btn(false)} onClick={onImage} disabled={uploading} title="이미지 넣기">
        {uploading ? "업로드 중…" : "🖼 이미지"}
      </button>
      <span className="mx-1 h-5 w-px bg-line" />
      <button type="button" className={btn(false)} onClick={() => c().undo().run()} title="되돌리기">↶</button>
      <button type="button" className={btn(false)} onClick={() => c().redo().run()} title="다시 실행">↷</button>
    </div>
  );
}
