import type { AssessmentOverlay } from "@/lib/runtime/types";

/**
 * Production answer semantics for exam / AI_OFF rendering.
 * Canonical stems and requiredEvidence remain on the Physics Model.
 * This overlay is not a second question bank.
 */
export const ohmsLawAssessmentOverlay: AssessmentOverlay = {
  exam: {
    "exam-same-r-larger-u-larger-i": {
      intendedRepresentation: "电阻不变时电压和电流怎样比",
      intendedModel: "R 不变时，U 更大则 I 更大",
    },
    "exam-same-u-larger-r-smaller-i": {
      intendedRepresentation: "电压相同时电阻和电流怎样比",
      intendedModel: "U 不变时，R 更大则 I 更小",
    },
    "exam-r-is-not-made-by-u-and-i": {
      intendedRepresentation: "公式变形是不是新的因果关系",
      intendedModel: "R 是这段导体的属性；R = U / I 是计算它的方法",
    },
    "exam-calculate-i-from-u-and-r": {
      intendedRepresentation: "用 U、R 求 I",
      intendedModel: "闭合且 R 可看成不变时，I = U / R",
    },
    "exam-filament-not-constant-r": {
      intendedRepresentation: "电阻还能不能看成不变",
      intendedModel: "R 明显随温度变化时，不能再用固定 R 说 I 与 U 成正比",
    },
  },
  independent: {
    "ai-off-unfamiliar-toy-motor-resistor": {
      judgments: [
        {
          id: "two-controls-same-relation",
          label:
            "换更高电压的电池时，电阻可以看成不变，电流更大；换更大电阻时，电压可以看成不变，电流更小。",
          correct: true,
        },
        {
          id: "voltage-alone",
          label: "电压更大，电流一定更大，电阻不用看。",
          correct: false,
        },
        {
          id: "formula-is-enough",
          label: "只要写出 I = U / R，就已经说明白了。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesVoltage",
          label: "换电池时用到了电压。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesResistance",
          label: "换元件时用到了电阻。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesCurrent",
          label: "要比较的是电流。",
          required: true,
          distractor: false,
        },
        {
          id: "checksControlledComparison",
          label: "两次比较分别说清了哪个量可以看成不变。",
          required: true,
          distractor: false,
        },
        {
          id: "formula-alone",
          label: "写出 I = U / R 就够了。",
          required: false,
          distractor: true,
        },
        {
          id: "voltage-without-r",
          label: "电压大电流就大，不必看电阻。",
          required: false,
          distractor: true,
        },
      ],
    },
    "ai-off-condition-r-not-made-by-division": {
      judgments: [
        {
          id: "rearrangement-computes-same-r",
          label:
            "R = U / I 和 I = U / R 是同一个关系。电压变了并没有制造新的电阻；电阻仍可看成不变，电流会变大。",
          correct: true,
        },
        {
          id: "changing-u-makes-new-r",
          label: "电压变了，电阻一定变成一个新的电阻，因为电阻是用电压除以电流算出来的。",
          correct: false,
        },
        {
          id: "numerator-makes-r",
          label: "分子变大所以电阻变大。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesResistance",
          label: "电阻是这段导体的属性，不是被算式重新制造出来的。",
          required: true,
          distractor: false,
        },
        {
          id: "usesCurrentVoltageResistanceRelation",
          label: "R = U / I 只是 I = U / R 的变形。",
          required: true,
          distractor: false,
        },
        {
          id: "rejectsResistanceCreatedByUI",
          label: "改变电压或电流，并不是在制造新的电阻。",
          required: true,
          distractor: false,
        },
        {
          id: "checksOhmicCondition",
          label: "在本模型边界内，电阻仍可看成不变，电压变大则电流变大。",
          required: true,
          distractor: false,
        },
        {
          id: "numerator-slogan",
          label: "分子变大所以电阻变大。",
          required: false,
          distractor: true,
        },
        {
          id: "need-resistivity",
          label: "必须先讲电阻率和材料内部结构，才能回答。",
          required: false,
          distractor: true,
        },
      ],
    },
  },
};
