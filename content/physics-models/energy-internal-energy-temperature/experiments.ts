import { ExperimentEvidenceKind, type ExperimentDefinition } from "@/types/physics-model";
import { MODEL_QUANTITY_IDS } from "./model";

const UPLP_EXPERIMENT_EVIDENCE = [
  {
    kind: ExperimentEvidenceKind.PREDICTION,
    required: true,
    notes: "学生必须先猜测温度或能量状态会怎样变。OBSERVE 演示不能代替这一步。",
  },
  {
    kind: ExperimentEvidenceKind.INTERVENTION,
    required: true,
    notes: "学生主动改变能量进入或离开的条件。",
  },
  {
    kind: ExperimentEvidenceKind.OBSERVED_RESULT,
    required: true,
    notes: "结果由确定性物理规则给出，不能由 LLM 编造。",
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
    id: "more-energy-in-no-phase-change",
    question:
      "同一个系统、没有物态变化。如果进入系统的能量更多，温度会怎样变？为什么？",
    controllableVariables: ["energyInput"],
    fixedVariables: ["sameSystem", "noPhaseChange"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.internalEnergy,
    ],
    allowedOperations: [
      {
        id: "increase-energy-input",
        description: "增加进入系统的能量（例如更长加热时间或更大功率）。",
        variable: "energyInput",
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "medium",
  },
  {
    // Model-level boundary experiment. Scene 01 microwave physics must not
    // implement phase change unless a later request requires it. Production
    // Scene 01 evidences this boundary through ice TRANSFER and AI_OFF B.
    id: "energy-in-without-required-temperature-rise",
    question:
      "系统在吸热或有能量进入。温度是不是一定升高？什么时候不能这样推？",
    controllableVariables: ["energyInput"],
    fixedVariables: ["phaseChangePossible"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.internalEnergy,
    ],
    allowedOperations: [
      {
        id: "add-energy-near-phase-change",
        description: "在可能发生物态变化的情况下继续给系统能量。",
        variable: "energyInput",
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
];
