import { ExperimentEvidenceKind, type ExperimentDefinition } from "@/types/physics-model";
import { MODEL_QUANTITY_IDS } from "./model";

const UPLP_EXPERIMENT_EVIDENCE = [
  {
    kind: ExperimentEvidenceKind.PREDICTION,
    required: true,
    notes: "学生必须先猜测温度会怎样变，并写下理由。不能先看结果再改猜测。",
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
      "质量、温度变化和所需能量由确定性规则给出，不能由 LLM 编造。同样加热时间只是让能量输入可以看成相近，时间本身不是 Q。",
  },
  {
    kind: ExperimentEvidenceKind.PREDICTION_VS_RESULT,
    required: true,
    notes: "学生对照猜测和结果。",
  },
  {
    kind: ExperimentEvidenceKind.REFLECTION,
    required: true,
    notes: "学生写下这次动手让自己看清了哪个量要一起看。",
  },
] as const;

export const experiments: ExperimentDefinition[] = [
  {
    id: "same-mass-same-heating-different-material",
    question:
      "两份样品质量相同，用同样方式加热同样久——这只表示吸收的能量可以近似看成相同，不是时间等于能量。如果一种材料比热容更大，它的温度会怎样？为什么？",
    controllableVariables: ["comparisonMode", "selectedSampleId"],
    fixedVariables: ["mass", "heatingEnergy", "noPhaseChange"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.specificHeatCapacity,
    ],
    allowedOperations: [
      {
        id: "compare-same-mass-same-heating",
        description:
          "比较质量相同的水和沙子。同样加热时间只当作能量输入相近的近似，不要写成时间就是 Q。",
        variable: "comparisonMode",
        values: ["same-mass-same-heating"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "same-material-same-heating-different-mass",
    question:
      "同一种材料，同样加热时间只表示吸收的能量可以近似看成相同。如果一份质量明显更大，它的温度会怎样？为什么？",
    controllableVariables: ["comparisonMode", "sampleMass"],
    fixedVariables: ["material", "heatingEnergy", "noPhaseChange"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.mass,
    ],
    allowedOperations: [
      {
        id: "compare-same-material-different-mass",
        description:
          "比较同一种材料、质量不同的两份样品。同样加热时间只是能量相近的近似，不是能量本身。",
        variable: "comparisonMode",
        values: ["same-material-different-mass"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "same-material-same-mass-different-energy",
    question:
      "同一种材料、质量相同。如果这一次吸收的能量更多，温度变化会怎样？为什么？",
    controllableVariables: ["comparisonMode", "heatingEnergy"],
    fixedVariables: ["material", "mass", "noPhaseChange"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.heatEnergy,
    ],
    allowedOperations: [
      {
        id: "compare-same-sample-different-energy",
        description: "比较同一份样品吸收不同能量时的温度变化。",
        variable: "comparisonMode",
        values: ["same-sample-different-energy"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
];
