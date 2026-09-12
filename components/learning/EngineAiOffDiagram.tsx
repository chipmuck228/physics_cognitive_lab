interface EngineAiOffDiagramProps {
  challengeId: string;
}

export function EngineAiOffDiagram({ challengeId }: EngineAiOffDiagramProps) {
  if (challengeId === "ai-off-condition-locked-mechanism") {
    return (
      <svg
        viewBox="0 0 280 140"
        className="h-auto w-full"
        data-testid="engine-ai-off-diagram"
        role="img"
        aria-label="气缸里气体变热，但连杆被卡住"
      >
        <rect x="36" y="24" width="88" height="92" rx="6" fill="#f4efe6" stroke="#5b5348" />
        <rect x="48" y="36" width="64" height="44" rx="4" fill="#e3c9b0" stroke="#5b5348" />
        <rect x="70" y="80" width="20" height="28" fill="#cfc6b8" stroke="#5b5348" />
        <line x1="80" y1="108" x2="132" y2="108" stroke="#5b5348" strokeWidth="4" />
        <circle cx="148" cy="108" r="10" fill="#d9d3c8" stroke="#5b5348" />
        <line x1="138" y1="98" x2="158" y2="118" stroke="#a33" strokeWidth="3" />
        <line x1="158" y1="98" x2="138" y2="118" stroke="#a33" strokeWidth="3" />
        <text x="176" y="52" fill="#5b5348" fontSize="12">
          气体变热
        </text>
        <text x="176" y="112" fill="#a33" fontSize="12">
          机械卡住
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 280 140"
      className="h-auto w-full"
      data-testid="engine-ai-off-diagram"
      role="img"
      aria-label="园林机械：气缸推动刀具"
    >
      <rect x="28" y="28" width="72" height="80" rx="6" fill="#f4efe6" stroke="#5b5348" />
      <rect x="40" y="40" width="48" height="36" rx="4" fill="#d7e3c4" stroke="#5b5348" />
      <rect x="56" y="76" width="16" height="24" fill="#cfc6b8" stroke="#5b5348" />
      <line x1="64" y1="100" x2="124" y2="100" stroke="#5b5348" strokeWidth="4" />
      <circle cx="148" cy="100" r="18" fill="#d9d3c8" stroke="#5b5348" />
      <line x1="148" y1="82" x2="148" y2="62" stroke="#5b5348" strokeWidth="3" />
      <polygon points="148,48 138,64 158,64" fill="#8aa36a" stroke="#5b5348" />
      <text x="176" y="56" fill="#5b5348" fontSize="12">
        小型园林机械
      </text>
      <text x="176" y="108" fill="#5b5348" fontSize="12">
        刀具转动
      </text>
    </svg>
  );
}
