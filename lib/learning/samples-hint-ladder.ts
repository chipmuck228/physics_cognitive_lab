import { densityMassVolumeModel } from "@/content/physics-models/density-mass-volume";
import type { LearningEvent, LearningStage } from "@/types/learning";
import { HintLevelId } from "@/types/physics-model";

export function samplesHintLadder() {
  return densityMassVolumeModel.tutorPolicy.hintLadder;
}

export function usedSamplesHintCount(
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

export function nextSamplesHint(
  events: LearningEvent[],
  stage: LearningStage,
): { id: (typeof HintLevelId)[keyof typeof HintLevelId]; prompt: string } | null {
  const ladder = samplesHintLadder();
  const used = usedSamplesHintCount(events, stage);
  if (used >= ladder.length) {
    return null;
  }
  const hint = ladder[used];
  return { id: hint.id, prompt: hint.prompt };
}

export function revealedSamplesHints(
  events: LearningEvent[],
  stage: LearningStage,
): string[] {
  const used = usedSamplesHintCount(events, stage);
  return samplesHintLadder()
    .slice(0, used)
    .map((hint) => hint.prompt);
}
