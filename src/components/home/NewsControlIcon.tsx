export function NewsControlIcon({ kind }: { kind: "prev" | "next" | "pause" | "play" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {kind === "prev" && <path d="m14 6-6 6 6 6" />}
      {kind === "next" && <path d="m10 6 6 6-6 6" />}
      {kind === "pause" && <path d="M9 6v12M15 6v12" strokeWidth="3" />}
      {kind === "play" && <path d="m9 5 10 7-10 7z" fill="currentColor" stroke="none" />}
    </svg>
  );
}
