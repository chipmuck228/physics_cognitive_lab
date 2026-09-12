interface CombustionEffectProps {
  active: boolean;
  label: string;
  intensity?: number;
}

export function CombustionEffect({
  active,
  label,
  intensity = 1,
}: CombustionEffectProps) {
  if (!active) {
    return null;
  }

  const opacity = 0.35 + 0.5 * Math.min(1, Math.max(0, intensity));

  return (
    <g data-testid="combustion-effect" data-combustion="active" opacity={opacity}>
      <title>{label}</title>
      <ellipse
        cx="180"
        cy="96"
        rx="48"
        ry="28"
        fill="#f3d2a4"
      />
      <ellipse
        cx="180"
        cy="94"
        rx="28"
        ry="16"
        fill="#e8b56a"
      />
      <text
        x="180"
        y="100"
        textAnchor="middle"
        fill="#6a3b12"
        fontSize="11"
        fontWeight="700"
      >
        {label}
      </text>
    </g>
  );
}
