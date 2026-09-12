import type { Misconception } from "@/types/physics-model";
import { HintLevelId } from "@/types/physics-model";
import { TutorAction } from "@/types/ai";

export const misconceptions: Misconception[] = [
  {
    id: "dmv-M1",
    statement: "更大的物体密度一定更大。",
    diagnosticSignals: [
      "更大密度就更大",
      "看起来大密度就大",
      "体积大密度就大",
      "bigger means denser",
      "larger object has larger density",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "你比较的是“占了多少空间”，还是“同样多的空间里有多重”？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "如果两样东西质量相同，更大的那一块密度会怎样？",
      },
    ],
  },
  {
    id: "dmv-M2",
    statement: "更重的物体密度一定更大。质量变大，所以密度一定变大。",
    diagnosticSignals: [
      "更重密度就更大",
      "质量大数据就大",
      "谁沉密度谁大",
      "质量变大所以密度一定变大",
      "质量变大，所以密度一定变大",
      "heavier means denser",
      "more mass means more density",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "更重和密度，中间还差了哪一个量？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "只知道质量变大了，信息够不够断定密度变大？体积呢？",
      },
    ],
  },
  {
    id: "dmv-M3",
    statement: "密度就是体积的另一个说法。",
    diagnosticSignals: [
      "密度就是体积",
      "密度等于占多少空间",
      "density is volume",
      "density means size",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "体积说的是占多少空间。密度还用到了哪一个量？",
      },
    ],
  },
  {
    id: "dmv-M4",
    statement: "把均匀物体切开，密度会变小。",
    diagnosticSignals: [
      "切开密度变小",
      "变小了密度就变小",
      "切一半密度一半",
      "cutting lowers density",
      "smaller piece is less dense",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.ASK,
        prompt: "切开以后，质量和体积是不是只变了一个？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.HINT,
        prompt: "如果两个量按同样的比例变，它们的比会怎样？",
      },
    ],
  },
  {
    id: "dmv-M5",
    statement: "密度大就一定会沉；密度小就一定会浮。",
    diagnosticSignals: [
      "密度大就会沉",
      "密度小就会浮",
      "密度能直接解释浮沉",
      "denser must sink",
      "density explains floating",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "空心的铁盒有时能浮。这还只是“铁的密度”一件事吗？",
      },
    ],
  },
  {
    id: "dmv-M6",
    statement: "外形体积就是材料体积，空心物体也可以直接当实心来算材料密度。",
    diagnosticSignals: [
      "外形多大密度就按多大算",
      "空心也用外表体积当材料体积",
      "outer size is material volume",
      "hollow uses outside volume as material volume",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.ASK,
        prompt: "你用的体积，是材料真正占的空间，还只是外面看起来的大小？",
      },
    ],
  },
];
