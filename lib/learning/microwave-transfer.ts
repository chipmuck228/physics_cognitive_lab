import { transferTargets } from "@/content/physics-models/energy-internal-energy-temperature/transfer";
import { MODEL_RELATION_IDS } from "@/content/physics-models/energy-internal-energy-temperature/model";
import {
  PRODUCTION_TRANSFER_REQUIRED_IDS,
} from "@/content/physics-models/energy-internal-energy-temperature/implementation-contract";
import { MICROWAVE_TRANSFER_RELATIONS } from "@/lib/content/microwave-bread";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import {
  hasAuthoredIceBoundary,
  hasAuthoredKettleTransfer,
  looksLikeGenericBoundaryTalk,
  looksLikeSurfaceHeating,
} from "@/lib/learning/microwave-text";
import type { TransferAttempt } from "@/types/learning";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const MICROWAVE_KETTLE_TARGET_ID = PRODUCTION_TRANSFER_REQUIRED_IDS[0];
export const MICROWAVE_ICE_TARGET_ID = PRODUCTION_TRANSFER_REQUIRED_IDS[1];

export const MICROWAVE_TRANSFER_DRAFT_KIND = "microwave-transfer-draft";

export const MICROWAVE_KETTLE_INTENDED_CHECKS = [
  "water",
  "ordinary-heating",
] as const;

export const MICROWAVE_ICE_INTENDED_CHECKS = [
  "energy-can-enter",
  "state-can-change",
  "cannot-transfer-unchanged",
] as const;

export type MicrowaveTransferJudgment = "applies" | "not-necessarily" | "";

export interface MicrowaveTransferInput {
  targetId: string;
  judgments: Record<string, MicrowaveTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  conditionChecks?: string[];
  timestamp: string;
}

export interface MicrowaveTransferDraft {
  kind: typeof MICROWAVE_TRANSFER_DRAFT_KIND;
  targetId: string;
  judgments: Record<string, MicrowaveTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  conditionChecks: Record<string, string>;
}

export function microwaveTransferTarget(targetId: string): TransferTarget | undefined {
  return transferTargets.find((target) => target.id === targetId);
}

export function emptyMicrowaveTransferJudgments(): Record<
  string,
  MicrowaveTransferJudgment
> {
  return Object.fromEntries(
    MICROWAVE_TRANSFER_RELATIONS.map((relation) => [
      relation.id,
      "" as MicrowaveTransferJudgment,
    ]),
  );
}

export function emptyMicrowaveTransferDraft(
  targetId: string = MICROWAVE_KETTLE_TARGET_ID,
): MicrowaveTransferDraft {
  return {
    kind: MICROWAVE_TRANSFER_DRAFT_KIND,
    targetId,
    judgments: emptyMicrowaveTransferJudgments(),
    surfaceCueSelected: false,
    studentExplanation: "",
    conditionChecks: {},
  };
}

export function selectedMicrowaveTransferRelations(
  judgments: Record<string, MicrowaveTransferJudgment>,
): string[] {
  return MICROWAVE_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "applies",
  ).map((relation) => relation.id);
}

export function rejectedMicrowaveTransferRelations(
  judgments: Record<string, MicrowaveTransferJudgment>,
): string[] {
  return MICROWAVE_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "not-necessarily",
  ).map((relation) => relation.id);
}

export function evaluateMicrowaveTransfer(input: MicrowaveTransferInput): {
  accepted: boolean;
  failureKinds: string[];
} {
  const target = microwaveTransferTarget(input.targetId);
  const failureKinds: string[] = [];
  if (!target) {
    return { accepted: false, failureKinds: ["unknown-target"] };
  }

  const selected = new Set(selectedMicrowaveTransferRelations(input.judgments));
  const rejected = new Set(rejectedMicrowaveTransferRelations(input.judgments));
  const checks = new Set(input.conditionChecks ?? []);

  if (!hasOwnWords(input.studentExplanation)) {
    failureKinds.push("missing-explanation");
  }
  if (input.surfaceCueSelected || looksLikeSurfaceHeating(input.studentExplanation)) {
    failureKinds.push("surface-similarity-only");
  }

  if (input.targetId === MICROWAVE_KETTLE_TARGET_ID) {
    const hasOrdinaryChain =
      selected.has(MODEL_RELATION_IDS.energyTransferChangesInternalEnergy) &&
      selected.has(MODEL_RELATION_IDS.internalEnergyMayChangeTemperature);
    if (!hasOrdinaryChain) {
      failureKinds.push("missing-energy-internal-temperature-relation");
    }
    if (!checks.has("water") || !checks.has("ordinary-heating")) {
      failureKinds.push("missing-kettle-system-or-condition");
    }
    if (
      selected.has(MODEL_RELATION_IDS.energyInDoesNotAlwaysRaiseTemperature) &&
      !hasOrdinaryChain
    ) {
      failureKinds.push("ice-relation-on-kettle");
    }
    if (!hasAuthoredKettleTransfer(input.studentExplanation)) {
      failureKinds.push("missing-target-specific-explanation");
    }
  }

  if (input.targetId === MICROWAVE_ICE_TARGET_ID) {
    if (!selected.has(MODEL_RELATION_IDS.energyTransferChangesInternalEnergy)) {
      failureKinds.push("missing-energy-can-enter");
    }
    if (!selected.has(MODEL_RELATION_IDS.energyInDoesNotAlwaysRaiseTemperature)) {
      failureKinds.push("missing-energy-in-boundary");
    }
    if (
      selected.has(MODEL_RELATION_IDS.internalEnergyMayChangeTemperature) &&
      rejected.has(MODEL_RELATION_IDS.energyInDoesNotAlwaysRaiseTemperature)
    ) {
      failureKinds.push("ordinary-rise-applied-to-ice");
    }
    if (
      !checks.has("energy-can-enter") ||
      !checks.has("state-can-change") ||
      !checks.has("cannot-transfer-unchanged")
    ) {
      failureKinds.push("missing-ice-boundary-checks");
    }
    if (
      looksLikeGenericBoundaryTalk(input.studentExplanation) ||
      !hasAuthoredIceBoundary(input.studentExplanation)
    ) {
      failureKinds.push("generic-boundary-talk");
    }
  }

  return {
    accepted: failureKinds.length === 0,
    failureKinds: [...new Set(failureKinds)],
  };
}

export function buildMicrowaveTransferAttempt(
  input: MicrowaveTransferInput,
): TransferAttempt {
  const target = microwaveTransferTarget(input.targetId);
  const evaluation = evaluateMicrowaveTransfer(input);
  return {
    scenarioId: input.targetId,
    targetId: input.targetId,
    transferMode: target?.transferMode,
    response: input.studentExplanation.trim(),
    timestamp: input.timestamp,
    selectedRelations: selectedMicrowaveTransferRelations(input.judgments),
    rejectedRelations: rejectedMicrowaveTransferRelations(input.judgments),
    conditionReasoning:
      target?.transferMode === TransferMode.BOUNDARY_CONTRAST
        ? input.studentExplanation.trim()
        : undefined,
    accepted: evaluation.accepted,
    failureKinds: evaluation.failureKinds,
    surfaceCueSelected: input.surfaceCueSelected,
    judgments: { ...emptyMicrowaveTransferJudgments(), ...input.judgments },
    conditionChecks: [...(input.conditionChecks ?? [])],
  };
}

export function hasAcceptedMicrowaveFullModel(attempts: TransferAttempt[]): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.FULL_MODEL &&
      (attempt.targetId ?? attempt.scenarioId) === MICROWAVE_KETTLE_TARGET_ID,
  );
}

export function hasAcceptedMicrowaveBoundaryContrast(
  attempts: TransferAttempt[],
): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.BOUNDARY_CONTRAST &&
      (attempt.targetId ?? attempt.scenarioId) === MICROWAVE_ICE_TARGET_ID,
  );
}

export function hasCompletedMicrowaveTransfer(attempts: TransferAttempt[]): boolean {
  return (
    hasAcceptedMicrowaveFullModel(attempts) &&
    hasAcceptedMicrowaveBoundaryContrast(attempts)
  );
}

export function activeMicrowaveTransferTargetId(
  attempts: TransferAttempt[],
  draftTargetId?: string,
): string {
  if (!hasAcceptedMicrowaveFullModel(attempts)) {
    return draftTargetId === MICROWAVE_KETTLE_TARGET_ID
      ? draftTargetId
      : MICROWAVE_KETTLE_TARGET_ID;
  }
  return MICROWAVE_ICE_TARGET_ID;
}

export function completeMicrowaveKettleTransferInput(
  timestamp: string,
): MicrowaveTransferInput {
  return {
    targetId: MICROWAVE_KETTLE_TARGET_ID,
    judgments: {
      [MODEL_RELATION_IDS.energyTransferChangesInternalEnergy]: "applies",
      [MODEL_RELATION_IDS.internalEnergyMayChangeTemperature]: "applies",
      [MODEL_RELATION_IDS.energyInDoesNotAlwaysRaiseTemperature]: "not-necessarily",
      [MODEL_RELATION_IDS.temperatureDoesNotEqualInternalEnergy]: "applies",
    },
    surfaceCueSelected: false,
    studentExplanation: "能量进入壶里的水，水的内能增加，没有物态变化，所以温度升高。",
    conditionChecks: [...MICROWAVE_KETTLE_INTENDED_CHECKS],
    timestamp,
  };
}

export function completeMicrowaveIceTransferInput(
  timestamp: string,
): MicrowaveTransferInput {
  return {
    targetId: MICROWAVE_ICE_TARGET_ID,
    judgments: {
      [MODEL_RELATION_IDS.energyTransferChangesInternalEnergy]: "applies",
      [MODEL_RELATION_IDS.internalEnergyMayChangeTemperature]: "not-necessarily",
      [MODEL_RELATION_IDS.energyInDoesNotAlwaysRaiseTemperature]: "applies",
      [MODEL_RELATION_IDS.temperatureDoesNotEqualInternalEnergy]: "applies",
    },
    surfaceCueSelected: false,
    studentExplanation: "能量还可以进入冰块，内能或状态可以变，但温度不一定升高。",
    conditionChecks: [...MICROWAVE_ICE_INTENDED_CHECKS],
    timestamp,
  };
}

export function summarizeMicrowaveTransferAttempt(attempt: TransferAttempt): string {
  if (attempt.accepted) {
    return attempt.transferMode === TransferMode.BOUNDARY_CONTRAST
      ? "你分清了：能量可以进入，但不能把“温度一定升高”原样搬过来。"
      : "你用能量进入、内能变化和温度升高，解释了壶里的水。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("surface-similarity-only")) {
    return "只说“也是加热”还不够。先看这个系统里能量和温度怎样连。";
  }
  if (kinds.includes("ice-relation-on-kettle") || kinds.includes("ordinary-rise-applied-to-ice")) {
    return "这句话要绑在当前这个情境上，不能把另一个情况的关系直接套过来。";
  }
  if (kinds.includes("generic-boundary-talk")) {
    return "只写“还在加热”或“情况不一样”还不够。要说出能量可以进入，但温度不一定升高。";
  }
  return "再检查这个情境里，哪些关系还能用，哪一句不能原样搬。";
}

export function microwaveTransferDraftFromAttempt(
  attempt: TransferAttempt,
): MicrowaveTransferDraft {
  return {
    kind: MICROWAVE_TRANSFER_DRAFT_KIND,
    targetId: attempt.targetId ?? attempt.scenarioId,
    judgments: {
      ...emptyMicrowaveTransferJudgments(),
      ...(attempt.judgments ?? {}),
    },
    surfaceCueSelected: attempt.surfaceCueSelected === true,
    studentExplanation: attempt.conditionReasoning || attempt.response || "",
    conditionChecks: Object.fromEntries(
      (attempt.conditionChecks ?? []).map((id) => [id, id]),
    ),
  };
}

export function conditionCheckIdsFromRecord(
  record: Record<string, string>,
): string[] {
  return Object.values(record).filter(Boolean);
}
