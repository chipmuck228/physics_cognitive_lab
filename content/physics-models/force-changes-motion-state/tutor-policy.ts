import { STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { HintLevelId, type TutorPolicy } from "@/types/physics-model";
import { misconceptions } from "./misconceptions";

export const tutorPolicy: TutorPolicy = {
  allowedActionsByStage: STAGE_TUTOR_POLICY,
  maxExplanationLength: 80,
  answerLeakageRules: [
    "OBSERVE：不要在学生观察前塞入“力能改变物体运动状态”。",
    "DESCRIBE：先抓住能看见的变化，不要过早要求教材原句。",
    "PREDICT：不要说出实验会得到什么结果。",
    "EXPLAIN：提示要一层一层来，不要一次给出完整关系。",
    "MODEL：可以指出缺了哪一部分，但不能替学生把关系建好。",
    "TRANSFER：学生还没尝试前，不要说出“这和刚才是同一个力和运动状态的关系”。",
    "AI_OFF：不得发起任何 tutor 请求。",
    "任何阶段都不得说“有力就一定运动”或“没有力物体就会停下”作为正确物理结论。",
  ],
  hintLadder: [
    {
      id: HintLevelId.H1,
      prompt: "再看看。小车先是怎样的？后来快慢或方向有没有变？",
    },
    {
      id: HintLevelId.H2,
      prompt: "你可以分开看看：力朝哪边，小车朝哪边。",
    },
    {
      id: HintLevelId.H3,
      prompt: "这次是开始运动、加快、减慢，还是方向变了？先选一件说清楚。",
    },
    {
      id: HintLevelId.H4,
      prompt: "如果只改一个条件——比如力顺着走、顶着走，或者合力变成零——还会怎样？",
    },
    {
      id: HintLevelId.H5,
      prompt: "你已经看到变化了。再想一步：合力为零时，运动状态是必须停下，还是可以保持原来的样子？",
    },
  ],
  misconceptionStrategies: misconceptions.map((item) => ({
    misconceptionId: item.id,
    approach: "先让学生分开说出力和运动，再给对照条件。不要直接把正确关系说完。",
  })),
};
