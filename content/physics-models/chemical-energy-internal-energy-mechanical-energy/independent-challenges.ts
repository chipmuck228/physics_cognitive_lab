import { MODEL_ID } from "./model";
import type { IndependentChallenge } from "@/types/physics-model";

export const independentChallenges: IndependentChallenge[] = [
  {
    id: "ai-off-unfamiliar-combustion-piston",
    scenario:
      "一种小型园林机械用可燃混合气在气缸中燃烧，推动活塞，再带动刀具转动。它的外形和课堂上的四冲程教学图不一样，也没有把四个冲程画出来。",
    unfamiliarity: "medium",
    question:
      "刀具能够转动，能量是从哪里来的？请按发生顺序说明。不要只写零件名字。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      { id: "identifiesEnergySource", description: "指出起始能量来自燃料的化学能。" },
      { id: "identifiesInternalEnergyChange", description: "指出工作物质内能或状态发生了变化。" },
      { id: "identifiesWorkProcess", description: "指出气体对机械系统做功。" },
      { id: "identifiesMechanicalOutput", description: "指出最终表现为机械能。" },
      { id: "preservesCausalOrder", description: "顺序不能颠倒，也不能跳过做功。" },
    ],
    llmAllowed: false,
  },
  {
    id: "ai-off-condition-locked-mechanism",
    scenario:
      "燃料正常燃烧，气缸里的气体明显变热，但机械部件被卡住，无法运动。",
    unfamiliarity: "high",
    question:
      "这个装置还能按原来的方式输出机械能吗？说明原因。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      { id: "checksNecessaryConditions", description: "指出可运动机械系统、气体做功是必要的。" },
      { id: "identifiesInternalEnergyChange", description: "承认燃烧仍可能改变气体内能/状态。" },
      { id: "identifiesWorkProcess", description: "指出做功这一步没有完成。" },
      { id: "identifiesMechanicalOutput", description: "不能把升温直接当成机械能输出。" },
    ],
    llmAllowed: false,
  },
];
