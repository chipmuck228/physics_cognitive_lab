import { MODEL_ID } from "./model";
import type { IndependentChallenge } from "@/types/physics-model";

export const independentChallenges: IndependentChallenge[] = [
  {
    id: "ai-off-unfamiliar-metal-spoon",
    scenario:
      "餐厅里一把金属勺刚放进热汤。勺把摸起来渐渐变热。这里没有面包，也没有微波炉。这是普通应用：能量进入后，温度在适当条件下升高。",
    unfamiliarity: "medium",
    question:
      "勺子为什么可能变热？请用能量进入、内能变化和温度变化说明。不要只写“它变热了”或“因为是金属”。这里不要求你讨论冰或物态变化。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      {
        id: "identifiesEnergyTransfer",
        description: "指出有能量进入勺子这个系统。",
      },
      {
        id: "identifiesInternalEnergyChange",
        description: "指出勺子的内能发生了变化。",
      },
      {
        id: "identifiesTemperatureChange",
        description: "指出温度升高是可观察的结果，不是内能的另一个名字。",
      },
      {
        id: "avoidsHeatAsStoredSubstance",
        description: "不把热说成装在勺子里的东西。",
      },
    ],
    llmAllowed: false,
  },
  {
    id: "ai-off-condition-ice-absorbs-energy",
    scenario:
      "夏天有人把一袋冰块放在桌上。冰块表面开始出水，但袋里的冰水混合物还可以长时间接近 0℃。",
    unfamiliarity: "high",
    question:
      "冰块明明在吸收周围的能量，为什么不能直接说它的温度一定升高？这里要检查的是条件，不是再把普通升温关系完整说一遍。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      {
        id: "identifiesEnergyTransfer",
        description: "承认有能量进入或离开这个系统。",
      },
      {
        id: "identifiesConditionOrBoundary",
        description: "指出能量进入不等于温度一定升高。",
      },
      {
        id: "distinguishesTemperatureFromInternalEnergy",
        description: "不把温度不变写成内能一定不变。",
      },
    ],
    llmAllowed: false,
  },
];
