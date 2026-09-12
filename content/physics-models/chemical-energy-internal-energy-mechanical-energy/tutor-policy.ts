import { STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { HintLevelId, type TutorPolicy } from "@/types/physics-model";
import { misconceptions } from "./misconceptions";

export const tutorPolicy: TutorPolicy = {
  allowedActionsByStage: STAGE_TUTOR_POLICY,
  maxExplanationLength: 80,
  answerLeakageRules: [
    "OBSERVE：不要在学生观察前塞入“化学能 → 内能 → 机械能”。",
    "DESCRIBE：先抓住能看见的变化，不要过早要求教材术语。",
    "PREDICT：不要说出实验会得到什么结果。",
    "EXPLAIN：提示要一层一层来，不要一次给出完整因果链。",
    "MODEL：可以指出缺了哪一环，但不能替学生把整条链建好。",
    "TRANSFER：学生还没尝试前，不要说出“这和刚才是同一条能量链”。",
    "AI_OFF：不得发起任何 tutor 请求。",
    "任何阶段都不得说“能量被制造出来”或“做功冲程产生了能量”。",
  ],
  hintLadder: [
    {
      id: HintLevelId.H1,
      prompt: "再看看。哪个部分先动了，哪个变化是后来才出现的？",
    },
    {
      id: HintLevelId.H2,
      prompt: "你可以重点看看：燃烧发生时，气体和活塞各发生了什么。",
    },
    {
      id: HintLevelId.H3,
      prompt: "这个变化和哪种能量有关？是化学能、内能，还是机械能？",
    },
    {
      id: HintLevelId.H4,
      prompt: "如果只改一个条件——比如没有燃烧，或者活塞被卡住——还会怎样？",
    },
    {
      id: HintLevelId.H5,
      prompt: "你已经找到能量变化了。再想一步：它是怎样到达机械运动的？中间有没有“做功”？",
    },
  ],
  misconceptionStrategies: misconceptions.map((item) => ({
    misconceptionId: item.id,
    approach: "先问缺失的那一环，再给对照条件。不要直接把正确链说完。",
  })),
};
