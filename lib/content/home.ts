import { LENS_COPY, LENS_STAGE_PROMPTS } from "@/lib/content/convex-lens-optical-bench";
import { HEAT_COPY } from "@/lib/content/equal-mass-heated-samples";
import { SAMPLES_COPY } from "@/lib/content/equal-volume-material-samples";
import { ENGINE_COPY } from "@/lib/content/four-stroke-engine";
import { CART_COPY } from "@/lib/content/horizontal-force-cart";
import { SCENE_COPY } from "@/lib/content/microwave-bread";
import { OHMS_COPY, OHMS_STAGE_PROMPTS } from "@/lib/content/simple-resistor-circuit";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import { LearningStage } from "@/types/learning";

export const HOME_COPY = {
  productName: STUDENT_CHROME.productName,
  kicker: "九年级物理",
  title: "学会用物理去想",
  lead: "实验室把现象呈现出来。你负责观察、猜测、解释、建立模型，再把它用到新情况和题目上。提示不会替你想。最后一次，没有提示，自己做。",
  contrast: "这里不是刷题机，也不是让 AI 替你写答案。",
  pathTitle: "一条思考路径",
  scenesTitle: "选一个现象开始",
  scenesHint: "每个现象学一个模型。可以从任意一个开始。",
  footer:
    "这是一个研究原型。留下的思考痕迹不是分数，也不表示已经学会了物理。",
} as const;

export const HOME_ROLES = [
  {
    title: "你来想",
    body: "观察、猜测、解释、建立模型。思考是你的事。",
  },
  {
    title: "实验室呈现现象",
    body: "变化由确定的规则算出来，不是聊天编出来的。",
  },
  {
    title: "提示不替你答",
    body: "卡住时可以要一点提示。最后一次没有提示，自己做。",
  },
] as const;

export const HOME_PATH_STEPS = [
  "观察",
  "描述",
  "预测",
  "动手",
  "解释",
  "建立模型",
  "换个情境",
  "题目",
  "独立做",
] as const;

export const LAB_SCENES = [
  {
    id: "microwave-bread",
    href: "/scenes/microwave-bread",
    kicker: SCENE_COPY.landingKicker,
    title: SCENE_COPY.landingTitle,
    question: SCENE_COPY.headline,
    cta: SCENE_COPY.landingCta,
  },
  {
    id: "four-stroke-engine",
    href: "/scenes/four-stroke-engine",
    kicker: ENGINE_COPY.landingKicker,
    title: ENGINE_COPY.landingTitle,
    question: ENGINE_COPY.headline,
    cta: ENGINE_COPY.landingCta,
  },
  {
    id: "horizontal-force-cart",
    href: "/scenes/horizontal-force-cart",
    kicker: CART_COPY.landingKicker,
    title: CART_COPY.landingTitle,
    question: CART_COPY.headline,
    cta: CART_COPY.landingCta,
  },
  {
    id: "equal-volume-material-samples",
    href: "/scenes/equal-volume-material-samples",
    kicker: SAMPLES_COPY.landingKicker,
    title: SAMPLES_COPY.landingTitle,
    question: SAMPLES_COPY.headline,
    cta: SAMPLES_COPY.landingCta,
  },
  {
    id: "equal-mass-heated-samples",
    href: "/scenes/equal-mass-heated-samples",
    kicker: HEAT_COPY.landingKicker,
    title: HEAT_COPY.landingTitle,
    question: HEAT_COPY.headline,
    cta: HEAT_COPY.landingCta,
  },
  {
    id: "simple-resistor-circuit",
    href: "/scenes/simple-resistor-circuit",
    kicker: OHMS_COPY.landingKicker,
    title: OHMS_COPY.landingTitle,
    question: OHMS_STAGE_PROMPTS[LearningStage.ENTRY],
    cta: OHMS_COPY.landingCta,
  },
  {
    id: "convex-lens-optical-bench",
    href: "/scenes/convex-lens-optical-bench",
    kicker: LENS_COPY.landingKicker,
    title: LENS_COPY.landingTitle,
    question: LENS_STAGE_PROMPTS[LearningStage.ENTRY],
    cta: LENS_COPY.landingCta,
  },
] as const;

export function sceneEnterAria(scene: {
  cta: string;
  title: string;
}): string {
  return `${scene.cta}：${scene.title}`;
}
