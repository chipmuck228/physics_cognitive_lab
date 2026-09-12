import { MODEL_ID } from "./model";
import type { ExamPattern } from "@/types/physics-model";

export const examPatterns: ExamPattern[] = [
  {
    id: "exam-temperature-is-not-internal-energy",
    format: "multiple-choice",
    representation: "文字判断：温度、热、内能是不是同一件事",
    testedModel: MODEL_ID,
    difficulty: "basic",
    requiredCognitiveActions: ["C3", "C4", "C9"],
    stem: "物体温度升高了。下面哪一句最合适？",
    representationOptions: [
      "温度、热和内能是不是同一件事",
      "物体摸起来热不热",
      "是不是微波炉",
      "题目有没有图",
    ],
    modelOptions: [
      "温度升高说明内能可能发生了变化，但温度不是内能",
      "温度就是内能",
      "热是装在物体里的东西",
    ],
    options: [
      "温度升高，可以说明内能可能发生了变化；温度不是内能。",
      "温度升高，就是内能这个词的另一种说法。",
      "温度升高，是因为热量像东西一样被装进物体。",
      "更热的物体，总内能一定比任何更凉的物体都大。",
    ],
    correctAnswer: "温度升高，可以说明内能可能发生了变化；温度不是内能。",
    commonDistractors: [
      "温度升高，就是内能这个词的另一种说法。",
      "温度升高，是因为热量像东西一样被装进物体。",
    ],
    requiredReasoning: [
      "区分温度和内能",
      "不把热说成储存物",
    ],
    reasoningPrompt: "指出哪两个量不能当成同一件事。",
  },
  {
    id: "exam-energy-in-need-not-raise-temperature",
    format: "multiple-choice",
    representation: "条件判断：能量进入是否一定升温",
    testedModel: MODEL_ID,
    difficulty: "medium",
    requiredCognitiveActions: ["C4", "C7", "C13"],
    stem: "下面哪一句一定正确？",
    representationOptions: [
      "这句话有没有成立条件",
      "物体是不是面包",
      "有没有微波炉",
      "摸起来热不热",
    ],
    modelOptions: [
      "能量进入时内能可以改变，温度不一定升高",
      "吸收能量温度就一定升高",
      "更热就一定内能更大",
    ],
    options: [
      "物体吸收能量后，内能可以改变，但温度不一定升高。",
      "物体吸收能量后，温度一定会马上升高。",
      "更热的物体，内能一定比任何更凉的物体都大。",
      "温度升高，物体一定增加了质量。",
    ],
    correctAnswer: "物体吸收能量后，内能可以改变，但温度不一定升高。",
    commonDistractors: [
      "物体吸收能量后，温度一定会马上升高。",
      "更热的物体，内能一定比任何更凉的物体都大。",
    ],
    requiredReasoning: [
      "否定“能量进入就一定升温”",
      "指出需要条件",
    ],
    reasoningPrompt: "为什么其他几句推得太满？",
  },
  {
    id: "exam-hotter-not-always-more-internal-energy",
    format: "multiple-choice",
    representation: "信息是否足够：只知道温度能不能比内能",
    testedModel: MODEL_ID,
    difficulty: "medium",
    requiredCognitiveActions: ["C4", "C7", "C13"],
    stem: "只知道甲物体比乙物体温度高。能不能断定甲的总内能一定更大？",
    representationOptions: [
      "只知道温度够不够",
      "哪个摸起来更热",
      "是不是同一种装置",
      "有没有公式",
    ],
    modelOptions: [
      "温度不是总内能，还要看是不是同一个系统",
      "更热就一定内能更大",
      "写出 Q = c m ΔT 才能回答",
    ],
    options: [
      "不能。只知道温度，还不能断定总内能一定更大。",
      "能。更热的物体总内能一定更大。",
      "能。温度高就是内能大的另一种说法。",
      "不能，因为必须先写出比热容公式。",
    ],
    correctAnswer: "不能。只知道温度，还不能断定总内能一定更大。",
    commonDistractors: [
      "能。更热的物体总内能一定更大。",
      "不能，因为必须先写出比热容公式。",
    ],
    requiredReasoning: [
      "温度不是总内能",
      "不把任务变成比热容计算",
    ],
    reasoningPrompt: "你还缺什么信息？不要把这道题做成比热容计算。",
  },
];
