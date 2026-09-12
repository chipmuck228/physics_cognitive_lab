import { STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { HintLevelId, type TutorPolicy } from "@/types/physics-model";
import { misconceptions } from "./misconceptions";

export const tutorPolicy: TutorPolicy = {
  allowedActionsByStage: STAGE_TUTOR_POLICY,
  maxExplanationLength: 80,
  answerLeakageRules: [
    "OBSERVE：不要在学生观察前塞入“I = U / R”。",
    "DESCRIBE：先抓住电流表、电压表读数和哪个元件，不要过早要求公式。",
    "PREDICT：不要说出电流会变成多少，也不要替学生选定“电压加倍电流加倍”。",
    "EXPLAIN：提示要一层一层来，不要一次给出完整关系。",
    "MODEL：可以指出缺了电流、电压、电阻或控制条件，但不能替学生把关系建好。",
    "TRANSFER：学生还没尝试前，不要说出“这和刚才是同一个 I = U / R”。",
    "AI_OFF：不得发起任何 tutor 请求。",
    "任何阶段都不得把“会背 I = U / R”当成已经理解模型。",
    "任何阶段都不得把 R = U / I 讲成电压和电流制造了电阻。",
    "不得把串联、并联、电功率或电能当作本 Scene 的下一步标准答案。",
  ],
  hintLadder: [
    {
      id: HintLevelId.H1,
      prompt: "再看看。这是哪一段上的电压？电流表接在哪一段？",
    },
    {
      id: HintLevelId.H2,
      prompt: "你可以分开看看：电压有没有变，电阻有没有变，开关通不通。",
    },
    {
      id: HintLevelId.H3,
      prompt: "这次是同一个电阻比电压，还是同一个电压比电阻？先选一件说清楚。",
    },
    {
      id: HintLevelId.H4,
      prompt: "如果只改一个条件——电阻不变只改电压，或电压不变只改电阻——电流还会怎样？",
    },
    {
      id: HintLevelId.H5,
      prompt: "你已经看到两个量了。再想一步：第三个量和它们是什么关系？不要只把公式抄出来。",
    },
  ],
  misconceptionStrategies: misconceptions.map((item) => ({
    misconceptionId: item.id,
    approach:
      "先让学生分开说出电流、电压和电阻，再问比较时哪个量保持不变。不要直接把 I = U / R 说完，也不要把变形讲成新的因果。",
  })),
};
