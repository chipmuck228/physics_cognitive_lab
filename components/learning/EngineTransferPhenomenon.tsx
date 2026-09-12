import { ENGINE_TRANSFER_TARGET_IDS } from "@/lib/learning/engine-transfer";

interface EngineTransferPhenomenonProps {
  targetId: string;
}

export function EngineTransferPhenomenon({ targetId }: EngineTransferPhenomenonProps) {
  if (targetId === ENGINE_TRANSFER_TARGET_IDS.steam) {
    return <SteamPistonVisual />;
  }
  if (targetId === ENGINE_TRANSFER_TARGET_IDS.lab) {
    return <LabPistonVisual />;
  }
  return <MotorcyclePistonVisual />;
}

function MotorcyclePistonVisual() {
  return (
    <figure
      className="w-full max-w-md rounded-[2rem] bg-[var(--scene)] p-4 sm:p-6"
      data-testid="engine-transfer-visual-motorcycle"
    >
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="摩托车活塞装置示意">
        <rect x="24" y="70" width="70" height="44" rx="8" fill="#d7c4a3" stroke="#5c4a32" />
        <text x="59" y="96" textAnchor="middle" fontSize="11" fill="#3b2f22">
          气缸
        </text>
        <rect x="48" y="52" width="22" height="28" rx="3" fill="#8aa3b5" stroke="#3b2f22" />
        <line x1="94" y1="92" x2="150" y2="118" stroke="#3b2f22" strokeWidth="4" />
        <circle cx="176" cy="128" r="22" fill="none" stroke="#3b2f22" strokeWidth="6" />
        <circle cx="236" cy="128" r="22" fill="none" stroke="#3b2f22" strokeWidth="6" />
        <line x1="176" y1="128" x2="236" y2="128" stroke="#3b2f22" strokeWidth="5" />
        <text x="206" y="36" textAnchor="middle" fontSize="12" fill="#3b2f22">
          摩托车
        </text>
      </svg>
    </figure>
  );
}

function LabPistonVisual() {
  return (
    <figure
      className="w-full max-w-md rounded-[2rem] bg-[var(--scene)] p-4 sm:p-6"
      data-testid="engine-transfer-visual-lab"
    >
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="实验室燃烧活塞装置示意">
        <rect x="90" y="48" width="90" height="86" rx="10" fill="#d7c4a3" stroke="#5c4a32" />
        <rect x="118" y="28" width="34" height="70" rx="4" fill="#8aa3b5" stroke="#3b2f22" />
        <circle cx="135" cy="108" r="8" fill="#e07a3d" />
        <text x="160" y="160" textAnchor="middle" fontSize="12" fill="#3b2f22">
          实验室装置
        </text>
      </svg>
    </figure>
  );
}

function SteamPistonVisual() {
  return (
    <figure
      className="w-full max-w-md rounded-[2rem] bg-[var(--scene)] p-4 sm:p-6"
      data-testid="engine-transfer-visual-steam"
    >
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="蒸汽活塞装置示意">
        <ellipse cx="70" cy="110" rx="36" ry="28" fill="#c9d6e3" stroke="#3b2f22" />
        <text x="70" y="114" textAnchor="middle" fontSize="11" fill="#3b2f22">
          蒸汽
        </text>
        <line x1="106" y1="100" x2="160" y2="78" stroke="#3b2f22" strokeWidth="4" />
        <rect x="160" y="52" width="80" height="54" rx="8" fill="#d7c4a3" stroke="#5c4a32" />
        <rect x="186" y="36" width="28" height="40" rx="3" fill="#8aa3b5" stroke="#3b2f22" />
        <text x="160" y="160" textAnchor="middle" fontSize="12" fill="#3b2f22">
          蒸汽推动活塞
        </text>
      </svg>
    </figure>
  );
}
