import { MINIMUM_L4_MODEL_EVIDENCE } from "@/content/physics-models/specific-heat-capacity/evaluator";
import type { ModelAttempt } from "@/types/learning";

export const HEAT_MODEL_DRAFT_KIND = "heat-model-draft";

export const ENERGY_CHAIN_NODE_IDS = [
  "chemical-energy",
  "internal-energy",
  "mechanical-energy",
] as const;

export const FORCE_BOARD_NODE_IDS = [
  "same:motion:",
  "same:force:",
  "zero:force:",
] as const;

export const DENSITY_BOARD_NODE_IDS = [
  "ratio:numerator:mass",
  "ratio:denominator:volume",
  "ratio:result:density",
] as const;

export type HeatModelFailureKind =
  | "missing-core-relation"
  | "missing-same-mass-same-delta-t"
  | "missing-same-mass-same-q"
  | "missing-same-c-same-q"
  | "missing-conditions"
  | "temperature-alone-sufficient"
  | "energy-chain-shape"
  | "force-board-shape"
  | "density-board-shape"
  | "time-treated-as-q"
  | "formula-only";

export interface HeatModelInput {
  factorC: string;
  factorM: string;
  factorDeltaT: string;
  productQ: string;
  sameMassSameDeltaT: string;
  sameMassSameQ: string;
  sameCSameQ: string;
  sufficiency: string;
  conditions: string[];
  timestamp: string;
}

export interface HeatModelDraft {
  kind: typeof HEAT_MODEL_DRAFT_KIND;
  factorC: string;
  factorM: string;
  factorDeltaT: string;
  productQ: string;
  sameMassSameDeltaT: string;
  sameMassSameQ: string;
  sameCSameQ: string;
  sufficiency: string;
  conditions: string[];
}

export function emptyHeatModelDraft(): HeatModelDraft {
  return {
    kind: HEAT_MODEL_DRAFT_KIND,
    factorC: "",
    factorM: "",
    factorDeltaT: "",
    productQ: "",
    sameMassSameDeltaT: "",
    sameMassSameQ: "",
    sameCSameQ: "",
    sufficiency: "",
    conditions: [],
  };
}

export function evaluateHeatModelStructure(input: HeatModelInput): {
  correctStructure: boolean;
  failureKinds: HeatModelFailureKind[];
  evidenceIds: string[];
} {
  const failureKinds: HeatModelFailureKind[] = [];
  const evidenceIds: string[] = [];
  const nodes = modelNodesFrom(input);

  if (looksLikeEnergyChain(nodes, input.conditions)) {
    failureKinds.push("energy-chain-shape");
  }
  if (looksLikeForceBoard(nodes, input.conditions)) {
    failureKinds.push("force-board-shape");
  }
  if (looksLikeDensityBoard(nodes, input.conditions)) {
    failureKinds.push("density-board-shape");
  }
  if (input.conditions.includes("energy-clock") || input.factorC === "clock-time") {
    failureKinds.push("time-treated-as-q");
  }

  if (hasCoreRelation(input)) {
    evidenceIds.push("core-relation-q-equals-c-m-delta-t");
  } else {
    failureKinds.push("missing-core-relation");
  }
  if (input.sameMassSameDeltaT === "larger-c-larger-q") {
    evidenceIds.push("same-mass-same-delta-t-larger-c-larger-q");
  } else {
    failureKinds.push("missing-same-mass-same-delta-t");
  }
  if (input.sameMassSameQ === "larger-c-smaller-delta-t") {
    evidenceIds.push("same-mass-same-q-larger-c-smaller-delta-t");
  } else {
    failureKinds.push("missing-same-mass-same-q");
  }
  if (input.sameCSameQ === "larger-mass-smaller-delta-t") {
    evidenceIds.push("same-c-same-q-larger-mass-smaller-delta-t");
  } else {
    failureKinds.push("missing-same-c-same-q");
  }
  if (
    input.conditions.includes("no-phase-change") &&
    input.conditions.includes("time-is-not-q")
  ) {
    evidenceIds.push("no-phase-change-and-time-is-not-q");
  } else {
    failureKinds.push("missing-conditions");
  }
  if (input.sufficiency === "temperature-not-enough") {
    evidenceIds.push("c13-temperature-alone-is-insufficient");
  } else {
    failureKinds.push("temperature-alone-sufficient");
  }

  if (hasCoreRelation(input) && isFormulaOnly(input)) {
    failureKinds.push("formula-only");
  }

  const hasAllL4 = MINIMUM_L4_MODEL_EVIDENCE.every((id) => evidenceIds.includes(id));

  return {
    correctStructure: hasAllL4 && failureKinds.length === 0,
    failureKinds: [...new Set(failureKinds)],
    evidenceIds,
  };
}

export function buildHeatModelAttempt(input: HeatModelInput): ModelAttempt {
  const evaluation = evaluateHeatModelStructure(input);
  return {
    nodes: modelNodesFrom(input),
    connections: [
      {
        from: `${input.factorC}*${input.factorM}*${input.factorDeltaT}`,
        to: input.productQ,
      },
    ],
    correctStructure: evaluation.correctStructure,
    timestamp: input.timestamp,
    conditions: [...input.conditions],
    failureKinds: evaluation.failureKinds,
  };
}

export function hasCompletedHeatModel(
  attempts: Array<{ correctStructure: boolean }>,
): boolean {
  return attempts.some((attempt) => attempt.correctStructure);
}

export function formulaOnlyHeatModelInput(timestamp: string): HeatModelInput {
  return {
    factorC: "specific-heat",
    factorM: "mass",
    factorDeltaT: "temperature-change",
    productQ: "heat-energy",
    sameMassSameDeltaT: "",
    sameMassSameQ: "",
    sameCSameQ: "",
    sufficiency: "",
    conditions: [],
    timestamp,
  };
}

export function sloganOnlyHeatModelInput(timestamp: string): HeatModelInput {
  return {
    factorC: "",
    factorM: "",
    factorDeltaT: "",
    productQ: "",
    sameMassSameDeltaT: "larger-c-larger-q",
    sameMassSameQ: "larger-c-smaller-delta-t",
    sameCSameQ: "larger-mass-smaller-delta-t",
    sufficiency: "",
    conditions: [],
    timestamp,
  };
}

export function completeHeatModelInput(timestamp: string): HeatModelInput {
  return {
    factorC: "specific-heat",
    factorM: "mass",
    factorDeltaT: "temperature-change",
    productQ: "heat-energy",
    sameMassSameDeltaT: "larger-c-larger-q",
    sameMassSameQ: "larger-c-smaller-delta-t",
    sameCSameQ: "larger-mass-smaller-delta-t",
    sufficiency: "temperature-not-enough",
    conditions: ["no-phase-change", "time-is-not-q"],
    timestamp,
  };
}

export function summarizeHeatModelAttempt(attempt: ModelAttempt): string {
  if (attempt.correctStructure) {
    return "你用同一个 Q = c m ΔT，说明了三次比较，也检查了只看升温是不够的。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("energy-chain-shape")) {
    return "这不是能量传送带。先写：比热容、质量和温度变化怎样得到能量。";
  }
  if (kinds.includes("force-board-shape")) {
    return "这不是力和运动的关系板。先写 Q、c、m、ΔT。";
  }
  if (kinds.includes("density-board-shape")) {
    return "这不是密度表。这里要比的是能量、质量和温度变化。";
  }
  if (kinds.includes("missing-core-relation") || kinds.includes("formula-only")) {
    return "只写出公式还不够。三次比较和条件也要从同一个关系推出来。";
  }
  if (kinds.includes("temperature-alone-sufficient")) {
    return "只知道温度升了，还不能断定吸收的能量或比热容。";
  }
  if (kinds.includes("missing-conditions") || kinds.includes("time-treated-as-q")) {
    return "还要标出：没有物态变化，加热时间不是 Q。";
  }
  if (kinds.includes("missing-same-mass-same-q")) {
    return "质量和能量相同时，比热容更大则升温更小。这是同一个关系推出来的。";
  }
  if (kinds.includes("missing-same-c-same-q")) {
    return "材料和能量相同时，质量更大则升温更小。这也是同一个关系推出来的。";
  }
  if (kinds.includes("missing-same-mass-same-delta-t")) {
    return "质量和升温相同时，比热容更大则需要的能量更多。";
  }
  return "乘积板还没写完整。再对着三次比较看一看。";
}

export function heatModelDraftFromAttempt(attempt: ModelAttempt): HeatModelDraft {
  const empty = emptyHeatModelDraft();
  return {
    kind: HEAT_MODEL_DRAFT_KIND,
    factorC: valueAfter(attempt.nodes, "product:c:") || empty.factorC,
    factorM: valueAfter(attempt.nodes, "product:m:") || empty.factorM,
    factorDeltaT: valueAfter(attempt.nodes, "product:delta-t:") || empty.factorDeltaT,
    productQ: valueAfter(attempt.nodes, "product:q:") || empty.productQ,
    sameMassSameDeltaT: valueAfter(attempt.nodes, "same-m-dt:") || "",
    sameMassSameQ: valueAfter(attempt.nodes, "same-m-q:") || "",
    sameCSameQ: valueAfter(attempt.nodes, "same-c-q:") || "",
    sufficiency: valueAfter(attempt.nodes, "sufficiency:") || "",
    conditions: attempt.conditions ?? [],
  };
}

function hasCoreRelation(input: HeatModelInput): boolean {
  return (
    input.factorC === "specific-heat" &&
    input.factorM === "mass" &&
    input.factorDeltaT === "temperature-change" &&
    input.productQ === "heat-energy"
  );
}

function isFormulaOnly(input: HeatModelInput): boolean {
  return (
    !input.sameMassSameDeltaT &&
    !input.sameMassSameQ &&
    !input.sameCSameQ &&
    !input.sufficiency &&
    input.conditions.length === 0
  );
}

function modelNodesFrom(input: HeatModelInput): string[] {
  return [
    `product:c:${input.factorC}`,
    `product:m:${input.factorM}`,
    `product:delta-t:${input.factorDeltaT}`,
    `product:q:${input.productQ}`,
    `same-m-dt:${input.sameMassSameDeltaT}`,
    `same-m-q:${input.sameMassSameQ}`,
    `same-c-q:${input.sameCSameQ}`,
    `sufficiency:${input.sufficiency}`,
  ];
}

function looksLikeEnergyChain(nodes: string[], conditions: string[]): boolean {
  if (conditions.includes("energy-conversion-chain")) {
    return true;
  }
  const joined = nodes.join(" ");
  return ENERGY_CHAIN_NODE_IDS.every((id) => joined.includes(id));
}

function looksLikeForceBoard(nodes: string[], conditions: string[]): boolean {
  if (conditions.includes("force-equals-motion")) {
    return true;
  }
  const joined = nodes.join(" ");
  return FORCE_BOARD_NODE_IDS.every((id) => joined.includes(id));
}

function looksLikeDensityBoard(nodes: string[], conditions: string[]): boolean {
  if (conditions.includes("mass-over-volume")) {
    return true;
  }
  const joined = nodes.join(" ");
  return DENSITY_BOARD_NODE_IDS.every((id) => joined.includes(id));
}

function valueAfter(nodes: string[], prefix: string): string {
  const match = nodes.find((node) => node.startsWith(prefix));
  return match ? match.slice(prefix.length) : "";
}
