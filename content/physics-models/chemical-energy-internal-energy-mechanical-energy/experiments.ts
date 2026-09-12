import { ExperimentEvidenceKind, type ExperimentDefinition } from "@/types/physics-model";
import { MODEL_QUANTITY_IDS } from "./model";

const UPLP_EXPERIMENT_EVIDENCE = [
  {
    kind: ExperimentEvidenceKind.PREDICTION,
    required: true,
    notes: "学生必须先猜测，并写下理由。初始观察播放不能代替这一步。",
  },
  {
    kind: ExperimentEvidenceKind.INTERVENTION,
    required: true,
    notes: "学生主动改变一个条件。OBSERVE 阶段的自动演示不算实验证据。",
  },
  {
    kind: ExperimentEvidenceKind.OBSERVED_RESULT,
    required: true,
    notes: "结果由确定性物理引擎给出，不能由 LLM 编造。",
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
    id: "ignition-energy-release",
    question:
      "如果压缩完成后没有发生正常燃烧，还会不会出现正常的主要动力输出？为什么？",
    controllableVariables: ["combustionEnabled"],
    fixedVariables: ["pistonCanMove", "compressionCompleted"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.workingGasState,
      MODEL_QUANTITY_IDS.pistonMotion,
      MODEL_QUANTITY_IDS.mechanicalEnergy,
    ],
    allowedOperations: [
      {
        id: "disable-combustion",
        description: "压缩完成后，把燃烧关掉。",
        variable: "combustionEnabled",
        values: [false],
      },
      {
        id: "enable-combustion",
        description: "压缩完成后，让燃烧正常发生。",
        variable: "combustionEnabled",
        values: [true],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "immovable-mechanical-system",
    question:
      "燃料正常燃烧，但高温气体无法推动机械部件运动。这个装置还能按原来的方式输出机械能吗？",
    controllableVariables: ["pistonCanMove"],
    fixedVariables: ["combustionEnabled"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.workingGasInternalEnergy,
      MODEL_QUANTITY_IDS.pistonMotion,
      MODEL_QUANTITY_IDS.mechanicalEnergy,
    ],
    allowedOperations: [
      {
        id: "lock-piston",
        description: "让活塞或机械部件不能运动。",
        variable: "pistonCanMove",
        values: [false],
      },
      {
        id: "unlock-piston",
        description: "让活塞可以运动。",
        variable: "pistonCanMove",
        values: [true],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
];
