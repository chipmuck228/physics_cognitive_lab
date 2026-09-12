import type { Misconception } from "@/types/physics-model";
import { HintLevelId } from "@/types/physics-model";
import { TutorAction } from "@/types/ai";

export const misconceptions: Misconception[] = [
  {
    id: "shc-M1",
    statement: "谁更烫，谁吸收的能量一定更多。温度高就是热量多。",
    diagnosticSignals: [
      "更烫能量就更多",
      "温度高就是热多",
      "谁烫谁吸热多",
      "hotter means more heat",
      "temperature is heat",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "温度说的是有多热。吸收的能量还用到了哪几个量？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "只知道温度升了，信息够不够断定它吸收的能量一定更多？质量和材料呢？",
      },
    ],
  },
  {
    id: "shc-M2",
    statement: "加热时间相同，温度一定升得一样。",
    diagnosticSignals: [
      "加热一样久温度就一样",
      "同样加热一定同样烫",
      "时间相同升温相同",
      "same heating time same temperature rise",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "加热时间相同，是不是已经保证材料和质量都相同？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "同样加热时，水和沙子为什么可以升得不一样？",
      },
    ],
  },
  {
    id: "shc-M3",
    statement: "质量越大，温度一定升得越高。",
    diagnosticSignals: [
      "质量大升温一定多",
      "东西越多越容易烫",
      "more mass higher temperature",
      "bigger sample gets hotter",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "同样多的能量分给更多的物质，每一份升高的温度会怎样？",
      },
    ],
  },
  {
    id: "shc-M4",
    statement: "比热容就是物体有多热，或者就是温度的另一个名字。",
    diagnosticSignals: [
      "比热容就是温度",
      "比热容就是有多热",
      "specific heat is temperature",
      "c means how hot",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "温度是现在的读数。比热容还要和哪个量、哪段变化一起看？",
      },
    ],
  },
  {
    id: "shc-M5",
    statement: "记住 Q = c m ΔT 就可以了，不必先看哪个量相同。",
    diagnosticSignals: [
      "套公式就行不用看条件",
      "直接算不用控制变量",
      "formula is enough without controls",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "如果质量和吸收的能量都不知道是否相同，这个式子还能直接比较谁更烫吗？",
      },
    ],
  },
  {
    id: "shc-M6",
    statement: "只要在加热，温度就一定会升高。",
    diagnosticSignals: [
      "加热温度一定升高",
      "吸热就一定升温",
      "heating always raises temperature",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "冰水混合物还在熔化时，继续加热，温度计一定往上走吗？",
      },
    ],
  },
];
