import { MODEL_ID, MODEL_RELATION_IDS } from "./model";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const transferTargets: TransferTarget[] = [
  {
    id: "near-kettle-heating-water",
    level: "near",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "电热水壶给水加热，水的温度升高。这里没有面包，也没有微波炉。你还能用刚才的想法解释吗？",
    surfaceFeatures: ["电热水壶", "水", "没有面包", "没有微波炉"],
    deepStructure: [
      "能量进入系统",
      "系统内能改变",
      "没有物态变化时温度升高",
    ],
    expectedModelId: MODEL_ID,
  },
  {
    id: "medium-hot-water-bag",
    level: "medium",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "热水袋贴在手上，过一会儿手变暖。装置完全不同。先解释手为什么可能变暖，不要只说“也是热的东西”。",
    surfaceFeatures: ["热水袋", "手", "接触", "没有微波炉"],
    deepStructure: [
      "能量进入手这个系统",
      "手的内能改变",
      "温度可能升高",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "far-ice-absorbs-energy",
    level: "far",
    transferMode: TransferMode.BOUNDARY_CONTRAST,
    scenario:
      "一杯冰水混合物还在吸热，温度却可以暂时几乎不变。哪些想法还能用？哪一句不能直接搬过来？",
    surfaceFeatures: ["冰", "冰水混合物", "没有微波炉", "看起来还很冷"],
    deepStructure: [
      "能量可以进入系统",
      "内能可以改变",
      "温度不一定升高",
    ],
    expectedModelId: MODEL_ID,
    transferableRelations: [
      MODEL_RELATION_IDS.energyTransferChangesInternalEnergy,
      MODEL_RELATION_IDS.energyInDoesNotAlwaysRaiseTemperature,
    ],
    nonTransferableRelations: ["energy-in-always-raises-temperature"],
    requiresConditionCheck: true,
  },
  {
    id: "partial-rubbing-hands",
    level: "medium",
    transferMode: TransferMode.PARTIAL_STRUCTURE,
    scenario:
      "两只手来回搓，搓完觉得暖和。结果也是变暖。哪些关系还能用？哪一句不能说成“和微波炉加热是同一种方式”？",
    surfaceFeatures: ["搓手", "没有加热装置", "没有面包"],
    deepStructure: [
      "系统内能可以改变",
      "温度可能升高",
      "能量改变的方式不必是微波炉或热传递",
    ],
    expectedModelId: "internal-energy-change-mechanisms",
    transferableRelations: [
      MODEL_RELATION_IDS.energyTransferChangesInternalEnergy,
      MODEL_RELATION_IDS.internalEnergyMayChangeTemperature,
    ],
    nonTransferableRelations: [
      "energy-change-must-be-microwave-or-heat-transfer",
    ],
    requiresConditionCheck: true,
  },
];
