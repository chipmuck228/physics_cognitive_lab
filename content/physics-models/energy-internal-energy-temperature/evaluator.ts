import type { ModelEvaluatorSpec, TransferMode } from "@/types/physics-model";
import { ModelEvidenceLevel } from "@/types/physics-model";
import { MODEL_RELATION_IDS } from "./model";

export const EVALUATOR_COMPONENT_IDS = {
  identifiesEnergyTransfer: "identifiesEnergyTransfer",
  identifiesInternalEnergyChange: "identifiesInternalEnergyChange",
  identifiesTemperatureRelation: "identifiesTemperatureRelation",
  distinguishesTemperatureFromInternalEnergy:
    "distinguishesTemperatureFromInternalEnergy",
  treatsHeatAsProcess: "treatsHeatAsProcess",
  checksEnergyInNeedNotRaiseTemperature:
    "checksEnergyInNeedNotRaiseTemperature",
} as const;

export const modelEvaluatorSpec: ModelEvaluatorSpec = {
  requiredComponents: {
    [EVALUATOR_COMPONENT_IDS.identifiesEnergyTransfer]:
      "指出有能量进入或离开系统。",
    [EVALUATOR_COMPONENT_IDS.identifiesInternalEnergyChange]:
      "指出系统的内能发生了变化。",
    [EVALUATOR_COMPONENT_IDS.identifiesTemperatureRelation]:
      "指出温度在适当条件下可能改变，而不是把温度写成内能。",
    [EVALUATOR_COMPONENT_IDS.distinguishesTemperatureFromInternalEnergy]:
      "不把温度和内能当成同一个量。",
    [EVALUATOR_COMPONENT_IDS.treatsHeatAsProcess]:
      "不把热说成储存在物体里的东西。",
    [EVALUATOR_COMPONENT_IDS.checksEnergyInNeedNotRaiseTemperature]:
      "检查“能量进入 → 温度一定升高”是否超出条件。",
  },
  evidenceLevels: {
    [ModelEvidenceLevel.L1]: "能观察到物体变热或温度读数变化。",
    [ModelEvidenceLevel.L2]: "能说出对象、温度和变化，而不是只写“变热了”。",
    [ModelEvidenceLevel.L3]: "能说出能量进入或内能变化等部分关系。",
    [ModelEvidenceLevel.L4]:
      "能建立“能量传递 → 内能变化 → 温度在适当条件下可能改变”，并区分温度、热和内能。",
    [ModelEvidenceLevel.L5]:
      "能在新情境调用这个关系，并分清能量进入不必然升温等不能直接搬走的句子。",
    [ModelEvidenceLevel.L6]:
      "能在没有 AI 时独立使用该模型，并且关键推理出现在提交之前。",
  },
};

export interface EnergyInternalTemperatureSignals {
  identifiesEnergyTransfer: boolean;
  identifiesInternalEnergyChange: boolean;
  identifiesTemperatureRelation: boolean;
  distinguishesTemperatureFromInternalEnergy: boolean;
  treatsHeatAsProcess: boolean;
  checksEnergyInNeedNotRaiseTemperature: boolean;
  claimsHeatIsStored: boolean;
  claimsEnergyInMustRaiseTemperature: boolean;
  claimsHotterMeansMoreInternalEnergy: boolean;
  claimsTemperatureIsEnergy: boolean;
  suggestsValidRelation: boolean;
}

/**
 * Deterministic SIGNAL extractor only.
 * Keyword overlap is not mastery and must not assign L1–L6.
 */
export function extractEnergyInternalTemperatureSignals(
  text: string,
): EnergyInternalTemperatureSignals {
  const normalized = normalize(text);
  const identifiesEnergyTransfer = includesAny(normalized, [
    "能量进入",
    "能量离开",
    "吸收能量",
    "放出能量",
    "energy enters",
    "energy leaves",
  ]);
  const identifiesInternalEnergyChange = includesAny(normalized, [
    "内能",
    "internal energy",
  ]);
  const identifiesTemperatureRelation = includesAny(normalized, [
    "温度",
    "升温",
    "升高",
    "温度不变",
    "temperature",
  ]);
  const claimsHeatIsStored = includesAny(normalized, [
    "热量装在",
    "热存在里面",
    "热是一种东西",
    "heat stored",
  ]);
  const claimsEnergyInMustRaiseTemperature = includesAny(normalized, [
    "吸收能量就一定升温",
    "能量进来温度就必须升高",
    "energy in means temperature must rise",
  ]);
  const claimsHotterMeansMoreInternalEnergy = includesAny(normalized, [
    "更热就一定内能更大",
    "温度高内能就一定大",
    "hotter means more internal energy",
  ]);
  const claimsTemperatureIsEnergy = includesAny(normalized, [
    "温度就是内能",
    "内能就是温度",
    "temperature is energy",
  ]);
  const checksEnergyInNeedNotRaiseTemperature = includesAny(normalized, [
    "温度不一定升高",
    "不一定升温",
    "温度可以不变",
    "need not raise",
  ]);
  const distinguishesTemperatureFromInternalEnergy =
    identifiesInternalEnergyChange &&
    identifiesTemperatureRelation &&
    !claimsTemperatureIsEnergy;
  const treatsHeatAsProcess = !claimsHeatIsStored;
  const suggestsValidRelation =
    identifiesEnergyTransfer &&
    identifiesInternalEnergyChange &&
    identifiesTemperatureRelation &&
    !claimsHeatIsStored &&
    !claimsTemperatureIsEnergy;

  return {
    identifiesEnergyTransfer,
    identifiesInternalEnergyChange,
    identifiesTemperatureRelation,
    distinguishesTemperatureFromInternalEnergy,
    treatsHeatAsProcess,
    checksEnergyInNeedNotRaiseTemperature,
    claimsHeatIsStored,
    claimsEnergyInMustRaiseTemperature,
    claimsHotterMeansMoreInternalEnergy,
    claimsTemperatureIsEnergy,
    suggestsValidRelation,
  };
}

export function evaluateTransferAttempt(input: {
  targetId: string;
  transferMode: TransferMode;
  selectedRelations: string[];
  rejectedRelations: string[];
  studentExplanation: string;
}): { accepted: boolean; failureKinds: string[] } {
  const failureKinds: string[] = [];
  const signals = extractEnergyInternalTemperatureSignals(input.studentExplanation);
  const selected = new Set(input.selectedRelations);

  if (input.transferMode === "full-model") {
    const hasCore =
      selected.has(MODEL_RELATION_IDS.energyTransferChangesInternalEnergy) ||
      selected.has(MODEL_RELATION_IDS.internalEnergyMayChangeTemperature);
    if (!hasCore) {
      failureKinds.push("missing-energy-internal-temperature-relation");
    }
    if (signals.claimsHeatIsStored || signals.claimsTemperatureIsEnergy) {
      failureKinds.push("temperature-heat-internal-energy-conflation");
    }
  }

  if (input.transferMode === "boundary-contrast") {
    if (!selected.has(MODEL_RELATION_IDS.energyInDoesNotAlwaysRaiseTemperature)) {
      failureKinds.push("missing-energy-in-boundary");
    }
    if (signals.claimsEnergyInMustRaiseTemperature) {
      failureKinds.push("energy-in-must-raise-temperature");
    }
  }

  if (input.transferMode === "partial-structure") {
    if (
      !selected.has(MODEL_RELATION_IDS.energyTransferChangesInternalEnergy) &&
      !selected.has(MODEL_RELATION_IDS.internalEnergyMayChangeTemperature)
    ) {
      failureKinds.push("missing-transferable-structure");
    }
  }

  return { accepted: failureKinds.length === 0, failureKinds };
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

function includesAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle.toLowerCase().replace(/\s+/g, "")));
}
