import type { ModelEvaluatorSpec, TransferMode } from "@/types/physics-model";
import { ModelEvidenceLevel } from "@/types/physics-model";
import { MODEL_RELATION_IDS } from "./model";

export const EVALUATOR_COMPONENT_IDS = {
  identifiesHeatEnergy: "identifiesHeatEnergy",
  identifiesMass: "identifiesMass",
  identifiesTemperatureChange: "identifiesTemperatureChange",
  identifiesSpecificHeat: "identifiesSpecificHeat",
  usesHeatMassTempRelation: "usesHeatMassTempRelation",
  distinguishesHeatFromTemperature: "distinguishesHeatFromTemperature",
  checksNoPhaseChangeCondition: "checksNoPhaseChangeCondition",
  checksControlledComparison: "checksControlledComparison",
  checksTemperatureSufficiency: "checksTemperatureSufficiency",
} as const;

export const MINIMUM_L4_MODEL_EVIDENCE = [
  "core-relation-q-equals-c-m-delta-t",
  "same-mass-same-delta-t-larger-c-larger-q",
  "same-mass-same-q-larger-c-smaller-delta-t",
  "same-c-same-q-larger-mass-smaller-delta-t",
  "no-phase-change-and-time-is-not-q",
  "c13-temperature-alone-is-insufficient",
] as const;

export const modelEvaluatorSpec: ModelEvaluatorSpec = {
  requiredComponents: {
    [EVALUATOR_COMPONENT_IDS.identifiesHeatEnergy]:
      "指出比较或计算时用到了吸收或放出的能量 Q。",
    [EVALUATOR_COMPONENT_IDS.identifiesMass]: "指出比较或计算时用到了质量。",
    [EVALUATOR_COMPONENT_IDS.identifiesTemperatureChange]:
      "指出比较或计算时用到了温度变化，而不是只说“有多热”。",
    [EVALUATOR_COMPONENT_IDS.identifiesSpecificHeat]:
      "指出比热容是材料属性，不是温度本身。",
    [EVALUATOR_COMPONENT_IDS.usesHeatMassTempRelation]:
      "用 Q = c m ΔT（或 c = Q / (m ΔT)），而不是只用谁更烫或加热多久。",
    [EVALUATOR_COMPONENT_IDS.distinguishesHeatFromTemperature]:
      "不把温度说成吸收的能量。",
    [EVALUATOR_COMPONENT_IDS.checksNoPhaseChangeCondition]:
      "检查这段过程有没有物态变化，不把熔化时的吸热悄悄写成升温。",
    [EVALUATOR_COMPONENT_IDS.checksControlledComparison]:
      "比较前先说明质量、能量或材料哪个相同。",
    [EVALUATOR_COMPONENT_IDS.checksTemperatureSufficiency]:
      "只知道温度升了，还不能断定吸收的能量或比热容；还要看质量和 Q。",
  },
  evidenceLevels: {
    [ModelEvidenceLevel.L1]: "能观察到同样加热后，有的样品更烫，有的升得慢。",
    [ModelEvidenceLevel.L2]: "能识别质量、温度、材料、加热过程等对象和物理量。",
    [ModelEvidenceLevel.L3]: "能说出部分关系，例如同样加热时水比沙子升得慢。",
    [ModelEvidenceLevel.L4]:
      "能用同一个 Q = c m ΔT 同时说明：同样质量同样升温则 c 更大 Q 更大；同样质量同样能量则 c 更大 ΔT 更小；同样材料同样能量则质量更大 ΔT 更小；并标出无物态变化且时间不是 Q；还能指出只看升温不够。只写出公式或三条口号不算。",
    [ModelEvidenceLevel.L5]:
      "能在新情境中调用这个关系，并分清热传递快慢、物态变化和 Scene 01 的能量链不能代替它。",
    [ModelEvidenceLevel.L6]:
      "能在独立挑战中使用该模型，并检查 Q 是否就是加热时间、有没有物态变化。",
  },
};

export interface SpecificHeatSignals {
  identifiesHeatEnergy: boolean;
  identifiesMass: boolean;
  identifiesTemperatureChange: boolean;
  identifiesSpecificHeat: boolean;
  usesHeatMassTempRelation: boolean;
  distinguishesHeatFromTemperature: boolean;
  checksNoPhaseChangeCondition: boolean;
  checksControlledComparison: boolean;
  claimsHotterMeansMoreHeat: boolean;
  claimsSameTimeSameRise: boolean;
  claimsMoreMassHotter: boolean;
  claimsHeatingAlwaysRaisesTemperature: boolean;
  claimsMaterialNameAlone: boolean;
  considersQMassAndDeltaTTogether: boolean;
  statesNonTransferLimit: boolean;
  conclusionOnlyMaterialReasoning: boolean;
}

const HEAT = ["能量", "吸热", "放热", "热量", "q"];
const MASS = ["质量", "同样重", "千克", "kg", "mass"];
const DELTA_T = ["升温", "温度变化", "升了", "降了", "δt", "δt", "deltat", "Δt"];
const SPECIFIC_HEAT = ["比热容", "比热", "specific heat"];
const RELATION = ["q=c", "q = c", "c=q", "c = q", "c m", "cmδ", "cmΔ"];
const PHASE = ["熔化", "沸腾", "物态", "冰水", "相变"];
const CONTROL = ["质量相同", "能量相同", "同样质量", "同样加热"];
const HOTTER_MORE_HEAT = ["更烫能量就更多", "谁烫谁吸热多", "温度高就是热多"];
const SAME_TIME = ["加热一样久温度就一样", "同样加热一定同样烫", "时间相同升温相同"];
const MORE_MASS = ["质量大升温一定多", "东西越多越容易烫"];
const ALWAYS_RISE = ["加热温度一定升高", "吸热就一定升温"];
const MATERIAL_ALONE = [
  "材料不同所以升温不同",
  "因为材料不同",
  "不同物质所以不一样烫",
  "材料不一样就这样",
];
const NON_TRANSFER = [
  "不能直接",
  "不能搬",
  "不是气候",
  "不是天气",
  "不是风力",
  "不是流动",
  "不是散热",
  "散热器",
  "不能解释全部",
];
const TARGETS_NEEDING_NON_TRANSFER = new Set([
  "medium-coastal-vs-inland",
  "far-car-cooling-water",
]);
const PHYSICS_NOUNS = ["质量", "温度", "能量", "比热", "热量"];
const COMPARISON_MARKERS = ["相同", "同样", "相近", "不同", "更大", "更小", "则"];
const BOUNDARY_MARKERS = [
  "熔化",
  "融化",
  "物态",
  "相变",
  "不能用",
  "不能写",
  "不能直接",
  "不能只用",
  "温度不变",
  "几乎不变",
  "没有升温",
  "不一定升",
];
const GENERIC_BOUNDARY_PHRASES = [
  "质量温度能量都有",
  "两边都还在加热",
  "还在加热",
  "情况不一样",
  "看起来像",
  "都是加热",
  "还是冷的",
  "所以很奇怪",
  "很奇怪",
];

export function extractSpecificHeatSignals(text: string): SpecificHeatSignals {
  const normalized = normalize(text);
  const identifiesHeatEnergy = includesAny(normalized, HEAT);
  const identifiesMass = includesAny(normalized, MASS);
  const identifiesTemperatureChange =
    includesAny(normalized, DELTA_T) || normalized.includes("温度");
  const identifiesSpecificHeat = includesAny(normalized, SPECIFIC_HEAT);
  const usesHeatMassTempRelation =
    includesAny(normalized, RELATION) ||
    (identifiesHeatEnergy &&
      identifiesMass &&
      identifiesTemperatureChange &&
      includesAny(normalized, COMPARISON_MARKERS));
  const claimsHotterMeansMoreHeat = includesAny(normalized, HOTTER_MORE_HEAT);
  const claimsSameTimeSameRise = includesAny(normalized, SAME_TIME);
  const claimsMoreMassHotter = includesAny(normalized, MORE_MASS);
  const claimsHeatingAlwaysRaisesTemperature = includesAny(normalized, ALWAYS_RISE);
  const claimsMaterialNameAlone = includesAny(normalized, MATERIAL_ALONE);
  const statesNonTransferLimit = includesAny(normalized, NON_TRANSFER);
  const checksNoPhaseChangeCondition = includesAny(normalized, PHASE);
  const checksControlledComparison = includesAny(normalized, CONTROL);
  const considersQMassAndDeltaTTogether =
    identifiesHeatEnergy &&
    identifiesMass &&
    identifiesTemperatureChange &&
    includesAny(normalized, COMPARISON_MARKERS) &&
    !looksLikePhysicsNounSandwich(text);
  const conclusionOnlyMaterialReasoning =
    claimsMaterialNameAlone && !considersQMassAndDeltaTTogether;
  const distinguishesHeatFromTemperature =
    identifiesSpecificHeat ||
    (identifiesHeatEnergy && !claimsHotterMeansMoreHeat);

  return {
    identifiesHeatEnergy,
    identifiesMass,
    identifiesTemperatureChange,
    identifiesSpecificHeat,
    usesHeatMassTempRelation,
    distinguishesHeatFromTemperature,
    checksNoPhaseChangeCondition,
    checksControlledComparison,
    claimsHotterMeansMoreHeat,
    claimsSameTimeSameRise,
    claimsMoreMassHotter,
    claimsHeatingAlwaysRaisesTemperature,
    claimsMaterialNameAlone,
    considersQMassAndDeltaTTogether,
    statesNonTransferLimit,
    conclusionOnlyMaterialReasoning,
  };
}

export const REQUIRED_ICE_BOUNDARY_CONDITION_CHECKS = [
  "melting-phase-change",
  "energy-can-enter-without-rise",
  "cannot-finish-with-q-equals-c-m-dt",
] as const;

export function evaluateTransferAttempt(input: {
  targetId: string;
  transferMode: TransferMode;
  selectedRelations: string[];
  rejectedRelations: string[];
  studentExplanation: string;
  conditionChecks?: readonly string[];
}): { accepted: boolean; failureKinds: string[] } {
  const failureKinds: string[] = [];
  const signals = extractSpecificHeatSignals(input.studentExplanation);
  const selected = new Set(input.selectedRelations);

  if (looksLikePhysicsNounSandwich(input.studentExplanation)) {
    failureKinds.push("keyword-sandwich");
  }

  if (input.transferMode === "full-model") {
    if (!selected.has(MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT)) {
      failureKinds.push("missing-heat-mass-temp-relation");
    }
    if (signals.claimsHotterMeansMoreHeat || signals.claimsSameTimeSameRise) {
      failureKinds.push("heat-temperature-conflation");
    }
    if (looksLikeSurfaceOnly(input.studentExplanation)) {
      failureKinds.push("surface-similarity-only");
    }
    if (
      TARGETS_NEEDING_NON_TRANSFER.has(input.targetId) &&
      !signals.statesNonTransferLimit
    ) {
      failureKinds.push("missing-non-transfer-limit");
    }
  }

  if (input.transferMode === "boundary-contrast") {
    if (!selected.has(MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT)) {
      failureKinds.push("missing-heat-mass-temp-relation");
    }
    if (!hasStructuredIceBoundaryEvidence(input)) {
      failureKinds.push("missing-phase-change-boundary");
    }
    if (signals.claimsHeatingAlwaysRaisesTemperature) {
      failureKinds.push("heating-without-condition");
    }
    if (
      looksLikeGenericBoundaryTalk(input.studentExplanation) ||
      !hasAuthoredBoundarySignal(input.studentExplanation)
    ) {
      failureKinds.push("generic-boundary-talk");
    }
    if (looksLikeSurfaceOnly(input.studentExplanation)) {
      failureKinds.push("surface-similarity-only");
    }
  }

  if (input.transferMode === "partial-structure") {
    if (!selected.has(MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT)) {
      failureKinds.push("missing-heat-mass-temp-relation");
    }
  }

  return { accepted: failureKinds.length === 0, failureKinds };
}

export function hasStructuredIceBoundaryEvidence(input: {
  selectedRelations: readonly string[];
  conditionChecks?: readonly string[];
}): boolean {
  const selected = new Set(input.selectedRelations);
  const checks = new Set(input.conditionChecks ?? []);
  return (
    selected.has(MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT) &&
    selected.has(MODEL_RELATION_IDS.temperatureAloneDoesNotGiveQ) &&
    selected.has(MODEL_RELATION_IDS.phaseChangeNeedsAnotherModel) &&
    REQUIRED_ICE_BOUNDARY_CONDITION_CHECKS.every((id) => checks.has(id))
  );
}

export function looksLikePhysicsNounSandwich(text: string): boolean {
  const normalized = normalize(text);
  const nounCount = PHYSICS_NOUNS.filter((noun) => normalized.includes(noun)).length;
  return (
    nounCount >= 2 &&
    !includesAny(normalized, COMPARISON_MARKERS) &&
    !includesAny(normalized, BOUNDARY_MARKERS) &&
    !includesAny(normalized, RELATION)
  );
}

export function looksLikeGenericBoundaryTalk(text: string): boolean {
  const normalized = normalize(text);
  if (looksLikePhysicsNounSandwich(text)) {
    return true;
  }
  if (!includesAny(normalized, GENERIC_BOUNDARY_PHRASES)) {
    return false;
  }
  return !includesAny(normalized, BOUNDARY_MARKERS);
}

export function hasAuthoredBoundarySignal(text: string): boolean {
  return includesAny(normalize(text), BOUNDARY_MARKERS);
}

function looksLikeSurfaceOnly(text: string): boolean {
  const normalized = normalize(text);
  const surface = ["也是加热", "看起来像", "都是杯子", "课堂上见过"];
  const structure = ["质量", "温度", "比热", "能量"];
  return includesAny(normalized, surface) && !includesAny(normalized, structure);
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

function includesAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle.toLowerCase().replace(/\s+/g, "")));
}
