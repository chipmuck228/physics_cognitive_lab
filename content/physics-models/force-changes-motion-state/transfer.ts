import { MODEL_ID, MODEL_RELATION_IDS } from "./model";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const transferTargets: TransferTarget[] = [
  {
    id: "near-bicycle-speeding-up",
    level: "near",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "同学骑车，沿平直公路越蹬越快。路面可以看成很平。你觉得车子为什么会越来越快？",
    surfaceFeatures: ["自行车", "车轮", "蹬车", "公路"],
    deepStructure: [
      "物体已有运动状态",
      "水平合力与运动方向相同",
      "运动状态改变：速度变大",
    ],
    expectedModelId: MODEL_ID,
  },
  {
    id: "medium-ball-opposite-force",
    level: "medium",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "草地上海上滚来一个球。同学迎面挡了一下，球明显变慢，后来还往回滚了一点。这里没有小车轨道。你还能用刚才的想法解释吗？",
    surfaceFeatures: ["球", "草地", "没有轨道", "迎面挡住"],
    deepStructure: [
      "物体已有运动状态",
      "合力方向与运动方向相反",
      "运动状态改变：速度变小，可能改变方向",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "far-hover-constant-velocity",
    level: "far",
    transferMode: TransferMode.BOUNDARY_CONTRAST,
    scenario:
      "气垫导轨上，滑块几乎不受摩擦。它已经在向右匀速滑动，这时水平方向不再给它推力，看起来也没有明显的拉力。哪些想法还能用？哪些不能直接搬过来？",
    surfaceFeatures: ["气垫导轨", "滑块", "几乎无摩擦", "没有小车外壳"],
    deepStructure: [
      "水平合力为零",
      "运动状态保持不变",
      "原来在运动的物体不必立刻静止",
    ],
    expectedModelId: "force-equilibrium",
    transferableRelations: [MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged],
    nonTransferableRelations: [
      MODEL_RELATION_IDS.sameDirectionIncreasesSpeed,
      MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed,
    ],
    requiresConditionCheck: true,
  },
];
