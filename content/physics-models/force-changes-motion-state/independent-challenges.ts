import { MODEL_ID } from "./model";
import type { IndependentChallenge } from "@/types/physics-model";

export const independentChallenges: IndependentChallenge[] = [
  {
    id: "ai-off-unfamiliar-hover-sled",
    scenario:
      "游乐场有一种气垫滑板，几乎贴着地面漂着走。它的外形不像课堂上的小车，也没有明显的轮子。滑板已经在向右滑动，这时水平方向的推动消失了。",
    unfamiliarity: "medium",
    question:
      "如果水平方向的合力可以看成零，滑板的运动状态会怎样？请说明理由。不要只写“它有没有轮子”。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      { id: "identifiesCurrentMotionState", description: "指出滑板原来已经在运动。" },
      { id: "identifiesNetForceCondition", description: "指出水平合力可以看成零。" },
      {
        id: "identifiesMotionStateChange",
        description: "指出运动状态保持不变，而不是必须立刻停下。",
      },
      {
        id: "distinguishesForceFromMotion",
        description: "不把“没有向前的力”写成“一定静止”。",
      },
    ],
    llmAllowed: false,
  },
  {
    id: "ai-off-condition-tug-moving-crate",
    scenario:
      "仓库里一只木箱已经在向右滑动。两边的人用大小几乎相等、方向相反的水平力拉它。地面很滑，摩擦可以忽略。",
    unfamiliarity: "high",
    question:
      "木箱还会不会像刚才那样改变运动的快慢？说明原因。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      {
        id: "identifiesNetForceCondition",
        description: "指出两个水平力效果上合力为零，不是“没有力”。",
      },
      {
        id: "checksZeroNetForceUnchangedCondition",
        description: "指出合力为零时运动状态不变。",
      },
      {
        id: "distinguishesBalancedFromAbsentForce",
        description: "不把平衡力说成没有力。",
      },
      {
        id: "identifiesCurrentMotionState",
        description: "承认木箱原来已经在运动，所以不必变成静止。",
      },
    ],
    llmAllowed: false,
  },
];
