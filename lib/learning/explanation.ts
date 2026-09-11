import type { ExplanationEvidence } from "@/types/learning";

/**
 * Deterministic heuristic for the MVP checkpoint.
 * This does not claim to fully understand student reasoning.
 */
export function classifyExplanationLevel(text: string): 0 | 1 | 2 | 3 | 4 {
  const normalized = normalize(text);

  const mentionsTemperature =
    includesAny(normalized, [
      "temperature",
      "temperature increase",
      "temperature increased",
      "hotter",
      "warmer",
    ]);
  const mentionsMicrowave = includesAny(normalized, ["microwave", "heated", "heating"]);
  const mentionsEnergy = includesAny(normalized, ["energy", "entered", "into"]);
  const mentionsInternal = includesAny(normalized, [
    "internal energy",
    "internal energy changed",
    "internal energy can change",
    "inside changed",
    "state changed",
    "internal state",
  ]);
  const mentionsCause = includesAny(normalized, [
    "because",
    "so",
    "therefore",
    "which made",
    "which makes",
    "caused",
  ]);
  const mentionsTransferable = includesAny(normalized, [
    "system",
    "object",
    "in general",
    "energy enters",
  ]);

  if (mentionsEnergy && mentionsInternal && mentionsTemperature && mentionsCause) {
    return mentionsTransferable ? 4 : 3;
  }

  if (mentionsEnergy) {
    return 2;
  }

  if (mentionsMicrowave) {
    return 1;
  }

  if (mentionsTemperature || normalized.length > 0) {
    return 0;
  }

  return 0;
}

export function summarizeExplanationLevel(level: ExplanationEvidence["explanationLevel"]): string {
  switch (level) {
    case 4:
      return "You connected energy, internal change, and temperature in a reusable way.";
    case 3:
      return "You connected energy entering the bread to an internal change and temperature increase.";
    case 2:
      return "You noticed that energy enters the bread. The next step is explaining what changes inside it.";
    case 1:
      return "You named the process, but not yet the physical relationship inside the bread.";
    case 0:
    default:
      return "You described the result. The next step is explaining what changed inside the bread.";
  }
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(text: string, candidates: string[]): boolean {
  return candidates.some((candidate) => text.includes(candidate));
}
