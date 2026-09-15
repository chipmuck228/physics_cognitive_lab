import { describe, expect, it } from "vitest";

import {
  lensExperimentCurrentAction,
  lensExperimentMoment,
} from "@/lib/learning/lens-now-do";
import {
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_B,
  LENS_EXPERIMENT_C,
  LENS_EXPERIMENT_D,
} from "@/lib/physics/convex-lens-optical-bench";

const ids = [
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_B,
  LENS_EXPERIMENT_C,
  LENS_EXPERIMENT_D,
] as const;

describe("Scene 07 experiment current action", () => {
  it("names the round and the current action for every trial", () => {
    const expectedNowDo = {
      [LENS_EXPERIMENT_A]: "把物体移到 F 和 2F 之间",
      [LENS_EXPERIMENT_B]: "把物体放到焦点上",
      [LENS_EXPERIMENT_C]: "把物体放到焦点以内",
      [LENS_EXPERIMENT_D]: "遮住透镜一部分",
    };

    ids.forEach((id, index) => {
      const intervene = lensExperimentCurrentAction(id, "intervene");
      expect(intervene.kicker).toContain(`第 ${index + 1} / 4 次`);
      expect(intervene.nowDo).toBe(expectedNowDo[id]);

      const record = lensExperimentCurrentAction(id, "record");
      expect(record.nowDo).toContain("你观察到了什么");
      if (id !== LENS_EXPERIMENT_D) {
        expect(lensExperimentCurrentAction(id, "inspect").nowDo).toContain("移动光屏");
      }
      expect(lensExperimentCurrentAction(id, "next").nowDo).toBe("开始下一次");
    });
  });

  it("changes the current action after the previous moment is complete", () => {
    expect(
      lensExperimentMoment({
        predictionLocked: true,
        interventionDone: false,
        observedSaved: false,
        comparisonSaved: false,
        reflectionSaved: false,
        awaitingNext: false,
      }),
    ).toBe("intervene");
    expect(
      lensExperimentMoment({
        predictionLocked: true,
        interventionDone: true,
        observedSaved: false,
        comparisonSaved: false,
        reflectionSaved: false,
        awaitingNext: false,
        needsInspect: true,
        screenInspected: false,
      }),
    ).toBe("inspect");
    expect(
      lensExperimentMoment({
        predictionLocked: true,
        interventionDone: true,
        observedSaved: false,
        comparisonSaved: false,
        reflectionSaved: false,
        awaitingNext: false,
        needsInspect: true,
        screenInspected: true,
      }),
    ).toBe("record");
  });
});
