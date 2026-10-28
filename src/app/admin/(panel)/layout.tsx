import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/actions/admin";
import { AdminNav } from "@/components/admin/AdminNav";

// 관리자 화면은 매 요청마다 로그인 확인 후 서버에서 렌더링
export const instant = false;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-5 lg:h-20">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.png" alt="상상마루" width={100} height={32} className="h-8 w-auto" />
            <span className="rounded bg-ink px-1.5 py-0.5 text-[11px] font-bold text-white">ADMIN</span>
          </Link>
        </div>
        <AdminNav />
        <div className="hidden border-t border-line p-5 text-[13px] text-muted lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <p className="mb-3">
            <strong className="text-ink">{admin.id}</strong> 님 로그인 중
          </p>
          <div className="flex gap-2">
            <Link href="/" target="_blank" className="flex-1 rounded-lg border border-line py-2 text-center hover:border-primary hover:text-primary">
              사이트 보기
            </Link>
            <form action={logoutAction} className="flex-1">
              <button className="w-full rounded-lg border border-line py-2 hover:border-brand-red hover:text-brand-red-ink">로그아웃</button>
            </form>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-end gap-2 border-b border-line bg-white px-5 py-2 text-[13px] lg:hidden">
          <Link href="/" target="_blank" className="rounded-lg border border-line px-3 py-1.5">사이트 보기</Link>
          <form action={logoutAction}>
            <button className="rounded-lg border border-line px-3 py-1.5">로그아웃</button>
          </form>
        </div>
        <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
