import type { AssessmentOverlay } from "@/lib/runtime/types";

/**
 * Production assessment answer semantics for
 * chemical-energy-internal-energy-mechanical-energy.
 *
 * Canonical examPatterns / independentChallenges remain the source of
 * IDs, stems, scenarios, requiredEvidence, and llmAllowed.
 * This overlay supplies rendering/evaluation details that the current
 * Physics Model schema does not own.
 */
export const chemicalEnergyMechanicalAssessmentOverlay: AssessmentOverlay = {
  exam: {
    "exam-power-stroke-energy-conversion": {
      intendedRepresentation: "主要能量转化关系",
      intendedModel: "化学能 → 内能/状态变化 → 做功 → 机械能",
    },
    "exam-why-power-stroke-works": {
      intendedRepresentation: "能量从哪里来、经过什么、到哪里去",
      intendedModel: "化学能转化 → 气体内能/状态变化 → 气体做功 → 机械能",
    },
    "exam-stroke-diagram-energy-flow": {
      intendedRepresentation: "示意图上的能量流动",
      intendedModel: "燃烧后气体膨胀并对活塞做功",
    },
  },
  independent: {
    "ai-off-unfamiliar-combustion-piston": {
      judgments: [
        {
          id: "fuel-gas-work-cutter",
          label:
            "燃料里的能量先让气缸里的气体发生变化，气体再推动可以运动的部分，刀具才转起来。",
          correct: true,
        },
        {
          id: "parts-make-energy",
          label: "刀具和气缸这些零件自己产生了让它转动的能量。",
          correct: false,
        },
        {
          id: "combustion-turns-cutter",
          label: "燃烧直接让刀具转起来。",
          correct: false,
        },
        {
          id: "same-as-four-stroke-diagram",
          label: "因为它也有气缸，所以一定和课堂上的四冲程图完全一样。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesEnergySource",
          label: "起始能量来自燃料。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesInternalEnergyChange",
          label: "气缸里的气体状态或内部能量发生了变化。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesWorkProcess",
          label: "气体推动了可以运动的机械部分。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesMechanicalOutput",
          label: "刀具转动是机械运动这一边的结果。",
          required: true,
          distractor: false,
        },
        {
          id: "distractor-direct-combustion",
          label: "燃烧直接让刀具转起来。",
          required: false,
          distractor: true,
        },
        {
          id: "distractor-surface-cue",
          label: "因为外形零件和课堂图看起来差不多。",
          required: false,
          distractor: true,
        },
      ],
    },
    "ai-off-condition-locked-mechanism": {
      judgments: [
        {
          id: "blocked-no-output",
          label:
            "不能按原来的方式输出。燃烧仍可能发生，但机械路径被堵住，做功没法完成。",
          correct: true,
        },
        {
          id: "combustion-guarantees-output",
          label: "能。只要燃烧发生了，就一定有机械输出。",
          correct: false,
        },
        {
          id: "heat-is-output",
          label: "能。气体变热了，就等于已经输出机械能。",
          correct: false,
        },
        {
          id: "missing-stroke-names",
          label: "不能。因为这里没有写出吸气、压缩、做功、排气这些名字。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesInternalEnergyChange",
          label: "燃烧仍然可能让气体变热。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesWorkProcess",
          label: "机械被卡住后，做功这一步没有完成。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesMechanicalOutput",
          label: "不能把升温直接当成机械能输出。",
          required: true,
          distractor: false,
        },
        {
          id: "checksNecessaryConditions",
          label: "机械部分必须还能运动，气体才能按原来的方式做功。",
          required: true,
          distractor: false,
        },
        {
          id: "distractor-combustion-guarantees",
          label: "燃烧了就一定有机械输出。",
          required: false,
          distractor: true,
        },
        {
          id: "distractor-heat-is-output",
          label: "气体变热就是机械能输出了。",
          required: false,
          distractor: true,
        },
      ],
    },
  },
};
