import { transferTargets } from "@/content/physics-models/force-changes-motion-state/transfer";
import { evaluateTransferAttempt } from "@/content/physics-models/force-changes-motion-state/evaluator";
import { MODEL_RELATION_IDS } from "@/content/physics-models/force-changes-motion-state/model";
import { CART_TRANSFER_RELATIONS } from "@/lib/content/horizontal-force-cart";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { TransferAttempt } from "@/types/learning";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const CART_TRANSFER_TARGET_IDS = {
  bicycle: "near-bicycle-speeding-up",
  ball: "medium-ball-opposite-force",
  hover: "far-hover-constant-velocity",
} as const;

export const CART_FULL_MODEL_TARGET_IDS = [
  CART_TRANSFER_TARGET_IDS.bicycle,
  CART_TRANSFER_TARGET_IDS.ball,
] as const;

export const CART_BOUNDARY_TARGET_ID = CART_TRANSFER_TARGET_IDS.hover;

export const CART_TRANSFER_DRAFT_KIND = "cart-transfer-draft";

export type CartTransferJudgment = "applies" | "not-necessarily" | "";

export type CartTransferFailureKind =
  | "surface-similarity-only"
  | "missing-force-motion-relation"
  | "missing-target-relation"
  | "wrong-target-relation"
  | "missing-zero-net-force-boundary"
  | "forced-nonzero-force-onto-zero-net-force"
  | "force-motion-conflation"
  | "zero-net-force-misread"
  | "generic-boundary-talk"
  | "keyword-sandwich"
  | "missing-authored-relation"
  | "missing-authored-consequence"
  | "missing-explanation";

export interface CartTransferInput {
  targetId: string;
  judgments: Record<string, CartTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  timestamp: string;
}

export interface CartTransferDraft {
  kind: typeof CART_TRANSFER_DRAFT_KIND;
  targetId: string;
  judgments: Record<string, CartTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
}

export function cartTransferTarget(targetId: string): TransferTarget | undefined {
  return transferTargets.find((target) => target.id === targetId);
}

export function emptyCartTransferJudgments(): Record<string, CartTransferJudgment> {
  return Object.fromEntries(
    CART_TRANSFER_RELATIONS.map((relation) => [relation.id, "" as CartTransferJudgment]),
  );
}

export function emptyCartTransferDraft(
  targetId: string = CART_TRANSFER_TARGET_IDS.bicycle,
): CartTransferDraft {
  return {
    kind: CART_TRANSFER_DRAFT_KIND,
    targetId,
    judgments: emptyCartTransferJudgments(),
    surfaceCueSelected: false,
    studentExplanation: "",
  };
}

export function selectedCartTransferRelations(
  judgments: Record<string, CartTransferJudgment>,
): string[] {
  return CART_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "applies",
  ).map((relation) => relation.id);
}

export function rejectedCartTransferRelations(
  judgments: Record<string, CartTransferJudgment>,
): string[] {
  return CART_TRANSFER_RELATIONS.filter(
    (relation) => judgments[relation.id] === "not-necessarily",
  ).map((relation) => relation.id);
}

export function evaluateCartTransfer(input: CartTransferInput): {
  accepted: boolean;
  failureKinds: string[];
} {
  const target = cartTransferTarget(input.targetId);
  if (!target) {
    return { accepted: false, failureKinds: ["missing-explanation"] };
  }

  const selected = selectedCartTransferRelations(input.judgments);
  const rejected = rejectedCartTransferRelations(input.judgments);
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

  failureKinds.push(...evaluateCartTargetSpecificEvidence(input, selected));

  return {
    accepted: failureKinds.length === 0,
    failureKinds: [...new Set(failureKinds)],
  };
}

export function buildCartTransferAttempt(input: CartTransferInput): TransferAttempt {
  const target = cartTransferTarget(input.targetId);
  const evaluation = evaluateCartTransfer(input);
  return {
    scenarioId: input.targetId,
    targetId: input.targetId,
    transferMode: target?.transferMode,
    response: input.studentExplanation.trim(),
    timestamp: input.timestamp,
    selectedRelations: selectedCartTransferRelations(input.judgments),
    rejectedRelations: rejectedCartTransferRelations(input.judgments),
    conditionReasoning:
      target?.transferMode === TransferMode.BOUNDARY_CONTRAST
        ? input.studentExplanation.trim()
        : undefined,
    accepted: evaluation.accepted,
    failureKinds: evaluation.failureKinds,
    surfaceCueSelected: input.surfaceCueSelected,
    judgments: { ...emptyCartTransferJudgments(), ...input.judgments },
  };
}

export function hasAcceptedCartFullModel(attempts: TransferAttempt[]): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.FULL_MODEL &&
      CART_FULL_MODEL_TARGET_IDS.includes(
        (attempt.targetId ?? attempt.scenarioId) as (typeof CART_FULL_MODEL_TARGET_IDS)[number],
      ),
  );
}

export function hasAcceptedCartBoundaryContrast(
  attempts: TransferAttempt[],
): boolean {
  return attempts.some(
    (attempt) =>
      attempt.accepted === true &&
      attempt.transferMode === TransferMode.BOUNDARY_CONTRAST &&
      (attempt.targetId ?? attempt.scenarioId) === CART_BOUNDARY_TARGET_ID,
  );
}

export function hasCompletedCartTransfer(attempts: TransferAttempt[]): boolean {
  return hasAcceptedCartFullModel(attempts) && hasAcceptedCartBoundaryContrast(attempts);
}

export function activeCartTransferTargetId(
  attempts: TransferAttempt[],
  draftTargetId?: string,
): string {
  if (!hasAcceptedCartFullModel(attempts)) {
    if (
      draftTargetId === CART_TRANSFER_TARGET_IDS.ball ||
      draftTargetId === CART_TRANSFER_TARGET_IDS.bicycle
    ) {
      return draftTargetId;
    }
    return CART_TRANSFER_TARGET_IDS.bicycle;
  }
  return CART_BOUNDARY_TARGET_ID;
}

export function completeCartBicycleTransferInput(timestamp: string): CartTransferInput {
  return {
    targetId: CART_TRANSFER_TARGET_IDS.bicycle,
    judgments: {
      [MODEL_RELATION_IDS.netForceChangesMotionState]: "applies",
      [MODEL_RELATION_IDS.sameDirectionIncreasesSpeed]: "applies",
      [MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed]: "not-necessarily",
      [MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged]: "not-necessarily",
    },
    surfaceCueSelected: false,
    studentExplanation: "人和车同一边蹬，水平合力与运动方向相同，所以会加快。",
    timestamp,
  };
}

export function completeCartBallTransferInput(timestamp: string): CartTransferInput {
  return {
    targetId: CART_TRANSFER_TARGET_IDS.ball,
    judgments: {
      [MODEL_RELATION_IDS.netForceChangesMotionState]: "applies",
      [MODEL_RELATION_IDS.sameDirectionIncreasesSpeed]: "not-necessarily",
      [MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed]: "applies",
      [MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged]: "not-necessarily",
    },
    surfaceCueSelected: false,
    studentExplanation: "球原来在动，迎面的力顶着运动方向，所以会减慢。",
    timestamp,
  };
}

export function completeCartHoverTransferInput(timestamp: string): CartTransferInput {
  return {
    targetId: CART_BOUNDARY_TARGET_ID,
    judgments: {
      [MODEL_RELATION_IDS.netForceChangesMotionState]: "not-necessarily",
      [MODEL_RELATION_IDS.sameDirectionIncreasesSpeed]: "not-necessarily",
      [MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed]: "not-necessarily",
      [MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged]: "applies",
    },
    surfaceCueSelected: false,
    studentExplanation: "水平合力接近零，原来在滑动的滑块可以保持原来的运动，不必立刻停下。",
    timestamp,
  };
}

export function summarizeCartTransferAttempt(attempt: TransferAttempt): string {
  if (attempt.accepted) {
    return attempt.transferMode === TransferMode.BOUNDARY_CONTRAST
      ? "你分清了合力为零时哪些关系还能用。"
      : "你用合力与运动状态的关系，而不是外表，解释了这个情境。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("surface-similarity-only")) {
    return "只看见有轮子还不够。要看合力和运动状态的关系是不是还在。";
  }
  if (kinds.includes("missing-zero-net-force-boundary") || kinds.includes("zero-net-force-misread")) {
    return "合力接近零时，运动状态是必须停下，还是可以保持原来的样子？";
  }
  if (kinds.includes("forced-nonzero-force-onto-zero-net-force")) {
    return "不要把“顺着推会加快”直接搬到合力为零的情况里。";
  }
  if (kinds.includes("wrong-target-relation") || kinds.includes("missing-target-relation")) {
    return "这个情境里，合力和现在的运动是同一边、顶着，还是接近零？不要把别的情况的关系直接搬过来。";
  }
  if (
    kinds.includes("generic-boundary-talk") ||
    kinds.includes("keyword-sandwich") ||
    kinds.includes("missing-authored-relation") ||
    kinds.includes("missing-authored-consequence")
  ) {
    return "只写出个别词还不够。要说出：现在怎么运动、合力怎样、运动状态会怎样变。";
  }
  if (kinds.includes("missing-force-motion-relation") || kinds.includes("force-motion-conflation")) {
    return "先判断：这里合力怎样，运动状态会怎样变。";
  }
  return "再检查一遍关系和条件，用自己的话说说为什么。";
}

export function cartTransferDraftFromAttempt(attempt: TransferAttempt): CartTransferDraft {
  return {
    kind: CART_TRANSFER_DRAFT_KIND,
    targetId: attempt.targetId ?? attempt.scenarioId,
    judgments: {
      ...emptyCartTransferJudgments(),
      ...(attempt.judgments ?? {}),
    },
    surfaceCueSelected: attempt.surfaceCueSelected === true,
    studentExplanation: attempt.conditionReasoning || attempt.response || "",
  };
}

function evaluateCartTargetSpecificEvidence(
  input: CartTransferInput,
  selected: string[],
): string[] {
  const failureKinds: string[] = [];
  const text = input.studentExplanation;

  if (looksLikeCartTransferNounSandwich(text)) {
    failureKinds.push("keyword-sandwich");
  }
  if (looksLikeGenericCartTransferTalk(text)) {
    failureKinds.push("generic-boundary-talk");
  }
  if (looksLikeCartTransferMustStop(text)) {
    failureKinds.push("zero-net-force-misread");
  }

  if (input.targetId === CART_TRANSFER_TARGET_IDS.bicycle) {
    if (selected.includes(MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed)) {
      failureKinds.push("wrong-target-relation");
    }
    if (!selected.includes(MODEL_RELATION_IDS.sameDirectionIncreasesSpeed)) {
      failureKinds.push("missing-target-relation");
    }
    if (!hasAuthoredSameDirectionSpeedUp(text)) {
      failureKinds.push("missing-authored-relation");
    }
  }

  if (input.targetId === CART_TRANSFER_TARGET_IDS.ball) {
    if (selected.includes(MODEL_RELATION_IDS.sameDirectionIncreasesSpeed)) {
      failureKinds.push("wrong-target-relation");
    }
    if (!selected.includes(MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed)) {
      failureKinds.push("missing-target-relation");
    }
    if (!hasAuthoredOppositeDirectionSlowDown(text)) {
      failureKinds.push("missing-authored-relation");
    }
  }

  if (input.targetId === CART_TRANSFER_TARGET_IDS.hover) {
    if (
      selected.includes(MODEL_RELATION_IDS.sameDirectionIncreasesSpeed) ||
      selected.includes(MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed)
    ) {
      failureKinds.push("forced-nonzero-force-onto-zero-net-force");
    }
    if (!selected.includes(MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged)) {
      failureKinds.push("missing-zero-net-force-boundary");
    }
    if (!hasAuthoredZeroNetForce(text)) {
      failureKinds.push("missing-authored-relation");
    }
    if (!hasAuthoredUnchangedWhileMoving(text)) {
      failureKinds.push("missing-authored-consequence");
    }
  }

  return failureKinds;
}

function normalizeCartTransferText(text: string): string {
  return text.replace(/\s+/g, "");
}

export function looksLikeCartTransferNounSandwich(text: string): boolean {
  const normalized = normalizeCartTransferText(text);
  const nouns = ["合力", "运动", "速度", "方向", "力"];
  const count = nouns.filter((noun) => normalized.includes(noun)).length;
  const hasRelation =
    /同一边|顺着|顶着|加快|减慢|保持|不变|为零|相反|迎面/.test(normalized);
  return count >= 3 && !hasRelation;
}

export function looksLikeGenericCartTransferTalk(text: string): boolean {
  const normalized = normalizeCartTransferText(text);
  return /^(合力|运动|速度|方向|好好+|情况不一样|看起来像|不太一样)[。！]?$/.test(
    normalized,
  );
}

export function looksLikeCartTransferMustStop(text: string): boolean {
  return /(没力就停|没有力就会停|不受力就会停|合力为零就一定静止)/.test(
    normalizeCartTransferText(text),
  );
}

export function hasAuthoredSameDirectionSpeedUp(text: string): boolean {
  const normalized = normalizeCartTransferText(text);
  return (
    /(同一边|顺着|方向相同|和运动.{0,8}相同)/.test(normalized) &&
    /(加快|变快|越来越快)/.test(normalized)
  );
}

export function hasAuthoredOppositeDirectionSlowDown(text: string): boolean {
  const normalized = normalizeCartTransferText(text);
  return (
    /(顶着|迎面|方向相反|反向)/.test(normalized) &&
    /(减慢|变慢)/.test(normalized)
  );
}

export function hasAuthoredZeroNetForce(text: string): boolean {
  return /(合力为零|合力接近零|水平合力.{0,8}零)/.test(
    normalizeCartTransferText(text),
  );
}

export function hasAuthoredUnchangedWhileMoving(text: string): boolean {
  const normalized = normalizeCartTransferText(text);
  const moving = /(原来|已经在|正在|在滑|在动|向右|向左)/.test(normalized);
  const unchanged = /(保持|不必停|不用停|不变|继续运动)/.test(normalized);
  return moving && unchanged;
}

function hasCoreRelation(
  selected: string[],
  transferMode: TransferMode,
): boolean {
  if (transferMode === TransferMode.BOUNDARY_CONTRAST) {
    return selected.includes(MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged);
  }
  return (
    selected.includes(MODEL_RELATION_IDS.netForceChangesMotionState) ||
    selected.includes(MODEL_RELATION_IDS.sameDirectionIncreasesSpeed) ||
    selected.includes(MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed)
  );
}
