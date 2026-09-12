import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

import { HEAT_STAGE_PROMPTS } from "../../lib/content/equal-mass-heated-samples";
import { OHMS_STAGE_PROMPTS } from "../../lib/content/simple-resistor-circuit";
import { SAMPLES_STAGE_PROMPTS } from "../../lib/content/equal-volume-material-samples";
import { ENGINE_STAGE_PROMPTS } from "../../lib/content/four-stroke-engine";
import { CART_STAGE_PROMPTS } from "../../lib/content/horizontal-force-cart";
import { STAGE_PROMPTS } from "../../lib/content/microwave-bread";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  completeCartDescribe,
  completeCartExam,
  completeCartExperimentCycle,
  completeCartExplain,
  completeCartModel,
  completeCartObserve,
  completeCartPredictA,
  completeCartBicycleTransfer,
  completeCartHoverTransfer,
  openCartLab,
  startCartLesson,
} from "./cart-helpers";
import {
  completeEngineDescribe,
  completeEngineExam,
  completeEngineExperimentA,
  completeEngineExperimentB,
  completeEngineExplain,
  completeEngineModel,
  completeEngineObserve,
  completeEnginePredictA,
  completeEngineTransfer,
  openEngineLab,
  startEngineLesson,
} from "./engine-helpers";
import {
  completeHeatDescribe,
  completeHeatExam,
  completeHeatExperimentCycle,
  completeHeatExplain,
  completeHeatIceTransfer,
  completeHeatModel,
  completeHeatObserve,
  completeHeatPotsTransfer,
  completeHeatPredictA,
  openHeatLab,
  startHeatLesson,
} from "./heat-helpers";
import {
  completeOhmsDescribe,
  completeOhmsExam,
  completeOhmsExperimentCycle,
  completeOhmsExplain,
  completeOhmsFilamentTransfer,
  completeOhmsModel,
  completeOhmsObserve,
  completeOhmsPredictA,
  completeOhmsWireTransfer,
  openOhmsLab,
  startOhmsLesson,
} from "./ohms-helpers";
import {
  completeDescribe,
  completeExam,
  completeExperiment,
  completeExplain,
  completeModel,
  completeObserve,
  completePredict,
  completeTransfer,
  openLab,
  startLesson,
} from "./helpers";
import {
  completeSamplesDescribe,
  completeSamplesExam,
  completeSamplesExperimentCycle,
  completeSamplesExplain,
  completeSamplesCupsTransfer,
  completeSamplesHollowTransfer,
  completeSamplesModel,
  completeSamplesObserve,
  completeSamplesPredictA,
  openSamplesLab,
  startSamplesLesson,
} from "./samples-helpers";

const SHOT_DIR = path.join("spec", "student-ui", "screenshots");

type TutorExpectation = "present" | "absent";

async function captureStage(
  page: Page,
  sceneId: string,
  stage: string,
  heading: string,
  tutor: TutorExpectation,
) {
  await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  const tutorButton = page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria });
  await expect(tutorButton).toHaveCount(tutor === "present" ? 1 : 0);
  await page.screenshot({
    path: path.join(SHOT_DIR, `${sceneId}-${stage}.png`),
    fullPage: true,
  });
}

test.describe("student UI screenshot baseline", () => {
  test("Scene 01 microwave-bread required stages", async ({ page }) => {
    test.setTimeout(240_000);
    await openLab(page);
    await startLesson(page);
    await captureStage(page, "scene-01", "observe", STAGE_PROMPTS[LearningStage.OBSERVE]!, "present");
    await completeObserve(page);
    await completeDescribe(page);
    await captureStage(page, "scene-01", "predict", STAGE_PROMPTS[LearningStage.PREDICT]!, "present");
    await completePredict(page);
    await captureStage(page, "scene-01", "experiment", STAGE_PROMPTS[LearningStage.EXPERIMENT]!, "absent");
    await completeExperiment(page);
    await completeExplain(page);
    await captureStage(page, "scene-01", "model", STAGE_PROMPTS[LearningStage.MODEL]!, "present");
    await completeModel(page);
    await captureStage(page, "scene-01", "transfer", STAGE_PROMPTS[LearningStage.TRANSFER]!, "present");
    await completeTransfer(page);
    await captureStage(page, "scene-01", "exam", STAGE_PROMPTS[LearningStage.EXAM]!, "present");
    await completeExam(page);
    await captureStage(page, "scene-01", "ai-off", STAGE_PROMPTS[LearningStage.AI_OFF]!, "absent");
  });

  test("Scene 02 four-stroke-engine required stages", async ({ page }) => {
    test.setTimeout(240_000);
    await openEngineLab(page);
    await startEngineLesson(page);
    await captureStage(page, "scene-02", "observe", ENGINE_STAGE_PROMPTS[LearningStage.OBSERVE]!, "present");
    await completeEngineObserve(page);
    await completeEngineDescribe(page);
    await captureStage(page, "scene-02", "predict", ENGINE_STAGE_PROMPTS[LearningStage.PREDICT]!, "present");
    await completeEnginePredictA(page);
    await captureStage(page, "scene-02", "experiment", ENGINE_STAGE_PROMPTS[LearningStage.EXPERIMENT]!, "absent");
    await completeEngineExperimentA(page);
    await completeEngineExperimentB(page);
    await completeEngineExplain(page);
    await captureStage(page, "scene-02", "model", ENGINE_STAGE_PROMPTS[LearningStage.MODEL]!, "present");
    await completeEngineModel(page);
    await captureStage(page, "scene-02", "transfer", ENGINE_STAGE_PROMPTS[LearningStage.TRANSFER]!, "present");
    await completeEngineTransfer(page);
    await captureStage(page, "scene-02", "exam", ENGINE_STAGE_PROMPTS[LearningStage.EXAM]!, "present");
    await completeEngineExam(page);
    await captureStage(page, "scene-02", "ai-off", ENGINE_STAGE_PROMPTS[LearningStage.AI_OFF]!, "absent");
  });

  test("Scene 03 horizontal-force-cart required stages", async ({ page }) => {
    test.setTimeout(240_000);
    await openCartLab(page);
    await startCartLesson(page);
    await captureStage(page, "scene-03", "observe", CART_STAGE_PROMPTS[LearningStage.OBSERVE]!, "present");
    await completeCartObserve(page);
    await completeCartDescribe(page);
    await captureStage(page, "scene-03", "predict", CART_STAGE_PROMPTS[LearningStage.PREDICT]!, "present");
    await completeCartPredictA(page, "会越来越慢");
    await captureStage(page, "scene-03", "experiment", CART_STAGE_PROMPTS[LearningStage.EXPERIMENT]!, "absent");
    await completeCartExperimentCycle(page, {
      speed: "更快",
      direction: "方向没有变",
      motion: "加快",
      comparison: "不一样",
      reflection: "顺着推以后，小车更快了。",
    });
    await completeCartExperimentCycle(page, {
      predictOutcome: "会越来越快",
      reason: "我以为力必须和运动同一边。",
      speed: "更慢",
      direction: "方向没有变",
      motion: "减慢",
      comparison: "不一样",
      reflection: "力也可以顶着运动，小车会变慢。",
    });
    await completeCartExperimentCycle(page, {
      predictOutcome: "会立刻掉转方向",
      reason: "没有向前的力就会停。",
      speed: "快慢几乎不变",
      direction: "方向没有变",
      motion: "保持原来的运动",
      comparison: "不一样",
      reflection: "合力为零时，它还可以继续运动。",
    });
    await completeCartExplain(page);
    await captureStage(page, "scene-03", "model", CART_STAGE_PROMPTS[LearningStage.MODEL]!, "present");
    await completeCartModel(page);
    await captureStage(page, "scene-03", "transfer", CART_STAGE_PROMPTS[LearningStage.TRANSFER]!, "present");
    await completeCartBicycleTransfer(page);
    await completeCartHoverTransfer(page);
    await captureStage(page, "scene-03", "exam", CART_STAGE_PROMPTS[LearningStage.EXAM]!, "present");
    await completeCartExam(page);
    await captureStage(page, "scene-03", "ai-off", CART_STAGE_PROMPTS[LearningStage.AI_OFF]!, "absent");
  });

  test("Scene 04 equal-volume-material-samples required stages", async ({ page }) => {
    test.setTimeout(240_000);
    await openSamplesLab(page);
    await startSamplesLesson(page);
    await captureStage(page, "scene-04", "observe", SAMPLES_STAGE_PROMPTS[LearningStage.OBSERVE]!, "present");
    await completeSamplesObserve(page);
    await completeSamplesDescribe(page);
    await captureStage(page, "scene-04", "predict", SAMPLES_STAGE_PROMPTS[LearningStage.PREDICT]!, "present");
    await completeSamplesPredictA(page, "体积相同，所以密度一定相同");
    await captureStage(page, "scene-04", "experiment", SAMPLES_STAGE_PROMPTS[LearningStage.EXPERIMENT]!, "absent");
    await completeSamplesExperimentCycle(page, {
      kind: "same-volume",
      mass: "铁块更重",
      volume: "体积几乎相同",
      density: "铁块密度更大",
      comparison: "不一样",
      reflection: "同样大的时候，更沉的那一块密度更大。",
    });
    await completeSamplesExperimentCycle(page, {
      kind: "same-mass",
      predictOutcome: "占空间更大的那一块密度更小",
      reason: "质量相同，占的空间更大就更疏。",
      mass: "两块质量几乎相同",
      volume: "塑料块体积更大",
      density: "金属小块密度更大",
      comparison: "差不多一样",
      reflection: "同样重的时候，更大的那一块密度更小。",
    });
    await completeSamplesExperimentCycle(page, {
      kind: "cut",
      predictOutcome: "切成一半，密度也变成一半",
      reason: "我以为切小了密度就会变小。",
      mass: "大约变成一半",
      volume: "大约变成一半",
      density: "几乎不变",
      comparison: "不一样",
      reflection: "均匀切开以后，质量和体积一起变，密度不必变。",
    });
    await completeSamplesExplain(page);
    await captureStage(page, "scene-04", "model", SAMPLES_STAGE_PROMPTS[LearningStage.MODEL]!, "present");
    await completeSamplesModel(page);
    await captureStage(page, "scene-04", "transfer", SAMPLES_STAGE_PROMPTS[LearningStage.TRANSFER]!, "present");
    await completeSamplesCupsTransfer(page);
    await completeSamplesHollowTransfer(page);
    await captureStage(page, "scene-04", "exam", SAMPLES_STAGE_PROMPTS[LearningStage.EXAM]!, "present");
    await completeSamplesExam(page);
    await captureStage(page, "scene-04", "ai-off", SAMPLES_STAGE_PROMPTS[LearningStage.AI_OFF]!, "absent");
  });

  test("Scene 05 equal-mass-heated-samples required stages", async ({ page }) => {
    test.setTimeout(240_000);
    await openHeatLab(page);
    await startHeatLesson(page);
    await captureStage(page, "scene-05", "observe", HEAT_STAGE_PROMPTS[LearningStage.OBSERVE]!, "present");
    await completeHeatObserve(page);
    await completeHeatDescribe(page);
    await captureStage(page, "scene-05", "predict", HEAT_STAGE_PROMPTS[LearningStage.PREDICT]!, "present");
    await completeHeatPredictA(page, "两边升得一样");
    await captureStage(page, "scene-05", "experiment", HEAT_STAGE_PROMPTS[LearningStage.EXPERIMENT]!, "absent");
    await completeHeatExperimentCycle(page, {
      mass: "质量相同",
      energy: "吸收的能量可以看成相近",
      deltaT: "沙子升温更多",
      comparison: "不一样",
      reflection: "质量相同、能量相近时，沙子升得更多。时间不是吸收的能量。",
    });
    await completeHeatExperimentCycle(page, {
      predictOutcome: "质量更小的那份升得更多",
      reason: "同样加热，质量更小的应该升得更多。",
      mass: "左边质量更小",
      energy: "吸收的能量可以看成相近",
      deltaT: "质量更小的升温更多",
      comparison: "差不多一样",
      reflection: "同一种材料、能量相近时，质量更大升温更小。",
    });
    await completeHeatExperimentCycle(page, {
      predictOutcome: "吸收能量更多的那次升得更多",
      reason: "同样样品时，能量更多升温应该更多。",
      mass: "质量相同",
      energy: "右边吸收的能量更多",
      deltaT: "能量更多的那次升温更多",
      comparison: "差不多一样",
      reflection: "同样材料、同样质量时，吸收能量更多升温更多。",
    });
    await completeHeatExplain(page);
    await captureStage(page, "scene-05", "model", HEAT_STAGE_PROMPTS[LearningStage.MODEL]!, "present");
    await completeHeatModel(page);
    await captureStage(page, "scene-05", "transfer", HEAT_STAGE_PROMPTS[LearningStage.TRANSFER]!, "present");
    await completeHeatPotsTransfer(page);
    await completeHeatIceTransfer(page);
    await captureStage(page, "scene-05", "exam", HEAT_STAGE_PROMPTS[LearningStage.EXAM]!, "present");
    await completeHeatExam(page);
    await captureStage(page, "scene-05", "ai-off", HEAT_STAGE_PROMPTS[LearningStage.AI_OFF]!, "absent");
  });

  test("Scene 06 simple-resistor-circuit required stages", async ({ page }) => {
    test.setTimeout(240_000);
    await openOhmsLab(page);
    await startOhmsLesson(page);
    await captureStage(page, "scene-06", "observe", OHMS_STAGE_PROMPTS[LearningStage.OBSERVE]!, "present");
    await completeOhmsObserve(page);
    await completeOhmsDescribe(page);
    await captureStage(page, "scene-06", "predict", OHMS_STAGE_PROMPTS[LearningStage.PREDICT]!, "present");
    await completeOhmsPredictA(page);
    await captureStage(page, "scene-06", "experiment", OHMS_STAGE_PROMPTS[LearningStage.EXPERIMENT]!, "absent");
    await completeOhmsExperimentCycle(page, {
      held: "电阻可以看成没变",
      current: "电流更大",
      comparison: "和我猜的差不多",
      reflection: "电阻没变时，电压更大，电流更大。",
    });
    await completeOhmsExperimentCycle(page, {
      predictOutcome: "电流会变小",
      reason: "电压没变，电阻更大，电流应该更小。",
      held: "电压可以看成没变",
      current: "电流更小",
      comparison: "和我猜的差不多",
      reflection: "电压没变时，电阻更大，电流更小。",
    });
    await completeOhmsExplain(page);
    await captureStage(page, "scene-06", "model", OHMS_STAGE_PROMPTS[LearningStage.MODEL]!, "present");
    await completeOhmsModel(page);
    await captureStage(page, "scene-06", "transfer", OHMS_STAGE_PROMPTS[LearningStage.TRANSFER]!, "present");
    await completeOhmsWireTransfer(page);
    await completeOhmsFilamentTransfer(page);
    await captureStage(page, "scene-06", "exam", OHMS_STAGE_PROMPTS[LearningStage.EXAM]!, "present");
    await completeOhmsExam(page);
    await captureStage(page, "scene-06", "ai-off", OHMS_STAGE_PROMPTS[LearningStage.AI_OFF]!, "absent");
  });
});
