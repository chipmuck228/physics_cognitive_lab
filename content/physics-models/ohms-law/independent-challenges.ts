import { MODEL_ID } from "./model";
import type { IndependentChallenge } from "@/types/physics-model";

export const independentChallenges: IndependentChallenge[] = [
  {
    id: "ai-off-unfamiliar-toy-motor-resistor",
    scenario:
      "一个玩具里有一节电池和一个单独的电阻元件，看起来不像课堂上的实验板。先换一节电压更高的电池，再换一个电阻更大的元件。",
    unfamiliarity: "medium",
    question:
      "电流会怎样想？请说明理由。不要只写 I = U / R，也不要只写“电压大电流就大”或“电阻大电流就大”。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      {
        id: "identifiesVoltage",
        description: "指出比较时用到了电压。",
      },
      {
        id: "identifiesResistance",
        description: "指出比较时用到了电阻。",
      },
      {
        id: "identifiesCurrent",
        description: "指出要求的或要比较的是电流。",
      },
      {
        id: "checksControlledComparison",
        description: "分别说明：换电池时电阻可以看成不变；换电阻时电压可以看成不变。",
      },
      {
        id: "usesCurrentVoltageResistanceRelation",
        description: "用 I、U、R 的关系解释，而不是只背公式。",
      },
      {
        id: "rejectsFormulaAlone",
        description: "只写 I = U / R 不算完成。",
      },
    ],
    llmAllowed: false,
  },
  {
    id: "ai-off-condition-r-not-made-by-division",
    scenario:
      "有人测出一段导体两端的电压和通过它的电流，用 R = U / I 算出电阻。然后只把电压调高。电路仍闭合，这段导体仍可看成同一个电阻。有人说：电压变了，电阻一定变成一个新的电阻，因为电阻是用电压除以电流算出来的。",
    unfamiliarity: "high",
    question:
      "只把电压调高，是不是就制造出了一个新的电阻？R = U / I 是在计算这段导体已经具有的电阻，还是电压和电流在制造电阻？说明原因。不要谈材料内部结构或电阻率。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      {
        id: "identifiesResistance",
        description: "把电阻说成这段导体的属性，不是被 U、I 重新制造出来的量。",
      },
      {
        id: "usesCurrentVoltageResistanceRelation",
        description: "承认 R = U / I 与 I = U / R 是同一个关系的变形。",
      },
      {
        id: "rejectsResistanceCreatedByUI",
        description:
          "拒绝“改变 U 或 I 就制造了新电阻”。包括“电压变了电阻就变了，因为 R = U / I”和它的算式口号“分子变大所以电阻变大”。",
      },
      {
        id: "checksOhmicCondition",
        description:
          "指出在本模型边界内电阻仍可看成不变，电压变大则电流变大。不要引入电阻率或微观结构。",
      },
    ],
    llmAllowed: false,
  },
];
