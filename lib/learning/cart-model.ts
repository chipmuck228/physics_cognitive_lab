import {
  CART_MODEL_CASE_IDS,
  type CartModelCaseId,
} from "@/lib/content/horizontal-force-cart";
import {
  studentUiFeedback,
  type StudentUiFeedback,
} from "@/lib/learning/student-ui-feedback";
import type { ModelAttempt } from "@/types/learning";

export const CART_MODEL_DRAFT_KIND = "cart-model-draft";

export const ENERGY_CHAIN_NODE_IDS = [
  "chemical-energy",
  "internal-energy",
  "mechanical-energy",
] as const;

export type CartModelFailureKind =
  | "missing-same-direction-speed-up"
  | "missing-opposite-direction-slow-down"
  | "missing-zero-net-force-unchanged"
  | "force-means-motion"
  | "zero-net-force-must-stop"
  | "force-direction-must-match-motion"
  | "energy-chain-shape"
  | "missing-zero-net-force-condition"
  | "missing-friction-omitted-condition";

export interface CartModelCase {
  currentMotionState: string;
  netForceCondition: string;
  resultingChange: string;
}

export interface CartModelInput {
  cases: Record<CartModelCaseId, CartModelCase>;
  conditions: string[];
  timestamp: string;
}

export interface CartModelDraft {
  kind: typeof CART_MODEL_DRAFT_KIND;
  cases: Record<CartModelCaseId, CartModelCase>;
  conditions: string[];
}

export function emptyCartModelCase(): CartModelCase {
  return {
    currentMotionState: "",
    netForceCondition: "",
    resultingChange: "",
  };
}

export function emptyCartModelCases(): Record<CartModelCaseId, CartModelCase> {
  return {
    same: emptyCartModelCase(),
    opposite: emptyCartModelCase(),
    zero: emptyCartModelCase(),
  };
}

export function emptyCartModelDraft(): CartModelDraft {
  return {
    kind: CART_MODEL_DRAFT_KIND,
    cases: emptyCartModelCases(),
    conditions: [],
  };
}

export function evaluateCartModelStructure(input: CartModelInput): {
  correctStructure: boolean;
  failureKinds: CartModelFailureKind[];
} {
  const failureKinds: CartModelFailureKind[] = [];
  const nodes = modelNodesFrom(input);
  const same = input.cases.same;
  const opposite = input.cases.opposite;
  const zero = input.cases.zero;

  if (looksLikeEnergyChain(nodes, input.conditions)) {
    failureKinds.push("energy-chain-shape");
  }
  if (claimsForceMeansMotion(input)) {
    failureKinds.push("force-means-motion");
  }
  if (zero.resultingChange === "must-stop" || zero.netForceCondition === "must-stop") {
    failureKinds.push("zero-net-force-must-stop");
  }
  if (input.conditions.includes("force-equals-motion") || opposite.resultingChange === "sped-up") {
    failureKinds.push("force-direction-must-match-motion");
  }
  if (!isSameDirectionSpeedUp(same)) {
    failureKinds.push("missing-same-direction-speed-up");
  }
  if (!isOppositeSlowDown(opposite)) {
    failureKinds.push("missing-opposite-direction-slow-down");
  }
  if (!isZeroUnchanged(zero)) {
    failureKinds.push("missing-zero-net-force-unchanged");
  }
  if (!input.conditions.includes("net-force-zero-unchanged")) {
    failureKinds.push("missing-zero-net-force-condition");
  }
  if (!input.conditions.includes("friction-omitted")) {
    failureKinds.push("missing-friction-omitted-condition");
  }

  return {
    correctStructure: failureKinds.length === 0,
    failureKinds,
  };
}

export function buildCartModelAttempt(input: CartModelInput): ModelAttempt {
  const evaluation = evaluateCartModelStructure(input);
  return {
    nodes: modelNodesFrom(input),
    connections: modelConnectionsFrom(input),
    correctStructure: evaluation.correctStructure,
    timestamp: input.timestamp,
    conditions: [...input.conditions],
    failureKinds: evaluation.failureKinds,
  };
}

export function hasCompletedCartModel(
  attempts: Array<{ correctStructure: boolean }>,
): boolean {
  return attempts.some((attempt) => attempt.correctStructure);
}

export function completeCartModelInput(timestamp: string): CartModelInput {
  return {
    cases: {
      same: {
        currentMotionState: "moving-right",
        netForceCondition: "same-as-motion",
        resultingChange: "sped-up",
      },
      opposite: {
        currentMotionState: "moving-right",
        netForceCondition: "opposite-to-motion",
        resultingChange: "slowed-down",
      },
      zero: {
        currentMotionState: "moving-right",
        netForceCondition: "zero",
        resultingChange: "unchanged",
      },
    },
    conditions: [
      "one-dimensional-motion",
      "friction-omitted",
      "net-force-zero-unchanged",
    ],
    timestamp,
  };
}

export function cartModelMissingLabels(draft: CartModelDraft): string[] {
  const missing: string[] = [];
  for (const caseId of CART_MODEL_CASE_IDS) {
    const item = draft.cases[caseId];
    if (!item.currentMotionState || !item.netForceCondition || !item.resultingChange) {
      missing.push(
        caseId === "same"
          ? "顺着推这一格"
          : caseId === "opposite"
            ? "顶着推这一格"
            : "合力为零这一格",
      );
    }
  }
  if (draft.conditions.length === 0) {
    missing.push("这个关系在什么条件下能用");
  }
  return missing;
}

export function cartModelStudentFeedback(
  draft: CartModelDraft,
  attempt: ModelAttempt,
): StudentUiFeedback {
  return studentUiFeedback(
    cartModelMissingLabels(draft),
    summarizeCartModelAttempt(attempt),
  );
}

export function summarizeCartModelAttempt(attempt: ModelAttempt): string {
  if (attempt.correctStructure) {
    return "你把现在的运动、合力条件和运动状态变化连起来了，也标出了合力为零时不变。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("energy-chain-shape")) {
    return "这不是能量传送带。先连：现在怎么运动、合力怎样、运动状态怎样变。";
  }
  if (kinds.includes("force-means-motion")) {
    return "有力不等于一定在运动。先分开说出力和运动。";
  }
  if (kinds.includes("zero-net-force-must-stop")) {
    return "合力为零时，原来在动的物体不必立刻静止。";
  }
  if (kinds.includes("force-direction-must-match-motion")) {
    return "力也可以顶着运动。顶着推时，快慢会怎样？";
  }
  if (kinds.includes("missing-zero-net-force-unchanged") || kinds.includes("missing-zero-net-force-condition")) {
    return "还少了合力为零时运动状态不变这个条件。";
  }
  if (kinds.includes("missing-friction-omitted-condition")) {
    return "还要标出：这一模型里摩擦先不算。";
  }
  if (kinds.includes("missing-same-direction-speed-up")) {
    return "顺着推这一格，运动状态应该怎样变？";
  }
  if (kinds.includes("missing-opposite-direction-slow-down")) {
    return "顶着推这一格，运动状态应该怎样变？";
  }
  return "三个对照还没连完整。再对着三次实验看一看。";
}

export function cartModelDraftFromAttempt(attempt: ModelAttempt): CartModelDraft {
  const cases = emptyCartModelCases();
  for (const caseId of CART_MODEL_CASE_IDS) {
    const prefix = `${caseId}:`;
    const motion = attempt.nodes.find((node) => node.startsWith(`${prefix}motion:`));
    const force = attempt.nodes.find((node) => node.startsWith(`${prefix}force:`));
    const change = attempt.nodes.find((node) => node.startsWith(`${prefix}change:`));
    cases[caseId] = {
      currentMotionState: motion?.slice(prefix.length + "motion:".length) ?? "",
      netForceCondition: force?.slice(prefix.length + "force:".length) ?? "",
      resultingChange: change?.slice(prefix.length + "change:".length) ?? "",
    };
  }
  return {
    kind: CART_MODEL_DRAFT_KIND,
    cases,
    conditions: attempt.conditions ?? [],
  };
}

function modelNodesFrom(input: CartModelInput): string[] {
  return CART_MODEL_CASE_IDS.flatMap((caseId) => {
    const row = input.cases[caseId];
    return [
      `${caseId}:motion:${row.currentMotionState}`,
      `${caseId}:force:${row.netForceCondition}`,
      `${caseId}:change:${row.resultingChange}`,
    ];
  });
}

function modelConnectionsFrom(
  input: CartModelInput,
): ModelAttempt["connections"] {
  return CART_MODEL_CASE_IDS.map((caseId) => ({
    from: `${input.cases[caseId].currentMotionState}+${input.cases[caseId].netForceCondition}`,
    to: input.cases[caseId].resultingChange,
  }));
}

function isSameDirectionSpeedUp(row: CartModelCase): boolean {
  return (
    (row.currentMotionState === "moving-right" ||
      row.currentMotionState === "moving-left") &&
    row.netForceCondition === "same-as-motion" &&
    row.resultingChange === "sped-up"
  );
}

function isOppositeSlowDown(row: CartModelCase): boolean {
  return (
    (row.currentMotionState === "moving-right" ||
      row.currentMotionState === "moving-left") &&
    row.netForceCondition === "opposite-to-motion" &&
    row.resultingChange === "slowed-down"
  );
}

function isZeroUnchanged(row: CartModelCase): boolean {
  return (
    (row.currentMotionState === "moving-right" ||
      row.currentMotionState === "moving-left") &&
    row.netForceCondition === "zero" &&
    row.resultingChange === "unchanged"
  );
}

function claimsForceMeansMotion(input: CartModelInput): boolean {
  return CART_MODEL_CASE_IDS.some((caseId) => {
    const row = input.cases[caseId];
    return (
      row.netForceCondition === "force-means-motion" ||
      row.resultingChange === "must-move"
    );
  });
}

function looksLikeEnergyChain(nodes: string[], conditions: string[]): boolean {
  if (conditions.includes("energy-conversion-chain")) {
    return true;
  }
  const joined = nodes.join(" ");
  return ENERGY_CHAIN_NODE_IDS.every((id) => joined.includes(id));
}
