import type { ExamPattern } from "@/types/physics-model";

export interface LensExamDiagramSpec {
  patternId: string;
  objectStation: "beyond-2f";
  showScreen: boolean;
  showImage: false;
  showRays: false;
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
    };
  }
  return null;
}
