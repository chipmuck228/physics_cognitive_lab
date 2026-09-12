import { STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { HintLevelId, type TutorPolicy } from "@/types/physics-model";
import { misconceptions } from "./misconceptions";

export const tutorPolicy: TutorPolicy = {
  allowedActionsByStage: STAGE_TUTOR_POLICY,
  maxExplanationLength: 80,
  answerLeakageRules: [
    "OBSERVE：不要在学生观察前塞入“密度等于质量除以体积”。",
    "DESCRIBE：先抓住能看见的轻重和大小，不要过早要求公式。",
    "PREDICT：不要说出实验会得到什么质量、体积或密度。",
    "EXPLAIN：提示要一层一层来，不要一次给出完整比值。",
    "MODEL：可以指出缺了质量或体积，但不能替学生把比值建好。",
    "TRANSFER：学生还没尝试前，不要说出“这和刚才是同一个 ρ = m / V”。",
    "AI_OFF：不得发起任何 tutor 请求。",
    "任何阶段都不得把“更重就一定更密”或“更大就一定更密”当作正确结论。",
  ],
  hintLadder: [
    {
      id: HintLevelId.H1,
      prompt: "再看看。哪一块更沉？它们看起来是不是一样大？",
    },
    {
      id: HintLevelId.H2,
      prompt: "你可以分开看看：质量有没有不同，体积有没有不同。",
    },
    {
      id: HintLevelId.H3,
      prompt: "这次是同样大比轻重，还是同样重比大小？先选一件说清楚。",
    },
    {
      id: HintLevelId.H4,
      prompt: "如果只改一个条件——比如体积相同、质量相同，或者均匀切开——还会怎样？",
    },
    {
      id: HintLevelId.H5,
      prompt: "你已经看到质量和体积了。再想一步：密度是其中一个量，还是它们的比？",
    },
  ],
  misconceptionStrategies: misconceptions.map((item) => ({
    misconceptionId: item.id,
    approach: "先让学生分开说出质量和体积，再问比值。不要直接把公式说完。",
  })),
};
