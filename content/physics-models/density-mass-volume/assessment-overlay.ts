import type { AssessmentOverlay } from "@/lib/runtime/types";

/**
 * Production answer semantics for exam / AI_OFF rendering.
 * Canonical stems and requiredEvidence remain on the Physics Model.
 * This overlay is not a second question bank.
 */
export const densityMassVolumeAssessmentOverlay: AssessmentOverlay = {
  exam: {
    "exam-density-is-not-mass-or-size": {
      intendedRepresentation: "密度、质量和体积是不是同一件事",
      intendedModel: "密度是单位体积的质量，不等于“更重”或“更大”",
    },
    "exam-same-volume-larger-mass": {
      intendedRepresentation: "体积相同时质量和密度怎样比",
      intendedModel: "体积相同，质量更大则密度更大",
    },
    "exam-cut-uniform-density-unchanged": {
      intendedRepresentation: "均匀切开后密度是否改变",
      intendedModel: "质量和体积按同样比例变，密度不变",
    },
    "exam-calculate-density-ratio": {
      intendedRepresentation: "用 m 和 V 求 ρ",
      intendedModel: "ρ = m / V",
    },
    "exam-mass-volume-density-table": {
      intendedRepresentation: "表上质量和体积怎样对应到密度",
      intendedModel: "同样体积下，质量更大则密度更大",
    },
  },
  independent: {
    "ai-off-unfamiliar-sealed-packages": {
      judgments: [
        {
          id: "same-volume-heavier-denser",
          label: "外形体积几乎相同，更沉的那个单位体积的质量更大，密度更大。",
          correct: true,
        },
        {
          id: "heavier-always-denser",
          label: "更重的密度一定更大，不用看体积。",
          correct: false,
        },
        {
          id: "unknown-material-no-density",
          label: "不知道里面是什么材料，所以不能谈密度。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesMass",
          label: "两个包装的质量不同。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesVolume",
          label: "外形看起来体积几乎一样。",
          required: true,
          distractor: false,
        },
        {
          id: "usesMassVolumeRatio",
          label: "在体积相同的条件下，用质量比较密度。",
          required: true,
          distractor: false,
        },
        {
          id: "heavier-without-volume",
          label: "只要更重，密度就一定更大，体积不用管。",
          required: false,
          distractor: true,
        },
      ],
    },
    "ai-off-condition-cut-uniform-bar": {
      judgments: [
        {
          id: "density-unchanged",
          label: "这一段质量和体积都变小了，但比值可以保持不变，密度不必变小。",
          correct: true,
        },
        {
          id: "smaller-less-dense",
          label: "看起来更短更轻，所以密度一定变小。",
          correct: false,
        },
        {
          id: "mass-down-density-down",
          label: "质量变小了，密度就一定变小。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesMass",
          label: "切开后这一段质量变小了。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesVolume",
          label: "切开后这一段体积也变小了。",
          required: true,
          distractor: false,
        },
        {
          id: "usesProportionalInvariance",
          label: "切开后质量和体积都按同样比例变小，所以 m/V 不变。",
          required: true,
          distractor: false,
        },
        {
          id: "checksUniformMaterialCondition",
          label: "这个比值保持不变，还要样品内部均匀。",
          required: true,
          distractor: false,
        },
        {
          id: "same-material-alone",
          label: "因为是同一种物质，所以密度不变。",
          required: false,
          distractor: true,
        },
        {
          id: "smaller-means-less-dense",
          label: "变小了就是密度变小了。",
          required: false,
          distractor: true,
        },
      ],
    },
  },
};
