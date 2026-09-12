interface EngineCylinderProps {
  label: string;
}

export function EngineCylinder({ label }: EngineCylinderProps) {
  return (
    <g>
      <title>{label}</title>
      <rect
        x="108"
        y="54"
        width="144"
        height="268"
        rx="10"
        fill="#d8d0c4"
        stroke="#8d8478"
        strokeWidth="3"
      />
      <rect
        x="114"
        y="62"
        width="132"
        height="252"
        rx="6"
        fill="#ece6db"
        stroke="#b7aea1"
        strokeWidth="1.5"
      />
      <rect x="114" y="62" width="8" height="252" fill="#c9c1b5" />
      <rect x="238" y="62" width="8" height="252" fill="#c9c1b5" />
      <rect x="96" y="46" width="168" height="22" rx="4" fill="#cfc6ba" stroke="#8d8478" strokeWidth="2" />
      <text
        x="180"
        y="38"
        textAnchor="middle"
        fill="#efe8dc"
        fontSize="12"
      >
        {label}
      </text>
    </g>
  );
}
