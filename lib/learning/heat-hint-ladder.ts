import { specificHeatCapacityModel } from "@/content/physics-models/specific-heat-capacity";
import type { LearningEvent, LearningStage } from "@/types/learning";
import { HintLevelId } from "@/types/physics-model";

export function heatHintLadder() {
  return specificHeatCapacityModel.tutorPolicy.hintLadder;
}

export function usedHeatHintCount(
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

export function nextHeatHint(
  events: LearningEvent[],
  stage: LearningStage,
): { id: (typeof HintLevelId)[keyof typeof HintLevelId]; prompt: string } | null {
  const ladder = heatHintLadder();
  const used = usedHeatHintCount(events, stage);
  if (used >= ladder.length) {
    return null;
  }
  const hint = ladder[used];
  return { id: hint.id, prompt: hint.prompt };
}

export function revealedHeatHints(
  events: LearningEvent[],
  stage: LearningStage,
): string[] {
  const used = usedHeatHintCount(events, stage);
  return heatHintLadder()
    .slice(0, used)
    .map((hint) => hint.prompt);
}
