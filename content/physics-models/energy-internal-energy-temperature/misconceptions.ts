import type { Misconception } from "@/types/physics-model";
import { HintLevelId } from "@/types/physics-model";
import { TutorAction } from "@/types/ai";

export const misconceptions: Misconception[] = [
  {
    id: "eiet-M1",
    statement: "热是储存在物体里的一种东西。",
    diagnosticSignals: [
      "面包里面的热更多了",
      "热量装在里面",
      "heat stored inside",
      "热像东西一样存在物体里",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "你能直接看到“热”装在面包里吗？你实际看见或量到的是什么？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "如果热不是一种东西，那改变的是哪个可以观察的量？",
      },
    ],
  },
  {
    id: "eiet-M2",
    statement: "物体吸收能量后，温度一定升高。",
    diagnosticSignals: [
      "吸收能量就一定会升温",
      "能量进来温度就必须升高",
      "energy in means temperature must rise",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "能量进来了，一定只能表现为温度升高吗？还有没有别的可能？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.HINT,
        prompt: "先分清：内能变了，和温度一定变，是不是同一句话。",
      },
    ],
  },
  {
    id: "eiet-M3",
    statement: "温度更高的物体，总内能一定更大。",
    diagnosticSignals: [
      "更热就一定内能更大",
      "100度一定比50度内能多",
      "hotter means more internal energy",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.ASK,
        prompt: "只知道温度，你还缺什么，才能比较两个物体的内能？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.HINT,
        prompt: "温度高不等于总内能一定大。还要看是不是同一个系统。",
      },
    ],
  },
  {
    id: "eiet-M4",
    statement: "温度、热和内能是同一件事。",
    diagnosticSignals: [
      "温度升高因为热增加了",
      "内能就是温度",
      "temperature is energy",
      "热就是内能",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "你说的“热”是进来的过程，还是物体现在的状态？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "温度计读数、能量进出、系统的内能，能用同一个词代替吗？",
      },
    ],
  },
  {
    id: "eiet-M5",
    statement: "微波炉在面包里面制造出热，这就是要学的物理模型。",
    diagnosticSignals: [
      "微波炉制造热量",
      "微波本身就是解释",
      "microwave creates heat inside",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "不讲微波炉怎么工作，你还能说出面包的什么量发生了变化吗？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.HINT,
        prompt: "微波炉是这个现象的装置。要抓住的是能量进出、内能和温度的关系。",
      },
    ],
  },
];
