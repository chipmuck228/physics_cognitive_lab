import type { Misconception } from "@/types/physics-model";
import { HintLevelId } from "@/types/physics-model";
import { TutorAction } from "@/types/ai";

export const misconceptions: Misconception[] = [
  {
    id: "cli-M1",
    statement: "像就在透镜上，或者像贴在玻璃里。",
    diagnosticSignals: [
      "像在透镜上",
      "像贴在玻璃里",
      "透镜就是像",
      "image is on the lens",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "像到光心的距离和透镜本身是同一个位置吗？光屏要放到透镜上才能接到实像吗？",
      },
    ],
  },
  {
    id: "cli-M2",
    statement: "实像就是像长在光屏里面，光屏本身就是像。",
    diagnosticSignals: [
      "实像在光屏里面",
      "光屏就是像",
      "像是屏做出来的",
      "real image lives inside the screen",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "光屏挪开一点，像的位置跟着光屏走吗？还是只是变模糊？",
      },
    ],
  },
  {
    id: "cli-M3",
    statement: "虚像也可以用光屏接到。",
    diagnosticSignals: [
      "虚像也能投到屏上",
      "放大镜的像可以接到",
      "virtual image on a screen",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "这次透镜后的光线是真的会聚，还是只有反向延长线相交？光屏能接到哪一种？",
      },
    ],
  },
  {
    id: "cli-M4",
    statement: "物体靠近透镜，像一定也靠近透镜。",
    diagnosticSignals: [
      "物体近像就近",
      "移近物体像跟着过来",
      "closer object closer image",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "物体还在焦点以外时往透镜靠近，光屏要往近处移还是往更远处才能再清晰？",
      },
    ],
  },
  {
    id: "cli-M5",
    statement: "物体离透镜越近，像一定越小。",
    diagnosticSignals: [
      "越近越小",
      "靠近就缩小",
      "closer object smaller image",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "从 2F 以外移到 F 与 2F 之间，像是变小了还是变大了？",
      },
    ],
  },
  {
    id: "cli-M6",
    statement: "F 和 2F 只是要背的记号，跟成像没有结构关系。",
    diagnosticSignals: [
      "就是背五种情况",
      "F和2F只是记号",
      "just memorize F and 2F",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "物体在 F 的哪一侧，透镜后的光线会真的会聚吗？2F 帮你判断的是什么？",
      },
    ],
  },
  {
    id: "cli-M7",
    statement: "遮住透镜一部分，像对应的那一部分就会消失。",
    diagnosticSignals: [
      "遮上面像就少上面",
      "透镜是拼图",
      "covering removes part of the image",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "遮住一半以后，光屏上的像是缺了一块，还是整幅还在、只是暗了？",
      },
    ],
  },
  {
    id: "cli-M8",
    statement: "光屏上看不到像，就等于没有像。",
    diagnosticSignals: [
      "屏上没有就没有像",
      "接不到等于不成像",
      "no screen image means no image",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "光屏接不到的时候，透过透镜还可能看到像吗？还是光线在有限远处根本不相交？",
      },
    ],
  },
  {
    id: "cli-M9",
    statement: "物在焦点上也会成一个普通的有限远的像。",
    diagnosticSignals: [
      "在F上也有像",
      "像在很远但仍是普通成像",
      "u = f is an ordinary image",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "物正好在 F 上时，出射光线还会交在某一个有限远的点吗？",
      },
    ],
  },
  {
    id: "cli-M10",
    statement: "正立/倒立和实像/虚像是同一件事。",
    diagnosticSignals: [
      "倒立就是实像的另一个名字",
      "正立就是虚像",
      "upright means virtual",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "实像说的是光线有没有真的会聚，倒立说的是像的朝向。它们为什么常常一起出现，却不是同一个性质？",
      },
    ],
  },
];
