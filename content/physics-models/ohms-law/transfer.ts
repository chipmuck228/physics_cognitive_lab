import { MODEL_ID, MODEL_RELATION_IDS } from "./model";
import { TransferMode, type TransferTarget } from "@/types/physics-model";

export const transferTargets: TransferTarget[] = [
  {
    id: "near-heating-wire-one-resistor",
    level: "near",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "一段电热丝接在电池两端，可以看成一个电阻。电池电压变了，或者换了一段更细、电阻更大的电热丝。电流会怎样想？不要只写 I = U / R。",
    surfaceFeatures: ["电热丝", "加热", "不是课堂上的色环电阻"],
    deepStructure: [
      "仍是一个电阻上的 I、U、R",
      "R 不变时 U 更大则 I 更大",
      "U 不变时 R 更大则 I 更小",
    ],
    expectedModelId: MODEL_ID,
  },
  {
    id: "medium-exam-diagram-one-resistor",
    level: "medium",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "试卷上的电路图画法不同，只有一个待研究的电阻，电压和电阻标在图上。没有课堂上的滑动选择器。哪些想法还能用？不要只因为“也是电路图”就写出公式。",
    surfaceFeatures: ["试卷电路图", "符号画法不同", "没有实验室台面"],
    deepStructure: [
      "U 是该电阻两端电压",
      "I 是通过该电阻的电流",
      "比较前要说明 R 或 U 哪个不变",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "far-flashlight-cell-and-resistor",
    level: "far",
    transferMode: TransferMode.FULL_MODEL,
    scenario:
      "手电筒里一节电池和一个小电阻元件连成简单回路。换一节电压不同的电池，或换一个电阻。哪些关系还能用？不要用灯泡亮度、电功率或串并联去代替 I、U、R。",
    surfaceFeatures: ["手电筒", "电池", "生活用品"],
    deepStructure: [
      "一个电阻元件上的关系仍是 I = U / R",
      "必须说出控制的是 U 还是 R",
      "不能迁移：亮度、电功率、多灯串并联不是这个模型",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "far-filament-lamp-not-constant-r",
    level: "far",
    transferMode: TransferMode.BOUNDARY_CONTRAST,
    scenario:
      "小灯泡两端电压增大，灯丝明显更亮更热。有人说电压加倍，电流一定加倍，因为 I = U / R。哪些想法还能用？哪些不能直接搬过来？",
    surfaceFeatures: ["小灯泡", "变亮", "灯丝发热"],
    deepStructure: [
      "I、U、R 仍是三个不同的量",
      "R 随温度明显变化时，不能再用固定 R 说 I 与 U 成正比",
      "需要先检查电阻是否可以看成不变",
    ],
    expectedModelId: MODEL_ID,
    requiresConditionCheck: true,
  },
  {
    id: "partial-ammeter-is-not-series-circuit-course",
    level: "exam",
    transferMode: TransferMode.PARTIAL_STRUCTURE,
    scenario:
      "电路里电流表和电阻串联。有人说：既然有串联，就要改学 series-circuit，欧姆定律不够了。哪些关系可以留下？哪些不能变成新的 primary？",
    surfaceFeatures: ["电流表", "串联接法", "仪表"],
    deepStructure: [
      "电流表串联是为了读出通过该电阻的 I",
      "这是测量连接，不是把 series-circuit 升级成学习目标",
    ],
    expectedModelId: MODEL_ID,
    transferableRelations: [MODEL_RELATION_IDS.currentEqualsVoltageOverResistance],
    nonTransferableRelations: [MODEL_RELATION_IDS.nonOhmicNeedsAnotherCondition],
    requiresConditionCheck: true,
  },
];
