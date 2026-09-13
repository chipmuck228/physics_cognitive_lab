import type { ExamPattern } from "@/types/physics-model";

/** Scene07-local exam sketch coordinates. Not a universal diagram DSL. */
export const LENS_EXAM_BEYOND_2F_LAYOUT = {
  lensX: 280,
  left2F: 196,
  leftF: 238,
  rightF: 322,
  right2F: 364,
  objectX: 132,
  screenX: 343,
  screenWidth: 10,
} as const;

export type LensExamScreenRegion = "between-f-and-2f";

export type LensExamDiagramLayout = {
  lensX: number;
  left2F: number;
  leftF: number;
  rightF: number;
  right2F: number;
  objectX: number;
  screenX: number;
  screenWidth: number;
};

export interface LensExamDiagramSpec {
  patternId: string;
  objectStation: "beyond-2f";
  showScreen: boolean;
  showImage: false;
  showRays: false;
  screenRegion: LensExamScreenRegion;
  layout: LensExamDiagramLayout;
}

/**
 * Scene07-local exam representation adapter.
 * ExamPattern.representation is a caption, not a drawable schema.
 * Only `format === "diagram"` patterns may receive a figure.
 */
export function lensExamDiagramSpec(
  pattern: Pick<ExamPattern, "id" | "format">,
): LensExamDiagramSpec | null {
  if (pattern.format !== "diagram") {
    return null;
  }
  if (pattern.id === "exam-object-beyond-2f-properties") {
    return {
      patternId: pattern.id,
      objectStation: "beyond-2f",
      showScreen: true,
      showImage: false,
      showRays: false,
      screenRegion: "between-f-and-2f",
      layout: LENS_EXAM_BEYOND_2F_LAYOUT,
    };
  }
  return null;
}

export function lensExamObjectIsBeyondLeft2F(layout: LensExamDiagramLayout): boolean {
  return layout.objectX < layout.left2F;
}

export function lensExamScreenIsBetweenRightFAnd2F(
  layout: LensExamDiagramLayout,
): boolean {
  const screenEnd = layout.screenX + layout.screenWidth;
  return layout.screenX > layout.rightF && screenEnd < layout.right2F;
}
