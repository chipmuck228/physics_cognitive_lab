import { transferTargets } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/transfer";
import { MODEL_RELATION_IDS } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/model";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { TransferAttempt } from "@/types/learning";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const ENGINE_TRANSFER_TARGET_IDS = {
  motorcycle: "near-motorcycle-piston-engine",
  lab: "medium-lab-combustion-piston",
  steam: "far-steam-piston",
} as const;

export const ENGINE_FULL_MODEL_TARGET_IDS = [
  ENGINE_TRANSFER_TARGET_IDS.motorcycle,
  ENGINE_TRANSFER_TARGET_IDS.lab,
] as const;

export const ENGINE_PARTIAL_TARGET_ID = ENGINE_TRANSFER_TARGET_IDS.steam;

/**
 * Pedagogical relation cards for Grade 9. Card B composites two canonical
 * relations (internal-energy/state change and work) the same way MODEL
 * composites the gas node. Canonical Physics Model IDs are unchanged.
 */
export const ENGINE_TRANSFER_RELATION_IDS = {
  chemicalToInternal: "chemical-to-internal",
  internalToWork: "internal-to-work",
  systemToMechanical: "system-to-mechanical",
} as const;

export type EngineTransferRelationId =
  (typeof ENGINE_TRANSFER_RELATION_IDS)[keyof typeof ENGINE_TRANSFER_RELATION_IDS];

export type EngineTransferJudgment = "applies" | "not-necessarily" | "";

export type EngineTransferFailureKind =
  | "surface-cue"
  | "missing-source"
  | "missing-gas-state"
  | "missing-work"
  | "missing-mechanical"
  | "incorrect-order"
  | "blind-full-model"
  | "chemical-source-forced"
  | "missing-boundary"
  | "missing-transferable-authorship"
  | "generic-boundary-talk"
  | "keyword-sandwich"
  | "missing-explanation";

export interface EngineTransferInput {
  targetId: string;
  judgments: Record<string, EngineTransferJudgment>;
  relationOrder: string[];
  surfaceCueSelected: boolean;
  studentExplanation: string;
  timestamp: string;
}

export const ENGINE_TRANSFER_DRAFT_KIND = "engine-transfer-draft";

export interface EngineTransferDraft {
  kind: typeof ENGINE_TRANSFER_DRAFT_KIND;
  targetId: string;
  judgments: Record<string, EngineTransferJudgment>;
  relationOrder: string[];
  surfaceCueSelected: boolean;
  studentExplanation: string;
}

export const ENGINE_TRANSFER_RELATIONS: Array<{
  id: EngineTransferRelationId;
  label: string;
  canonicalIds: string[];
}> = [
  {
    id: ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal,
    label: "燃料化学能 → 工作物质内能/状态",
    canonicalIds: [MODEL_RELATION_IDS.chemicalConvertsToInternal],
  },
  {
    id: ENGINE_TRANSFER_RELATION_IDS.internalToWork,
    label: "工作物质内能/状态 → 对机械系统做功",
    canonicalIds: [
      MODEL_RELATION_IDS.internalEnergyChangesState,
      MODEL_RELATION_IDS.workingGasDoesWork,
    ],
  },
  {
    id: ENGINE_TRANSFER_RELATION_IDS.systemToMechanical,
    label: "机械系统 → 获得机械能",
    canonicalIds: [MODEL_RELATION_IDS.mechanicalEnergyOutput],
  },
];

/** Display order must not encode the accepted causal sequence. */
export const ENGINE_TRANSFER_RELATION_DISPLAY_ORDER: EngineTransferRelationId[] = [
  ENGINE_TRANSFER_RELATION_IDS.internalToWork,
  ENGINE_TRANSFER_RELATION_IDS.systemToMechanical,
  ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal,
];

const FULL_MODEL_ORDER: EngineTransferRelationId[] = [
  ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal,
  ENGINE_TRANSFER_RELATION_IDS.internalToWork,
  ENGINE_TRANSFER_RELATION_IDS.systemToMechanical,
];

export function engineTransferTarget(targetId: string): TransferTarget | undefined {
  return transferTargets.find((target) => target.id === targetId);
}

export function emptyEngineTransferJudgments(): Record<string, EngineTransferJudgment> {
  return {
    [ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal]: "",
    [ENGINE_TRANSFER_RELATION_IDS.internalToWork]: "",
    [ENGINE_TRANSFER_RELATION_IDS.systemToMechanical]: "",
  };
}

export function emptyEngineTransferDraft(
  targetId: string = ENGINE_TRANSFER_TARGET_IDS.motorcycle,
): EngineTransferDraft {
  return {
    kind: ENGINE_TRANSFER_DRAFT_KIND,
    targetId,
    judgments: emptyEngineTransferJudgments(),
    relationOrder: [],
    surfaceCueSelected: false,
    studentExplanation: "",
  };
}

export function expandEngineTransferRelations(relationIds: string[]): string[] {
  const expanded = ENGINE_TRANSFER_RELATIONS.filter((relation) =>
    relationIds.includes(relation.id),
  ).flatMap((relation) => relation.canonicalIds);
  return [...new Set(expanded)];
}

export function selectedPedagogicalIds(
  judgments: Record<string, EngineTransferJudgment>,
): EngineTransferRelationId[] {
  return ENGINE_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "applies",
  ).map((relation) => relation.id);
}

export function rejectedPedagogicalIds(
  judgments: Record<string, EngineTransferJudgment>,
): EngineTransferRelationId[] {
  return ENGINE_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "not-necessarily",
  ).map((relation) => relation.id);
}

export function evaluateEngineTransfer(input: EngineTransferInput): {
  accepted: boolean;
  failureKinds: EngineTransferFailureKind[];
} {
  const target = engineTransferTarget(input.targetId);
  if (!target) {
    return { accepted: false, failureKinds: ["missing-explanation"] };
  }

  if (target.transferMode === TransferMode.PARTIAL_STRUCTURE) {
    return evaluatePartialStructure(input, target);
  }

  return evaluateFullModel(input);
}

export function buildEngineTransferAttempt(input: EngineTransferInput): TransferAttempt {
  const target = engineTransferTarget(input.targetId);
  const evaluation = evaluateEngineTransfer(input);
  const selected = selectedPedagogicalIds(input.judgments);
  const rejected = rejectedPedagogicalIds(input.judgments);
  const explanation = input.studentExplanation.trim();

  return {
    scenarioId: input.targetId,
    targetId: input.targetId,
    transferMode: target?.transferMode,
    response: explanation,
    timestamp: input.timestamp,
    selectedRelations: expandEngineTransferRelations(selected),
    rejectedRelations: expandEngineTransferRelations(rejected),
    conditionReasoning:
      target?.transferMode === TransferMode.PARTIAL_STRUCTURE ? explanation : undefined,
    accepted: evaluation.accepted,
    failureKinds: evaluation.failureKinds,
    relationOrder: [...input.relationOrder],
    surfaceCueSelected: input.surfaceCueSelected,
    judgments: { ...emptyEngineTransferJudgments(), ...input.judgments },
  };
}

export function hasAcceptedEngineFullModel(attempts: TransferAttempt[]): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.FULL_MODEL &&
      ENGINE_FULL_MODEL_TARGET_IDS.includes(
        (attempt.targetId ?? attempt.scenarioId) as (typeof ENGINE_FULL_MODEL_TARGET_IDS)[number],
      ),
  );
}

export function hasAcceptedEnginePartialStructure(
  attempts: TransferAttempt[],
): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.PARTIAL_STRUCTURE &&
      (attempt.targetId ?? attempt.scenarioId) === ENGINE_PARTIAL_TARGET_ID,
  );
}

export function hasCompletedEngineTransfer(attempts: TransferAttempt[]): boolean {
  return (
    hasAcceptedEngineFullModel(attempts) &&
    hasAcceptedEnginePartialStructure(attempts)
  );
}

export function activeEngineTransferTargetId(
  attempts: TransferAttempt[],
  draftTargetId?: string,
): string {
  if (!hasAcceptedEngineFullModel(attempts)) {
    if (
      draftTargetId === ENGINE_TRANSFER_TARGET_IDS.lab ||
      draftTargetId === ENGINE_TRANSFER_TARGET_IDS.motorcycle
    ) {
      return draftTargetId;
    }
    return ENGINE_TRANSFER_TARGET_IDS.motorcycle;
  }

  if (!hasAcceptedEnginePartialStructure(attempts)) {
    return ENGINE_PARTIAL_TARGET_ID;
  }

  return ENGINE_PARTIAL_TARGET_ID;
}

export function latestEngineTransferDraft(
  events: Array<{ metadata?: Record<string, unknown> }>,
): EngineTransferDraft | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const metadata = events[index]?.metadata;
    if (metadata?.kind !== ENGINE_TRANSFER_DRAFT_KIND) {
      continue;
    }
    const targetId =
      typeof metadata.targetId === "string"
        ? metadata.targetId
        : ENGINE_TRANSFER_TARGET_IDS.motorcycle;
    return {
      kind: ENGINE_TRANSFER_DRAFT_KIND,
      targetId,
      judgments: {
        ...emptyEngineTransferJudgments(),
        ...((metadata.judgments as Record<string, EngineTransferJudgment> | undefined) ??
          {}),
      },
      relationOrder: Array.isArray(metadata.relationOrder)
        ? (metadata.relationOrder as string[])
        : [],
      surfaceCueSelected: metadata.surfaceCueSelected === true,
      studentExplanation:
        typeof metadata.studentExplanation === "string"
          ? metadata.studentExplanation
          : "",
    };
  }
  return null;
}

export function engineTransferDraftFromAttempt(
  attempt: TransferAttempt,
): EngineTransferDraft {
  return {
    kind: ENGINE_TRANSFER_DRAFT_KIND,
    targetId: attempt.targetId ?? attempt.scenarioId,
    judgments: {
      ...emptyEngineTransferJudgments(),
      ...(attempt.judgments ?? {}),
    },
    relationOrder: attempt.relationOrder ?? [],
    surfaceCueSelected: attempt.surfaceCueSelected === true,
    studentExplanation: attempt.conditionReasoning || attempt.response || "",
  };
}

export function latestAttemptForTarget(
  attempts: TransferAttempt[],
  targetId: string,
): TransferAttempt | undefined {
  return [...attempts]
    .reverse()
    .find((attempt) => (attempt.targetId ?? attempt.scenarioId) === targetId);
}

export function summarizeEngineTransferAttempt(attempt: TransferAttempt): string {
  if (attempt.accepted) {
    return attempt.transferMode === TransferMode.PARTIAL_STRUCTURE
      ? "你分清了哪些关系还能用，哪些不能直接照搬。"
      : "你用关系，而不是装置外表，解释了这个新情境。";
  }

  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("surface-cue")) {
    return "只看见有活塞还不够。要看能量和做功的关系是不是还在。";
  }
  if (kinds.includes("blind-full-model") || kinds.includes("chemical-source-forced")) {
    return "不要把刚才整条模型一起搬过来。先逐条看看，哪些还能用。";
  }
  if (kinds.includes("generic-boundary-talk") || kinds.includes("keyword-sandwich")) {
    return "只写出个别词还不够。要说清楚：后半段做功还能用，开头的化学能不能直接搬过来。";
  }
  if (kinds.includes("missing-transferable-authorship")) {
    return "还要说说：蒸汽里工作物质变化后，做功和机械能这一段还能不能用。";
  }
  if (kinds.includes("missing-boundary")) {
    return "还要说说：哪些关系能用，哪些因为能量来源不同而不能直接照搬。";
  }
  if (kinds.includes("incorrect-order")) {
    return "关系找对了以后，再想想它们在这个情境里谁先发生。";
  }
  if (kinds.includes("missing-gas-state") || kinds.includes("missing-work")) {
    return "工作物质有没有变化？它有没有对机械部分产生推动？";
  }
  if (kinds.includes("missing-source")) {
    return "这个情境里，能量是从哪一步开始进入工作物质的？";
  }
  if (kinds.includes("missing-mechanical")) {
    return "机械部分最后有没有得到运动或机械能？";
  }
  return "再检查一遍关系，用自己的话说说为什么。";
}

export function completeEngineFullModelInput(
  timestamp: string,
  targetId = ENGINE_TRANSFER_TARGET_IDS.motorcycle,
): EngineTransferInput {
  return {
    targetId,
    judgments: {
      [ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal]: "applies",
      [ENGINE_TRANSFER_RELATION_IDS.internalToWork]: "applies",
      [ENGINE_TRANSFER_RELATION_IDS.systemToMechanical]: "applies",
    },
    relationOrder: [...FULL_MODEL_ORDER],
    surfaceCueSelected: false,
    studentExplanation:
      "汽油燃烧后工作气体的状态变了，再推动机械部分，车子得到机械能。",
    timestamp,
  };
}

export function completeEnginePartialTransferInput(
  timestamp: string,
): EngineTransferInput {
  return {
    targetId: ENGINE_PARTIAL_TARGET_ID,
    judgments: {
      [ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal]: "not-necessarily",
      [ENGINE_TRANSFER_RELATION_IDS.internalToWork]: "applies",
      [ENGINE_TRANSFER_RELATION_IDS.systemToMechanical]: "applies",
    },
    relationOrder: [
      ENGINE_TRANSFER_RELATION_IDS.internalToWork,
      ENGINE_TRANSFER_RELATION_IDS.systemToMechanical,
    ],
    surfaceCueSelected: false,
    studentExplanation: "后面的关系还可以用，但前面的能量来源不一定相同。",
    timestamp,
  };
}

function evaluateFullModel(input: EngineTransferInput): {
  accepted: boolean;
  failureKinds: EngineTransferFailureKind[];
} {
  const failureKinds: EngineTransferFailureKind[] = [];
  const selected = selectedPedagogicalIds(input.judgments);
  const hasA = selected.includes(ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal);
  const hasB = selected.includes(ENGINE_TRANSFER_RELATION_IDS.internalToWork);
  const hasC = selected.includes(ENGINE_TRANSFER_RELATION_IDS.systemToMechanical);
  const completeRelations = hasA && hasB && hasC;
  const pistonOnly = isSurfacePistonOnly(input.studentExplanation);
  const surfaceAlone =
    (input.surfaceCueSelected || pistonOnly) && !completeRelations;

  if (surfaceAlone) {
    failureKinds.push("surface-cue");
  }
  if (!hasA) {
    failureKinds.push("missing-source");
  }
  if (!hasB) {
    failureKinds.push("missing-gas-state");
    failureKinds.push("missing-work");
  }
  if (!hasC) {
    failureKinds.push("missing-mechanical");
  }
  if (completeRelations && !orderMatches(input.relationOrder, FULL_MODEL_ORDER)) {
    failureKinds.push("incorrect-order");
  }
  if (!hasOwnWords(input.studentExplanation)) {
    failureKinds.push("missing-explanation");
  }

  return {
    accepted: failureKinds.length === 0,
    failureKinds,
  };
}

function evaluatePartialStructure(
  input: EngineTransferInput,
  target: TransferTarget,
): {
  accepted: boolean;
  failureKinds: EngineTransferFailureKind[];
} {
  const failureKinds: EngineTransferFailureKind[] = [];
  const selected = expandEngineTransferRelations(selectedPedagogicalIds(input.judgments));
  const rejected = expandEngineTransferRelations(rejectedPedagogicalIds(input.judgments));
  const transferable = target.transferableRelations ?? [];
  const nonTransferable = target.nonTransferableRelations ?? [];
  const allPedagogicalApply = ENGINE_TRANSFER_RELATIONS.every(
    (relation) => input.judgments[relation.id] === "applies",
  );
  const pistonOnly = isSurfacePistonOnly(input.studentExplanation);

  if (allPedagogicalApply) {
    failureKinds.push("blind-full-model");
  }

  for (const relationId of nonTransferable) {
    if (selected.includes(relationId)) {
      failureKinds.push("chemical-source-forced");
    }
    if (!rejected.includes(relationId)) {
      failureKinds.push("missing-boundary");
    }
  }

  for (const relationId of transferable) {
    if (selected.includes(relationId)) {
      continue;
    }
    if (relationId === MODEL_RELATION_IDS.internalEnergyChangesState) {
      failureKinds.push("missing-gas-state");
    } else if (relationId === MODEL_RELATION_IDS.workingGasDoesWork) {
      failureKinds.push("missing-work");
    } else if (relationId === MODEL_RELATION_IDS.mechanicalEnergyOutput) {
      failureKinds.push("missing-mechanical");
    }
  }

  if (pistonOnly || input.surfaceCueSelected) {
    failureKinds.push("surface-cue");
  }
  if (looksLikeEngineTransferNounSandwich(input.studentExplanation)) {
    failureKinds.push("keyword-sandwich");
  }
  if (looksLikeGenericSteamBoundaryTalk(input.studentExplanation)) {
    failureKinds.push("generic-boundary-talk");
  }
  if (!hasAuthoredSteamTransferableStructure(input.studentExplanation)) {
    failureKinds.push("missing-transferable-authorship");
  }
  if (!hasAuthoredSteamNonTransferableSource(input.studentExplanation)) {
    if (!failureKinds.includes("missing-boundary")) {
      failureKinds.push("missing-boundary");
    }
  }
  if (!hasOwnWords(input.studentExplanation)) {
    failureKinds.push("missing-explanation");
  }

  return {
    accepted: failureKinds.length === 0,
    failureKinds: [...new Set(failureKinds)],
  };
}

function orderMatches(actual: string[], expected: string[]): boolean {
  if (actual.length !== expected.length) {
    return false;
  }
  return expected.every((id, index) => actual[index] === id);
}

function isSurfacePistonOnly(text: string): boolean {
  const normalized = text.replace(/\s+/g, "");
  const pistonCue = /都有活塞|只要有活塞|有活塞就是|都是活塞|看见活塞|有活塞/;
  const relationLanguage = /化学能|内能|做功|机械能|状态|工作物质|工作气体|来源/;
  return pistonCue.test(normalized) && !relationLanguage.test(normalized);
}

function normalizeEngineTransferText(text: string): string {
  return text.replace(/\s+/g, "");
}

export function looksLikeEngineTransferNounSandwich(text: string): boolean {
  const normalized = normalizeEngineTransferText(text);
  const nouns = ["化学能", "内能", "做功", "机械能", "状态", "燃料", "气体"];
  const count = nouns.filter((noun) => normalized.includes(noun)).length;
  const hasStructure =
    /再|然后|但|不能|不一定|还能|还可以|所以|不是|转化|推动/.test(normalized);
  return count >= 3 && !hasStructure;
}

export function looksLikeGenericSteamBoundaryTalk(text: string): boolean {
  const normalized = normalizeEngineTransferText(text);
  return /^(化学能|来源|不一定|好好+|情况不一样|看起来像|不太一样|都有活塞)[。！]?$/.test(
    normalized,
  );
}

export function hasAuthoredSteamTransferableStructure(text: string): boolean {
  const normalized = normalizeEngineTransferText(text);
  return (
    /(做功|推动).{0,20}(机械|运动|活塞|输出)/.test(normalized) ||
    /(内能|状态).{0,16}(做功|推动)/.test(normalized) ||
    /(后半|后面).{0,16}(还能用|还可以用|仍能用|还能|还可以)/.test(normalized)
  );
}

export function hasAuthoredSteamNonTransferableSource(text: string): boolean {
  const normalized = normalizeEngineTransferText(text);
  if (/(蒸汽不是燃料|不是燃料化学能|没有燃烧|不是缸内燃烧)/.test(normalized)) {
    return true;
  }
  return (
    /(化学能|燃料|燃烧|起始|前面)/.test(normalized) &&
    /(不一定|不能直接|不能照搬|不能自动|不相同|不一样|不是同一|没法直接)/.test(
      normalized,
    )
  );
}
