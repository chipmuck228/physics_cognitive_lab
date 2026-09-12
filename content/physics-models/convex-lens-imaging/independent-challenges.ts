import { MODEL_ID } from "./model";
import type { IndependentChallenge } from "@/types/physics-model";

export const independentChallenges: IndependentChallenge[] = [
  {
    id: "ai-off-unfamiliar-window-card-projection",
    scenario:
      "晚上，有人把一块凸透镜对着窗外的街灯，在透镜另一侧用一张白卡片左右移动。卡片上出现一幅倒立、比窗外景物小的清晰画面。这不是课堂上的光具座。",
    unfamiliarity: "medium",
    question:
      "这时物体、像分别在什么位置关系里？卡片上的画面是实像还是虚像？为什么能接到？不要只写“这也有凸透镜，所以一样”，也不要只背“缩小倒立实像”。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      {
        id: "identifiesObjectRelativeToF",
        description: "指出窗外景物的物距大于 2f，或至少明确在焦点以外且较远。",
      },
      {
        id: "identifiesRayMeetingMode",
        description: "指出透镜后的光线真正会聚。",
      },
      {
        id: "identifiesImageNatureAndOrientation",
        description: "指出这是倒立实像，并且实像与倒立不是同一个词。",
      },
      {
        id: "checksScreenIsReceiver",
        description: "指出白卡片是接收器，必须放在像的位置才能清晰。",
      },
      {
        id: "rejectsSurfaceConvexLensSlogan",
        description: "只写“这也有凸透镜”不算完成。",
      },
    ],
    llmAllowed: false,
  },
  {
    id: "ai-off-boundary-magnifier-cannot-catch-virtual",
    scenario:
      "同学用放大镜看一枚邮票（邮票在焦点以内），透过透镜看到正立、放大的像。然后把一张白纸放到“像应该在的地方”，想把这个像接到纸上。另有同学把物体正好放到焦点上，来回移动光屏找清晰像，找不到就说“没有像，所以 u = f 也算一种普通成像失败”。",
    unfamiliarity: "high",
    question:
      "白纸接得到放大镜里的那个像吗？物体正好在焦点上时，是“没有像所以也是一种普通有限远成像”，还是有限远处根本不成完整的像？说明理由。不要背五种情况表。",
    expectedModelId: MODEL_ID,
    requiredEvidence: [
      {
        id: "identifiesRayMeetingMode",
        description: "分别指出：焦点以内是反向延长线相交；在焦点上是有限远处不相交。",
      },
      {
        id: "rejectsVirtualOnScreen",
        description: "拒绝“虚像可以用光屏接到”。",
      },
      {
        id: "rejectsObjectAtFAsOrdinaryImage",
        description: "拒绝把 u = f 说成普通的有限远成像。",
      },
      {
        id: "distinguishesNoScreenFromNoImage",
        description: "光屏上看不到，不等于任何情况下都没有像。",
      },
    ],
    llmAllowed: false,
  },
];
