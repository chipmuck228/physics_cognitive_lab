import type { Misconception } from "@/types/physics-model";
import { HintLevelId } from "@/types/physics-model";
import { TutorAction } from "@/types/ai";

export const misconceptions: Misconception[] = [
  {
    id: "ceime-M1",
    statement: "做功冲程产生了能量。",
    diagnosticSignals: [
      "做功冲程产生了能量",
      "做功冲程制造能量",
      "能量是做功冲程产生的",
      "power stroke creates energy",
      "creates energy",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "先别急着给结论。机械运动的能量，是从哪一步来的？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.CHALLENGE,
        prompt: "如果能量是冲程“产生”的，那燃料不燃烧，这一步还能不能照常发生？",
      },
    ],
  },
  {
    id: "ceime-M2",
    statement: "四个冲程都会把内能转化为机械能。",
    diagnosticSignals: [
      "四个冲程都会转化",
      "每个冲程都对外做功",
      "吸气也把内能变成机械能",
      "all four strokes convert",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "四个冲程里，你实际看见活塞被气体有力地推出去，是哪一次？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.HINT,
        prompt: "有的冲程是在准备条件，有的冲程才完成“气体做功”。它们不是同一件事。",
      },
    ],
  },
  {
    id: "ceime-M3",
    statement: "燃烧会直接使曲轴转动，中间没有气体做功过程。",
    diagnosticSignals: [
      "燃烧直接让曲轴转",
      "燃烧直接推动曲轴",
      "化学能直接变成转动",
      "combustion directly turns",
      "没有气体做功",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.ASK,
        prompt: "燃烧发生之后，先是什么发生了变化？曲轴是被谁推着动的？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.CHALLENGE,
        prompt: "如果气体不能推动活塞，燃烧还在，曲轴还会不会按原来的方式转？",
      },
    ],
  },
  {
    id: "ceime-M4",
    statement: "压缩冲程就是发动机对外做功的主要冲程。",
    diagnosticSignals: [
      "压缩冲程对外做功",
      "压缩才是主要做功",
      "compression stroke does the work",
      "压缩冲程输出机械能",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "压缩的时候，是气体在推机械系统，还是机械系统在压缩气体？",
      },
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.HINT,
        prompt: "对外输出机械能，要看气体有没有对可运动部件做功。",
      },
    ],
  },
  {
    id: "ceime-M5",
    statement: "只要温度升高，就一定能输出机械能。",
    diagnosticSignals: [
      "温度升高就一定能输出机械能",
      "变热就一定能推动",
      "只要热就能做功",
      "temperature rise means mechanical output",
    ],
    severity: "high",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H3,
        action: TutorAction.ASK,
        prompt: "温度升高说明什么可能变了？这和“已经对机械系统做功”是不是同一件事？",
      },
      {
        hintLevel: HintLevelId.H4,
        action: TutorAction.CHALLENGE,
        prompt: "气体再热，如果推不动部件，还能不能按原来的方式输出机械能？"
      },
    ],
  },
  {
    id: "ceime-M6",
    statement: "记住四个冲程的名字，就等于理解发动机的物理模型。",
    diagnosticSignals: [
      "记住四个冲程就懂了",
      "吸气压缩做功排气就是模型",
      "背出冲程就理解了",
      "four strokes are the model",
    ],
    severity: "medium",
    recommendedInterventions: [
      {
        hintLevel: HintLevelId.H2,
        action: TutorAction.ASK,
        prompt: "如果把四个名字都记住了，你能说明机械能是从燃料的哪一种能量一步步来的吗？",
      },
      {
        hintLevel: HintLevelId.H5,
        action: TutorAction.HINT,
        prompt: "冲程名字是这个装置怎么运转的步骤。还要能说出：化学能、内能变化、做功、机械能，哪一步都不能少。",
      },
    ],
  },
];
