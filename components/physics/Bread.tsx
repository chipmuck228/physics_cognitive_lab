interface BreadProps {
  temperatureC: number;
  isHeating: boolean;
}

function mix(from: number, to: number, t: number): number {
  return Math.round(from + (to - from) * t);
}

function heatProgress(temperatureC: number): number {
  const t = (temperatureC - 20) / 25;
  return Math.min(1, Math.max(0, t));
}

export function Bread({ temperatureC, isHeating }: BreadProps) {
  const heat = heatProgress(temperatureC);
  const crumb = `rgb(${mix(243, 176, heat)} ${mix(215, 132, heat)} ${mix(150, 70, heat)})`;
  const crust = `rgb(${mix(196, 122, heat)} ${mix(140, 72, heat)} ${mix(64, 32, heat)})`;

  return (
    <svg
      viewBox="0 0 120 88"
      className={`h-20 w-28 drop-shadow-sm ${isHeating ? "origin-center animate-[subtle-pulse_2.4s_ease-in-out_infinite]" : ""}`}
      aria-hidden="true"
    >
      <ellipse cx="60" cy="58" rx="38" ry="8" fill="rgba(0,0,0,0.22)" />
      <path
        d="M18 52c2-22 18-38 42-38s40 16 42 38c1 10-8 18-42 18S17 62 18 52Z"
        fill={crust}
      />
      <path
        d="M26 50c2-16 14-28 34-28s32 12 34 28c1 8-7 14-34 14S25 58 26 50Z"
        fill={crumb}
      />
      <path
        d="M40 36c3-2 7-1 8 3M58 32c2-3 7-3 9 1M74 38c2-2 6-1 7 3"
        fill="none"
        stroke={crust}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
