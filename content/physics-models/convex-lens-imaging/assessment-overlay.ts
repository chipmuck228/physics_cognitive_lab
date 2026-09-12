import type { AssessmentOverlay } from "@/lib/runtime/types";

/**
 * Design-time answer semantics for exam / AI_OFF.
 * Canonical stems and requiredEvidence remain on the Physics Model.
 * This overlay is not a second question bank and not a running Scene.
 */
export const convexLensImagingAssessmentOverlay: AssessmentOverlay = {
  exam: {
    "exam-object-beyond-2f-properties": {
      intendedRepresentation: "物距相对 2F 的光具座图",
      intendedModel: "u > 2f 时另一侧成倒立、缩小的实像，光屏可接到",
    },
    "exam-move-object-toward-f-real-image": {
      intendedRepresentation: "物距变小但仍大于 f",
      intendedModel: "像远离透镜并且变大",
    },
    "exam-inside-f-screen-cannot-receive": {
      intendedRepresentation: "光屏接不到与透过透镜看到的像",
      intendedModel: "虚像存在但光屏接不到",
    },
    "exam-object-at-f-no-finite-image": {
      intendedRepresentation: "u = f 的极限情形",
      intendedModel: "有限远处不成完整的像",
    },
    "exam-cover-part-of-lens": {
      intendedRepresentation: "遮挡后的实像是否完整",
      intendedModel: "整幅像仍在，通常变暗",
    },
  },
  independent: {
    "ai-off-unfamiliar-window-card-projection": {
      judgments: [
        {
          id: "distant-object-real-reduced",
          label:
            "窗外景物物距大于 2f，透镜后光线真正会聚，白卡片接到倒立、缩小的实像；卡片是接收器，必须放在像的位置。",
          correct: true,
        },
        {
          id: "also-convex-lens",
          label: "这也有凸透镜，所以和课堂上完全一样，不必再说物距。",
          correct: false,
        },
        {
          id: "image-on-card-is-the-image-itself",
          label: "画面长在卡片里面，卡片就是像。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesObjectRelativeToF",
          label: "窗外景物在 2F 以外或至少在焦点以外且较远。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesRayMeetingMode",
          label: "透镜后的光线真正会聚。",
          required: true,
          distractor: false,
        },
        {
          id: "identifiesImageNatureAndOrientation",
          label: "这是倒立实像；实像和倒立不是同一个词。",
          required: true,
          distractor: false,
        },
        {
          id: "checksScreenIsReceiver",
          label: "白卡片是接收器，要放在像的位置才清晰。",
          required: true,
          distractor: false,
        },
        {
          id: "surface-slogan",
          label: "这也有凸透镜，所以一样。",
          required: false,
          distractor: true,
        },
        {
          id: "table-row-only",
          label: "背出“缩小倒立实像”就够了。",
          required: false,
          distractor: true,
        },
      ],
    },
    "ai-off-boundary-magnifier-cannot-catch-virtual": {
      judgments: [
        {
          id: "virtual-not-on-screen-and-f-is-limit",
          label:
            "邮票在焦点以内时，反向延长线相交，成虚像，白纸接不到；物体正好在 F 上时，有限远处不成完整的像，不是又一种普通成像。",
          correct: true,
        },
        {
          id: "catch-virtual-on-paper",
          label: "把白纸放到正确地方，就能接到放大镜里的虚像。",
          correct: false,
        },
        {
          id: "at-f-ordinary-row",
          label: "u = f 也是五种普通有限远成像之一，只是光屏不好找。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "identifiesRayMeetingMode",
          label: "焦点以内是反向延长线相交；在焦点上是有限远处不相交。",
          required: true,
          distractor: false,
        },
        {
          id: "rejectsVirtualOnScreen",
          label: "虚像不能用光屏接到。",
          required: true,
          distractor: false,
        },
        {
          id: "rejectsObjectAtFAsOrdinaryImage",
          label: "u = f 不是普通的有限远成像。",
          required: true,
          distractor: false,
        },
        {
          id: "distinguishesNoScreenFromNoImage",
          label: "光屏上看不到，不等于任何情况下都没有像。",
          required: true,
          distractor: false,
        },
        {
          id: "no-image-if-no-screen",
          label: "屏上没有就一定没有像。",
          required: false,
          distractor: true,
        },
        {
          id: "need-thin-lens-equation",
          label: "必须先用 1/f = 1/u + 1/v 才能回答。",
          required: false,
          distractor: true,
        },
      ],
    },
  },
};
