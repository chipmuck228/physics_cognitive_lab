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
          label: "能在卡片上得到清晰的实像。",
          correct: true,
        },
        {
          id: "also-convex-lens",
          label: "只能透过透镜看到虚像，卡片接不到。",
          correct: false,
        },
        {
          id: "image-on-card-is-the-image-itself",
          label: "有限远处不能形成清晰的像。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "condition-determines-rays",
          label: "物体相对 F / 2F 的位置，决定光线会不会真正会聚。",
          required: true,
          distractor: false,
        },
        {
          id: "meeting-determines-image",
          label: "光线怎样相遇，决定像是实是虚、卡片能不能接到。",
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
          id: "screen-creates-image",
          label: "画面是卡片自己造出来的。",
          required: false,
          distractor: true,
        },
      ],
    },
    "ai-off-boundary-magnifier-cannot-catch-virtual": {
      judgments: [
        {
          id: "virtual-not-on-screen-and-f-is-limit",
          label: "白纸接不到这个像；物体在焦点上时，有限远处也得不到清晰像。",
          correct: true,
        },
        {
          id: "catch-virtual-on-paper",
          label: "把白纸放到对的地方，就能接到这个像。",
          correct: false,
        },
        {
          id: "at-f-ordinary-row",
          label: "焦点上也能成普通的像，只是光屏不好找。",
          correct: false,
        },
      ],
      postCheck: [
        {
          id: "virtual-cannot-project",
          label: "焦点以内出来的光还是散开的，往回延长才相交，所以纸接不到。",
          required: true,
          distractor: false,
          localScope: "u-less-than-f",
        },
        {
          id: "f-is-not-ordinary",
          label: "物体在焦点上时，有限远处不成完整的像。",
          required: true,
          distractor: false,
          localScope: "u-equals-f",
        },
        {
          id: "project-virtual",
          label: "虚像也可以投影到纸上。",
          required: false,
          distractor: true,
        },
        {
          id: "no-image-if-no-screen",
          label: "屏上看不到就一定没有像。",
          required: false,
          distractor: true,
        },
      ],
    },
  },
};
