import type { ModelAttempt } from "@/types/learning";

export const MODEL_NODE_OPTIONS = [
  "internal energy changes",
  "mass changes",
  "speed changes",
] as const;

export const MODEL_ANCHORS = {
  source: "energy enters",
  target: "temperature increases",
} as const;

export function buildModelAttempt(input: {
  middleNode: string;
  connectSourceToMiddle: boolean;
  connectMiddleToTarget: boolean;
  timestamp: string;
}): ModelAttempt {
  const nodes = [
    MODEL_ANCHORS.source,
    input.middleNode,
    MODEL_ANCHORS.target,
  ];
  const connections = [];

  if (input.connectSourceToMiddle) {
    connections.push({
      from: MODEL_ANCHORS.source,
      to: input.middleNode,
    });
  }

  if (input.connectMiddleToTarget) {
    connections.push({
      from: input.middleNode,
      to: MODEL_ANCHORS.target,
    });
  }

  return {
    nodes,
    connections,
    correctStructure: isCorrectModelStructure(
      input.middleNode,
      input.connectSourceToMiddle,
      input.connectMiddleToTarget,
    ),
    timestamp: input.timestamp,
  };
}

export function isCorrectModelStructure(
  middleNode: string,
  connectSourceToMiddle: boolean,
  connectMiddleToTarget: boolean,
): boolean {
  return (
    middleNode === "internal energy changes" &&
    connectSourceToMiddle &&
    connectMiddleToTarget
  );
}

export function summarizeModelAttempt(attempt: ModelAttempt): string {
  if (attempt.correctStructure) {
    return "You built the core relationship: energy enters, internal energy changes, then temperature increases.";
  }

  const middleNode = attempt.nodes[1];
  if (middleNode !== "internal energy changes") {
    return "The start and end match the phenomenon. Reconsider what kind of change inside the bread links energy entering to temperature increasing.";
  }

  if (attempt.connections.length < 2) {
    return "You chose a promising middle idea. Now connect each step so the cause-and-effect chain is complete.";
  }

  return "The model is not complete yet. Try linking the physical changes in order.";
}
