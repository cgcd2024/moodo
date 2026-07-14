// 무도리 로고: 레퍼런스 트레이싱, 파비콘과 동일 (색상만 브랜드 노랑)
export default function Logo({ className = "w-9 h-9" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M8 17 L12 21 M13 10.5 L15.5 15.5 M20 7 L21 12.5"
        stroke="#facc15"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M39 15 L41 5 L45 9.5 L48.5 3 L52 8.5 L54.5 5.5 L54 14"
        fill="none"
        stroke="#facc15"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 35
           C12.5 31 12 27 13 23.5
           C15 15.5 22 11.5 30.5 11.5
           C40.5 11.5 48 18.5 48 28.5
           C48 36.5 45.5 42 41.5 46
           C38.5 49 34 51.5 28.5 52.5
           C25 53.2 21.5 53 20.5 51.5
           C22.5 49.5 26.5 48 30 46.5
           C33.5 45 35.5 42.5 35 40
           C35.5 36 32 33 27.5 33
           C21 33 15.5 34 13.5 35 Z"
        fill="#facc15"
      />
      <circle cx="23" cy="27" r="2.6" fill="#ffffff" />
      <circle cx="37.5" cy="29" r="2.6" fill="#ffffff" />
      <ellipse cx="26" cy="58.5" rx="3.6" ry="2.8" fill="#facc15" transform="rotate(-25 26 58.5)" />
    </svg>
  );
}
