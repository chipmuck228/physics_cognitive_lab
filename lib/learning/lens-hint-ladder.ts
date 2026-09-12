import { convexLensImagingModel } from "@/content/physics-models/convex-lens-imaging";
import type { LearningEvent, LearningStage } from "@/types/learning";
import { HintLevelId } from "@/types/physics-model";

export function lensHintLadder() {
  return convexLensImagingModel.tutorPolicy.hintLadder;
}

export function usedLensHintCount(
  events: LearningEvent[],
  stage: LearningStage,
): number {
  return events.filter(
    (event) =>
      event.stage === stage &&
      event.type === "ai_interaction" &&
      event.metadata?.source === "hint-ladder",
  ).length;
}

export function nextLensHint(
  events: LearningEvent[],
  stage: LearningStage,
): { id: (typeof HintLevelId)[keyof typeof HintLevelId]; prompt: string } | null {
  const ladder = lensHintLadder();
  const used = usedLensHintCount(events, stage);
  if (used >= ladder.length) {
    return null;
  }
  const hint = ladder[used];
  return { id: hint.id, prompt: hint.prompt };
}

export function revealedLensHints(
  events: LearningEvent[],
  stage: LearningStage,
): string[] {
  const used = usedLensHintCount(events, stage);
  return lensHintLadder()
    .slice(0, used)
    .map((hint) => hint.prompt);
}
