import type { AssessmentOverlay } from "@/lib/runtime/types";

/**
 * Production answer semantics for exam / AI_OFF rendering.
 * Canonical stems and requiredEvidence remain on the Physics Model.
 * This overlay is not a second question bank.
 */
export const specificHeatCapacityAssessmentOverlay: AssessmentOverlay = {
  exam: {
    "exam-heat-is-not-temperature": {
      intendedRepresentation: "温度和吸收的能量是不是同一件事",
      intendedModel: "温度不是吸收的能量；还要看质量、比热容和温度变化",
    },
    "exam-same-mass-same-delta-t-larger-c": {
      intendedRepresentation: "质量和升温相同时谁需要的能量更多",
      intendedModel: "同样质量升高同样温度，c 更大则 Q 更大",
    },
    "exam-same-mass-same-q-larger-c": {
      intendedRepresentation: "质量和能量相同时温度怎样比",
      intendedModel: "同样质量吸收同样能量，c 更大则 ΔT 更小",
    },
    "exam-calculate-q-from-c-m-delta-t": {
      intendedRepresentation: "用 c、m、ΔT 求 Q",
      intendedModel: "Q = c m ΔT",
    },
    "exam-heating-without-temperature-rise": {
      intendedRepresentation: "没有升温时还能不能直接用 Q = c m ΔT",
      intendedModel: "没有 ΔT 时不能用这个式子写完熔化过程",
    },
  },
  independent: {
    "ai-off-unfamiliar-two-lunchboxes": {
      judgments: [
        {
          id: "same-mass-same-heating-different-c",
          label: "质量几乎相同、加热可以看成相近时，比热容不同，升温就可以不同。",
          correct: true,
        },
        {
          id: "hotter-always-more-heat",
          label: "更烫的那个吸收的能量一定更多，质量和材料不用管。",
          correct: false,
        },
        {
          id: "same-time-same-rise",
          label: "微波炉时间相同，温度就应该升得一样。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesMass",
          label: "两个饭盒的质量几乎相同。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesHeatEnergy",
          label: "加热时间相同只说明能量输入可以看成相近，时间不是能量本身。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesTemperatureChange",
          label: "打开后它们的温度变化不同。",
          required: true,
          distractor: false,
        },
        {
          id: "usesHeatMassTempRelation",
          label: "用质量、比热容和温度变化一起解释，而不是只比谁更烫。",
          required: true,
          distractor: false,
        },
        {
          id: "hotter-without-mass",
          label: "只要更烫，吸收的能量就一定更多。",
          required: false,
          distractor: true,
        },
        {
          id: "material-name-alone",
          label: "因为材料不同，所以升温不同。",
          required: false,
          distractor: true,
        },
      ],
    },
    "ai-off-condition-ice-pack-stays-cold": {
      judgments: [
        {
          id: "phase-change-not-this-formula-alone",
          label: "冰在熔化时，能量可以进入但温度几乎不变，不能只用 Q = c m ΔT 写完。",
          correct: true,
        },
        {
          id: "no-rise-means-no-energy",
          label: "没升温就是没吸收能量。",
          correct: false,
        },
        {
          id: "heating-must-raise-temperature",
          label: "只要在加热，温度就一定会升高。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesHeatEnergy",
          label: "加热器仍可能把能量送进冰袋。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesTemperatureChange",
          label: "这段时间里冰袋的温度变化几乎为零。",
          required: true,
          distractor: false,
        },
        {
          id: "checksNoPhaseChangeCondition",
          label: "冰在熔化，这个式子不能单独写完全部能量去向。",
          required: true,
          distractor: false,
        },
        {
          id: "usesHeatMassTempRelation",
          label: "先检查有没有 ΔT 和物态变化，再决定能不能直接用公式。",
          required: true,
          distractor: false,
        },
        {
          id: "same-time-alone",
          label: "加热时间相同，所以两边温度必须一样。",
          required: false,
          distractor: true,
        },
      ],
    },
  },
};
