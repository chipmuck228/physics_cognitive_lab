import { transferTargets } from "@/content/physics-models/specific-heat-capacity/transfer";
import { evaluateTransferAttempt } from "@/content/physics-models/specific-heat-capacity/evaluator";
import { MODEL_RELATION_IDS } from "@/content/physics-models/specific-heat-capacity/model";
import { HEAT_TRANSFER_RELATIONS } from "@/lib/content/equal-mass-heated-samples";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { TransferAttempt } from "@/types/learning";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const HEAT_ICE_INTENDED_CONDITION_CHECKS = [
  "melting-phase-change",
  "energy-can-enter-without-rise",
  "cannot-finish-with-q-equals-c-m-dt",
] as const;

export const HEAT_TRANSFER_TARGET_IDS = {
  pots: "near-two-pots-water-and-oil",
  ice: "far-ice-water-heated",
} as const;

export const HEAT_FULL_MODEL_TARGET_ID = HEAT_TRANSFER_TARGET_IDS.pots;
export const HEAT_BOUNDARY_TARGET_ID = HEAT_TRANSFER_TARGET_IDS.ice;

export const HEAT_TRANSFER_DRAFT_KIND = "heat-transfer-draft";

export type HeatTransferJudgment = "applies" | "not-necessarily" | "";

export interface HeatTransferInput {
  targetId: string;
  judgments: Record<string, HeatTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  conditionChecks?: string[];
  timestamp: string;
}

export interface HeatTransferDraft {
  kind: typeof HEAT_TRANSFER_DRAFT_KIND;
  targetId: string;
  judgments: Record<string, HeatTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  conditionChecks: Record<string, string>;
}

export function heatTransferTarget(targetId: string): TransferTarget | undefined {
  return transferTargets.find((target) => target.id === targetId);
}

export function conditionChecksRecordFromIds(
  ids: readonly string[],
): Record<string, string> {
  return Object.fromEntries(
    ids.map((id) => {
      if (id === "melting-phase-change") {
        return ["situation", id];
      }
      if (id === "energy-can-enter-without-rise") {
        return ["energy", id];
      }
      if (id === "cannot-finish-with-q-equals-c-m-dt") {
        return ["limit", id];
      }
      return [id, id];
    }),
  );
}

export function conditionCheckIdsFromRecord(
  record: Record<string, string>,
): string[] {
  return Object.values(record).filter(Boolean);
}

export function emptyHeatTransferJudgments(): Record<string, HeatTransferJudgment> {
  return Object.fromEntries(
    HEAT_TRANSFER_RELATIONS.map((relation) => [
      relation.id,
      "" as HeatTransferJudgment,
    ]),
  );
}

export function emptyHeatTransferDraft(
  targetId: string = HEAT_TRANSFER_TARGET_IDS.pots,
): HeatTransferDraft {
  return {
    kind: HEAT_TRANSFER_DRAFT_KIND,
    targetId,
    judgments: emptyHeatTransferJudgments(),
    surfaceCueSelected: false,
    studentExplanation: "",
    conditionChecks: {},
  };
}

export function selectedHeatTransferRelations(
  judgments: Record<string, HeatTransferJudgment>,
): string[] {
  return HEAT_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "applies",
  ).map((relation) => relation.id);
}

export function rejectedHeatTransferRelations(
  judgments: Record<string, HeatTransferJudgment>,
): string[] {
  return HEAT_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "not-necessarily",
  ).map((relation) => relation.id);
}

export function evaluateHeatTransfer(input: HeatTransferInput): {
  accepted: boolean;
  failureKinds: string[];
} {
  const target = heatTransferTarget(input.targetId);
  if (!target) {
    return { accepted: false, failureKinds: ["missing-explanation"] };
  }

  const selected = selectedHeatTransferRelations(input.judgments);
  const rejected = rejectedHeatTransferRelations(input.judgments);
  const modelResult = evaluateTransferAttempt({
    targetId: input.targetId,
    transferMode: target.transferMode,
    selectedRelations: selected,
    rejectedRelations: rejected,
    studentExplanation: input.studentExplanation,
    conditionChecks: input.conditionChecks ?? [],
  });
  const failureKinds = [...modelResult.failureKinds];

  if (!hasOwnWords(input.studentExplanation)) {
    failureKinds.push("missing-explanation");
  }

  if (input.surfaceCueSelected && target.transferMode === TransferMode.BOUNDARY_CONTRAST) {
    failureKinds.push("surface-similarity-only");
  } else if (input.surfaceCueSelected && !hasCoreRelation(selected)) {
    failureKinds.push("surface-similarity-only");
  }

  return {
    accepted: failureKinds.length === 0,
    failureKinds: [...new Set(failureKinds)],
  };
}

export function buildHeatTransferAttempt(input: HeatTransferInput): TransferAttempt {
  const target = heatTransferTarget(input.targetId);
  const evaluation = evaluateHeatTransfer(input);
  return {
    scenarioId: input.targetId,
    targetId: input.targetId,
    transferMode: target?.transferMode,
    response: input.studentExplanation.trim(),
    timestamp: input.timestamp,
    selectedRelations: selectedHeatTransferRelations(input.judgments),
    rejectedRelations: rejectedHeatTransferRelations(input.judgments),
    conditionReasoning:
      target?.transferMode === TransferMode.BOUNDARY_CONTRAST
        ? input.studentExplanation.trim()
        : undefined,
    accepted: evaluation.accepted,
    failureKinds: evaluation.failureKinds,
    surfaceCueSelected: input.surfaceCueSelected,
    judgments: { ...emptyHeatTransferJudgments(), ...input.judgments },
    conditionChecks: [...(input.conditionChecks ?? [])],
  };
}

export function hasAcceptedHeatFullModel(attempts: TransferAttempt[]): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.FULL_MODEL &&
      (attempt.targetId ?? attempt.scenarioId) === HEAT_FULL_MODEL_TARGET_ID,
  );
}

export function hasAcceptedHeatBoundaryContrast(
  attempts: TransferAttempt[],
): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.BOUNDARY_CONTRAST &&
      (attempt.targetId ?? attempt.scenarioId) === HEAT_BOUNDARY_TARGET_ID,
  );
}

export function hasCompletedHeatTransfer(attempts: TransferAttempt[]): boolean {
  return (
    hasAcceptedHeatFullModel(attempts) && hasAcceptedHeatBoundaryContrast(attempts)
  );
}

export function activeHeatTransferTargetId(
  attempts: TransferAttempt[],
  draftTargetId?: string,
): string {
  if (!hasAcceptedHeatFullModel(attempts)) {
    if (draftTargetId === HEAT_TRANSFER_TARGET_IDS.pots) {
      return draftTargetId;
    }
    return HEAT_TRANSFER_TARGET_IDS.pots;
  }
  return HEAT_BOUNDARY_TARGET_ID;
}

export function completeHeatPotsTransferInput(timestamp: string): HeatTransferInput {
  return {
    targetId: HEAT_TRANSFER_TARGET_IDS.pots,
    judgments: {
      [MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT]: "applies",
      [MODEL_RELATION_IDS.sameMassSameQLargerCSmallerDeltaT]: "applies",
      [MODEL_RELATION_IDS.sameCSameQLargerMassSmallerDeltaT]: "not-necessarily",
      [MODEL_RELATION_IDS.temperatureAloneDoesNotGiveQ]: "applies",
      [MODEL_RELATION_IDS.phaseChangeNeedsAnotherModel]: "not-necessarily",
    },
    surfaceCueSelected: false,
    studentExplanation:
      "质量和加热可以看成相同，油的比热容不同，所以升温不同。更烫不等于吸热更多。",
    timestamp,
  };
}

export function completeHeatIceTransferInput(timestamp: string): HeatTransferInput {
  return {
    targetId: HEAT_BOUNDARY_TARGET_ID,
    judgments: {
      [MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT]: "applies",
      [MODEL_RELATION_IDS.sameMassSameQLargerCSmallerDeltaT]: "not-necessarily",
      [MODEL_RELATION_IDS.sameCSameQLargerMassSmallerDeltaT]: "not-necessarily",
      [MODEL_RELATION_IDS.temperatureAloneDoesNotGiveQ]: "applies",
      [MODEL_RELATION_IDS.phaseChangeNeedsAnotherModel]: "applies",
    },
    surfaceCueSelected: false,
    studentExplanation:
      "还可能有能量进入，但冰在熔化，没有 ΔT 时不能用 Q = c m ΔT 写完这段过程。",
    conditionChecks: [...HEAT_ICE_INTENDED_CONDITION_CHECKS],
    timestamp,
  };
}

export function summarizeHeatTransferAttempt(attempt: TransferAttempt): string {
  if (attempt.accepted) {
    return attempt.transferMode === TransferMode.BOUNDARY_CONTRAST
      ? "你分清了熔化时不能只用升温公式写完全部能量去向。"
      : "你用能量、质量和温度变化，而不是外表，解释了这个情境。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("surface-similarity-only")) {
    return "只看见都在加热还不够。要看 Q、m、c 和 ΔT 的关系是不是还在。";
  }
  if (kinds.includes("heat-temperature-conflation")) {
    return "不能把更烫直接写成吸收的能量更多。";
  }
  if (kinds.includes("heating-without-condition")) {
    return "加热不一定升温。先检查有没有物态变化。";
  }
  if (kinds.includes("missing-heat-mass-temp-relation")) {
    return "先判断：这里还要不要用 Q、m、c 和 ΔT。";
  }
  if (kinds.includes("missing-non-transfer-limit")) {
    return "还要说出哪些想法不能直接搬过来。";
  }
  if (kinds.includes("missing-phase-change-boundary")) {
    return "先看这里是不是在熔化。能量仍可能进入，但不能只用升温公式写完。";
  }
  if (kinds.includes("keyword-sandwich") || kinds.includes("generic-boundary-talk")) {
    return "只列出质量、温度、能量还不够。要说出这个情境的条件和公式还能不能原样用。";
  }
  return "再检查一遍关系和条件，用自己的话说说为什么。";
}

export function heatTransferDraftFromAttempt(
  attempt: TransferAttempt,
): HeatTransferDraft {
  return {
    kind: HEAT_TRANSFER_DRAFT_KIND,
    targetId: attempt.targetId ?? attempt.scenarioId,
    judgments: {
      ...emptyHeatTransferJudgments(),
      ...(attempt.judgments ?? {}),
    },
    surfaceCueSelected: attempt.surfaceCueSelected === true,
    studentExplanation: attempt.conditionReasoning || attempt.response || "",
    conditionChecks: conditionChecksRecordFromIds(attempt.conditionChecks ?? []),
  };
}

function hasCoreRelation(selected: string[]): boolean {
  return selected.includes(MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT);
}
