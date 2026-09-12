import { STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { HintLevelId, type TutorPolicy } from "@/types/physics-model";
import { misconceptions } from "./misconceptions";

export const tutorPolicy: TutorPolicy = {
  allowedActionsByStage: STAGE_TUTOR_POLICY,
  maxExplanationLength: 80,
  answerLeakageRules: [
    "OBSERVE：不要在学生观察前塞入“能量进入 → 内能变化 → 温度升高”。",
    "DESCRIBE：先抓住能看见的温度变化，不要过早要求教材原句。",
    "PREDICT：不要说出实验会得到什么结果。",
    "EXPLAIN：提示要一层一层来，不要一次给出完整关系。",
    "MODEL：可以指出缺了哪一部分，但不能替学生把关系建好。",
    "TRANSFER：学生还没尝试前，不要说出这和刚才是同一个能量—内能—温度关系。",
    "AI_OFF：不得发起任何 tutor 请求。",
    "任何阶段都不得把热说成装在物体里的东西，也不得说吸收能量就一定升温。",
  ],
  hintLadder: [
    {
      id: HintLevelId.H1,
      prompt: "再看看。你实际看见或量到的是什么变了？",
    },
    {
      id: HintLevelId.H2,
      prompt: "“变热了”可以先说成哪个物理量在变？",
    },
    {
      id: HintLevelId.H3,
      prompt: "能量是进来了还是离开了？物体本身哪个状态可能变了？",
    },
    {
      id: HintLevelId.H4,
      prompt: "温度和内能是同一件事吗？能量进来，温度就一定升高吗？",
    },
    {
      id: HintLevelId.H5,
      prompt: "你已经看到变化了。再想一步：这句话在什么条件下才成立？",
    },
  ],
  misconceptionStrategies: misconceptions.map((item) => ({
    misconceptionId: item.id,
    approach: "先让学生分开说出温度、能量进出和内能，再给对照条件。不要直接把正确关系说完。",
  })),
};
