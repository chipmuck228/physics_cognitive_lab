import { MODEL_ID } from "./model";
import type { IndependentChallenge } from "@/types/physics-model";

export const independentChallenges: IndependentChallenge[] = [
  {
    id: "ai-off-unfamiliar-sealed-packages",
    scenario:
      "快递站有两个密封包装，外形几乎一样大，也不透明。一个明显更沉。它们看起来不像课堂上的铁块和木块。",
    unfamiliarity: "medium",
    question:
      "在不知道里面是什么材料的情况下，你怎样比较它们的密度？请说明理由。不要只写“更重的密度更大”。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      { id: "identifiesMass", description: "指出两个包装的质量不同。" },
      { id: "identifiesVolume", description: "指出外形体积几乎相同。" },
      {
        id: "usesMassVolumeRatio",
        description: "用单位体积的质量来比较密度，而不是只比轻重。",
      },
      {
        id: "distinguishesDensityFromMassOrSize",
        description: "不把“更重”直接写成“密度一定更大”，除非体积条件已经说清。",
      },
    ],
    llmAllowed: false,
  },
  {
    id: "ai-off-condition-cut-uniform-bar",
    scenario:
      "一根内部均匀的金属条被切成长度大约一半的两段。其中一段看起来更短、也更轻。",
    unfamiliarity: "high",
    question:
      "这一段的密度会不会因此变小？说明原因。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      {
        id: "identifiesMass",
        description: "承认切开后这一段质量变小。",
      },
      {
        id: "identifiesVolume",
        description: "承认切开后这一段体积也变小。",
      },
      {
        id: "usesProportionalInvariance",
        description: "指出切开后质量和体积按同样比例变，所以比值不变。",
      },
      {
        id: "checksUniformMaterialCondition",
        description: "指出这个比值保持不变还依赖样品内部均匀。",
      },
      {
        id: "usesMassVolumeRatio",
        description: "仍然用 ρ = m / V，而不是“同一种物质所以不变”或“变小了所以密度变小”。",
      },
    ],
    llmAllowed: false,
  },
];
