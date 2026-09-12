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
    return "你把关系连起来了：能量进入 → 内能变化 → 温度升高。";
  }

  const middleNode = attempt.nodes[1];
  if (middleNode !== "internal energy changes") {
    return "开头和结尾对上了。再想想：能量进入之后，面包里面是哪种变化，才会让温度升高？";
  }

  if (attempt.connections.length < 2) {
    return "中间这一步选得不错。再把前后都连上，因果才完整。";
  }

  return "还差一点。试着按发生的顺序把变化连起来。";
}
