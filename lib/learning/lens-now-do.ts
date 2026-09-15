import { lensTrialSpec } from "@/lib/learning/lens-trial-intervention";
import type { LensExperimentId } from "@/lib/physics/convex-lens-optical-bench";

export type LensExperimentMoment =
  | "predict"
  | "intervene"
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
  return "对着光具座，把物体、透镜、像和光屏分开说";
}

export function lensPredictNowDo(): string {
  return "先猜你会看见什么。现在不用答对";
}

export function lensExperimentMoment(input: {
  predictionLocked: boolean;
  interventionDone: boolean;
  observedSaved: boolean;
  comparisonSaved: boolean;
  reflectionSaved: boolean;
  awaitingNext: boolean;
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
      nowDo: "先猜这一次会看见什么。现在不用答对",
      nextHint: "记下猜想以后，再到光具座上动手。",
    };
  }
  if (moment === "intervene") {
    return {
      kicker,
      nowDo: trial.nowDo,
      nextHint: trial.nextAfterIntervene,
    };
  }
  if (moment === "record") {
    return {
      kicker,
      nowDo: "记下你看见的：光屏怎样了，像怎样了",
      nextHint:
        trial.capability === "cover-lens"
          ? "看清楚像还在不在，然后记下。"
          : "可以再移动光屏看一看，然后记下。",
    };
  }
  if (moment === "compare") {
    return {
      kicker,
      nowDo: "对照一下：和刚才猜的一样吗？",
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
    nowDo: "用自己的话写一句你现在怎么想",
  };
}

export function lensEntryNowDo(): string {
  return "点下面的「开始观察」";
}
