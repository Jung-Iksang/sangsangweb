import "server-only";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSessionToken, verifySessionToken } from "./session-token";

/** 관리자 설정 누락 여부 (로그인 화면 안내용) */
export function authConfigProblems() {
  const problems: string[] = [];
  if (!process.env.ADMIN_ID) problems.push("ADMIN_ID");
  if (!process.env.ADMIN_PASSWORD_HASH) problems.push("ADMIN_PASSWORD_HASH");
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) problems.push("AUTH_SECRET(32자 이상)");
  return problems;
}

function passwordHash() {
  const raw = process.env.ADMIN_PASSWORD_HASH ?? "";
  // .env 파일의 $ 확장 문제를 피하려고 base64 로 저장한 값도 허용
  return raw.startsWith("$2") ? raw : Buffer.from(raw, "base64").toString("utf8");
}

// ── 로그인 시도 제한 (IP당 10분에 5회) ──
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX_FAILS = 5;

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
}

export async function isLockedOut() {
  const ip = await clientIp();
  const a = attempts.get(ip);
  if (!a) return false;
  if (Date.now() - a.first > WINDOW) {
    attempts.delete(ip);
    return false;
  }
  return a.count >= MAX_FAILS;
}

async function recordFailure() {
  const ip = await clientIp();
  const a = attempts.get(ip);
  if (!a || Date.now() - a.first > WINDOW) attempts.set(ip, { count: 1, first: Date.now() });
  else a.count += 1;
}

export async function verifyCredentials(id: string, password: string) {
  const expectedId = process.env.ADMIN_ID;
  const hash = passwordHash();
  const idOk = !!expectedId && id === expectedId;
  // 아이디가 틀려도 동일한 시간이 걸리도록 항상 bcrypt 비교 수행
  const pwOk = hash ? await bcrypt.compare(password, hash) : false;
  const ok = idOk && pwOk;
  if (!ok) {
    await recordFailure();
    await new Promise((r) => setTimeout(r, 400));
  } else {
    attempts.delete(await clientIp());
  }
  return ok;
}

export async function startSession() {
  const token = await signSessionToken(process.env.ADMIN_ID!);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = await verifySessionToken(token);
  return payload ? { id: payload.sub as string } : null;
}

/** 관리자 전용 서버 코드 첫 줄에서 호출 (Server Action·관리자 페이지) */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
