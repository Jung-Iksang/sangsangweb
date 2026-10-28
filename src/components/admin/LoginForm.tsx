"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/admin";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-[14px] font-bold text-ink">아이디</span>
        <input name="id" defaultValue={state?.id} key={state?.id ?? "id"} autoComplete="username" required className="h-12 w-full rounded-input border border-line px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[14px] font-bold text-ink">비밀번호</span>
        <input name="password" type="password" autoComplete="current-password" required className="h-12 w-full rounded-input border border-line px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-brand-red/10 px-4 py-3 text-[14px] text-brand-red-ink">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="h-12 w-full rounded-full bg-primary font-bold text-white transition hover:bg-primary-dark disabled:opacity-60">
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
