import { MODEL_ID, MODEL_RELATION_IDS } from "./model";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const transferTargets: TransferTarget[] = [
  {
    id: "near-projector-real-enlarged",
    level: "near",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "教室里用一块凸透镜把幻灯片投到远处幕布上。幻灯片在焦点以外、二倍焦距以内。幕布上会出现什么样的像？不要只写“这也有凸透镜，所以一样”。",
    surfaceFeatures: ["投影仪", "幻灯片", "幕布", "不是光具座蜡烛"],
    deepStructure: [
      "f < u < 2f",
      "出射光线真正会聚",
      "另一侧成倒立、放大的实像",
      "幕布必须放在像的位置才能接到",
    ],
    expectedModelId: MODEL_ID,
  },
  {
    id: "far-magnifying-glass-virtual",
    level: "far",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "用放大镜看一枚邮票，邮票在焦点以内。透过透镜看到什么？把白纸放在“像应该在的地方”能不能接到这个像？不要只写“这也是凸透镜”。",
    surfaceFeatures: ["放大镜", "邮票", "手持", "没有光具座"],
    deepStructure: [
      "u < f",
      "出射光线发散，反向延长线相交",
      "与物体同侧成正立、放大的虚像",
      "光屏接不到虚像",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "medium-camera-real-reduced",
    level: "medium",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "简易照相机把远处景物成像在感光面上。哪些想法还能用？不要只因为“也有屏”就当成投影仪。",
    surfaceFeatures: ["照相机", "感光面", "远处景物"],
    deepStructure: [
      "u > 2f",
      "出射光线真正会聚",
      "另一侧成倒立、缩小的实像",
      "感光面是接收器，不是像本身",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "partial-eye-retina-receives-real-image",
    level: "far",
    transferMode: TransferMode.PARTIAL_STRUCTURE,
    scenario:
      "有人说眼睛就是一台凸透镜照相机，所以 Scene 07 的整套五种情况和调节晶状体都要一起搬过来。哪些关系可以留下？哪些不能变成新的 primary？",
    surfaceFeatures: ["眼睛", "晶状体", "视网膜", "看东西"],
    deepStructure: [
      "视网膜可以看成接收实像的屏",
      "看清需要光线真正会聚在接收面上",
      "不能迁移：调节焦距的完整课程、两眼光学、大脑把倒立像看成正立",
    ],
    expectedModelId: MODEL_ID,
    transferableRelations: [
      MODEL_RELATION_IDS.actualConvergenceMakesRealImage,
      MODEL_RELATION_IDS.realImageCanBeReceivedOnScreen,
    ],
    nonTransferableRelations: [
      MODEL_RELATION_IDS.objectCloserTowardFMakesFartherLargerRealImage,
      MODEL_RELATION_IDS.virtualImageCannotBeReceivedOnScreen,
    ],
    requiresConditionCheck: true,
  },
  {
    id: "boundary-plane-mirror-is-not-convex-lens",
    level: "exam",
    transferMode: TransferMode.BOUNDARY_CONTRAST,
    scenario:
      "平面镜前也能看到像。有人说：只要是成像，就用凸透镜的 F 和 2F 去套。哪些想法不能直接搬过来？",
    surfaceFeatures: ["平面镜", "正立虚像", "也有像"],
    deepStructure: [
      "平面镜成像不是凸透镜的会聚/反向延长结构",
      "F 和 2F 不是平面镜的标志位置",
      "需要换到 plane-mirror-imaging",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
];
