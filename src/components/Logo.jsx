// 무도짤 마크: 왕관 쓴 말풍선 + 물음표 (파비콘과 동일한 단일 실루엣)
export default function Logo({ className = "w-9 h-9" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M18 12 H46 C56 12 60 16 60 23 V42 C60 49 56 53 46 53 H28 L15 62 L19 53 H18 C8 53 4 49 4 42 V23 C4 16 8 12 18 12 Z"
        fill="#facc15"
      />
      <path d="M19 13 L21 3 L27 8.5 L32 1.5 L37 8.5 L43 3 L45 13 Z" fill="#facc15" />
      <path
        d="M26 27 C26 21.5 28.5 19 32 19 C36 19 38.5 21.5 38.5 25 C38.5 28 36.5 29.5 34.5 30.8 C33 31.8 32.3 33 32.3 35"
        fill="none"
        stroke="#111111"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <circle cx="32.3" cy="44.5" r="3.9" fill="#111111" />
    </svg>
  );
}
