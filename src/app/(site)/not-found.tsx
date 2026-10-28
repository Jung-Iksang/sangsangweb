import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[64px] font-bold text-primary">404</p>
      <h1 className="mt-2 text-[24px] font-bold text-ink">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-muted">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-8 font-bold text-white hover:bg-primary-dark">
        홈으로 가기
      </Link>
    </div>
  );
}
