import { LearningStage } from "@/types/learning";

export type LensCapabilityId =
  | "change-object-station"
  | "move-screen"
  | "record-observation"
  | "author-description"
  | "commit-prediction"
  | "run-intervention"
  | "record-observed-result"
  | "compare-outcome"
  | "author-reflection"
  | "author-explanation"
  | "construct-relation"
  | "apply-transfer"
  | "answer-exam"
  | "independent-commit"
  | "request-help"
  | "return-to-progress";

export type LensReferenceId =
  | "object"
  | "lens"
  | "screen"
  | "f-marks"
  | "visible-image-state"
  | "committed-prediction"
  | "ray"
  | "meeting-point"
  | "image-consequence"
  | "new-situation"
  | "exam-stem";

export interface LensVisibleCapability {
  id: LensCapabilityId;
  available: boolean;
}

export interface LensVisibleReference {
  id: LensReferenceId;
}

export interface LensVisibleInteractionContext {
  stage: LearningStage;
  substep?: string;
  capabilities: LensVisibleCapability[];
  references: LensVisibleReference[];
}

export interface LensInteractionLookup {
  constructionStep?: number;
  revisiting?: boolean;
}

export function lensModelSubstep(constructionStep = 1): string {
  const step = Math.min(Math.max(constructionStep, 1), 7);
  return `construction-${step}`;
}

export function lensVisibleInteractionContext(
  stage: LearningStage,
  lookup: LensInteractionLookup = {},
): LensVisibleInteractionContext {
  const revisiting = lookup.revisiting === true;
  const constructionStep = lookup.constructionStep ?? 1;
  const substep = stage === LearningStage.MODEL ? lensModelSubstep(constructionStep) : undefined;
  return {
    stage,
    substep,
    capabilities: capabilitiesFor(stage, constructionStep, revisiting),
    references: referencesFor(stage, constructionStep).map((id) => ({ id })),
  };
}

export function lensContextHasCapability(
  context: LensVisibleInteractionContext,
  id: LensCapabilityId,
): boolean {
  return context.capabilities.some((item) => item.id === id && item.available);
}

export function lensContextHasReference(
  context: LensVisibleInteractionContext,
  id: LensReferenceId,
): boolean {
  return context.references.some((item) => item.id === id);
}

function cap(id: LensCapabilityId, available: boolean): LensVisibleCapability {
  return { id, available };
}

function capabilitiesFor(
  stage: LearningStage,
  _constructionStep: number,
  revisiting: boolean,
): LensVisibleCapability[] {
  const help = cap("request-help", !revisiting && helpAllowed(stage));
  const ret = cap("return-to-progress", revisiting);
  if (stage === LearningStage.OBSERVE) {
    return [
      cap("change-object-station", true),
      cap("move-screen", true),
      cap("record-observation", !revisiting),
      help,
      ret,
    ];
  }
  if (stage === LearningStage.DESCRIBE) {
    return [cap("author-description", !revisiting), help, ret];
  }
  if (stage === LearningStage.PREDICT) {
    return [cap("commit-prediction", !revisiting), help, ret];
  }
  if (stage === LearningStage.EXPERIMENT) {
    return [
      cap("commit-prediction", !revisiting),
      cap("run-intervention", !revisiting),
      cap("record-observed-result", !revisiting),
      cap("compare-outcome", !revisiting),
      cap("author-reflection", !revisiting),
      help,
      ret,
    ];
  }
  if (stage === LearningStage.EXPLAIN) {
    return [cap("author-explanation", !revisiting), help, ret];
  }
  if (stage === LearningStage.MODEL) {
    return [cap("construct-relation", !revisiting), help, ret];
  }
  if (stage === LearningStage.TRANSFER) {
    return [cap("apply-transfer", !revisiting), help, ret];
  }
  if (stage === LearningStage.EXAM) {
    return [cap("answer-exam", !revisiting), help, ret];
  }
  if (stage === LearningStage.AI_OFF) {
    return [cap("independent-commit", !revisiting)];
  }
  return [];
}

function helpAllowed(stage: LearningStage): boolean {
  return (
    stage !== LearningStage.ENTRY &&
    stage !== LearningStage.AI_OFF &&
    stage !== LearningStage.COMPLETE
  );
}

function referencesFor(stage: LearningStage, constructionStep: number): LensReferenceId[] {
  const bench: LensReferenceId[] = ["object", "lens", "screen", "f-marks", "visible-image-state"];
  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return bench;
  }
  if (stage === LearningStage.PREDICT) {
    return bench;
  }
  if (stage === LearningStage.EXPERIMENT) {
    return [...bench, "committed-prediction"];
  }
  if (stage === LearningStage.EXPLAIN) {
    return [...bench, "ray", "meeting-point"];
  }
  if (stage === LearningStage.MODEL) {
    const refs: LensReferenceId[] = ["object", "lens", "f-marks"];
    if (constructionStep >= 2) {
      refs.push("ray");
    }
    if (constructionStep >= 4) {
      refs.push("meeting-point");
    }
    if (constructionStep >= 5) {
      refs.push("image-consequence");
    }
    return refs;
  }
  if (stage === LearningStage.TRANSFER) {
    return [
      "new-situation",
      "object",
      "lens",
      "f-marks",
      "ray",
      "meeting-point",
      "image-consequence",
    ];
  }
  if (stage === LearningStage.EXAM) {
    return ["exam-stem"];
  }
  return [];
}
