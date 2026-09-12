import { MODEL_CONDITION_IDS } from "@/content/physics-models/energy-internal-energy-temperature/model";
import type { ModelAttempt } from "@/types/learning";
import {
  hasAuthoredModelDistinction,
  looksLikeHeatSlogan,
  looksLikeNounSandwich,
} from "@/lib/learning/microwave-text";

export const MICROWAVE_MODEL_DRAFT_KIND = "microwave-model-draft";

export const FORBIDDEN_MODEL_SHAPES = [
  "chemical-energy",
  "mechanical-energy",
  "identifiesWorkProcess",
  "ratio:numerator:mass",
  "product:c:",
] as const;

export type MicrowaveModelFailureKind =
  | "missing-energy-transfer"
  | "missing-internal-energy-change"
  | "missing-temperature-relation"
  | "missing-named-system"
  | "missing-distinction"
  | "missing-condition"
  | "missing-authored-distinction"
  | "noun-sandwich"
  | "heat-slogan"
  | "generic-authored"
  | "temperature-is-internal-energy"
  | "energy-in-must-raise-t"
  | "wrong-board-shape";

export interface MicrowaveModelInput {
  system: string;
  energyTransfer: string;
  internalEnergy: string;
  temperatureRelation: string;
  distinction: string;
  conditions: string[];
  authoredDistinction: string;
  timestamp: string;
}

export interface MicrowaveModelDraft {
  kind: typeof MICROWAVE_MODEL_DRAFT_KIND;
  system: string;
  energyTransfer: string;
  internalEnergy: string;
  temperatureRelation: string;
  distinction: string;
  conditions: string[];
  authoredDistinction: string;
}

export function emptyMicrowaveModelDraft(): MicrowaveModelDraft {
  return {
    kind: MICROWAVE_MODEL_DRAFT_KIND,
    system: "",
    energyTransfer: "",
    internalEnergy: "",
    temperatureRelation: "",
    distinction: "",
    conditions: [],
    authoredDistinction: "",
  };
}

export function evaluateMicrowaveModelStructure(input: MicrowaveModelInput): {
  correctStructure: boolean;
  failureKinds: MicrowaveModelFailureKind[];
} {
  const failureKinds: MicrowaveModelFailureKind[] = [];
  const nodes = modelNodesFrom(input);

  if (looksLikeWrongBoard(nodes, input.conditions)) {
    failureKinds.push("wrong-board-shape");
  }
  if (input.system !== "bread") {
    failureKinds.push("missing-named-system");
  }
  if (input.energyTransfer !== "enters-system") {
    failureKinds.push("missing-energy-transfer");
  }
  if (input.internalEnergy !== "changes") {
    failureKinds.push("missing-internal-energy-change");
  }
  if (input.temperatureRelation === "must-rise") {
    failureKinds.push("energy-in-must-raise-t");
  } else if (input.temperatureRelation !== "may-change") {
    failureKinds.push("missing-temperature-relation");
  }
  if (input.distinction === "t-is-u" || input.internalEnergy === "same-as-temperature") {
    failureKinds.push("temperature-is-internal-energy");
  } else if (input.distinction !== "t-not-u") {
    failureKinds.push("missing-distinction");
  }
  if (!hasApprovedCondition(input.conditions)) {
    failureKinds.push("missing-condition");
  }
  if (looksLikeNounSandwich(input.authoredDistinction)) {
    failureKinds.push("noun-sandwich");
  }
  if (looksLikeHeatSlogan(input.authoredDistinction)) {
    failureKinds.push("heat-slogan");
  }
  if (!hasAuthoredModelDistinction(input.authoredDistinction)) {
    failureKinds.push("missing-authored-distinction");
    if (
      input.authoredDistinction.trim() === "好好" ||
      input.authoredDistinction.trim().length <= 2
    ) {
      failureKinds.push("generic-authored");
    }
  }

  return {
    correctStructure: failureKinds.length === 0,
    failureKinds: [...new Set(failureKinds)],
  };
}

export function buildMicrowaveModelAttempt(input: MicrowaveModelInput): ModelAttempt {
  const evaluation = evaluateMicrowaveModelStructure(input);
  return {
    nodes: modelNodesFrom(input),
    connections: [
      { from: "energy-transfer", to: "internal-energy" },
      { from: "internal-energy", to: "temperature-may-change" },
    ],
    correctStructure: evaluation.correctStructure,
    timestamp: input.timestamp,
    conditions: [...input.conditions],
    failureKinds: evaluation.failureKinds,
  };
}

export function hasCompletedMicrowaveModel(
  attempts: Array<{ correctStructure: boolean }>,
): boolean {
  return attempts.some((attempt) => attempt.correctStructure);
}

export function completeMicrowaveModelInput(timestamp: string): MicrowaveModelInput {
  return {
    system: "bread",
    energyTransfer: "enters-system",
    internalEnergy: "changes",
    temperatureRelation: "may-change",
    distinction: "t-not-u",
    conditions: [MODEL_CONDITION_IDS.temperatureNotInternalEnergy],
    authoredDistinction: "温度不是内能。",
    timestamp,
  };
}

export function summarizeMicrowaveModelAttempt(attempt: ModelAttempt): string {
  if (attempt.correctStructure) {
    return "你把能量进入、内能变化和温度可能改变连起来，也写出了温度不是内能。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("wrong-board-shape")) {
    return "这不是另一块能量传送带或公式板。先写这个系统里能量、内能和温度怎样连。";
  }
  if (kinds.includes("energy-in-must-raise-t") || kinds.includes("temperature-is-internal-energy")) {
    return "能量进来，温度不一定升高；温度也不是内能。";
  }
  if (kinds.includes("heat-slogan") || kinds.includes("noun-sandwich")) {
    return "只写“吸收热量所以升温”或列出几个词，还没有把关系建起来。";
  }
  if (kinds.includes("missing-authored-distinction") || kinds.includes("generic-authored")) {
    return "格子选对了还不够。请用自己的话写一句区别或条件。";
  }
  if (kinds.includes("missing-condition")) {
    return "还要标出至少一句限制：温度不是内能，或能量进入不一定升温。";
  }
  return "先写出：能量进入这个系统 → 内能改变 → 温度在适当条件下可能改变。";
}

export function microwaveModelDraftFromAttempt(attempt: ModelAttempt): MicrowaveModelDraft {
  const empty = emptyMicrowaveModelDraft();
  return {
    kind: MICROWAVE_MODEL_DRAFT_KIND,
    system: valueAfter(attempt.nodes, "system:") || empty.system,
    energyTransfer: valueAfter(attempt.nodes, "energy:") || empty.energyTransfer,
    internalEnergy: valueAfter(attempt.nodes, "internal:") || empty.internalEnergy,
    temperatureRelation: valueAfter(attempt.nodes, "temperature:") || empty.temperatureRelation,
    distinction: valueAfter(attempt.nodes, "distinction:") || empty.distinction,
    conditions: attempt.conditions ?? [],
    authoredDistinction: valueAfter(attempt.nodes, "authored:") || empty.authoredDistinction,
  };
}

const APPROVED_MODEL_CONDITION_IDS = [
  MODEL_CONDITION_IDS.noPhaseChange,
  MODEL_CONDITION_IDS.energyInDoesNotRequireTemperatureRise,
  MODEL_CONDITION_IDS.heatIsProcessNotStore,
  MODEL_CONDITION_IDS.temperatureNotInternalEnergy,
] as const;

function hasApprovedCondition(conditions: string[]): boolean {
  return conditions.some((id) =>
    (APPROVED_MODEL_CONDITION_IDS as readonly string[]).includes(id),
  );
}

function modelNodesFrom(input: MicrowaveModelInput): string[] {
  return [
    `system:${input.system}`,
    `energy:${input.energyTransfer}`,
    `internal:${input.internalEnergy}`,
    `temperature:${input.temperatureRelation}`,
    `distinction:${input.distinction}`,
    `authored:${input.authoredDistinction}`,
  ];
}

function looksLikeWrongBoard(nodes: string[], conditions: string[]): boolean {
  const joined = `${nodes.join(" ")} ${conditions.join(" ")}`;
  return FORBIDDEN_MODEL_SHAPES.some((id) => joined.includes(id));
}

function valueAfter(nodes: string[], prefix: string): string {
  const match = nodes.find((node) => node.startsWith(prefix));
  return match ? match.slice(prefix.length) : "";
}
