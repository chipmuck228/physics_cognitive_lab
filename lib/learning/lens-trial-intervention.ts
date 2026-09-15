/**
 * Scene 07 trial start / required learner action.
 * Uses existing experiment after-states. Not a universal experiment engine.
 */

import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import {
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_B,
  LENS_EXPERIMENT_C,
  LENS_EXPERIMENT_D,
  LENS_EXPERIMENT_ORDER,
  prepareLensExperimentState,
  type ConvexLensSceneState,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";

export type LensTrialLearnerAction =
  | { kind: "move-object"; station: ObjectStation }
  | { kind: "cover-lens" };

export type LensTrialCapability = "move-object" | "cover-lens";

export interface LensTrialSpec {
  id: LensExperimentId;
  index: 1 | 2 | 3 | 4;
  capability: LensTrialCapability;
  start: Pick<
    ConvexLensSceneState,
    "objectStation" | "screenAtImagePlane" | "lensPartiallyCovered"
  >;
  required: LensTrialLearnerAction;
  instruction: string;
  nowDo: string;
  nextAfterIntervene: string;
  whatChanges: string;
  whatStays: string;
  wrongActionReason: string;
}

export const LENS_TRIAL_SPECS: Record<LensExperimentId, LensTrialSpec> = {
  [LENS_EXPERIMENT_A]: {
    id: LENS_EXPERIMENT_A,
    index: 1,
    capability: "move-object",
    start: {
      objectStation: "beyond-2f",
      screenAtImagePlane: true,
      lensPartiallyCovered: false,
    },
    required: { kind: "move-object", station: "between-f-and-2f" },
    instruction: "把物体从 2F 外移到 F 和 2F 之间。",
    nowDo: "把物体移到 F 和 2F 之间",
    nextAfterIntervene: "移动光屏，看看哪里最清楚",
    whatChanges: "物体位置：从 2F 外到 F 和 2F 之间",
    whatStays: "同一块透镜",
    wrongActionReason: "这次要把物体从 2F 外移到 F 和 2F 之间，不是做别的改变。",
  },
  [LENS_EXPERIMENT_B]: {
    id: LENS_EXPERIMENT_B,
    index: 2,
    capability: "move-object",
    start: {
      objectStation: "between-f-and-2f",
      screenAtImagePlane: true,
      lensPartiallyCovered: false,
    },
    required: { kind: "move-object", station: "at-f" },
    instruction: "这次把物体放到 F。再试试看——移动光屏，还能找到一个清楚的位置吗？",
    nowDo: "把物体放到焦点上",
    nextAfterIntervene: "移动光屏，还能找到一个清楚的位置吗？",
    whatChanges: "物体位置：放到焦点上",
    whatStays: "同一块透镜，不要改成别的站点",
    wrongActionReason: "这次要把物体放到焦点上。",
  },
  [LENS_EXPERIMENT_C]: {
    id: LENS_EXPERIMENT_C,
    index: 3,
    capability: "move-object",
    start: {
      objectStation: "at-f",
      screenAtImagePlane: false,
      lensPartiallyCovered: false,
    },
    required: { kind: "move-object", station: "inside-f" },
    instruction: "现在把物体放到 F 里面。再移动光屏，还能接到吗？",
    nowDo: "把物体放到焦点以内",
    nextAfterIntervene: "再移动光屏，还能接到吗？",
    whatChanges: "物体位置：放到焦点以内",
    whatStays: "同一块透镜",
    wrongActionReason: "这次要把物体放到焦点以内。",
  },
  [LENS_EXPERIMENT_D]: {
    id: LENS_EXPERIMENT_D,
    index: 4,
    capability: "cover-lens",
    start: {
      objectStation: "beyond-2f",
      screenAtImagePlane: true,
      lensPartiallyCovered: false,
    },
    required: { kind: "cover-lens" },
    instruction: "遮住透镜一部分。物体和光屏先不要动。",
    nowDo: "遮住透镜一部分",
    nextAfterIntervene: "看清楚像还在不在，然后记下。",
    whatChanges: "透镜被遮住一部分",
    whatStays: "物体和光屏先不要动",
    wrongActionReason: "这次不要换物体位置，只要遮住透镜一部分。",
  },
};

export function lensTrialSpec(experimentId: LensExperimentId): LensTrialSpec {
  return LENS_TRIAL_SPECS[experimentId];
}

export function lensTrialIndex(experimentId: LensExperimentId): number {
  return LENS_TRIAL_SPECS[experimentId].index;
}

export function lensTrialStartState(
  experimentId: LensExperimentId,
  current: ConvexLensSceneState,
): ConvexLensSceneState {
  const start = LENS_TRIAL_SPECS[experimentId].start;
  return {
    ...current,
    objectStation: start.objectStation,
    screenAtImagePlane: start.screenAtImagePlane,
    lensPartiallyCovered: start.lensPartiallyCovered,
  };
}

export function lensTrialAfterState(
  experimentId: LensExperimentId,
  current: ConvexLensSceneState,
): ConvexLensSceneState {
  return prepareLensExperimentState(experimentId, current);
}

export function isRequiredLensTrialAction(
  experimentId: LensExperimentId,
  action: LensTrialLearnerAction,
): boolean {
  const required = LENS_TRIAL_SPECS[experimentId].required;
  if (required.kind === "cover-lens") {
    return action.kind === "cover-lens";
  }
  return action.kind === "move-object" && action.station === required.station;
}

export function nextLensTrialId(
  experimentId: LensExperimentId,
): LensExperimentId | null {
  const index = LENS_EXPERIMENT_ORDER.indexOf(experimentId);
  if (index < 0 || index >= LENS_EXPERIMENT_ORDER.length - 1) {
    return null;
  }
  return LENS_EXPERIMENT_ORDER[index + 1] ?? null;
}
