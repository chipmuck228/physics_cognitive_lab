import { lensTrialPurpose } from "@/lib/content/convex-lens-optical-bench";
import { lensTrialSpec, nextLensTrialId } from "@/lib/learning/lens-trial-intervention";
import type { LensExperimentId } from "@/lib/physics/convex-lens-optical-bench";

export type LensExperimentMoment =
  | "predict"
  | "intervene"
  | "inspect"
  | "record"
  | "compare"
  | "reflect"
  | "next";

export interface LensCurrentActionCopy {
  kicker: string;
  nowDo: string;
  nextHint?: string;
}

export function lensObserveNowDo(interacted: boolean): string {
  return interacted ? "勾出你确实看见的变化" : "先看看这个装置。物体、透镜和光屏分别在哪里？";
}

export function lensDescribeNowDo(): string {
  return "看着左边的实验，说说你实际看到了什么";
}

export function lensPredictNowDo(): string {
  return "如果把物体移到 F 和 2F 之间，你觉得会发生什么？";
}

export function lensExplainNowDo(): string {
  return "你觉得真正起作用的是什么？";
}

export function lensExperimentMoment(input: {
  predictionLocked: boolean;
  interventionDone: boolean;
  observedSaved: boolean;
  comparisonSaved: boolean;
  reflectionSaved: boolean;
  awaitingNext: boolean;
  needsInspect?: boolean;
  screenInspected?: boolean;
}): LensExperimentMoment {
  if (input.awaitingNext) {
    return "next";
  }
  if (!input.predictionLocked) {
    return "predict";
  }
  if (!input.interventionDone) {
    return "intervene";
  }
  if (input.needsInspect && !input.screenInspected && !input.observedSaved) {
    return "inspect";
  }
  if (!input.observedSaved) {
    return "record";
  }
  if (!input.comparisonSaved) {
    return "compare";
  }
  return "reflect";
}

export function lensExperimentCurrentAction(
  experimentId: LensExperimentId,
  moment: LensExperimentMoment,
): LensCurrentActionCopy {
  const trial = lensTrialSpec(experimentId);
  const kicker = lensTrialPurpose(experimentId);
  if (moment === "predict") {
    return {
      kicker,
      nowDo: "先猜这一次会看见什么",
    };
  }
  if (moment === "intervene") {
    return {
      kicker,
      nowDo: trial.nowDo,
    };
  }
  if (moment === "inspect") {
    return {
      kicker,
      nowDo: trial.nextAfterIntervene,
    };
  }
  if (moment === "record") {
    return {
      kicker,
      nowDo: "你观察到了什么？",
    };
  }
  if (moment === "compare") {
    return {
      kicker,
      nowDo: "和刚才猜的一样吗？",
    };
  }
  if (moment === "next") {
    const nextId = nextLensTrialId(experimentId);
    return {
      kicker,
      nowDo: nextId ? lensTrialPurpose(nextId) : "这一轮先到这里",
    };
  }
  return {
    kicker,
    nowDo: "你现在怎么想？",
  };
}

export function lensEntryNowDo(): string {
  return "开始观察";
}
