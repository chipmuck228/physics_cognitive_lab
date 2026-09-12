import { REQUIRED_TRANSFER_SCENARIO_IDS } from "@/lib/content/transfer-scenarios";
import type { TransferAttempt } from "@/types/learning";

export function classifyTransferAttempt(response: string): boolean {
  const normalized = normalize(response);
  const mentionsEnergy = includesAny(normalized, [
    "energy",
    "heated",
    "heating",
    "能量",
    "加热",
  ]);
  const mentionsChange = includesAny(normalized, [
    "temperature",
    "warmer",
    "warm",
    "hotter",
    "internal energy",
    "internal state",
    "温度",
    "变暖",
    "变热",
    "内能",
  ]);

  return mentionsEnergy && mentionsChange;
}

export function hasCompletedTransferScenarios(
  attempts: TransferAttempt[],
): boolean {
  const completed = new Set(attempts.map((attempt) => attempt.scenarioId));
  return REQUIRED_TRANSFER_SCENARIO_IDS.every((id) => completed.has(id));
}

export function summarizeTransferAttempt(attempt: TransferAttempt): string {
  if (attempt.identifiedSharedModel) {
    return "你用能量和温度的关系，解释了这个新情况。";
  }

  return "你已经在想这个新情况了。再明确一点：能量怎样进来，什么发生了变化？";
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(text: string, candidates: string[]): boolean {
  return candidates.some((candidate) => text.includes(candidate));
}
