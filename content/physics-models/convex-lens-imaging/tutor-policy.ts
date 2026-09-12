import { STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { HintLevelId, type TutorPolicy } from "@/types/physics-model";
import { misconceptions } from "./misconceptions";

export const tutorPolicy: TutorPolicy = {
  allowedActionsByStage: STAGE_TUTOR_POLICY,
  maxExplanationLength: 80,
  answerLeakageRules: [
    "OBSERVE：不要在学生观察前塞入五种成像情况或 1/f = 1/u + 1/v。",
    "DESCRIBE：先抓住物体、透镜、光屏和焦点标志，不要过早报出实像虚像结论。",
    "PREDICT：不要说出这次会成哪种像，也不要替学生选定“缩小倒立实像”。",
    "EXPLAIN：提示要一层一层来，不要一次画完整光路或列出全部像的性质。",
    "MODEL：可以问物体相对 F 在哪一侧、光线过透镜后会不会真的相交，但不能替学生把光路建好。",
    "TRANSFER：学生还没尝试前，不要说出“这和刚才是同一种凸透镜成像”。",
    "EXAM：不得直接给出试卷答案。",
    "AI_OFF：不得发起任何 tutor 请求。",
    "任何阶段都不得把“背会 F 和 2F 的五种情况”当成已经理解模型。",
    "任何阶段都不得把 u = f 讲成普通的有限远成像。",
    "不得把透镜制造公式、像差、显微镜或望远镜推导当作本 Scene 的下一步标准答案。",
  ],
  hintLadder: [
    {
      id: HintLevelId.H1,
      prompt: "再看看。物体在 F 的哪一侧？光屏放在哪一侧？",
    },
    {
      id: HintLevelId.H2,
      prompt: "你可以分开看看：物体、透镜、光屏。这次改的是哪一个？",
    },
    {
      id: HintLevelId.H3,
      prompt: "光线过了凸透镜以后，是真的交在一起，还是只有反向延长线相交？",
    },
    {
      id: HintLevelId.H4,
      prompt: "如果物体从 2F 以外移近，或正好放到 F 上，有限远处还会不会有交点？",
    },
    {
      id: HintLevelId.H5,
      prompt: "你已经看到会聚方式了。再想一步：像在哪一侧、光屏能不能接到？不要把五种情况表抄出来。",
    },
  ],
  misconceptionStrategies: misconceptions.map((item) => ({
    misconceptionId: item.id,
    approach:
      "先让学生指出物体相对 F 的位置，再问透镜后的光线会不会真正相交。不要直接报出成像情况和全部性质。",
  })),
};
