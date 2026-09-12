import type { ModelEvaluatorSpec, TransferMode } from "@/types/physics-model";
import { ModelEvidenceLevel } from "@/types/physics-model";

export const modelEvaluatorSpec: ModelEvaluatorSpec = {
  requiredComponents: {
    identifiesEnergySource: "指出起始能量来自燃料的化学能。",
    identifiesInternalEnergyChange: "指出工作物质的内能或状态发生了变化。",
    identifiesWorkProcess: "指出气体对机械系统做功。",
    identifiesMechanicalOutput: "指出最终表现为机械能或机械运动。",
    preservesCausalOrder: "顺序为化学能 → 内能/状态变化 → 做功 → 机械能。",
    checksNecessaryConditions: "检查燃烧、可运动机械系统、气体确实做功等条件。",
  },
  evidenceLevels: {
    [ModelEvidenceLevel.L1]: "能观察到机械运动或活塞被推动。",
    [ModelEvidenceLevel.L2]: "能识别燃料、气体、活塞等对象和相关物理量。",
    [ModelEvidenceLevel.L3]: "能说出部分关系，例如燃烧和变热有关。",
    [ModelEvidenceLevel.L4]: "能建立化学能 → 内能/状态变化 → 做功 → 机械能的因果链。",
    [ModelEvidenceLevel.L5]: "能在新情境中调用这条链，并分清哪些部分可以迁移。",
    [ModelEvidenceLevel.L6]: "能在独立挑战中使用该模型，并检查必要条是否成立。",
  },
};

export interface CausalComponentSignals {
  identifiesEnergySource: boolean;
  identifiesInternalEnergyChange: boolean;
  identifiesWorkProcess: boolean;
  identifiesMechanicalOutput: boolean;
  preservesCausalOrder: boolean;
  checksNecessaryConditions: boolean;
  treatsCombustionAsDirectOutput: boolean;
  skipsWorkStep: boolean;
  suggestsCompleteChain: boolean;
}

const ENERGY_SOURCE = ["化学能", "燃料", "汽油", "柴油", "chemical energy", "fuel"];
const INTERNAL_ENERGY = ["内能", "状态", "internal energy", "gas state"];
const WORK = ["做功", "推动活塞", "推动机械", "对活塞", "work on", "does work"];
const MECHANICAL = ["机械能", "机械运动", "曲轴", "活塞运动", "mechanical energy"];
const CONDITIONS = [
  "卡住",
  "无法推动",
  "不能运动",
  "没有燃烧",
  "条件",
  "做不成",
  "不能输出",
];
const DIRECT_OUTPUT = [
  "燃烧直接",
  "直接让曲轴",
  "直接变成转动",
  "直接推动曲轴",
  "combustion directly",
  "directly turns the crank",
];

/**
 * Deterministic SIGNAL extractor.
 *
 * Keyword overlap is a hint about what a student mentioned.
 * It is not model mastery, not an L1–L6 assignment, and not
 * sufficient evidence that the student understands the model.
 *
 * Official levels come from deriveModelEvidenceLevel() using
 * accumulated structured stage evidence.
 */
export function extractCausalSignals(text: string): CausalComponentSignals {
  const normalized = normalize(text);
  const identifiesEnergySource = includesAny(normalized, ENERGY_SOURCE);
  const identifiesInternalEnergyChange = includesAny(normalized, INTERNAL_ENERGY);
  const identifiesWorkProcess = includesAny(normalized, WORK);
  const identifiesMechanicalOutput = includesAny(normalized, MECHANICAL);
  const checksNecessaryConditions = includesAny(normalized, CONDITIONS);
  const treatsCombustionAsDirectOutput = includesAny(normalized, DIRECT_OUTPUT);
  const skipsWorkStep =
    identifiesEnergySource &&
    identifiesMechanicalOutput &&
    !identifiesWorkProcess;

  const preservesCausalOrder =
    identifiesEnergySource &&
    identifiesInternalEnergyChange &&
    identifiesWorkProcess &&
    identifiesMechanicalOutput &&
    !treatsCombustionAsDirectOutput &&
    orderIsPreserved(normalized);

  return {
    identifiesEnergySource,
    identifiesInternalEnergyChange,
    identifiesWorkProcess,
    identifiesMechanicalOutput,
    preservesCausalOrder,
    checksNecessaryConditions,
    treatsCombustionAsDirectOutput,
    skipsWorkStep,
    suggestsCompleteChain:
      preservesCausalOrder && !skipsWorkStep && !treatsCombustionAsDirectOutput,
  };
}

/**
 * Transfer SIGNAL only. A true `accepted` value may be stored as
 * successfulTransfer evidence. It does not itself assign L5.
 */
export function evaluateTransferAttempt(input: {
  text: string;
  transferMode: TransferMode;
}): { accepted: boolean; reason: string } {
  const signals = extractCausalSignals(input.text);
  const mentionsPistonPush = includesAny(normalize(input.text), [
    "推活塞",
    "推动活塞",
    "something pushing a piston",
    "pushing a piston",
  ]);

  if (input.transferMode === "partial-structure") {
    const noticesPartialTransfer = includesAny(normalize(input.text), [
      "化学能不一定",
      "起始不一样",
      "不是燃料",
      "蒸汽",
      "后半段",
      "做功还能用",
    ]);
    const accepted =
      signals.identifiesWorkProcess &&
      signals.identifiesMechanicalOutput &&
      signals.identifiesInternalEnergyChange &&
      noticesPartialTransfer;
    return {
      accepted,
      reason: accepted
        ? "识别出后半段可以迁移，且没有把蒸汽情况当成完整的化学能模型。"
        : "只说“有东西在推活塞”不够。还要分清：内能变化后做功可能仍适用，化学能这一段不一定适用。",
    };
  }

  if (mentionsPistonPush && !signals.identifiesWorkProcess) {
    return {
      accepted: false,
      reason: "不能只因为看见有东西在推活塞，就判定调用了这个模型。",
    };
  }

  return {
    accepted: signals.suggestsCompleteChain,
    reason: signals.suggestsCompleteChain
      ? "在新情境中保持了化学能、内能变化、做功、机械能这条链。"
      : "还没有把可复用的能量链说完整。",
  };
}

function orderIsPreserved(text: string): boolean {
  const sourceIndex = firstIndex(text, ENERGY_SOURCE);
  const internalIndex = firstIndex(text, INTERNAL_ENERGY);
  const workIndex = firstIndex(text, WORK);
  const mechanicalIndex = firstIndex(text, MECHANICAL);

  if (
    sourceIndex === -1 ||
    internalIndex === -1 ||
    workIndex === -1 ||
    mechanicalIndex === -1
  ) {
    return false;
  }

  return sourceIndex <= internalIndex && internalIndex <= workIndex && workIndex <= mechanicalIndex;
}

function firstIndex(text: string, candidates: string[]): number {
  const indexes = candidates
    .map((item) => text.indexOf(item))
    .filter((index) => index >= 0);
  return indexes.length === 0 ? -1 : Math.min(...indexes);
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(text: string, candidates: string[]): boolean {
  return candidates.some((candidate) => text.includes(candidate.toLowerCase()));
}
