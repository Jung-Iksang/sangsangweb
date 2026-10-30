/** Decorative vector artwork keeps the career cards crisp at every screen size. */
export function CareerMascot({ kind }: { kind: "robot" | "drone" }) {
  return (
    <svg viewBox="0 0 220 190" fill="none" aria-hidden="true" focusable="false">
      <ellipse cx="110" cy="173" rx="58" ry="8" fill="#253c2b" opacity=".08" />
      {kind === "robot" ? <Robot /> : <Drone />}
      <path d="M185 32v12m-6-6h12M29 107v10m-5-5h10" stroke="#d6a532" strokeWidth="3" strokeLinecap="round" />
      <circle cx="35" cy="47" r="4" fill="#a3bd85" />
      <circle cx="187" cy="135" r="3" fill="#a3bd85" />
    </svg>
  );
}

function Robot() {
  return (
    <g stroke="#355742" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m83 143-4 20m48-20 5 20" strokeWidth="12" />
      <rect x="63" y="157" width="31" height="13" rx="6" fill="#77a969" />
      <rect x="119" y="157" width="31" height="13" rx="6" fill="#77a969" />
      <path d="m67 113-17 12-10-12m105-2 19-16 3-18" strokeWidth="11" />
      <circle cx="39" cy="109" r="9" fill="#f5c954" />
      <circle cx="168" cy="73" r="10" fill="#f5c954" />
      <rect x="69" y="98" width="77" height="51" rx="20" fill="#f9fcf2" />
      <rect x="85" y="110" width="45" height="25" rx="9" fill="#dcebcf" strokeWidth="2" />
      <path d="m101 118 5 5 9-10" strokeWidth="3" />
      <path d="M106 34V22" />
      <circle cx="106" cy="17" r="7" fill="#f5c954" />
      <rect x="52" y="57" width="15" height="26" rx="7" fill="#77a969" />
      <rect x="147" y="57" width="15" height="26" rx="7" fill="#77a969" />
      <rect x="61" y="35" width="94" height="69" rx="25" fill="#f9fcf2" />
      <rect x="73" y="49" width="70" height="41" rx="16" fill="#355742" stroke="none" />
      <path d="M87 65v6m41-6v6" stroke="#c5ecac" strokeWidth="6" />
      <path d="M101 77q7 6 14 0" stroke="#c5ecac" strokeWidth="2.5" />
      <path d="M79 85h7m44 0h7" stroke="#f3b0a1" strokeWidth="4" />
    </g>
  );
}

function Drone() {
  return (
    <g stroke="#486879" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m74 84-26-22m99 22 26-22M79 112l-31 17m94-17 31 17" strokeWidth="10" />
      <path d="M48 60V47m124 13V47m-124 85v-11m124 11v-11" />
      <g fill="#f9fcff">
        <ellipse cx="48" cy="44" rx="30" ry="7" transform="rotate(-8 48 44)" />
        <ellipse cx="172" cy="44" rx="30" ry="7" transform="rotate(8 172 44)" />
        <ellipse cx="48" cy="120" rx="27" ry="7" transform="rotate(8 48 120)" />
        <ellipse cx="172" cy="120" rx="27" ry="7" transform="rotate(-8 172 120)" />
      </g>
      <path d="m88 121-6 22h17m33-22 6 22h-17" />
      <rect x="64" y="64" width="92" height="64" rx="29" fill="#f9fcff" />
      <path d="M91 66q19-16 38 0" fill="#f5c954" />
      <rect x="76" y="78" width="68" height="32" rx="15" fill="#486879" stroke="none" />
      <path d="M89 90v5m42-5v5" stroke="#c6e9f3" strokeWidth="5" />
      <path d="M104 99q6 5 12 0" stroke="#c6e9f3" strokeWidth="2.5" />
      <path d="M84 106h6m40 0h6" stroke="#efb0a0" strokeWidth="4" />
      <path d="M18 61h17m150 0h17M26 72h9m150 0h9" strokeWidth="2" opacity=".4" />
    </g>
  );
}
