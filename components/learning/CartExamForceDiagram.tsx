export function CartExamForceDiagram() {
  return (
    <svg
      viewBox="0 0 320 120"
      role="img"
      aria-label="小车向右运动，水平力箭头向左"
      data-testid="cart-exam-diagram"
      className="h-auto w-full max-w-md text-[var(--ink)]"
    >
      <line x1="24" y1="88" x2="296" y2="88" stroke="currentColor" strokeWidth="2" />
      <rect x="118" y="48" width="84" height="36" rx="4" fill="white" stroke="currentColor" />
      <circle cx="136" cy="88" r="8" fill="white" stroke="currentColor" />
      <circle cx="184" cy="88" r="8" fill="white" stroke="currentColor" />
      <path d="M210 66 l48 0 l-8 -6 m8 6 l-8 6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M110 40 l-48 0 l8 -6 m-8 6 l8 6" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="228" y="58" fontSize="11" fill="currentColor">
        运动
      </text>
      <text x="48" y="32" fontSize="11" fill="currentColor">
        力
      </text>
    </svg>
  );
}
