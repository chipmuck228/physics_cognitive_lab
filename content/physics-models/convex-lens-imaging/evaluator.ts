import type { ModelEvaluatorSpec } from "@/types/physics-model";
import { ModelEvidenceLevel } from "@/types/physics-model";

export const EVALUATOR_COMPONENT_IDS = {
  identifiesObjectRelativeToF: "identifiesObjectRelativeToF",
  identifiesFocalLandmarks: "identifiesFocalLandmarks",
  identifiesRayMeetingMode: "identifiesRayMeetingMode",
  bindsImageAsConsequence: "bindsImageAsConsequence",
  distinguishesRealVirtualFromOrientation: "distinguishesRealVirtualFromOrientation",
  checksScreenReceivability: "checksScreenReceivability",
  treatsObjectAtFAsLimit: "treatsObjectAtFAsLimit",
  rejectsMnemonicTableAlone: "rejectsMnemonicTableAlone",
} as const;

/**
 * MODEL COMPLETENESS — designer checklist, not student construction
 * evidence. Selecting these rows must not set constructedValidCausalModel.
 */
export const MINIMUM_L4_MODEL_COMPLETENESS = [
  "object-position-relative-to-f-and-2f",
  "ray-meeting-mode",
  "image-position-as-intersection-or-backward-extension",
  "image-nature-orientation-size-as-consequences",
  "screen-receivability-follows-real-vs-virtual",
  "u-equals-f-is-not-a-finite-image",
] as const;

/** @deprecated Use MINIMUM_L4_MODEL_COMPLETENESS. Not L4 evidence. */
export const MINIMUM_L4_MODEL_EVIDENCE = MINIMUM_L4_MODEL_COMPLETENESS;

/**
 * STUDENT MODEL-CONSTRUCTION EVIDENCE — one coherent spatial-ray act.
 */
export const MINIMUM_L4_CONSTRUCTION_EVIDENCE = [
  "places-object-relative-to-f-or-2f",
  "constructs-or-decides-two-canonical-rays",
  "decides-actual-convergence-vs-backward-extension-vs-no-finite-meeting",
  "assigns-image-properties-as-consequences-not-lookup",
] as const;

export const WEAKEST_PASS_PROBES = [
  {
    id: "five-row-table-recitation",
    studentMove: "只背或只选“u>2f 缩小倒立实像”等五行，不谈光线会不会聚。",
    mustFail: ["L4", "L5", "L6"],
  },
  {
    id: "recognize-completed-ray-diagram",
    studentMove: "从已画好的光路图里认出标准图，自己没有决定交点或反向延长。",
    mustFail: ["L4", "L5", "L6"],
  },
  {
    id: "click-image-properties-without-relation",
    studentMove: "点对实像/倒立/缩小，不说明会聚方式。",
    mustFail: ["L4", "L5", "L6"],
  },
  {
    id: "copy-visible-rays",
    studentMove: "界面已经画出两条光线和交点，学生只是确认看见了。",
    mustFail: ["L4"],
  },
  {
    id: "surface-also-has-convex-lens",
    studentMove: "TRANSFER 只写“这也有凸透镜，所以一样”。",
    mustFail: ["L5", "L6"],
  },
  {
    id: "correct-option-no-spatial-reason",
    studentMove: "EXAM 或 AI_OFF 只选对最后一项，预提交没有空间理由。",
    mustFail: ["L6"],
  },
  {
    id: "postcheck-manufactures-ray-meeting",
    studentMove: "预提交只背表，事后勾选“光线真正会聚”。",
    mustFail: ["L6"],
  },
  {
    id: "object-at-f-as-ordinary-row",
    studentMove: "把 u = f 说成又一种普通有限远成像。",
    mustFail: ["L4", "L5", "L6"],
  },
] as const;

export const modelEvaluatorSpec: ModelEvaluatorSpec = {
  requiredComponents: {
    [EVALUATOR_COMPONENT_IDS.identifiesObjectRelativeToF]:
      "指出物体相对 F / 2F 在哪里。",
    [EVALUATOR_COMPONENT_IDS.identifiesFocalLandmarks]:
      "把 F 和 2F 当成焦点几何，而不是无意义记号。",
    [EVALUATOR_COMPONENT_IDS.identifiesRayMeetingMode]:
      "判断透镜后是真正会聚、反向延长线相交，还是有限远处不相交。",
    [EVALUATOR_COMPONENT_IDS.bindsImageAsConsequence]:
      "把像的位置和性质说成会聚方式的结果，而不是查表。",
    [EVALUATOR_COMPONENT_IDS.distinguishesRealVirtualFromOrientation]:
      "实像/虚像与正立/倒立不是同一个性质。",
    [EVALUATOR_COMPONENT_IDS.checksScreenReceivability]:
      "实像可被光屏接到，虚像不能；光屏位置不等于像的位置。",
    [EVALUATOR_COMPONENT_IDS.treatsObjectAtFAsLimit]:
      "u = f 不成有限远的像。",
    [EVALUATOR_COMPONENT_IDS.rejectsMnemonicTableAlone]:
      "只背五种情况不能算构建了模型。",
  },
  evidenceLevels: {
    [ModelEvidenceLevel.L1]:
      "能观察到物距不同时，光屏上有时有清晰像、有时没有，像有时大有时小。",
    [ModelEvidenceLevel.L2]:
      "能识别物距、焦点、光屏、像，不把像说成“在透镜上”或“就是光屏”。",
    [ModelEvidenceLevel.L3]:
      "能说出部分关系，例如焦点以外可以接到倒立的像，焦点以内光屏接不到。",
    [ModelEvidenceLevel.L4]:
      "在一次连贯的空间光路建构中，自己决定物体相对 F/2F 的位置、两条典型光线如何走、交点是真正会聚还是反向延长，并把实像/虚像和光屏能否接到绑在这个决定上。只背五种情况、只点性质、或只认出已画好的图，都不算构建。",
    [ModelEvidenceLevel.L5]:
      "能在投影仪或放大镜等新表面中调用同一条会聚结构，并分清平面镜成像和“也有凸透镜”不能代替它。",
    [ModelEvidenceLevel.L6]:
      "能在 AI_OFF 独立挑战中使用该模型：说明会聚方式，拒绝虚像上屏，并拒绝把 u = f 当成普通有限远成像。事后勾选不能补上预提交缺失的空间推理。",
  },
};
