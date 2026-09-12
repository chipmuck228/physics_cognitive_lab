import { transferTargets } from "@/content/physics-models/density-mass-volume/transfer";
import { evaluateTransferAttempt } from "@/content/physics-models/density-mass-volume/evaluator";
import { MODEL_RELATION_IDS } from "@/content/physics-models/density-mass-volume/model";
import {
  SAMPLES_TRANSFER_RELATIONS,
  SAMPLES_TRANSFER_TARGET_IDS,
} from "@/lib/content/equal-volume-material-samples";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { TransferAttempt } from "@/types/learning";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export { SAMPLES_TRANSFER_TARGET_IDS };

export const SAMPLES_FULL_MODEL_TARGET_IDS = [
  SAMPLES_TRANSFER_TARGET_IDS.cups,
  SAMPLES_TRANSFER_TARGET_IDS.stone,
] as const;

export const SAMPLES_BOUNDARY_TARGET_ID = SAMPLES_TRANSFER_TARGET_IDS.hollow;

export const SAMPLES_TRANSFER_DRAFT_KIND = "samples-transfer-draft";

export type SamplesTransferJudgment = "applies" | "not-necessarily" | "";

export interface SamplesTransferInput {
  targetId: string;
  judgments: Record<string, SamplesTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  timestamp: string;
}

export interface SamplesTransferDraft {
  kind: typeof SAMPLES_TRANSFER_DRAFT_KIND;
  targetId: string;
  judgments: Record<string, SamplesTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
}

export function samplesTransferTarget(targetId: string): TransferTarget | undefined {
  return transferTargets.find((target) => target.id === targetId);
}

export function emptySamplesTransferJudgments(): Record<string, SamplesTransferJudgment> {
  return Object.fromEntries(
    SAMPLES_TRANSFER_RELATIONS.map((relation) => [
      relation.id,
      "" as SamplesTransferJudgment,
    ]),
  );
}

export function emptySamplesTransferDraft(
  targetId: string = SAMPLES_TRANSFER_TARGET_IDS.cups,
): SamplesTransferDraft {
  return {
    kind: SAMPLES_TRANSFER_DRAFT_KIND,
    targetId,
    judgments: emptySamplesTransferJudgments(),
    surfaceCueSelected: false,
    studentExplanation: "",
  };
}

export function selectedSamplesTransferRelations(
  judgments: Record<string, SamplesTransferJudgment>,
): string[] {
  return SAMPLES_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "applies",
  ).map((relation) => relation.id);
}

export function rejectedSamplesTransferRelations(
  judgments: Record<string, SamplesTransferJudgment>,
): string[] {
  return SAMPLES_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "not-necessarily",
  ).map((relation) => relation.id);
}

export function evaluateSamplesTransfer(input: SamplesTransferInput): {
  accepted: boolean;
  failureKinds: string[];
} {
  const target = samplesTransferTarget(input.targetId);
  if (!target) {
    return { accepted: false, failureKinds: ["missing-explanation"] };
  }

  const selected = selectedSamplesTransferRelations(input.judgments);
  const rejected = rejectedSamplesTransferRelations(input.judgments);
  const modelResult = evaluateTransferAttempt({
    targetId: input.targetId,
    transferMode: target.transferMode,
    selectedRelations: selected,
    rejectedRelations: rejected,
    studentExplanation: input.studentExplanation,
  });
  const failureKinds = [...modelResult.failureKinds];

  if (!hasOwnWords(input.studentExplanation)) {
    failureKinds.push("missing-explanation");
  }

  if (input.surfaceCueSelected && !hasCoreRelation(selected, target.transferMode)) {
    failureKinds.push("surface-similarity-only");
  }

  return {
    accepted: failureKinds.length === 0,
    failureKinds: [...new Set(failureKinds)],
  };
}

export function buildSamplesTransferAttempt(
  input: SamplesTransferInput,
): TransferAttempt {
  const target = samplesTransferTarget(input.targetId);
  const evaluation = evaluateSamplesTransfer(input);
  return {
    scenarioId: input.targetId,
    targetId: input.targetId,
    transferMode: target?.transferMode,
    response: input.studentExplanation.trim(),
    timestamp: input.timestamp,
    selectedRelations: selectedSamplesTransferRelations(input.judgments),
    rejectedRelations: rejectedSamplesTransferRelations(input.judgments),
    conditionReasoning:
      target?.transferMode === TransferMode.BOUNDARY_CONTRAST
        ? input.studentExplanation.trim()
        : undefined,
    accepted: evaluation.accepted,
    failureKinds: evaluation.failureKinds,
    surfaceCueSelected: input.surfaceCueSelected,
    judgments: { ...emptySamplesTransferJudgments(), ...input.judgments },
  };
}

export function hasAcceptedSamplesFullModel(attempts: TransferAttempt[]): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.FULL_MODEL &&
      SAMPLES_FULL_MODEL_TARGET_IDS.includes(
        (attempt.targetId ?? attempt.scenarioId) as (typeof SAMPLES_FULL_MODEL_TARGET_IDS)[number],
      ),
  );
}

export function hasAcceptedSamplesBoundaryContrast(
  attempts: TransferAttempt[],
): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.BOUNDARY_CONTRAST &&
      (attempt.targetId ?? attempt.scenarioId) === SAMPLES_BOUNDARY_TARGET_ID,
  );
}

export function hasCompletedSamplesTransfer(attempts: TransferAttempt[]): boolean {
  return (
    hasAcceptedSamplesFullModel(attempts) &&
    hasAcceptedSamplesBoundaryContrast(attempts)
  );
}

export function activeSamplesTransferTargetId(
  attempts: TransferAttempt[],
  draftTargetId?: string,
): string {
  if (!hasAcceptedSamplesFullModel(attempts)) {
    if (
      draftTargetId === SAMPLES_TRANSFER_TARGET_IDS.stone ||
      draftTargetId === SAMPLES_TRANSFER_TARGET_IDS.cups
    ) {
      return draftTargetId;
    }
    return SAMPLES_TRANSFER_TARGET_IDS.cups;
  }
  return SAMPLES_BOUNDARY_TARGET_ID;
}

export function completeSamplesCupsTransferInput(
  timestamp: string,
): SamplesTransferInput {
  return {
    targetId: SAMPLES_TRANSFER_TARGET_IDS.cups,
    judgments: {
      [MODEL_RELATION_IDS.densityIsMassPerVolume]: "applies",
      [MODEL_RELATION_IDS.sameVolumeLargerMassLargerDensity]: "applies",
      [MODEL_RELATION_IDS.sameMassLargerVolumeSmallerDensity]: "not-necessarily",
      [MODEL_RELATION_IDS.uniformCutLeavesDensityUnchanged]: "not-necessarily",
      [MODEL_RELATION_IDS.densityAloneDoesNotExplainFloating]: "not-necessarily",
    },
    surfaceCueSelected: false,
    studentExplanation: "杯子体积相同，水和油质量不同，密度是单位体积的质量。",
    timestamp,
  };
}

export function completeSamplesStoneTransferInput(
  timestamp: string,
): SamplesTransferInput {
  return {
    targetId: SAMPLES_TRANSFER_TARGET_IDS.stone,
    judgments: {
      [MODEL_RELATION_IDS.densityIsMassPerVolume]: "applies",
      [MODEL_RELATION_IDS.sameVolumeLargerMassLargerDensity]: "not-necessarily",
      [MODEL_RELATION_IDS.sameMassLargerVolumeSmallerDensity]: "not-necessarily",
      [MODEL_RELATION_IDS.uniformCutLeavesDensityUnchanged]: "not-necessarily",
      [MODEL_RELATION_IDS.densityAloneDoesNotExplainFloating]: "not-necessarily",
    },
    surfaceCueSelected: false,
    studentExplanation: "石头形状不规则，但质量和排水得到的体积仍能求密度。",
    timestamp,
  };
}

export function completeSamplesHollowTransferInput(
  timestamp: string,
): SamplesTransferInput {
  return {
    targetId: SAMPLES_BOUNDARY_TARGET_ID,
    judgments: {
      [MODEL_RELATION_IDS.densityIsMassPerVolume]: "applies",
      [MODEL_RELATION_IDS.sameVolumeLargerMassLargerDensity]: "not-necessarily",
      [MODEL_RELATION_IDS.sameMassLargerVolumeSmallerDensity]: "not-necessarily",
      [MODEL_RELATION_IDS.uniformCutLeavesDensityUnchanged]: "not-necessarily",
      [MODEL_RELATION_IDS.densityAloneDoesNotExplainFloating]: "applies",
    },
    surfaceCueSelected: false,
    studentExplanation:
      "外形大小不是密度。空心时外形体积不一定等于材料体积，还是要用质量和体积的比。",
    timestamp,
  };
}

export function summarizeSamplesTransferAttempt(attempt: TransferAttempt): string {
  if (attempt.accepted) {
    return attempt.transferMode === TransferMode.BOUNDARY_CONTRAST
      ? "你分清了外形大小不能代替密度。"
      : "你用质量和体积的比，而不是外表，解释了这个情境。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("surface-similarity-only")) {
    return "只看见都是固体块还不够。要看质量和体积的关系是不是还在。";
  }
  if (kinds.includes("outer-size-treated-as-density")) {
    return "外形很大不一定密度更大。空心时外形体积不一定等于材料体积。";
  }
  if (kinds.includes("mass-or-size-conflation")) {
    return "不能只看谁更重或谁更大。要同时看质量和体积。";
  }
  if (kinds.includes("missing-mass-volume-ratio")) {
    return "先判断：这里还要不要用单位体积的质量。";
  }
  return "再检查一遍关系和条件，用自己的话说说为什么。";
}

export function samplesTransferDraftFromAttempt(
  attempt: TransferAttempt,
): SamplesTransferDraft {
  return {
    kind: SAMPLES_TRANSFER_DRAFT_KIND,
    targetId: attempt.targetId ?? attempt.scenarioId,
    judgments: {
      ...emptySamplesTransferJudgments(),
      ...(attempt.judgments ?? {}),
    },
    surfaceCueSelected: attempt.surfaceCueSelected === true,
    studentExplanation: attempt.conditionReasoning || attempt.response || "",
  };
}

function hasCoreRelation(
  selected: string[],
  transferMode: TransferMode,
): boolean {
  if (transferMode === TransferMode.BOUNDARY_CONTRAST) {
    return selected.includes(MODEL_RELATION_IDS.densityIsMassPerVolume);
  }
  return selected.includes(MODEL_RELATION_IDS.densityIsMassPerVolume);
}
