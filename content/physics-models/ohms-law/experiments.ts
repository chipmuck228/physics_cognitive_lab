import { ExperimentEvidenceKind, type ExperimentDefinition } from "@/types/physics-model";
import { MODEL_QUANTITY_IDS } from "./model";

const UPLP_EXPERIMENT_EVIDENCE = [
  {
    kind: ExperimentEvidenceKind.PREDICTION,
    required: true,
    notes: "学生必须先猜测电流会怎样变，并写下理由。不能先看电流表再改猜测。",
  },
  {
    kind: ExperimentEvidenceKind.INTERVENTION,
    required: true,
    notes: "学生主动选择比较方式。OBSERVE 阶段的展示不算实验证据。",
  },
  {
    kind: ExperimentEvidenceKind.OBSERVED_RESULT,
    required: true,
    notes:
      "电流由 officialCurrentA 给出，不能由 LLM 编造。电压和电阻来自输入目录，不是把屏幕上的示例数字写成另一套物理真理。",
  },
  {
    kind: ExperimentEvidenceKind.PREDICTION_VS_RESULT,
    required: true,
    notes: "学生对照猜测和结果。",
  },
  {
    kind: ExperimentEvidenceKind.REFLECTION,
    required: true,
    notes: "学生写下这次动手让自己看清了：比较时哪个量要保持不变。",
  },
] as const;

export const experiments: ExperimentDefinition[] = [
  {
    id: "same-resistance-different-voltage",
    question:
      "同一个电阻两端的电压变大。电流会怎样？你为什么这样想？先说清哪个量没有变。",
    controllableVariables: ["comparisonMode", "selectedSourceVoltageId"],
    fixedVariables: ["resistance", "ohmicResistanceTreatedConstant", "circuitClosed"],
    predictedVariables: [MODEL_QUANTITY_IDS.current, MODEL_QUANTITY_IDS.voltage],
    allowedOperations: [
      {
        id: "compare-same-resistance-different-voltage",
        description: "保持同一个电阻，只改变它两端的电压。",
        variable: "comparisonMode",
        values: ["same-resistance-different-voltage"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "same-voltage-different-resistance",
    question:
      "两端电压可以看成相同，换了一个更大的电阻。电流会怎样？你为什么这样想？先说清哪个量没有变。",
    controllableVariables: ["comparisonMode", "selectedResistorId"],
    fixedVariables: ["voltage", "ohmicResistanceTreatedConstant", "circuitClosed"],
    predictedVariables: [MODEL_QUANTITY_IDS.current, MODEL_QUANTITY_IDS.resistance],
    allowedOperations: [
      {
        id: "compare-same-voltage-different-resistance",
        description: "保持两端电压可以看成相同，只更换电阻。",
        variable: "comparisonMode",
        values: ["same-voltage-different-resistance"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
];
