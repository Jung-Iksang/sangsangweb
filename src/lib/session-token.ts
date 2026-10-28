import { jwtVerify, SignJWT } from "jose";

/** 관리자 세션 토큰 (proxy.ts 와 서버 코드에서 공용) */
export const SESSION_COOKIE = "smaru_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7일

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(adminId: string) {
  const key = secretKey();
  if (!key) throw new Error("AUTH_SECRET 환경변수(32자 이상)가 필요합니다.");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
}

export async function verifySessionToken(token: string | undefined | null) {
  const key = secretKey();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (payload.role !== "admin" || payload.sub !== process.env.ADMIN_ID) return null;
    return payload;
  } catch {
    return null;
  }
}
