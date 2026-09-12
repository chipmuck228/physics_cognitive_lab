import type { Misconception } from "@/types/physics-model";
import { HintLevelId } from "@/types/physics-model";
import { TutorAction } from "@/types/ai";

export const misconceptions: Misconception[] = [
  {
    id: "fcms-M1",
    statement: "有力就一定运动。",
    diagnosticSignals: [
      "有力就一定运动",
      "受到力就会动",
      "有力就在运动",
      "force means motion",
      "force means it is moving",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "你看到的是“有没有力”，还是“它现在是不是在动”？这两件事一样吗？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "如果两个力大小相等、方向相反，物体还一定在运动吗？",
      },
    ],
  },
  {
    id: "fcms-M2",
    statement: "物体要继续运动，就必须一直受到向前的力。",
    diagnosticSignals: [
      "运动就一定受到向前的力",
      "没有向前的力就会停",
      "要一直推着它才动",
      "motion requires continuous forward force",
      "needs a force to keep moving",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "小车已经在动了。你怎么判断它现在一定还在被向前推？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.HINT,
        prompt: "先分清：力是在改变运动状态，还是运动本身必须靠一个向前的力来维持。",
      },
    ],
  },
  {
    id: "fcms-M3",
    statement: "合力为零，物体就一定静止。",
    diagnosticSignals: [
      "没有力就会停下",
      "合力为零就一定静止",
      "不受力就会停",
      "no net force means stationary",
      "zero force must be at rest",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.ASK,
        prompt: "合力为零时，原来已经在动的小车，和原来静止的小车，情况一样吗？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.CHALLENGE,
        prompt: "如果摩擦可以忽略，撤去推力以后，它为什么必须立刻停住？",
      },
    ],
  },
  {
    id: "fcms-M4",
    statement: "平衡力就是没有力。",
    diagnosticSignals: [
      "平衡力就是没有力",
      "合力为零等于不受力",
      "平衡就是没有力",
      "balanced forces mean no forces",
      "equilibrium means no force",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "“两个力相互平衡”和“这个物体身上一个力都没有”，说的是同一件事吗？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.HINT,
        prompt: "合力为零，说的是力的总效果。不等于力不存在。",
      },
    ],
  },
  {
    id: "fcms-M5",
    statement: "力的方向必须和运动方向相同。",
    diagnosticSignals: [
      "力的方向必须和运动方向相同",
      "力只能顺着运动",
      "运动向右力就一定向右",
      "force and motion must have the same direction",
      "force must point the way it moves",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "你先分别说说：小车朝哪边走？这个力朝哪边？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "如果力顶着运动方向，速度还能不能变小？",
      },
    ],
  },
  {
    id: "fcms-M6",
    statement: "速度大小的变化和运动方向的变化是一回事。",
    diagnosticSignals: [
      "快慢变了就是方向变了",
      "运动状态变了就是掉头",
      "加速就是改变方向",
      "speed change is the same as direction change",
      "changing motion means reversing",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "这次是走得更快了、更慢了，还是朝另一边走了？先分开说。",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.HINT,
        prompt: "运动状态可以只改快慢，也可以改方向。它们不是同一个观察。",
      },
    ],
  },
];
