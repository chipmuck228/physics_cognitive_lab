import { transferTargets } from "@/content/physics-models/ohms-law/transfer";
import { OHMS_TRANSFER_RELATIONS } from "@/lib/content/simple-resistor-circuit";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import {
  evaluateOhmsBoundaryAuthored,
  evaluateOhmsOneCorrectControlAuthored,
} from "@/lib/learning/ohms-authored";
import type { TransferAttempt } from "@/types/learning";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const OHMS_TRANSFER_TARGET_IDS = {
  wire: "near-heating-wire-one-resistor",
  filament: "far-filament-lamp-not-constant-r",
} as const;

export const OHMS_TRANSFER_DRAFT_KIND = "ohms-transfer-draft";

export type OhmsTransferJudgment = "applies" | "not-necessarily" | "";

export interface OhmsTransferInput {
  targetId: string;
  judgments: Record<string, OhmsTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  conditionChecks?: string[];
  timestamp: string;
}

export interface OhmsTransferDraft {
  kind: typeof OHMS_TRANSFER_DRAFT_KIND;
  targetId: string;
  judgments: Record<string, OhmsTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  conditionChecks: Record<string, string>;
}

export function ohmsTransferTarget(targetId: string): TransferTarget | undefined {
  return transferTargets.find((target) => target.id === targetId);
}

export function emptyOhmsTransferJudgments(): Record<string, OhmsTransferJudgment> {
  return Object.fromEntries(
    OHMS_TRANSFER_RELATIONS.map((relation) => [relation.id, "" as OhmsTransferJudgment]),
  );
}

export function emptyOhmsTransferDraft(
  targetId: string = OHMS_TRANSFER_TARGET_IDS.wire,
): OhmsTransferDraft {
  return {
    kind: OHMS_TRANSFER_DRAFT_KIND,
    targetId,
    judgments: emptyOhmsTransferJudgments(),
    surfaceCueSelected: false,
    studentExplanation: "",
    conditionChecks: {},
  };
}

export function evaluateOhmsTransfer(input: OhmsTransferInput): {
  accepted: boolean;
  failureKinds: string[];
} {
  const target = ohmsTransferTarget(input.targetId);
  const failureKinds: string[] = [];
  if (!target) {
    return { accepted: false, failureKinds: ["unknown-target"] };
  }
  if (input.surfaceCueSelected) {
    failureKinds.push("surface-cue");
  }
  if (looksLikeAlsoACircuit(input.studentExplanation)) {
    failureKinds.push("also-a-circuit");
  }
  if (!hasOwnWords(input.studentExplanation)) {
    failureKinds.push("generic-text");
  }

  const sameRelation = input.judgments["same-relation"] === "applies";
  const rejectsSeries = input.judgments["need-series-course"] === "not-necessarily";
  const rejectsPower = input.judgments["need-power"] === "not-necessarily";

  if (target.transferMode === TransferMode.FULL_MODEL) {
    if (!sameRelation || !rejectsSeries || !rejectsPower) {
      failureKinds.push("missing-relation");
    }
    const authored = evaluateOhmsOneCorrectControlAuthored(input.studentExplanation);
    if (!authored.ok) {
      failureKinds.push(authored.failureKind);
    }
  }

  if (target.transferMode === TransferMode.BOUNDARY_CONTRAST) {
    const checks = new Set(input.conditionChecks ?? []);
    if (!checks.has("r-may-change") || !checks.has("not-fixed-proportion")) {
      failureKinds.push("missing-boundary");
    }
    const authored = evaluateOhmsBoundaryAuthored(input.studentExplanation);
    if (!authored.ok) {
      failureKinds.push(authored.failureKind);
    }
  }

  return { accepted: failureKinds.length === 0, failureKinds };
}

export function buildOhmsTransferAttempt(input: OhmsTransferInput): TransferAttempt {
  const evaluation = evaluateOhmsTransfer(input);
  const target = ohmsTransferTarget(input.targetId);
  return {
    scenarioId: input.targetId,
    targetId: input.targetId,
    transferMode: target?.transferMode,
    response: input.studentExplanation,
    identifiedSharedModel: evaluation.accepted,
    accepted: evaluation.accepted,
    failureKinds: evaluation.failureKinds,
    selectedRelations: Object.entries(input.judgments)
      .filter(([, value]) => value === "applies")
      .map(([id]) => id),
    rejectedRelations: Object.entries(input.judgments)
      .filter(([, value]) => value === "not-necessarily")
      .map(([id]) => id),
    conditionChecks: input.conditionChecks,
    surfaceCueSelected: input.surfaceCueSelected,
    timestamp: input.timestamp,
    conditionReasoning: input.studentExplanation,
    judgments: input.judgments,
  };
}

export function hasCompletedOhmsTransfer(attempts: TransferAttempt[]): boolean {
  const wire = attempts.some(
    (attempt) =>
      attempt.targetId === OHMS_TRANSFER_TARGET_IDS.wire && attempt.accepted === true,
  );
  const filament = attempts.some(
    (attempt) =>
      attempt.targetId === OHMS_TRANSFER_TARGET_IDS.filament &&
      attempt.accepted === true,
  );
  return wire && filament;
}

export function activeOhmsTransferTargetId(attempts: TransferAttempt[]): string {
  if (
    !attempts.some(
      (attempt) =>
        attempt.targetId === OHMS_TRANSFER_TARGET_IDS.wire && attempt.accepted === true,
    )
  ) {
    return OHMS_TRANSFER_TARGET_IDS.wire;
  }
  return OHMS_TRANSFER_TARGET_IDS.filament;
}

export function summarizeOhmsTransferAttempt(attempt: TransferAttempt): string {
  if (attempt.accepted) {
    return "这次说明对上了这个新情境。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("also-a-circuit")) {
    return "只说“也是电路所以还是公式”，还不能说明这个新情境。";
  }
  if (kinds.includes("missing-boundary") || kinds.includes("fixed-proportion")) {
    return "灯丝发热时，电阻不一定还能看成不变。";
  }
  if (
    kinds.includes("wrong-direction") ||
    kinds.includes("negated") ||
    kinds.includes("reversed-control")
  ) {
    return "先写清哪个量不变，电流会怎样。方向写反了还不能说明这个情境。";
  }
  if (kinds.includes("no-control") || kinds.includes("token-sandwich")) {
    return "先写清哪个量不变，电流会怎样。";
  }
  return "这个新情境还没说清楚。";
}

function looksLikeAlsoACircuit(text: string): boolean {
  const compact = text.replace(/\s+/g, "");
  return /也是电路/.test(compact) && /I=U\/R|电流等于电压除以电阻/.test(compact);
}

export function completeOhmsWireTransferInput(timestamp: string): OhmsTransferInput {
  return {
    targetId: OHMS_TRANSFER_TARGET_IDS.wire,
    judgments: {
      "same-relation": "applies",
      "need-series-course": "not-necessarily",
      "need-power": "not-necessarily",
    },
    surfaceCueSelected: false,
    studentExplanation:
      "电阻没变的时候，电压更大，电流就更大。换更细的电热丝时电压不变，电阻更大电流更小。",
    timestamp,
  };
}

export function completeOhmsFilamentTransferInput(timestamp: string): OhmsTransferInput {
  return {
    targetId: OHMS_TRANSFER_TARGET_IDS.filament,
    judgments: {
      "same-relation": "not-necessarily",
      "need-series-course": "not-necessarily",
      "need-power": "not-necessarily",
    },
    surfaceCueSelected: false,
    studentExplanation:
      "灯丝发热时电阻可能会变，所以不能再用固定电阻说电流一定跟着电压成正比。",
    conditionChecks: ["r-may-change", "not-fixed-proportion"],
    timestamp,
  };
}
