import { ExperimentEvidenceKind, type ExperimentDefinition } from "@/types/physics-model";
import { MODEL_QUANTITY_IDS } from "./model";

const UPLP_EXPERIMENT_EVIDENCE = [
  {
    kind: ExperimentEvidenceKind.PREDICTION,
    required: true,
    notes: "学生必须先猜测像会怎样、光屏能不能接到，并写下理由。不能先看结果再改猜测。",
  },
  {
    kind: ExperimentEvidenceKind.INTERVENTION,
    required: true,
    notes: "学生主动改动物距站点或遮挡。OBSERVE 阶段的展示不算实验证据。",
  },
  {
    kind: ExperimentEvidenceKind.OBSERVED_RESULT,
    required: true,
    notes:
      "成像情形由 officialImagingState 给出，不能由 LLM 编造。不要把五种情况表当成学生已经建构的模型。",
  },
  {
    kind: ExperimentEvidenceKind.PREDICTION_VS_RESULT,
    required: true,
    notes: "学生对照猜测和结果。",
  },
  {
    kind: ExperimentEvidenceKind.REFLECTION,
    required: true,
    notes: "学生写下这次动手让自己看清了：光线是真的会聚，还是只有反向延长线相交。",
  },
] as const;

export const experiments: ExperimentDefinition[] = [
  {
    id: "compare-real-image-across-2f",
    question:
      "同一块凸透镜，物体从 2F 以外移到 2F 上，再移到 F 与 2F 之间。像会怎样变？光屏还能不能接到？先说清透镜和焦距没有换。",
    controllableVariables: ["objectStation", "screenAtImagePlane"],
    fixedVariables: ["focal-length", "thin-single-convex-lens"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.imageSizeRelation,
      MODEL_QUANTITY_IDS.imageDistance,
      MODEL_QUANTITY_IDS.screenReceivable,
    ],
    allowedOperations: [
      {
        id: "compare-real-image-across-2f",
        description: "保持同一块透镜，只改物距站点，比较 2F 两侧的实像。",
        variable: "objectStation",
        values: ["beyond-2f", "at-2f", "between-f-and-2f"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "probe-object-at-f",
    question:
      "物体正好放在焦点上。无论怎么移动光屏，能不能接到有限远的清晰像？为什么？不要把它说成普通的一种有限远成像。",
    controllableVariables: ["objectStation", "screenAtImagePlane"],
    fixedVariables: ["focal-length", "thin-single-convex-lens"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.rayMeetingMode,
      MODEL_QUANTITY_IDS.imageNature,
      MODEL_QUANTITY_IDS.screenReceivable,
    ],
    allowedOperations: [
      {
        id: "probe-object-at-f",
        description: "把物体放到焦点上，移动光屏寻找清晰像。",
        variable: "objectStation",
        values: ["at-f"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "probe-object-inside-f",
    question:
      "物体放到焦点以内。光屏还能不能接到像？透过透镜看，会看到什么样的像？这两个观察是不是一回事？",
    controllableVariables: ["objectStation", "screenAtImagePlane"],
    fixedVariables: ["focal-length", "thin-single-convex-lens"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.rayMeetingMode,
      MODEL_QUANTITY_IDS.imageNature,
      MODEL_QUANTITY_IDS.imageOrientation,
      MODEL_QUANTITY_IDS.screenReceivable,
    ],
    allowedOperations: [
      {
        id: "probe-object-inside-f",
        description: "把物体放到焦点以内，比较光屏和透过透镜看到的像。",
        variable: "objectStation",
        values: ["inside-f"],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
  {
    id: "cover-part-of-lens",
    question:
      "光屏已经接到清晰实像。遮住透镜的上半部分，像会少掉上半部分吗？还是整幅像还在、只是变暗？",
    controllableVariables: ["lensPartiallyCovered"],
    fixedVariables: ["objectStation", "focal-length", "thin-single-convex-lens"],
    predictedVariables: [
      MODEL_QUANTITY_IDS.imageNature,
      MODEL_QUANTITY_IDS.imageSizeRelation,
    ],
    allowedOperations: [
      {
        id: "cover-part-of-lens",
        description: "在能接到实像时遮住透镜一部分。",
        variable: "lensPartiallyCovered",
        values: [true],
      },
    ],
    expectedEvidence: [...UPLP_EXPERIMENT_EVIDENCE],
    informationGain: "high",
  },
];
