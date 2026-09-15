import { lensTrialSpec } from "@/lib/learning/lens-trial-intervention";
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
  return interacted ? "勾出你确实看见的变化" : "点物体位置，或移动一次光屏";
}

export function lensDescribeNowDo(): string {
  return "看着左边的实验，说说你实际看到了什么";
}

export function lensPredictNowDo(): string {
  return "先猜你会看见什么";
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
  const kicker = `动手试试 · 第 ${trial.index} / 4 次`;
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
    return {
      kicker,
      nowDo: "开始下一次",
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
