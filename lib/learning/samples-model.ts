import {
  studentUiFeedback,
  type StudentUiFeedback,
} from "@/lib/learning/student-ui-feedback";
import type { ModelAttempt } from "@/types/learning";

export const SAMPLES_MODEL_DRAFT_KIND = "samples-model-draft";

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

export type SamplesModelFailureKind =
  | "missing-mass-volume-ratio"
  | "missing-same-volume-relation"
  | "missing-same-mass-relation"
  | "missing-uniform-cut-relation"
  | "missing-proportional-invariance"
  | "same-material-without-proportion"
  | "mass-increase-implies-density"
  | "heavier-without-volume"
  | "bigger-means-denser"
  | "cut-lowers-density"
  | "energy-chain-shape"
  | "force-board-shape"
  | "missing-volume-positive-condition"
  | "missing-uniform-sample-condition";

export interface SamplesModelInput {
  numerator: string;
  denominator: string;
  result: string;
  sameVolumeConclusion: string;
  sameMassConclusion: string;
  cutConclusion: string;
  cutMassChange: string;
  cutVolumeChange: string;
  cutRatioChange: string;
  cutWhy: string;
  sufficiency: string;
  conditions: string[];
  timestamp: string;
}

export interface SamplesModelDraft {
  kind: typeof SAMPLES_MODEL_DRAFT_KIND;
  numerator: string;
  denominator: string;
  result: string;
  sameVolumeConclusion: string;
  sameMassConclusion: string;
  cutConclusion: string;
  cutMassChange: string;
  cutVolumeChange: string;
  cutRatioChange: string;
  cutWhy: string;
  sufficiency: string;
  conditions: string[];
}

export function emptySamplesModelDraft(): SamplesModelDraft {
  return {
    kind: SAMPLES_MODEL_DRAFT_KIND,
    numerator: "",
    denominator: "",
    result: "",
    sameVolumeConclusion: "",
    sameMassConclusion: "",
    cutConclusion: "",
    cutMassChange: "",
    cutVolumeChange: "",
    cutRatioChange: "",
    cutWhy: "",
    sufficiency: "",
    conditions: [],
  };
}

export function evaluateSamplesModelStructure(input: SamplesModelInput): {
  correctStructure: boolean;
  failureKinds: SamplesModelFailureKind[];
} {
  const failureKinds: SamplesModelFailureKind[] = [];
  const nodes = modelNodesFrom(input);

  if (looksLikeEnergyChain(nodes, input.conditions)) {
    failureKinds.push("energy-chain-shape");
  }
  if (looksLikeForceBoard(nodes, input.conditions)) {
    failureKinds.push("force-board-shape");
  }
  if (!isMassVolumeRatio(input)) {
    failureKinds.push("missing-mass-volume-ratio");
  }
  if (input.sameVolumeConclusion !== "larger-mass-larger-density") {
    failureKinds.push("missing-same-volume-relation");
  }
  if (input.sameMassConclusion !== "larger-volume-smaller-density") {
    failureKinds.push("missing-same-mass-relation");
  }
  if (input.cutConclusion !== "density-unchanged") {
    failureKinds.push("missing-uniform-cut-relation");
  }
  if (!hasProportionalInvariance(input)) {
    failureKinds.push("missing-proportional-invariance");
  }
  if (input.cutWhy === "same-material-alone") {
    failureKinds.push("same-material-without-proportion");
  }
  if (
    input.sameVolumeConclusion === "heavier-always-denser" ||
    input.conditions.includes("heavier-always-denser") ||
    input.sufficiency === "mass-enough"
  ) {
    failureKinds.push("heavier-without-volume");
  }
  if (input.sufficiency !== "need-both") {
    failureKinds.push("mass-increase-implies-density");
  }
  if (
    input.sameMassConclusion === "bigger-always-denser" ||
    input.conditions.includes("bigger-means-denser")
  ) {
    failureKinds.push("bigger-means-denser");
  }
  if (
    input.cutConclusion === "cut-lowers-density" ||
    input.cutWhy === "smaller-less-dense" ||
    input.cutRatioChange === "halved" ||
    input.cutRatioChange === "smaller"
  ) {
    failureKinds.push("cut-lowers-density");
  }
  if (!input.conditions.includes("volume-positive")) {
    failureKinds.push("missing-volume-positive-condition");
  }
  if (!input.conditions.includes("uniform-sample")) {
    failureKinds.push("missing-uniform-sample-condition");
  }

  return {
    correctStructure: failureKinds.length === 0,
    failureKinds: [...new Set(failureKinds)],
  };
}

export function hasRatioReasoningStructure(input: SamplesModelInput): boolean {
  return evaluateSamplesModelStructure(input).correctStructure;
}

export function buildSamplesModelAttempt(input: SamplesModelInput): ModelAttempt {
  const evaluation = evaluateSamplesModelStructure(input);
  return {
    nodes: modelNodesFrom(input),
    connections: [
      {
        from: `${input.numerator}/${input.denominator}`,
        to: input.result,
      },
    ],
    correctStructure: evaluation.correctStructure,
    timestamp: input.timestamp,
    conditions: [...input.conditions],
    failureKinds: evaluation.failureKinds,
  };
}

export function hasCompletedSamplesModel(
  attempts: Array<{ correctStructure: boolean }>,
): boolean {
  return attempts.some((attempt) => attempt.correctStructure);
}

export function formulaOnlySamplesModelInput(timestamp: string): SamplesModelInput {
  return {
    numerator: "mass",
    denominator: "volume",
    result: "density",
    sameVolumeConclusion: "",
    sameMassConclusion: "",
    cutConclusion: "",
    cutMassChange: "",
    cutVolumeChange: "",
    cutRatioChange: "",
    cutWhy: "",
    sufficiency: "",
    conditions: [],
    timestamp,
  };
}

export function memorizedRulesSamplesModelInput(
  timestamp: string,
): SamplesModelInput {
  return {
    ...formulaOnlySamplesModelInput(timestamp),
    sameVolumeConclusion: "larger-mass-larger-density",
    sameMassConclusion: "larger-volume-smaller-density",
    cutConclusion: "density-unchanged",
    conditions: ["volume-positive", "uniform-sample"],
  };
}

export function completeSamplesModelInput(timestamp: string): SamplesModelInput {
  return {
    numerator: "mass",
    denominator: "volume",
    result: "density",
    sameVolumeConclusion: "larger-mass-larger-density",
    sameMassConclusion: "larger-volume-smaller-density",
    cutConclusion: "density-unchanged",
    cutMassChange: "smaller",
    cutVolumeChange: "smaller",
    cutRatioChange: "unchanged",
    cutWhy: "same-proportion",
    sufficiency: "need-both",
    conditions: ["volume-positive", "uniform-sample"],
    timestamp,
  };
}

export function samplesModelMissingLabels(
  draft: Pick<
    SamplesModelDraft,
    | "numerator"
    | "denominator"
    | "result"
    | "sameVolumeConclusion"
    | "sameMassConclusion"
    | "cutConclusion"
    | "cutMassChange"
    | "cutVolumeChange"
    | "cutRatioChange"
    | "cutWhy"
    | "sufficiency"
    | "conditions"
  >,
): string[] {
  const missing: string[] = [];
  if (!draft.numerator || !draft.denominator || !draft.result) {
    missing.push("密度怎样由质量和体积得到");
  }
  if (!draft.sameVolumeConclusion) {
    missing.push("同样体积时密度怎样变");
  }
  if (!draft.sameMassConclusion) {
    missing.push("同样质量时密度怎样变");
  }
  if (!draft.cutConclusion) {
    missing.push("均匀切开后密度怎样");
  }
  if (!draft.cutMassChange) {
    missing.push("切开后，质量怎样");
  }
  if (!draft.cutVolumeChange) {
    missing.push("切开后，体积怎样");
  }
  if (!draft.cutRatioChange) {
    missing.push("切开后，m ÷ V 怎样");
  }
  if (!draft.cutWhy) {
    missing.push("比值为什么可以保持不变");
  }
  if (!draft.sufficiency) {
    missing.push("只知道质量变大能不能断定密度");
  }
  if (draft.conditions.length === 0) {
    missing.push("这个关系在什么条件下能用");
  }
  return missing;
}

export function samplesModelStudentFeedback(
  draft: SamplesModelDraft,
  attempt: ModelAttempt,
): StudentUiFeedback {
  return studentUiFeedback(
    samplesModelMissingLabels(draft),
    summarizeSamplesModelAttempt(attempt),
  );
}

export function summarizeSamplesModelAttempt(attempt: ModelAttempt): string {
  if (attempt.correctStructure) {
    return "你用同一个质量和体积的比，说明了三次比较，也检查了只看质量是不够的。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("energy-chain-shape")) {
    return "这不是能量传送带。先写：质量除以体积得到密度。";
  }
  if (kinds.includes("force-board-shape")) {
    return "这不是力和运动的关系板。先写质量和体积怎样得到密度。";
  }
  if (kinds.includes("missing-mass-volume-ratio")) {
    return "密度是单位体积的质量。上面是质量，下面是体积。";
  }
  if (
    kinds.includes("heavier-without-volume") ||
    kinds.includes("mass-increase-implies-density") ||
    kinds.includes("bigger-means-denser")
  ) {
    return "只知道质量变大，还不能断定密度变大。要同时看质量和体积。";
  }
  if (kinds.includes("same-material-without-proportion")) {
    return "“同一种物质”还不够。要看出切开后质量和体积按同样比例变，比值才不变。";
  }
  if (
    kinds.includes("cut-lowers-density") ||
    kinds.includes("missing-proportional-invariance") ||
    kinds.includes("missing-uniform-cut-relation")
  ) {
    return "均匀切开时，质量和体积一起按同样比例变，m ÷ V 不必变小。";
  }
  if (kinds.includes("missing-same-volume-relation")) {
    return "体积相同时，质量更大则密度更大。这是同一个比值推出来的。";
  }
  if (kinds.includes("missing-same-mass-relation")) {
    return "质量相同时，体积更大则密度更小。这也是同一个比值推出来的。";
  }
  if (kinds.includes("missing-volume-positive-condition")) {
    return "还要标出：体积必须大于零。";
  }
  if (kinds.includes("missing-uniform-sample-condition")) {
    return "还要标出：内部均匀时，切开后密度可以保持不变。";
  }
  return "比值表还没写完整。再对着三次比较看一看。";
}

export function samplesModelDraftFromAttempt(attempt: ModelAttempt): SamplesModelDraft {
  const empty = emptySamplesModelDraft();
  return {
    kind: SAMPLES_MODEL_DRAFT_KIND,
    numerator: valueAfter(attempt.nodes, "ratio:numerator:") || empty.numerator,
    denominator: valueAfter(attempt.nodes, "ratio:denominator:") || empty.denominator,
    result: valueAfter(attempt.nodes, "ratio:result:") || empty.result,
    sameVolumeConclusion: valueAfter(attempt.nodes, "same-volume:") || "",
    sameMassConclusion: valueAfter(attempt.nodes, "same-mass:") || "",
    cutConclusion: valueAfter(attempt.nodes, "cut:") || "",
    cutMassChange: valueAfter(attempt.nodes, "cut-mass:") || "",
    cutVolumeChange: valueAfter(attempt.nodes, "cut-volume:") || "",
    cutRatioChange: valueAfter(attempt.nodes, "cut-ratio:") || "",
    cutWhy: valueAfter(attempt.nodes, "cut-why:") || "",
    sufficiency: valueAfter(attempt.nodes, "sufficiency:") || "",
    conditions: attempt.conditions ?? [],
  };
}

function hasProportionalInvariance(input: SamplesModelInput): boolean {
  return (
    input.cutMassChange === "smaller" &&
    input.cutVolumeChange === "smaller" &&
    input.cutRatioChange === "unchanged" &&
    input.cutWhy === "same-proportion"
  );
}

function modelNodesFrom(input: SamplesModelInput): string[] {
  return [
    `ratio:numerator:${input.numerator}`,
    `ratio:denominator:${input.denominator}`,
    `ratio:result:${input.result}`,
    `same-volume:${input.sameVolumeConclusion}`,
    `same-mass:${input.sameMassConclusion}`,
    `cut:${input.cutConclusion}`,
    `cut-mass:${input.cutMassChange}`,
    `cut-volume:${input.cutVolumeChange}`,
    `cut-ratio:${input.cutRatioChange}`,
    `cut-why:${input.cutWhy}`,
    `sufficiency:${input.sufficiency}`,
  ];
}

function isMassVolumeRatio(input: SamplesModelInput): boolean {
  return (
    input.numerator === "mass" &&
    input.denominator === "volume" &&
    input.result === "density"
  );
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

function valueAfter(nodes: string[], prefix: string): string {
  const match = nodes.find((node) => node.startsWith(prefix));
  return match ? match.slice(prefix.length) : "";
}
