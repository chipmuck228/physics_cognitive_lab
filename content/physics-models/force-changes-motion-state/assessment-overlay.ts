import type { AssessmentOverlay } from "@/lib/runtime/types";

/**
 * Production answer semantics for exam / AI_OFF rendering.
 * Canonical stems and requiredEvidence remain on the Physics Model.
 * This overlay is not a second question bank.
 */
export const forceChangesMotionStateAssessmentOverlay: AssessmentOverlay = {
  exam: {
    "exam-force-does-not-mean-motion": {
      intendedRepresentation: "力和运动是不是同一件事",
      intendedModel: "力可以改变运动状态，但有力不等于物体一定在运动",
    },
    "exam-zero-net-force-not-must-stop": {
      intendedRepresentation: "合力为零时运动状态怎样",
      intendedModel: "合力为零，运动状态保持不变",
    },
    "exam-opposite-force-slows-down": {
      intendedRepresentation: "力的方向和运动方向的关系",
      intendedModel: "反向合力使速度变小，力的方向不必与运动方向相同",
    },
    "exam-force-motion-arrow-diagram": {
      intendedRepresentation: "图上力箭头和运动箭头的关系",
      intendedModel: "合力与运动方向相反，速度可能变小",
    },
    "exam-balanced-forces-not-no-forces": {
      intendedRepresentation: "这句话是否把平衡力和没有力混在一起",
      intendedModel: "平衡指合力为零，不是力不存在",
    },
  },
  independent: {
    "ai-off-unfamiliar-hover-sled": {
      judgments: [
        {
          id: "keeps-moving",
          label: "滑板可以继续向右运动，运动状态保持不变。",
          correct: true,
        },
        {
          id: "must-stop",
          label: "没有向前的推力，滑板一定会立刻停下来。",
          correct: false,
        },
        {
          id: "must-reverse",
          label: "没有轮子，所以它一定会立刻掉头。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesCurrentMotionState",
          label: "滑板原来已经在向右运动。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesNetForceCondition",
          label: "这时水平合力可以看成零。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesMotionStateChange",
          label: "合力为零时运动状态保持不变。",
          required: true,
          distractor: false,
        },
        {
          id: "surface-wheels",
          label: "因为它没有轮子，所以和课堂上的关系不一样。",
          required: false,
          distractor: true,
        },
      ],
    },
    "ai-off-condition-tug-moving-crate": {
      judgments: [
        {
          id: "no-speed-change",
          label: "两边的力效果上合力为零，木箱的运动快慢不必因此改变。",
          correct: true,
        },
        {
          id: "must-rest",
          label: "受力平衡就是没有力，所以木箱一定静止。",
          correct: false,
        },
        {
          id: "must-speed-up",
          label: "有人在拉它，所以它一定会越来越快。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesNetForceCondition",
          label: "两个水平力大小几乎相等、方向相反，合力为零。",
          required: true,
          distractor: false,
        },
        {
          id: "distinguishesBalancedFromAbsentForce",
          label: "这是受力平衡，不是一个力都没有。",
          required: true,
          distractor: false,
        },
        {
          id: "checksZeroNetForceUnchangedCondition",
          label: "合力为零时，原来在滑动的木箱可以保持原来的运动状态。",
          required: true,
          distractor: false,
        },
        {
          id: "must-stop-because-no-forward",
          label: "没有单独向前的力，所以它必须停下。",
          required: false,
          distractor: true,
        },
      ],
    },
  },
};
