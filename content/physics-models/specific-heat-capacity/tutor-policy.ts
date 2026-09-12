import { STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { HintLevelId, type TutorPolicy } from "@/types/physics-model";
import { misconceptions } from "./misconceptions";

export const tutorPolicy: TutorPolicy = {
  allowedActionsByStage: STAGE_TUTOR_POLICY,
  maxExplanationLength: 80,
  answerLeakageRules: [
    "OBSERVE：不要在学生观察前塞入“Q = c m ΔT”。",
    "DESCRIBE：先抓住能看见的升温快慢和是否同样多，不要过早要求公式。",
    "PREDICT：不要说出实验会得到什么温度或能量。",
    "EXPLAIN：提示要一层一层来，不要一次给出完整关系。",
    "MODEL：可以指出缺了质量、能量或温度变化，但不能替学生把关系建好。",
    "TRANSFER：学生还没尝试前，不要说出“这和刚才是同一个 Q = c m ΔT”。",
    "AI_OFF：不得发起任何 tutor 请求。",
    "任何阶段都不得把“更烫就一定吸热更多”或“加热时间相同就一定同样烫”当作正确结论。",
  ],
  hintLadder: [
    {
      id: HintLevelId.H1,
      prompt: "再看看。两份样品是不是一样多？加热之后谁更烫？",
    },
    {
      id: HintLevelId.H2,
      prompt: "你可以分开看看：质量有没有不同，温度升了多少，加热是不是同样的。",
    },
    {
      id: HintLevelId.H3,
      prompt: "这次是同样多、同样加热比材料，还是同一种材料比质量？先选一件说清楚。",
    },
    {
      id: HintLevelId.H4,
      prompt: "如果只改一个条件——比如质量相同、能量相同，或者能量更多——温度还会怎样？",
    },
    {
      id: HintLevelId.H5,
      prompt: "你已经看到质量和温度变化了。再想一步：吸收的能量是其中一个量，还是还要乘上比热容？",
    },
  ],
  misconceptionStrategies: misconceptions.map((item) => ({
    misconceptionId: item.id,
    approach: "先让学生分开说出质量、温度变化和吸收的能量，再问它们怎样一起决定。不要直接把公式说完。",
  })),
};
