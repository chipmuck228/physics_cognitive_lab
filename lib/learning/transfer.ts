import { REQUIRED_TRANSFER_SCENARIO_IDS } from "@/lib/content/transfer-scenarios";
import type { TransferAttempt } from "@/types/learning";

export function classifyTransferAttempt(response: string): boolean {
  const normalized = normalize(response);
  const mentionsEnergy = includesAny(normalized, ["energy", "heated", "heating"]);
  const mentionsChange = includesAny(normalized, [
    "temperature",
    "warmer",
    "warm",
    "hotter",
    "internal energy",
    "internal state",
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
    return "You linked the new situation back to the same energy-and-temperature model.";
  }

  return "You responded to the new situation. The next step is making the shared model more explicit.";
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(text: string, candidates: string[]): boolean {
  return candidates.some((candidate) => text.includes(candidate));
}
