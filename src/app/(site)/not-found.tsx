import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[4.5rem] font-extrabold tabular-nums tracking-tight text-green">404</p>
      <h1 className="t-h2 mt-2">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-muted">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link href="/" className="btn btn-primary mt-8">
        홈으로 가기
      </Link>
    </div>
  );
}
