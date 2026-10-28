import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

// 관리자 화면: 매 요청 서버 렌더링 (DB 최신값 · 로그인 확인)
export const instant = false;

export const metadata = { title: "로그인" };

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-[400px] rounded-md bg-white p-8 border border-line md:p-10">
        <div className="mb-8 text-center">
          <Image src="/logo.png" alt="상상마루" width={150} height={48} className="mx-auto h-12 w-auto" priority />
          <h1 className="mt-5 text-[20px] font-bold text-ink">관리자 로그인</h1>
          <p className="mt-1 text-[14px] text-muted">게시글·사진 관리를 위한 관리자 전용 페이지입니다.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-[13px]">
          <Link href="/" className="text-muted hover:text-green">← 홈페이지로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
