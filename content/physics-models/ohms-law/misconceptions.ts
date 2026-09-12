import type { Misconception } from "@/types/physics-model";
import { HintLevelId } from "@/types/physics-model";
import { TutorAction } from "@/types/ai";

export const misconceptions: Misconception[] = [
  {
    id: "ohm-M1",
    statement: "记住 I = U / R 就够了，不必先看哪个量相同。",
    diagnosticSignals: [
      "套公式就行",
      "电流等于电压除以电阻",
      "I=U/R就完了",
      "formula is enough",
      "just use I = U / R",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "如果电阻有没有变、电压有没有变你都没说清，这个式子还能直接比较电流吗？",
      },
    ],
  },
  {
    id: "ohm-M2",
    statement:
      "改变电压或电流会制造出新的电阻。R = U / I 被当成“U 和 I 生成 R”的证据，而不是同一个关系的变形。",
    diagnosticSignals: [
      "电压电流决定电阻",
      "电阻是算出来的",
      "U和I制造了R",
      "改变电压就换了一个电阻",
      "电流变了电阻就被重新制造",
      "分子变大所以电阻变大",
      "R is made from U and I",
      "current and voltage create resistance",
      "changing U manufactures R",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "换一个电压再测同一段导体，电阻一定跟着变吗？R = U / I 是在算它，还是在制造它？",
      },
    ],
  },
  {
    id: "ohm-M3",
    statement: "电流决定电压，或者电压沿着导线流过去。",
    diagnosticSignals: [
      "电流决定电压",
      "电压流过去",
      "谁决定谁",
      "current causes voltage",
      "voltage flows through the wire",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "电压说的是哪两端？电流说的是通过哪一段？它们是不是同一种量？",
      },
    ],
  },
  {
    id: "ohm-M4",
    statement: "电阻越大，电流一定越大；或者电阻就是电流的另一个名字。",
    diagnosticSignals: [
      "电阻大电流就大",
      "电阻就是电流",
      "更大电阻电流更大",
      "larger R larger I",
      "resistance is current",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "如果两端电压差不多，电阻更大，电流表读数会更大还是更小？",
      },
    ],
  },
  {
    id: "ohm-M5",
    statement: "电压越大电流一定越大，不必看电阻有没有变。",
    diagnosticSignals: [
      "电压大电流一定大",
      "不用看电阻",
      "larger U always larger I",
      "voltage alone decides current",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "电压变大的同时如果电阻也变了，还能只凭电压判断电流吗？",
      },
    ],
  },
  {
    id: "ohm-M6",
    statement: "只要电路里有电源，就一定有电流；断开时电压和电流是同一个“没电”。",
    diagnosticSignals: [
      "有电源就有电流",
      "断开就没电压也没电流",
      "开关断开全部是零",
      "open circuit means no voltage",
      "battery means current",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "开关断开时，电流表一定是零。电源两端还可能有电压吗？这两个量能合成一个“没电”吗？",
      },
    ],
  },
];
