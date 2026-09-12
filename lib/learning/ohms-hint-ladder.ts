import { ohmsLawModel } from "@/content/physics-models/ohms-law";
import type { LearningEvent, LearningStage } from "@/types/learning";
import { HintLevelId } from "@/types/physics-model";

export function ohmsHintLadder() {
  return ohmsLawModel.tutorPolicy.hintLadder;
}

export function usedOhmsHintCount(
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

export function nextOhmsHint(
  events: LearningEvent[],
  stage: LearningStage,
): { id: (typeof HintLevelId)[keyof typeof HintLevelId]; prompt: string } | null {
  const ladder = ohmsHintLadder();
  const used = usedOhmsHintCount(events, stage);
  if (used >= ladder.length) {
    return null;
  }
  const hint = ladder[used];
  return { id: hint.id, prompt: hint.prompt };
}

export function revealedOhmsHints(
  events: LearningEvent[],
  stage: LearningStage,
): string[] {
  const used = usedOhmsHintCount(events, stage);
  return ohmsHintLadder()
    .slice(0, used)
    .map((hint) => hint.prompt);
}
