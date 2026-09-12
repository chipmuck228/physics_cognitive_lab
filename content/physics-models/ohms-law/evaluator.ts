import type { ModelEvaluatorSpec } from "@/types/physics-model";
import { ModelEvidenceLevel } from "@/types/physics-model";

export const EVALUATOR_COMPONENT_IDS = {
  identifiesCurrent: "identifiesCurrent",
  identifiesVoltage: "identifiesVoltage",
  identifiesResistance: "identifiesResistance",
  usesCurrentVoltageResistanceRelation: "usesCurrentVoltageResistanceRelation",
  checksControlledComparison: "checksControlledComparison",
  distinguishesRearrangementFromCause: "distinguishesRearrangementFromCause",
  checksOhmicClosedCircuit: "checksOhmicClosedCircuit",
  rejectsFormulaAlone: "rejectsFormulaAlone",
} as const;

/**
 * MODEL COMPLETENESS — what a complete ohms-law model contains.
 * This is a target-structure checklist for designers and later
 * evaluators. It is NOT student model-construction evidence.
 *
 * Six correct structured options that merely enumerate these parts
 * must not set constructedValidCausalModel.
 */
export const MINIMUM_L4_MODEL_COMPLETENESS = [
  "identifies-i-u-r-as-distinct",
  "core-relation-i-equals-u-over-r",
  "same-r-larger-u-larger-i",
  "same-u-larger-r-smaller-i",
  "rearrangement-is-not-new-cause-and-r-is-a-property",
  "closed-circuit-and-r-treated-constant",
] as const;

/** @deprecated Use MINIMUM_L4_MODEL_COMPLETENESS. Same six parts; not L4 evidence. */
export const MINIMUM_L4_MODEL_EVIDENCE = MINIMUM_L4_MODEL_COMPLETENESS;

/**
 * STUDENT MODEL-CONSTRUCTION EVIDENCE — one coherent action.
 * Completeness may be inferred from this construction. It must not
 * be scored as six independent correct answers.
 */
export const MINIMUM_L4_CONSTRUCTION_EVIDENCE = [
  "one-board-same-relation-both-controls",
  "authored-control-plus-i-consequence",
  "authored-not-formula-only-or-generic",
  "rejects-rearrangement-as-new-resistance",
] as const;

/**
 * Weakest-pass probes. If any of these can still earn L4 / L5 / L6,
 * the future evaluator is unqualified.
 *
 * These are design constraints, not implemented grading functions.
 */
export const WEAKEST_PASS_PROBES = [
  {
    id: "formula-recitation-only",
    studentMove: "只写或只选 I = U / R，不说明哪个量不变。",
    mustFail: ["L4", "L5", "L6"],
  },
  {
    id: "six-correct-structured-options",
    studentMove:
      "背会 I = U / R 后点对六个完整模型条目，作者栏只写公式或“好好”。",
    mustFail: ["L4", "L5", "L6"],
  },
  {
    id: "voltage-alone-slogan",
    studentMove: "只写“电压大电流就大”，不检查电阻。",
    mustFail: ["L4", "L5", "L6"],
  },
  {
    id: "resistance-alone-slogan",
    studentMove: "只写“电阻大电流就大”或“电阻大电流就小”而不说电压是否相同。",
    mustFail: ["L4", "L5", "L6"],
  },
  {
    id: "r-created-by-division",
    studentMove: "把 R = U / I 说成改变 U 或 I 就制造了新的电阻。",
    mustFail: ["L4", "L5", "L6"],
  },
  {
    id: "surface-also-a-circuit",
    studentMove: "TRANSFER 只写“也是电路，所以还是 I = U / R”。",
    mustFail: ["L5", "L6"],
  },
  {
    id: "ai-off-formula-only",
    studentMove: "AI_OFF 只默写公式，不处理换电池和换电阻两件控制。",
    mustFail: ["L6"],
  },
  {
    id: "ai-off-postcheck-manufactures-r-property",
    studentMove: "预提交只写 I = U / R，事后勾选“电阻不是算出来的”。",
    mustFail: ["L6"],
  },
] as const;

export const modelEvaluatorSpec: ModelEvaluatorSpec = {
  requiredComponents: {
    [EVALUATOR_COMPONENT_IDS.identifiesCurrent]:
      "指出比较或计算时用到了电流 I。",
    [EVALUATOR_COMPONENT_IDS.identifiesVoltage]:
      "指出比较或计算时用到了这段电阻两端的电压 U。",
    [EVALUATOR_COMPONENT_IDS.identifiesResistance]:
      "指出电阻 R 是这段导体的属性，不是电流的别名。",
    [EVALUATOR_COMPONENT_IDS.usesCurrentVoltageResistanceRelation]:
      "用 I = U / R（或等价变形）作为三个量的关系，而不是只背口号。",
    [EVALUATOR_COMPONENT_IDS.checksControlledComparison]:
      "比较前先说明是电阻不变还是电压不变。",
    [EVALUATOR_COMPONENT_IDS.distinguishesRearrangementFromCause]:
      "不把 U = I R 或 R = U / I 说成另一种“谁决定谁”的因果。",
    [EVALUATOR_COMPONENT_IDS.checksOhmicClosedCircuit]:
      "检查电路是否闭合，以及电阻是否可以看成不变。",
    [EVALUATOR_COMPONENT_IDS.rejectsFormulaAlone]:
      "只写出 I = U / R 不能算构建了模型。",
  },
  evidenceLevels: {
    [ModelEvidenceLevel.L1]:
      "能观察到电压变了或电阻变了之后，电流读数不同。",
    [ModelEvidenceLevel.L2]:
      "能识别电流、电压、电阻和电路是否闭合，不把它们说成同一种量。",
    [ModelEvidenceLevel.L3]:
      "能说出部分关系，例如同一个电阻上电压更大时电流更大。",
    [ModelEvidenceLevel.L4]:
      "在一次连贯的模型构建中，用同一个 I = U / R 同时带出两种控制比较，并用自己的话把“保持哪个量不变”和电流后果绑在一起；还要拒绝把 R = U / I 当成改变电压或电流就制造了新电阻。六个完整条目点对、或只默写公式，都不算构建。",
    [ModelEvidenceLevel.L5]:
      "能在新电路图或新器件表面中调用这个关系，并分清灯丝发热、串并联和电功率不能代替它。只说“也是电路”不算。",
    [ModelEvidenceLevel.L6]:
      "能在 AI_OFF 独立挑战中使用该模型：分别处理换电压和换电阻，并拒绝“R 是算出来才有的”。",
  },
};
