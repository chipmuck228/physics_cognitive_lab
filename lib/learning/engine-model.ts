import {
  ENGINE_MODEL_DISTRACTOR_NODES,
  ENGINE_MODEL_QUANTITY_NODES,
} from "@/lib/content/four-stroke-engine";
import type { ModelAttempt } from "@/types/learning";

/**
 * Student-facing MODEL node `working-gas-internal-energy-or-state`
 * (“工作气体的内能/状态”) is a Grade-9 pedagogical composite of the
 * canonical quantities `working-gas-internal-energy` and
 * `working-gas-state`. It is not a merge of the Physics Model ontology.
 */
export const ENGINE_MODEL_NODE_IDS = {
  fuel: "fuel-chemical-energy",
  gas: "working-gas-internal-energy-or-state",
  system: "mechanical-system",
  mechanical: "mechanical-energy",
  combustionQuantity: "combustion-quantity",
} as const;

export const ENGINE_STROKE_NODE_IDS = [
  "stroke-intake",
  "stroke-compression",
  "stroke-power",
  "stroke-exhaust",
] as const;

export type EngineModelFailureKind =
  | "missing-source"
  | "missing-gas-state"
  | "missing-work"
  | "direct-combustion-to-motion"
  | "incorrect-order"
  | "combustion-as-quantity"
  | "four-stroke-sequence";

export interface EngineModelInput {
  slots: string[];
  connections: Array<{
    from: string;
    to: string;
    kind?: "conversion" | "work" | "gains";
  }>;
  combustionEnablesConversion: boolean;
  timestamp: string;
}

export function buildEngineModelAttempt(input: EngineModelInput): ModelAttempt {
  const evaluation = evaluateEngineModelStructure(input);
  return {
    nodes: input.slots.filter(Boolean),
    connections: input.connections,
    correctStructure: evaluation.correctStructure,
    timestamp: input.timestamp,
    enablingProcesses: input.combustionEnablesConversion
      ? ["combustion-occurs"]
      : [],
    conditions: evaluation.correctStructure
      ? ["movable-mechanical-system", "gas-does-work"]
      : [],
    failureKinds: evaluation.failureKinds,
  };
}

export function evaluateEngineModelStructure(input: EngineModelInput): {
  correctStructure: boolean;
  failureKinds: EngineModelFailureKind[];
} {
  const placed = input.slots.filter(Boolean);
  const failureKinds: EngineModelFailureKind[] = [];

  if (isFourStrokeSequence(placed)) {
    failureKinds.push("four-stroke-sequence");
  }
  if (placed.includes(ENGINE_MODEL_NODE_IDS.combustionQuantity)) {
    failureKinds.push("combustion-as-quantity");
  }
  if (hasDirectCombustionToMotion(placed, input.connections)) {
    failureKinds.push("direct-combustion-to-motion");
  }
  if (!placed.includes(ENGINE_MODEL_NODE_IDS.fuel)) {
    failureKinds.push("missing-source");
  }
  if (!placed.includes(ENGINE_MODEL_NODE_IDS.gas)) {
    failureKinds.push("missing-gas-state");
  }
  if (!hasWorkLink(input.connections)) {
    failureKinds.push("missing-work");
  }
  if (hasPrimaryQuantityNodes(placed) && !orderIsCausal(placed)) {
    failureKinds.push("incorrect-order");
  }

  const hasConversion =
    hasRelation(
      input.connections,
      ENGINE_MODEL_NODE_IDS.fuel,
      ENGINE_MODEL_NODE_IDS.gas,
      "conversion",
    ) && input.combustionEnablesConversion;
  const hasSystem =
    placed.includes(ENGINE_MODEL_NODE_IDS.system) &&
    placed.includes(ENGINE_MODEL_NODE_IDS.mechanical);
  const hasGains = hasRelation(
    input.connections,
    ENGINE_MODEL_NODE_IDS.system,
    ENGINE_MODEL_NODE_IDS.mechanical,
    "gains",
  );

  const correctStructure =
    failureKinds.length === 0 &&
    hasConversion &&
    hasWorkLink(input.connections) &&
    hasSystem &&
    hasGains &&
    input.combustionEnablesConversion;

  return { correctStructure, failureKinds };
}

export function summarizeEngineModelAttempt(attempt: ModelAttempt): string {
  if (attempt.correctStructure) {
    return "你把燃料、工作气体、做功和机械能连成了一条可以用的关系。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("four-stroke-sequence")) {
    return "四个冲程名字是运转顺序，不是这条能量关系。再试试能量是怎样一步步到机械运动的。";
  }
  if (kinds.includes("combustion-as-quantity") || kinds.includes("direct-combustion-to-motion")) {
    return "燃烧是让转化能够发生的事件，不是被储存的能量，也不直接推动曲轴。";
  }
  if (kinds.includes("missing-source")) {
    return "开头好像还少了能量是从哪里来的。";
  }
  if (kinds.includes("missing-gas-state")) {
    return "你已经连出了燃料和机械运动。中间是不是少了一个真正发生变化的对象？";
  }
  if (kinds.includes("missing-work")) {
    return "气体变化之后，怎样把能量交给机械系统？中间是不是少了做功？";
  }
  if (kinds.includes("incorrect-order")) {
    return "卡片有了。再按发生的先后顺序排一排。";
  }
  return "还差一点。试着按发生的顺序把变化连起来。";
}

export function engineModelNodeLabel(id: string): string {
  return (
    [...ENGINE_MODEL_QUANTITY_NODES, ...ENGINE_MODEL_DISTRACTOR_NODES].find(
      (node) => node.id === id,
    )?.label ?? id
  );
}

export type EngineRelationKind = "conversion" | "work" | "gains";

export const ENGINE_MODEL_DRAFT_KIND = "engine-model-draft";

export interface EngineModelDraft {
  kind: typeof ENGINE_MODEL_DRAFT_KIND;
  slots: string[];
  relationKinds: Array<EngineRelationKind | "">;
  combustionEnablesConversion: boolean;
}

export function emptyEngineModelSlots(): string[] {
  return Array.from({ length: ENGINE_MODEL_QUANTITY_NODES.length }, () => "");
}

export function emptyEngineRelationKinds(): Array<EngineRelationKind | ""> {
  return Array.from(
    { length: ENGINE_MODEL_QUANTITY_NODES.length - 1 },
    (): EngineRelationKind | "" => "",
  );
}

export function connectionsFromEngineSlots(
  slots: string[],
  relationKinds: Array<EngineRelationKind | "">,
): EngineModelInput["connections"] {
  const connections: EngineModelInput["connections"] = [];
  for (let index = 0; index < relationKinds.length; index += 1) {
    const kind = relationKinds[index];
    const from = slots[index];
    const to = slots[index + 1];
    if (kind && from && to) {
      connections.push({ from, to, kind });
    }
  }
  return connections;
}

export function completeEngineModelInput(timestamp: string): EngineModelInput {
  const slots = [
    ENGINE_MODEL_NODE_IDS.fuel,
    ENGINE_MODEL_NODE_IDS.gas,
    ENGINE_MODEL_NODE_IDS.system,
    ENGINE_MODEL_NODE_IDS.mechanical,
  ];
  return {
    slots,
    connections: connectionsFromEngineSlots(slots, [
      "conversion",
      "work",
      "gains",
    ]),
    combustionEnablesConversion: true,
    timestamp,
  };
}

export function hasCompletedEngineModel(
  attempts: Array<{ correctStructure: boolean }>,
): boolean {
  return attempts.some((attempt) => attempt.correctStructure);
}

export function latestEngineModelDraft(
  events: Array<{ metadata?: Record<string, unknown> }>,
): EngineModelDraft | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const metadata = events[index]?.metadata;
    if (metadata?.kind === ENGINE_MODEL_DRAFT_KIND && Array.isArray(metadata.slots)) {
      return {
        kind: ENGINE_MODEL_DRAFT_KIND,
        slots: (metadata.slots as string[]).concat(emptyEngineModelSlots()).slice(
          0,
          ENGINE_MODEL_QUANTITY_NODES.length,
        ),
        relationKinds: (
          (metadata.relationKinds as Array<EngineRelationKind | ""> | undefined) ??
          emptyEngineRelationKinds()
        )
          .concat(emptyEngineRelationKinds())
          .slice(0, ENGINE_MODEL_QUANTITY_NODES.length - 1),
        combustionEnablesConversion: metadata.combustionEnablesConversion === true,
      };
    }
  }
  return null;
}

export function engineModelDraftFromAttempt(attempt: ModelAttempt): EngineModelDraft {
  const slots = attempt.nodes
    .concat(emptyEngineModelSlots())
    .slice(0, ENGINE_MODEL_QUANTITY_NODES.length);
  const relationKinds = emptyEngineRelationKinds().map((_, index) => {
    const from = slots[index];
    const to = slots[index + 1];
    return (
      attempt.connections.find(
        (connection) => connection.from === from && connection.to === to,
      )?.kind ?? ""
    );
  });
  return {
    kind: ENGINE_MODEL_DRAFT_KIND,
    slots,
    relationKinds,
    combustionEnablesConversion:
      attempt.enablingProcesses?.includes("combustion-occurs") === true,
  };
}

function isFourStrokeSequence(nodes: string[]): boolean {
  return ENGINE_STROKE_NODE_IDS.every((id) => nodes.includes(id));
}

function hasDirectCombustionToMotion(
  nodes: string[],
  connections: EngineModelInput["connections"],
): boolean {
  if (!nodes.includes(ENGINE_MODEL_NODE_IDS.combustionQuantity)) {
    return false;
  }
  return connections.some(
    (connection) =>
      connection.from === ENGINE_MODEL_NODE_IDS.combustionQuantity &&
      (connection.to === ENGINE_MODEL_NODE_IDS.system ||
        connection.to === ENGINE_MODEL_NODE_IDS.mechanical),
  );
}

function hasWorkLink(connections: EngineModelInput["connections"]): boolean {
  return connections.some(
    (connection) =>
      connection.kind === "work" &&
      connection.from === ENGINE_MODEL_NODE_IDS.gas &&
      connection.to === ENGINE_MODEL_NODE_IDS.system,
  );
}

function hasPrimaryQuantityNodes(nodes: string[]): boolean {
  return (
    nodes.includes(ENGINE_MODEL_NODE_IDS.fuel) &&
    nodes.includes(ENGINE_MODEL_NODE_IDS.gas) &&
    nodes.includes(ENGINE_MODEL_NODE_IDS.system) &&
    nodes.includes(ENGINE_MODEL_NODE_IDS.mechanical)
  );
}

function hasRelation(
  connections: EngineModelInput["connections"],
  from: string,
  to: string,
  kind: "conversion" | "work" | "gains",
): boolean {
  return connections.some(
    (connection) =>
      connection.from === from && connection.to === to && connection.kind === kind,
  );
}

function orderIsCausal(nodes: string[]): boolean {
  const fuel = nodes.indexOf(ENGINE_MODEL_NODE_IDS.fuel);
  const gas = nodes.indexOf(ENGINE_MODEL_NODE_IDS.gas);
  const system = nodes.indexOf(ENGINE_MODEL_NODE_IDS.system);
  const mechanical = nodes.indexOf(ENGINE_MODEL_NODE_IDS.mechanical);
  if (fuel < 0 || gas < 0 || system < 0 || mechanical < 0) {
    return false;
  }
  return fuel < gas && gas < system && system < mechanical;
}
