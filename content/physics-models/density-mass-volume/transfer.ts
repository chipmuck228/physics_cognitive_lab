import { MODEL_ID, MODEL_RELATION_IDS } from "./model";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const transferTargets: TransferTarget[] = [
  {
    id: "near-equal-cups-of-liquids",
    level: "near",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "厨房里两只相同的杯子，一杯倒满水，一杯倒满食用油。杯子一样大。为什么一杯会更沉？",
    surfaceFeatures: ["杯子", "液体", "厨房", "水和油"],
    deepStructure: [
      "体积相同",
      "质量不同",
      "密度是单位体积的质量",
    ],
    expectedModelId: MODEL_ID,
  },
  {
    id: "medium-irregular-stone",
    level: "medium",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "一块形状不规则的石头。用天平测质量，再用排水法测体积。没有现成的正方体。还能用刚才的想法求密度吗？",
    surfaceFeatures: ["不规则", "石头", "排水法", "不是课堂上的方块"],
    deepStructure: [
      "质量",
      "体积（排水得到）",
      "ρ = m / V",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "far-hollow-same-outer-size",
    level: "far",
    transferMode: TransferMode.BOUNDARY_CONTRAST,
    scenario:
      "一个空心大塑料球和一个实心小金属球。有人说大的密度一定更大，因为它看起来更大。哪些想法还能用？哪些不能直接搬过来？",
    surfaceFeatures: ["空心", "外形很大", "实心小球", "没有方块样品"],
    deepStructure: [
      "必须同时有质量和体积",
      "外形大小不是密度",
      "空心时外形体积不一定等于材料体积",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "far-float-or-sink",
    level: "far",
    transferMode: TransferMode.PARTIAL_STRUCTURE,
    scenario:
      "木块放进水里会浮，小铁块会沉。有人说：这就是密度，密度大的一定会沉。哪些关系可以迁移？哪些不能？",
    surfaceFeatures: ["浮", "沉", "水和木块", "没有天平读数"],
    deepStructure: [
      "密度仍是 m / V",
      "浮沉还需要和液体比较，并涉及排开液体",
    ],
    expectedModelId: "buoyancy-displaced-fluid",
    transferableRelations: [MODEL_RELATION_IDS.densityIsMassPerVolume],
    nonTransferableRelations: [
      MODEL_RELATION_IDS.densityAloneDoesNotExplainFloating,
    ],
    requiresConditionCheck: true,
  },
];
