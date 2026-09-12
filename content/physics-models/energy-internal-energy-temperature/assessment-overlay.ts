import type { AssessmentOverlay } from "@/lib/runtime/types";

/**
 * Canonical overlay for microwave-bread. The Scene adapter must import this
 * object. Do not duplicate it in Scene-owned files.
 *
 * Official independent flags copy PRE-COMMIT fields only.
 * Post-check may confirm or challenge; it must not manufacture missing reasoning.
 *
 * A (`ai-off-unfamiliar-metal-spoon`) success claim = ordinary energy → U → T-under-conditions.
 * B (`ai-off-condition-ice-absorbs-energy`) success claim = energy-in does not justify T-must-rise.
 * Do not accept the same authored text as official success for both.
 */
export const energyInternalEnergyTemperatureAssessmentOverlay: AssessmentOverlay = {
  exam: {
    "exam-temperature-is-not-internal-energy": {
      intendedRepresentation: "温度、热和内能是不是同一件事",
      intendedModel: "温度升高说明内能可能发生了变化，但温度不是内能",
    },
    "exam-energy-in-need-not-raise-temperature": {
      intendedRepresentation: "这句话有没有成立条件",
      intendedModel: "能量进入时内能可以改变，温度不一定升高",
    },
    "exam-hotter-not-always-more-internal-energy": {
      intendedRepresentation: "只知道温度够不够",
      intendedModel: "温度不是总内能，还要看是不是同一个系统",
    },
  },
  independent: {
    "ai-off-unfamiliar-metal-spoon": {
      judgments: [
        {
          id: "energy-in-internal-energy-temperature",
          label: "有能量进入勺子，勺子的内能改变，温度升高。热不是装在勺子里的东西。",
          correct: true,
        },
        {
          id: "heat-stored",
          label: "勺子变热，是因为热量被装进勺子里。",
          correct: false,
        },
        {
          id: "temperature-is-energy",
          label: "温度升高就是内能这个词的另一种说法。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesEnergyTransfer",
          label: "有能量进入勺子这个系统。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesInternalEnergyChange",
          label: "勺子的内能发生了变化。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesTemperatureChange",
          label: "温度升高是可以观察的结果，不是内能的另一个名字。",
          required: true,
          distractor: false,
        },
        {
          id: "surface-metal",
          label: "因为它是金属，所以和刚才的关系不一样。",
          required: false,
          distractor: true,
        },
      ],
    },
    "ai-off-condition-ice-absorbs-energy": {
      judgments: [
        {
          id: "energy-in-need-not-raise-t",
          label: "能量可以进入系统，内能可以变，但温度不一定升高。",
          correct: true,
        },
        {
          id: "must-heat-up",
          label: "只要在吸收能量，温度就一定会升高。",
          correct: false,
        },
        {
          id: "unchanged-means-no-energy",
          label: "温度几乎不变，说明没有能量进出，内能也一定没变。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesEnergyTransfer",
          label: "这里仍然可以有能量进入系统。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesConditionOrBoundary",
          label: "能量进入不等于温度一定升高。",
          required: true,
          distractor: false,
        },
        {
          id: "distinguishesTemperatureFromInternalEnergy",
          label: "温度几乎不变，不能直接写成内能一定不变。",
          required: true,
          distractor: false,
        },
        {
          id: "looks-cold",
          label: "因为它看起来还是冷的，所以和课堂上的关系无关。",
          required: false,
          distractor: true,
        },
      ],
    },
  },
};
