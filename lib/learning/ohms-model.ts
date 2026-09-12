import { evaluateOhmsTwoControlAuthored } from "@/lib/learning/ohms-authored";
import { studentUiFeedback, type StudentUiFeedback } from "@/lib/learning/student-ui-feedback";
import type { ModelAttempt } from "@/types/learning";

export const OHMS_MODEL_DRAFT_KIND = "ohms-model-draft";

export type OhmsModelFailureKind =
  | "missing-identities"
  | "missing-relation"
  | "missing-same-r"
  | "missing-same-u"
  | "missing-rearrangement-reject"
  | "missing-condition"
  | "authored-missing"
  | "authored-formula-only"
  | "authored-generic"
  | "authored-noun-sandwich"
  | "authored-no-control"
  | "authored-wrong-direction"
  | "authored-wrong-consequence-quantity"
  | "authored-negated"
  | "authored-reversed-control"
  | "authored-token-sandwich"
  | "one-control-only"
  | "energy-chain-shape"
  | "force-board-shape"
  | "completeness-without-construction";

export interface OhmsModelInput {
  currentIdentity: string;
  voltageIdentity: string;
  resistanceIdentity: string;
  relation: string;
  sameRConsequence: string;
  sameUConsequence: string;
  rearrangement: string;
  condition: string;
  studentReasoning: string;
  timestamp: string;
}

export interface OhmsModelDraft {
  kind: typeof OHMS_MODEL_DRAFT_KIND;
  currentIdentity: string;
  voltageIdentity: string;
  resistanceIdentity: string;
  relation: string;
  sameRConsequence: string;
  sameUConsequence: string;
  rearrangement: string;
  condition: string;
  studentReasoning: string;
}

export function emptyOhmsModelDraft(): OhmsModelDraft {
  return {
    kind: OHMS_MODEL_DRAFT_KIND,
    currentIdentity: "",
    voltageIdentity: "",
    resistanceIdentity: "",
    relation: "",
    sameRConsequence: "",
    sameUConsequence: "",
    rearrangement: "",
    condition: "",
    studentReasoning: "",
  };
}

export function hasBoardCompleteness(input: OhmsModelInput): boolean {
  return (
    input.currentIdentity === "current" &&
    input.voltageIdentity === "voltage" &&
    input.resistanceIdentity === "resistance" &&
    input.relation === "i-equals-u-over-r" &&
    input.sameRConsequence === "larger-u-larger-i" &&
    input.sameUConsequence === "larger-r-smaller-i" &&
    input.rearrangement === "same-relation-r-is-property" &&
    input.condition === "closed-ohmic"
  );
}

export function evaluateOhmsModelConstruction(input: OhmsModelInput): {
  correctStructure: boolean;
  completenessOnly: boolean;
  failureKinds: OhmsModelFailureKind[];
} {
  const failureKinds: OhmsModelFailureKind[] = [];
  const authored = evaluateOhmsModelAuthored(input.studentReasoning);

  if (
    input.currentIdentity === "internal-energy" ||
    input.voltageIdentity === "chemical-energy" ||
    input.resistanceIdentity === "mechanical-energy"
  ) {
    failureKinds.push("energy-chain-shape");
  }
  if (
    input.sameRConsequence.startsWith("same:force") ||
    input.sameUConsequence.startsWith("zero:force")
  ) {
    failureKinds.push("force-board-shape");
  }

  if (
    input.currentIdentity !== "current" ||
    input.voltageIdentity !== "voltage" ||
    input.resistanceIdentity !== "resistance"
  ) {
    failureKinds.push("missing-identities");
  }
  if (input.relation !== "i-equals-u-over-r") {
    failureKinds.push("missing-relation");
  }
  if (input.sameRConsequence !== "larger-u-larger-i") {
    failureKinds.push("missing-same-r");
  }
  if (input.sameUConsequence !== "larger-r-smaller-i") {
    failureKinds.push("missing-same-u");
  }
  if (
    input.sameRConsequence === "larger-u-larger-i" &&
    input.sameUConsequence !== "larger-r-smaller-i"
  ) {
    failureKinds.push("one-control-only");
  }
  if (
    input.sameUConsequence === "larger-r-smaller-i" &&
    input.sameRConsequence !== "larger-u-larger-i"
  ) {
    failureKinds.push("one-control-only");
  }
  if (input.rearrangement !== "same-relation-r-is-property") {
    failureKinds.push("missing-rearrangement-reject");
  }
  if (input.condition !== "closed-ohmic") {
    failureKinds.push("missing-condition");
  }

  if (authored.kind !== "ok") {
    failureKinds.push(authored.kind);
  }

  const completeness = hasBoardCompleteness(input);
  const construction = completeness && authored.kind === "ok";
  if (completeness && !construction) {
    failureKinds.push("completeness-without-construction");
  }

  return {
    correctStructure: construction && failureKinds.filter((k) => k !== "completeness-without-construction").length === 0,
    completenessOnly: completeness && !construction,
    failureKinds: [...new Set(failureKinds)],
  };
}

export function buildOhmsModelAttempt(input: OhmsModelInput): ModelAttempt {
  const evaluation = evaluateOhmsModelConstruction(input);
  return {
    nodes: [
      `i:${input.currentIdentity}`,
      `u:${input.voltageIdentity}`,
      `r:${input.resistanceIdentity}`,
      `relation:${input.relation}`,
      `same-r:${input.sameRConsequence}`,
      `same-u:${input.sameUConsequence}`,
      `rearrangement:${input.rearrangement}`,
      `condition:${input.condition}`,
    ],
    connections: [
      { from: "U", to: "I" },
      { from: "R", to: "I" },
    ],
    correctStructure: evaluation.correctStructure,
    timestamp: input.timestamp,
    conditions: [input.condition, input.rearrangement],
    failureKinds: evaluation.failureKinds,
    studentReasoning: input.studentReasoning,
    completenessOnly: evaluation.completenessOnly,
  };
}

export function hasCompletedOhmsModel(
  attempts: Array<{ correctStructure: boolean }>,
): boolean {
  return attempts.some((attempt) => attempt.correctStructure);
}

export function sixClickOhmsModelInput(timestamp: string): OhmsModelInput {
  return {
    currentIdentity: "current",
    voltageIdentity: "voltage",
    resistanceIdentity: "resistance",
    relation: "i-equals-u-over-r",
    sameRConsequence: "larger-u-larger-i",
    sameUConsequence: "larger-r-smaller-i",
    rearrangement: "same-relation-r-is-property",
    condition: "closed-ohmic",
    studentReasoning: "电流等于电压除以电阻",
    timestamp,
  };
}

export function completeOhmsModelInput(timestamp: string): OhmsModelInput {
  return {
    currentIdentity: "current",
    voltageIdentity: "voltage",
    resistanceIdentity: "resistance",
    relation: "i-equals-u-over-r",
    sameRConsequence: "larger-u-larger-i",
    sameUConsequence: "larger-r-smaller-i",
    rearrangement: "same-relation-r-is-property",
    condition: "closed-ohmic",
    studentReasoning: "电阻没变的时候，电压更大，电流就更大。换电阻时电压不变，电阻更大电流更小。",
    timestamp,
  };
}

export function ohmsModelMissingLabels(draft: OhmsModelDraft): string[] {
  const missing: string[] = [];
  if (
    !draft.currentIdentity ||
    !draft.voltageIdentity ||
    !draft.resistanceIdentity
  ) {
    missing.push("电流、电压、电阻分别是什么");
  }
  if (!draft.relation) {
    missing.push("三个量用哪一句关系连起来");
  }
  if (!draft.sameRConsequence) {
    missing.push("电阻不变时电流怎样");
  }
  if (!draft.sameUConsequence) {
    missing.push("电压不变时电流怎样");
  }
  if (!draft.rearrangement) {
    missing.push("R = U / I 是不是在制造电阻");
  }
  if (!draft.condition) {
    missing.push("这个关系在什么条件下能用");
  }
  if (!draft.studentReasoning.trim()) {
    missing.push("用一句话写出哪个量不变、电流怎样变");
  }
  return missing;
}

export function ohmsModelStudentFeedback(
  draft: OhmsModelDraft,
  attempt: ModelAttempt,
): StudentUiFeedback {
  return studentUiFeedback(
    ohmsModelMissingLabels(draft),
    summarizeOhmsModelAttempt(attempt),
  );
}

export function summarizeOhmsModelAttempt(attempt: ModelAttempt): string {
  if (attempt.correctStructure) {
    return "你用同一个关系说明了两种比较，也写清了哪个量不变时电流怎样变。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("completeness-without-construction") || kinds.includes("authored-formula-only")) {
    return "板上的格子选对了还不够。要用自己的话写出：哪个量不变，电流怎样变。只背公式不行。";
  }
  if (kinds.includes("authored-generic") || kinds.includes("authored-noun-sandwich")) {
    return "“好好”或只列出电流电压电阻，还不能说明关系。写出哪个量保持不变。";
  }
  if (
    kinds.includes("authored-wrong-direction") ||
    kinds.includes("authored-negated") ||
    kinds.includes("authored-reversed-control") ||
    kinds.includes("authored-wrong-consequence-quantity")
  ) {
    return "先分清哪个量不变。电阻不变时电压更大，电流应该更大；电压不变时电阻更大，电流应该更小。";
  }
  if (kinds.includes("authored-token-sandwich") || kinds.includes("authored-noun-sandwich")) {
    return "只列出电流、电压、电阻还不够。写出哪个量不变，电流怎样变。";
  }
  if (kinds.includes("authored-no-control") || kinds.includes("one-control-only")) {
    return "还要同时看出：电阻不变时电压怎样影响电流，电压不变时电阻怎样影响电流。";
  }
  if (kinds.includes("missing-rearrangement-reject")) {
    return "R = U / I 只是同一个关系。改变电压并不是在制造新的电阻。";
  }
  if (kinds.includes("energy-chain-shape") || kinds.includes("force-board-shape")) {
    return "这不是能量传送带，也不是力和运动板。先放电流、电压和电阻。";
  }
  return "关系板还没写完整。先把三个量和两种比较放在同一块板上。";
}

function evaluateOhmsModelAuthored(text: string): {
  kind: "ok" | OhmsModelFailureKind;
} {
  const authored = evaluateOhmsTwoControlAuthored(text);
  if (authored.ok) {
    return { kind: "ok" };
  }
  const mapped: Record<string, OhmsModelFailureKind> = {
    missing: "authored-missing",
    generic: "authored-generic",
    "formula-only": "authored-formula-only",
    "noun-sandwich": "authored-noun-sandwich",
    "token-sandwich": "authored-token-sandwich",
    "no-control": "authored-no-control",
    "wrong-direction": "authored-wrong-direction",
    "wrong-consequence-quantity": "authored-wrong-consequence-quantity",
    negated: "authored-negated",
    "reversed-control": "authored-reversed-control",
    "one-control-only": "one-control-only",
  };
  return { kind: mapped[authored.failureKind] ?? "authored-no-control" };
}
