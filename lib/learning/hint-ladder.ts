import { chemicalEnergyInternalEnergyMechanicalEnergyModel } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy";
import type { LearningEvent, LearningStage } from "@/types/learning";
import { HintLevelId } from "@/types/physics-model";

export function engineHintLadder() {
  return chemicalEnergyInternalEnergyMechanicalEnergyModel.tutorPolicy.hintLadder;
}

export function usedEngineHintCount(
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

export function nextEngineHint(
  events: LearningEvent[],
  stage: LearningStage,
): { id: (typeof HintLevelId)[keyof typeof HintLevelId]; prompt: string } | null {
  const ladder = engineHintLadder();
  const used = usedEngineHintCount(events, stage);
  if (used >= ladder.length) {
    return null;
  }
  const hint = ladder[used];
  return { id: hint.id, prompt: hint.prompt };
}

export function revealedEngineHints(
  events: LearningEvent[],
  stage: LearningStage,
): string[] {
  const used = usedEngineHintCount(events, stage);
  return engineHintLadder()
    .slice(0, used)
    .map((hint) => hint.prompt);
}
