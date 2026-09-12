import { MODEL_ID, MODEL_RELATION_IDS } from "./model";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const transferTargets: TransferTarget[] = [
  {
    id: "near-motorcycle-piston-engine",
    level: "near",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "一辆摩托车靠活塞发动机行驶。汽油在气缸里燃烧后，车子能向前走。你觉得能量是怎样一步步到车轮上的？",
    surfaceFeatures: ["摩托车", "汽油", "车轮", "气缸"],
    deepStructure: [
      "燃料化学能",
      "燃烧使化学能转化",
      "工作气体内能/状态变化",
      "气体做功",
      "机械能",
    ],
    expectedModelId: MODEL_ID,
  },
  {
    id: "medium-lab-combustion-piston",
    level: "medium",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "实验室里有一个简易装置：少量可燃气体在封闭气缸中被点燃，活塞被推出去。这个装置没有完整的四个冲程图，也没有汽车外壳。你还能用刚才的想法解释吗？",
    surfaceFeatures: ["实验室装置", "没有四冲程名称", "一次性点燃", "可见活塞"],
    deepStructure: [
      "化学能转化",
      "工作气体内能/状态变化",
      "气体对活塞做功",
      "机械能",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "far-steam-piston",
    level: "far",
    transferMode: TransferMode.PARTIAL_STRUCTURE,
    scenario:
      "蒸汽机里，高温蒸汽膨胀，推动活塞运动。这里没有汽油在气缸里燃烧。哪些想法还能用？哪些不能直接搬过来？",
    surfaceFeatures: ["蒸汽", "锅炉", "没有缸内燃烧", "活塞"],
    deepStructure: [
      "工作物质内能/状态变化",
      "对机械系统做功",
      "机械能",
    ],
    transferableRelations: [
      MODEL_RELATION_IDS.internalEnergyChangesState,
      MODEL_RELATION_IDS.workingGasDoesWork,
      MODEL_RELATION_IDS.mechanicalEnergyOutput,
    ],
    nonTransferableRelations: [MODEL_RELATION_IDS.chemicalConvertsToInternal],
    requiresConditionCheck: true,
  },
];
