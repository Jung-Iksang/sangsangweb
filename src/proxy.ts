import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

/**
 * /admin 보호 (1차 확인). 실제 권한 검사는 각 Server Action / 관리자 페이지의 requireAdmin() 에서 다시 수행.
 * 관리자 영역은 검색엔진에 노출되지 않도록 X-Robots-Tag 헤더도 붙인다.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  let res: NextResponse;
  if (!session && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    res = NextResponse.redirect(url);
  } else if (session && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    res = NextResponse.redirect(url);
  } else {
    res = NextResponse.next();
  }
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
