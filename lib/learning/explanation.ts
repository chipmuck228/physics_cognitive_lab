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
      "温度",
    ]);
  const mentionsMicrowave = includesAny(normalized, [
    "microwave",
    "heated",
    "heating",
    "微波炉",
    "加热",
  ]);
  const mentionsEnergy = includesAny(normalized, [
    "energy",
    "entered",
    "into",
    "能量",
    "进入",
  ]);
  const mentionsInternal = includesAny(normalized, [
    "internal energy",
    "internal energy changed",
    "internal energy can change",
    "inside changed",
    "state changed",
    "internal state",
    "内能",
  ]);
  const mentionsCause = includesAny(normalized, [
    "because",
    "so",
    "therefore",
    "which made",
    "which makes",
    "caused",
    "所以",
    "因为",
    "因此",
    "于是",
    "之后",
    "然后",
    "使得",
    "导致",
    "后，",
    "后",
  ]);
  const mentionsTransferable = includesAny(normalized, [
    "system",
    "object",
    "in general",
    "energy enters",
    "物体",
    "系统",
    "一般来说",
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
      return "你把能量进入、内能变化和温度升高连起来了，这个想法换个情况也能用。";
    case 3:
      return "你把能量进入面包、内能变化和温度升高连起来了。";
    case 2:
      return "你注意到能量进入了面包。接下来可以再想：面包里面发生了什么变化？";
    case 1:
      return "你说出了加热这件事，但还没说清里面的关系。";
    case 0:
    default:
      return "你说出了结果。接下来可以再想：面包里面发生了什么变化？";
  }
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(text: string, candidates: string[]): boolean {
  return candidates.some((candidate) => text.includes(candidate));
}
