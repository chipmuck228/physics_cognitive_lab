import { forceChangesMotionStateModel } from "@/content/physics-models/force-changes-motion-state";
import type { LearningEvent, LearningStage } from "@/types/learning";
import { HintLevelId } from "@/types/physics-model";

export function cartHintLadder() {
  return forceChangesMotionStateModel.tutorPolicy.hintLadder;
}

export function usedCartHintCount(
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

export function nextCartHint(
  events: LearningEvent[],
  stage: LearningStage,
): { id: (typeof HintLevelId)[keyof typeof HintLevelId]; prompt: string } | null {
  const ladder = cartHintLadder();
  const used = usedCartHintCount(events, stage);
  if (used >= ladder.length) {
    return null;
  }
  const hint = ladder[used];
  return { id: hint.id, prompt: hint.prompt };
}

export function revealedCartHints(
  events: LearningEvent[],
  stage: LearningStage,
): string[] {
  const used = usedCartHintCount(events, stage);
  return cartHintLadder()
    .slice(0, used)
    .map((hint) => hint.prompt);
}
