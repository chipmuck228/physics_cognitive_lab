import { ExperimentEvidenceKind, type ExperimentDefinition } from "@/types/physics-model";
import { MODEL_QUANTITY_IDS } from "./model";

const UPLP_EXPERIMENT_EVIDENCE = [
  {
    kind: ExperimentEvidenceKind.PREDICTION,
    required: true,
    notes: "学生必须先猜测质量和密度会怎样，并写下理由。只看外形不能代替这一步。",
  },
  {
    kind: ExperimentEvidenceKind.INTERVENTION,
    required: true,
    notes: "学生主动选择比较方式或切开样品。OBSERVE 阶段的展示不算实验证据。",
  },
  {
    kind: ExperimentEvidenceKind.OBSERVED_RESULT,
    required: true,
    notes:
      "质量、体积、密度由确定性规则给出，不能由 LLM 编造。切开实验还要对照切开前和切开后的 m / V。",
  },
  {
    kind: ExperimentEvidenceKind.PREDICTION_VS_RESULT,
    required: true,
    notes: "学生对照猜测和结果。",
  },
  {
    kind: ExperimentEvidenceKind.REFLECTION,
    required: true,
    notes: "学生写下这次动手让自己看清了什么。",
  },
] as const;

export const experiments: ExperimentDefinition[] = [
  {
    id: "same-volume-different-mass",
    question:
      "两块样品体积相同。如果一块明显更沉，它的密度会怎样？为什么？",
    controllableVariables: ["comparisonMode"],
    fixedVariables: ["volume", "temperature", "pressure"],
    predictedVariables: [MODEL_QUANTITY_IDS.mass, MODEL_QUANTITY_IDS.density],
    allowedOperations: [
      {
        id: "compare-same-volume-samples",
        description: "比较两块体积相同的样品的质量。",
        variable: "comparisonMode",
        values: ["same-volume"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "same-mass-different-volume",
    question:
      "两块样品质量相同。如果一块占的空间明显更大，它的密度会怎样？为什么？",
    controllableVariables: ["comparisonMode"],
    fixedVariables: ["mass", "temperature", "pressure"],
    predictedVariables: [MODEL_QUANTITY_IDS.volume, MODEL_QUANTITY_IDS.density],
    allowedOperations: [
      {
        id: "compare-same-mass-samples",
        description: "比较两块质量相同、体积不同的样品。",
        variable: "comparisonMode",
        values: ["same-mass"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "cut-uniform-sample",
    question:
      "把一块内部均匀的样品切成一半。这一半的密度会变吗？为什么？",
    controllableVariables: ["cutUniformSample"],
    fixedVariables: ["material", "uniformSample"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.mass,
      MODEL_QUANTITY_IDS.volume,
      MODEL_QUANTITY_IDS.density,
    ],
    allowedOperations: [
      {
        id: "cut-uniform-sample",
        description: "把均匀样品切成一半，再读取这一半的质量和体积。",
        variable: "cutUniformSample",
        values: [true],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
];
