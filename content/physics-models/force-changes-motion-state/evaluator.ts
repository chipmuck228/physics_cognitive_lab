import type { ModelEvaluatorSpec, TransferMode } from "@/types/physics-model";
import { ModelEvidenceLevel } from "@/types/physics-model";
import { MODEL_RELATION_IDS } from "./model";

export const EVALUATOR_COMPONENT_IDS = {
  identifiesCurrentMotionState: "identifiesCurrentMotionState",
  identifiesNetForceCondition: "identifiesNetForceCondition",
  identifiesForceMotionDirectionRelation: "identifiesForceMotionDirectionRelation",
  identifiesMotionStateChange: "identifiesMotionStateChange",
  distinguishesForceFromMotion: "distinguishesForceFromMotion",
  checksZeroNetForceUnchangedCondition: "checksZeroNetForceUnchangedCondition",
} as const;

export const modelEvaluatorSpec: ModelEvaluatorSpec = {
  requiredComponents: {
    [EVALUATOR_COMPONENT_IDS.identifiesCurrentMotionState]:
      "指出物体当前是静止还是在运动，以及运动方向。",
    [EVALUATOR_COMPONENT_IDS.identifiesNetForceCondition]:
      "指出水平合力是同向、反向，还是为零。",
    [EVALUATOR_COMPONENT_IDS.identifiesForceMotionDirectionRelation]:
      "分开说出力的方向和运动方向，不把它们当成必须相同。",
    [EVALUATOR_COMPONENT_IDS.identifiesMotionStateChange]:
      "指出运动状态是加快、减慢、改变方向，还是保持不变。",
    [EVALUATOR_COMPONENT_IDS.distinguishesForceFromMotion]:
      "不把“有力”写成“一定在运动”，也不把“在运动”写成“一定有向前的力”。",
    [EVALUATOR_COMPONENT_IDS.checksZeroNetForceUnchangedCondition]:
      "检查合力为零时运动状态不变，并且不把平衡力说成没有力。",
  },
  evidenceLevels: {
    [ModelEvidenceLevel.L1]: "能观察到小车开始运动、加快、减慢或改变方向。",
    [ModelEvidenceLevel.L2]: "能识别物体、运动状态、力的方向、运动方向等对象和物理量。",
    [ModelEvidenceLevel.L3]: "能说出部分关系，例如顺着推会变快，顶着推会变慢。",
    [ModelEvidenceLevel.L4]:
      "能建立“当前运动状态 + 合力条件/方向关系 → 运动状态变化”，并带上合力为零则不变的条件。",
    [ModelEvidenceLevel.L5]: "能在新情境中调用这个关系，并分清哪些表面相似不能代替深结构。",
    [ModelEvidenceLevel.L6]: "能在独立挑战中使用该模型，并检查合力为零等必要条是否成立。",
  },
};

export interface ForceMotionComponentSignals {
  identifiesCurrentMotionState: boolean;
  identifiesNetForceCondition: boolean;
  identifiesForceMotionDirectionRelation: boolean;
  identifiesMotionStateChange: boolean;
  distinguishesForceFromMotion: boolean;
  checksZeroNetForceUnchangedCondition: boolean;
  claimsForceMeansMotion: boolean;
  claimsMotionNeedsForwardForce: boolean;
  claimsZeroNetForceMustStop: boolean;
  claimsBalancedMeansNoForce: boolean;
  conflatesSpeedAndDirectionChange: boolean;
  suggestsValidRelation: boolean;
}

const MOTION_STATE = ["静止", "在运动", "向右", "向左", "原来已经在动", "motion state"];
const NET_FORCE = ["合力", "水平力", "推力", "net force", "合力为零"];
const DIRECTION_RELATION = [
  "方向相同",
  "方向相反",
  "顺着",
  "顶着",
  "同一边",
  "不是必须相同",
];
const STATE_CHANGE = ["加快", "减慢", "变慢", "开始运动", "改变方向", "保持不变", "掉头"];
const ZERO_UNCHANGED = ["合力为零", "运动状态不变", "继续运动", "不必停下"];
const FORCE_MEANS_MOTION = ["有力就一定运动", "受到力就一定在运动", "有力就在动"];
const NEEDS_FORWARD = [
  "必须一直受到向前的力",
  "没有向前的力就会停",
  "要继续运动就必须有向前的力",
];
const ZERO_MUST_STOP = ["合力为零就一定静止", "没有力就会停下", "不受力就会停"];
const BALANCED_NO_FORCE = ["平衡力就是没有力", "合力为零等于没有力", "平衡就是没有力"];
const SPEED_IS_DIRECTION = ["快慢变了就是方向变了", "变慢就是掉头", "加速就是改变方向"];

/**
 * Deterministic SIGNAL extractor.
 *
 * Keyword overlap is a hint about what a student mentioned.
 * It is not model mastery, not an L1–L6 assignment, and not
 * sufficient evidence that the student understands the model.
 *
 * Official levels come from deriveModelEvidenceLevel() using
 * accumulated structured stage evidence.
 */
export function extractForceMotionSignals(text: string): ForceMotionComponentSignals {
  const normalized = normalize(text);
  const identifiesCurrentMotionState = includesAny(normalized, MOTION_STATE);
  const identifiesNetForceCondition = includesAny(normalized, NET_FORCE);
  const identifiesForceMotionDirectionRelation = includesAny(
    normalized,
    DIRECTION_RELATION,
  );
  const identifiesMotionStateChange = includesAny(normalized, STATE_CHANGE);
  const checksZeroNetForceUnchangedCondition = includesAny(normalized, ZERO_UNCHANGED);
  const claimsForceMeansMotion = includesAny(normalized, FORCE_MEANS_MOTION);
  const claimsMotionNeedsForwardForce = includesAny(normalized, NEEDS_FORWARD);
  const claimsZeroNetForceMustStop = includesAny(normalized, ZERO_MUST_STOP);
  const claimsBalancedMeansNoForce = includesAny(normalized, BALANCED_NO_FORCE);
  const conflatesSpeedAndDirectionChange = includesAny(normalized, SPEED_IS_DIRECTION);
  const distinguishesForceFromMotion =
    identifiesCurrentMotionState &&
    identifiesNetForceCondition &&
    !claimsForceMeansMotion &&
    !claimsMotionNeedsForwardForce;

  const suggestsValidRelation =
    identifiesNetForceCondition &&
    identifiesMotionStateChange &&
    identifiesCurrentMotionState &&
    !claimsForceMeansMotion &&
    !claimsZeroNetForceMustStop;

  return {
    identifiesCurrentMotionState,
    identifiesNetForceCondition,
    identifiesForceMotionDirectionRelation,
    identifiesMotionStateChange,
    distinguishesForceFromMotion,
    checksZeroNetForceUnchangedCondition,
    claimsForceMeansMotion,
    claimsMotionNeedsForwardForce,
    claimsZeroNetForceMustStop,
    claimsBalancedMeansNoForce,
    conflatesSpeedAndDirectionChange,
    suggestsValidRelation,
  };
}

export function evaluateTransferAttempt(input: {
  targetId: string;
  transferMode: TransferMode;
  selectedRelations: string[];
  rejectedRelations: string[];
  studentExplanation: string;
}): { accepted: boolean; failureKinds: string[] } {
  const failureKinds: string[] = [];
  const signals = extractForceMotionSignals(input.studentExplanation);
  const selected = new Set(input.selectedRelations);
  const rejected = new Set(input.rejectedRelations);

  if (input.transferMode === "full-model") {
    const hasCore =
      selected.has(MODEL_RELATION_IDS.netForceChangesMotionState) ||
      selected.has(MODEL_RELATION_IDS.sameDirectionIncreasesSpeed) ||
      selected.has(MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed);
    if (!hasCore) {
      failureKinds.push("missing-force-motion-relation");
    }
    if (signals.claimsForceMeansMotion || signals.claimsMotionNeedsForwardForce) {
      failureKinds.push("force-motion-conflation");
    }
    if (looksLikeSurfaceOnly(input.studentExplanation)) {
      failureKinds.push("surface-similarity-only");
    }
  }

  if (input.transferMode === "boundary-contrast") {
    if (!selected.has(MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged)) {
      failureKinds.push("missing-zero-net-force-boundary");
    }
    if (
      selected.has(MODEL_RELATION_IDS.sameDirectionIncreasesSpeed) &&
      !rejected.has(MODEL_RELATION_IDS.sameDirectionIncreasesSpeed)
    ) {
      failureKinds.push("forced-nonzero-force-onto-zero-net-force");
    }
    if (signals.claimsZeroNetForceMustStop || signals.claimsBalancedMeansNoForce) {
      failureKinds.push("zero-net-force-misread");
    }
  }

  return { accepted: failureKinds.length === 0, failureKinds };
}

function looksLikeSurfaceOnly(text: string): boolean {
  const normalized = normalize(text);
  const surface = ["有轮子", "也是小车", "看起来像", "都有轮"];
  const structure = ["合力", "运动状态", "方向", "加快", "减慢", "不变"];
  return includesAny(normalized, surface) && !includesAny(normalized, structure);
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

function includesAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle.toLowerCase().replace(/\s+/g, "")));
}
