import { ExperimentEvidenceKind, type ExperimentDefinition } from "@/types/physics-model";
import { MODEL_QUANTITY_IDS } from "./model";

const UPLP_EXPERIMENT_EVIDENCE = [
  {
    kind: ExperimentEvidenceKind.PREDICTION,
    required: true,
    notes: "学生必须先猜测运动状态会怎样变，并写下理由。初始观察播放不能代替这一步。",
  },
  {
    kind: ExperimentEvidenceKind.INTERVENTION,
    required: true,
    notes: "学生主动改变合力条件。OBSERVE 阶段的自动演示不算实验证据。",
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
    id: "force-with-motion",
    question:
      "小车已经在向右运动。如果再给它一个向右的水平力，它的运动快慢会怎样变？为什么？",
    controllableVariables: ["netForce"],
    fixedVariables: ["initialMotionState", "frictionOmitted"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.speed,
      MODEL_QUANTITY_IDS.motionStateChange,
    ],
    allowedOperations: [
      {
        id: "apply-same-direction-force",
        description: "给正在向右运动的小车施加向右的水平合力。",
        variable: "netForce",
        values: ["right"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "force-against-motion",
    question:
      "小车仍在向右运动。如果给它一个向左的水平力，它的运动状态会怎样变？为什么？",
    controllableVariables: ["netForce"],
    fixedVariables: ["initialMotionState", "frictionOmitted"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.speed,
      MODEL_QUANTITY_IDS.motionDirection,
      MODEL_QUANTITY_IDS.motionStateChange,
    ],
    allowedOperations: [
      {
        id: "apply-opposite-direction-force",
        description: "给正在向右运动的小车施加向左的水平合力。",
        variable: "netForce",
        values: ["left"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "zero-net-force-while-moving",
    question:
      "小车已经在向右运动。如果水平方向的合力变为零，它会不会立刻停下来？为什么？",
    controllableVariables: ["netForce"],
    fixedVariables: ["initialMotionState", "frictionOmitted"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.speed,
      MODEL_QUANTITY_IDS.motionDirection,
      MODEL_QUANTITY_IDS.motionStateChange,
    ],
    allowedOperations: [
      {
        id: "remove-net-force",
        description: "让已经在运动的小车水平合力为零。",
        variable: "netForce",
        values: ["zero"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
];
