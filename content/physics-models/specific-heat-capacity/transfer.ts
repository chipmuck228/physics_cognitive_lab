import { MODEL_ID, MODEL_RELATION_IDS } from "./model";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const transferTargets: TransferTarget[] = [
  {
    id: "near-two-pots-water-and-oil",
    level: "near",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "厨房里两口一样的锅，一份水一份食用油，质量差不多，用同样的炉火加热同样久。为什么油往往先显得更烫？",
    surfaceFeatures: ["锅", "厨房", "水和油", "炉火"],
    deepStructure: [
      "质量可以看成相同",
      "吸收的能量可以看成相近",
      "比热容不同则 ΔT 不同",
    ],
    expectedModelId: MODEL_ID,
  },
  {
    id: "medium-coastal-vs-inland",
    level: "medium",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "夏天海边和内陆都晒了一天。海边昼夜温差往往更小。没有课堂上的沙子盘，刚才的 Q、m、c、ΔT 还能用吗？哪些想法不能直接搬过来？不要用风力、季节或整套气候去代替比热容。",
    surfaceFeatures: ["海边", "内陆", "昼夜", "不是实验室杯子"],
    deepStructure: [
      "水的比热容更大",
      "同样能量下温度变化更小",
      "要同时看物质的量和比热容",
      "不能迁移：辐射、风、湿度、季节不是这个模型",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "far-car-cooling-water",
    level: "far",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "汽车水箱里常用水来带走发动机的热。有人说随便什么液体都一样。哪些想法还能用？哪些不能直接搬过来？不要用流水、散热器形状去代替比热容。",
    surfaceFeatures: ["汽车", "水箱", "发动机", "不是沙子"],
    deepStructure: [
      "同样质量升高同样温度，c 更大则带走的能量更多",
      "Q = c m ΔT 仍可用",
      "不能迁移：流动、散热器结构、传热快慢不是这个模型",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "far-ice-water-heated",
    level: "far",
    transferMode: TransferMode.BOUNDARY_CONTRAST,
    scenario:
      "一杯冰水混合物还在熔化，继续用同样的加热器加热。温度计停在 0℃。哪些想法还能用？哪些不能直接搬过来？",
    surfaceFeatures: ["冰水", "熔化", "温度不变", "还在加热"],
    deepStructure: [
      "仍可能有能量进入",
      "没有 ΔT 时不能用 Q = c m ΔT 写完这段过程",
      "需要物态变化模型",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "partial-microwave-bread-already-hot",
    level: "exam",
    transferMode: TransferMode.PARTIAL_STRUCTURE,
    scenario:
      "微波炉里的面包变热了。有人说：这就是比热容公式，所以不必再谈能量进入和内能变化。哪些关系可以迁移？哪些不能？",
    surfaceFeatures: ["微波炉", "面包", "Scene 01 的表面"],
    deepStructure: [
      "温度变化仍可能和吸收的能量、质量、材料有关",
      "能量进入→内能变化→温度变化仍是另一条模型",
    ],
    expectedModelId: "energy-internal-energy-temperature",
    transferableRelations: [MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT],
    nonTransferableRelations: [MODEL_RELATION_IDS.phaseChangeNeedsAnotherModel],
    requiresConditionCheck: true,
  },
];
