import type { ModelEvaluatorSpec, TransferMode } from "@/types/physics-model";
import { ModelEvidenceLevel } from "@/types/physics-model";
import { MODEL_RELATION_IDS } from "./model";

export const EVALUATOR_COMPONENT_IDS = {
  identifiesMass: "identifiesMass",
  identifiesVolume: "identifiesVolume",
  identifiesDensity: "identifiesDensity",
  usesMassVolumeRatio: "usesMassVolumeRatio",
  distinguishesDensityFromMassOrSize: "distinguishesDensityFromMassOrSize",
  checksUniformMaterialCondition: "checksUniformMaterialCondition",
} as const;

export const modelEvaluatorSpec: ModelEvaluatorSpec = {
  requiredComponents: {
    [EVALUATOR_COMPONENT_IDS.identifiesMass]: "指出比较或计算时用到了质量。",
    [EVALUATOR_COMPONENT_IDS.identifiesVolume]: "指出比较或计算时用到了体积。",
    [EVALUATOR_COMPONENT_IDS.identifiesDensity]: "指出密度是要求的或要比较的量。",
    [EVALUATOR_COMPONENT_IDS.usesMassVolumeRatio]:
      "用 ρ = m / V，而不是只用轻重或大小。",
    [EVALUATOR_COMPONENT_IDS.distinguishesDensityFromMassOrSize]:
      "不把密度说成“更重”或“更大”。",
    [EVALUATOR_COMPONENT_IDS.checksUniformMaterialCondition]:
      "检查均匀切开、空心/外形体积等条件，不把平均密度悄悄当成材料密度。",
  },
  evidenceLevels: {
    [ModelEvidenceLevel.L1]: "能观察到同样大小时质量不同，或切开后一块变小变轻。",
    [ModelEvidenceLevel.L2]: "能识别质量、体积、材料等对象和物理量。",
    [ModelEvidenceLevel.L3]: "能说出部分关系，例如同样大时更沉的更密。",
    [ModelEvidenceLevel.L4]:
      "能用 ρ = m / V 同时解释同样体积、同样质量和均匀切开，而不是只背公式。",
    [ModelEvidenceLevel.L5]: "能在新情境中调用这个比值，并分清外形大小、空心和浮沉不能代替它。",
    [ModelEvidenceLevel.L6]: "能在独立挑战中使用该模型，并检查体积条件和均匀性。",
  },
};

export interface DensityComponentSignals {
  identifiesMass: boolean;
  identifiesVolume: boolean;
  identifiesDensity: boolean;
  usesMassVolumeRatio: boolean;
  distinguishesDensityFromMassOrSize: boolean;
  checksUniformMaterialCondition: boolean;
  claimsBiggerMeansDenser: boolean;
  claimsHeavierMeansDenser: boolean;
  claimsCuttingLowersDensity: boolean;
  claimsDensityExplainsFloating: boolean;
  claimsSameMaterialAlone: boolean;
  usesProportionalInvariance: boolean;
  considersMassAndVolumeTogether: boolean;
  suggestsValidRatio: boolean;
}

const MASS = ["质量", "更重", "更轻", "天平", "克", "mass"];
const VOLUME = ["体积", "占空间", "cm³", "立方", "排水", "volume"];
const DENSITY = ["密度", "单位体积", "疏密", "density"];
const RATIO = ["m/v", "m／v", "ρ", "单位体积的质量", "质量和体积"];
const UNIFORM = ["均匀", "切成一半", "同样比例", "平均密度", "空心"];
const BIGGER_DENSER = ["更大密度就更大", "看起来大密度就大", "体积大密度就大"];
const HEAVIER_DENSER = [
  "更重密度就更大",
  "谁沉密度谁大",
  "质量大数据就大",
  "质量变大所以密度一定变大",
  "质量变大，所以密度一定变大",
];
const CUT_LOWERS = ["切开密度变小", "变小了密度就变小", "切一半密度一半"];
const FLOAT = ["密度大就会沉", "密度小就会浮", "密度能直接解释浮沉"];
const SAME_MATERIAL_ALONE = [
  "同一种物质所以密度不变",
  "同样材料所以不变",
  "同一材料密度就不变",
  "因为是同一种物质",
];
const PROPORTION = ["同样比例", "相同比例", "按同样比例", "比值不变", "m/v", "m／v"];

export function extractDensitySignals(text: string): DensityComponentSignals {
  const normalized = normalize(text);
  const identifiesMass = includesAny(normalized, MASS);
  const identifiesVolume = includesAny(normalized, VOLUME);
  const identifiesDensity = includesAny(normalized, DENSITY);
  const usesMassVolumeRatio =
    includesAny(normalized, RATIO) || (identifiesMass && identifiesVolume && identifiesDensity);
  const claimsBiggerMeansDenser = includesAny(normalized, BIGGER_DENSER);
  const claimsHeavierMeansDenser = includesAny(normalized, HEAVIER_DENSER);
  const claimsCuttingLowersDensity = includesAny(normalized, CUT_LOWERS);
  const claimsDensityExplainsFloating = includesAny(normalized, FLOAT);
  const claimsSameMaterialAlone = includesAny(normalized, SAME_MATERIAL_ALONE);
  const usesProportionalInvariance = includesAny(normalized, PROPORTION);
  const considersMassAndVolumeTogether = identifiesMass && identifiesVolume;
  const checksUniformMaterialCondition = includesAny(normalized, UNIFORM);
  const distinguishesDensityFromMassOrSize =
    identifiesDensity &&
    !claimsBiggerMeansDenser &&
    !claimsHeavierMeansDenser;
  const suggestsValidRatio =
    usesMassVolumeRatio &&
    !claimsBiggerMeansDenser &&
    !claimsHeavierMeansDenser &&
    !claimsCuttingLowersDensity &&
    !claimsSameMaterialAlone;

  return {
    identifiesMass,
    identifiesVolume,
    identifiesDensity,
    usesMassVolumeRatio,
    distinguishesDensityFromMassOrSize,
    checksUniformMaterialCondition,
    claimsBiggerMeansDenser,
    claimsHeavierMeansDenser,
    claimsCuttingLowersDensity,
    claimsDensityExplainsFloating,
    claimsSameMaterialAlone,
    usesProportionalInvariance,
    considersMassAndVolumeTogether,
    suggestsValidRatio,
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
  const signals = extractDensitySignals(input.studentExplanation);
  const selected = new Set(input.selectedRelations);

  if (input.transferMode === "full-model") {
    if (!selected.has(MODEL_RELATION_IDS.densityIsMassPerVolume)) {
      failureKinds.push("missing-mass-volume-ratio");
    }
    if (signals.claimsBiggerMeansDenser || signals.claimsHeavierMeansDenser) {
      failureKinds.push("mass-or-size-conflation");
    }
    if (looksLikeSurfaceOnly(input.studentExplanation)) {
      failureKinds.push("surface-similarity-only");
    }
  }

  if (input.transferMode === "boundary-contrast") {
    if (!selected.has(MODEL_RELATION_IDS.densityIsMassPerVolume)) {
      failureKinds.push("missing-mass-volume-ratio");
    }
    if (signals.claimsBiggerMeansDenser) {
      failureKinds.push("outer-size-treated-as-density");
    }
  }

  if (input.transferMode === "partial-structure") {
    if (!selected.has(MODEL_RELATION_IDS.densityIsMassPerVolume)) {
      failureKinds.push("missing-mass-volume-ratio");
    }
    if (!selected.has(MODEL_RELATION_IDS.densityAloneDoesNotExplainFloating)) {
      if (signals.claimsDensityExplainsFloating) {
        failureKinds.push("density-used-as-buoyancy");
      }
    }
  }

  return { accepted: failureKinds.length === 0, failureKinds };
}

function looksLikeSurfaceOnly(text: string): boolean {
  const normalized = normalize(text);
  const surface = ["也是方块", "看起来像", "都是固体", "课堂上见过"];
  const structure = ["质量", "体积", "密度", "单位体积"];
  return includesAny(normalized, surface) && !includesAny(normalized, structure);
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

function includesAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle.toLowerCase().replace(/\s+/g, "")));
}
