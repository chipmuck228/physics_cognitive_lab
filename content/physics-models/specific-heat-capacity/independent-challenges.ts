import { MODEL_ID } from "./model";
import type { IndependentChallenge } from "@/types/physics-model";

export const independentChallenges: IndependentChallenge[] = [
  {
    id: "ai-off-unfamiliar-two-lunchboxes",
    scenario:
      "两个密封饭盒质量几乎相同，里面的食物看起来也不一样。用同一台微波炉加热同样长时间。打开后，一个明显更烫。它们不像课堂上的沙子盘。",
    unfamiliarity: "medium",
    question:
      "在不知道具体材料名称的情况下，你怎样解释它们升温不同？请说明理由。不要只写“加热时间一样所以应该一样烫”，也不要只写“材料不同所以升温不同”。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      { id: "identifiesMass", description: "指出两份食物质量几乎相同。" },
      {
        id: "identifiesHeatEnergy",
        description: "指出加热时间相同只是让吸收的能量可以看成相近，时间本身不是 Q。",
      },
      {
        id: "identifiesTemperatureChange",
        description: "指出最后温度变化不同。",
      },
      {
        id: "usesHeatMassTempRelation",
        description: "用 Q、m、c、ΔT 的关系解释，而不是只比谁更烫。",
      },
      {
        id: "distinguishesHeatFromTemperature",
        description: "不把“更烫”直接写成“吸收的能量一定更多”。",
      },
      {
        id: "rejectsMaterialNameAlone",
        description:
          "不把“材料不同所以升温不同”当成完整理由。必须同时谈到 Q、m 和 ΔT。",
      },
    ],
    llmAllowed: false,
  },
  {
    id: "ai-off-condition-ice-pack-stays-cold",
    scenario:
      "一个装了冰块的冰袋刚从冷冻柜拿出来，用和小杯温水同样的加热器加热同样久。冰袋几乎还是 0℃ 附近，小杯温水却明显升温。",
    unfamiliarity: "high",
    question:
      "冰袋几乎没升温，是不是说明它没有吸收能量，或者比热容变成了零？说明原因。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      {
        id: "identifiesHeatEnergy",
        description: "承认加热器仍可能把能量送进冰袋。",
      },
      {
        id: "identifiesTemperatureChange",
        description: "承认这段时间里冰袋的温度变化几乎为零。",
      },
      {
        id: "checksNoPhaseChangeCondition",
        description: "指出冰在熔化时，Q = c m ΔT 不能写完全部能量去向。",
      },
      {
        id: "usesHeatMassTempRelation",
        description: "仍然用该关系作条件检查，而不是说“没升温就没吸热”或“加热就一定升温”。",
      },
    ],
    llmAllowed: false,
  },
];
