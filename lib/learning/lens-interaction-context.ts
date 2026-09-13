import { visibleLensStudentRays, type LensModelDraft } from "@/lib/learning/lens-model";
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

export type LensReferenceKind = "rendered" | "textual" | "constructed";

export interface LensVisibleCapability {
  id: LensCapabilityId;
  available: boolean;
}

export interface LensVisibleReference {
  id: LensReferenceId;
  kind: LensReferenceKind;
}

export interface LensVisibleInteractionContext {
  stage: LearningStage;
  substep?: string;
  capabilities: LensVisibleCapability[];
  references: LensVisibleReference[];
}

export interface LensRenderedSurface {
  benchVisible: boolean;
  officialImageVisible: boolean;
  studentRayCount: number;
  predictionTextVisible: boolean;
  transferScenarioVisible: boolean;
  examStemVisible: boolean;
  modelRayEditorVisible: boolean;
  modelImageQuestionVisible: boolean;
  explainMeetingQuestionVisible: boolean;
  transferMeetingQuestionVisible: boolean;
}

export interface LensInteractionLookup {
  constructionStep?: number;
  revisiting?: boolean;
  modelDraft?: LensModelDraft;
  surface?: LensRenderedSurface;
}

export function lensModelSubstep(constructionStep = 1): string {
  const step = Math.min(Math.max(constructionStep, 1), 7);
  return `construction-${step}`;
}

export function lensRenderedSurfaceFor(
  stage: LearningStage,
  lookup: LensInteractionLookup = {},
): LensRenderedSurface {
  if (lookup.surface) {
    return lookup.surface;
  }
  const step = lookup.constructionStep ?? lookup.modelDraft?.constructionStep ?? 1;
  const hideBench =
    stage === LearningStage.EXAM ||
    stage === LearningStage.AI_OFF ||
    stage === LearningStage.COMPLETE ||
    stage === LearningStage.TRANSFER;
  const isModel = stage === LearningStage.MODEL;
  const studentRayCount =
    isModel && lookup.modelDraft ? visibleLensStudentRays(lookup.modelDraft).length : 0;
  return {
    benchVisible: !hideBench && stage !== LearningStage.ENTRY,
    officialImageVisible: !hideBench && !isModel && stage !== LearningStage.ENTRY,
    studentRayCount,
    predictionTextVisible: stage === LearningStage.EXPERIMENT,
    transferScenarioVisible: stage === LearningStage.TRANSFER,
    examStemVisible: stage === LearningStage.EXAM,
    modelRayEditorVisible: isModel && step >= 2,
    modelImageQuestionVisible: isModel && step >= 5,
    explainMeetingQuestionVisible: stage === LearningStage.EXPLAIN,
    transferMeetingQuestionVisible: stage === LearningStage.TRANSFER,
  };
}

export function lensVisibleInteractionContext(
  stage: LearningStage,
  lookup: LensInteractionLookup = {},
): LensVisibleInteractionContext {
  const revisiting = lookup.revisiting === true;
  const constructionStep = lookup.constructionStep ?? lookup.modelDraft?.constructionStep ?? 1;
  const surface = lensRenderedSurfaceFor(stage, { ...lookup, constructionStep });
  const substep = stage === LearningStage.MODEL ? lensModelSubstep(constructionStep) : undefined;
  return {
    stage,
    substep,
    capabilities: capabilitiesFor(stage, revisiting),
    references: referencesFromSurface(surface),
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

export function lensContextLookableReference(
  context: LensVisibleInteractionContext,
  id: LensReferenceId,
): boolean {
  return context.references.some(
    (item) => item.id === id && (item.kind === "rendered" || item.kind === "constructed"),
  );
}

export function formatLensReferenceAttr(context: LensVisibleInteractionContext): string {
  return context.references.map((item) => `${item.id}:${item.kind}`).join(",");
}

function cap(id: LensCapabilityId, available: boolean): LensVisibleCapability {
  return { id, available };
}

function capabilitiesFor(stage: LearningStage, revisiting: boolean): LensVisibleCapability[] {
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

function addRef(
  refs: LensVisibleReference[],
  id: LensReferenceId,
  kind: LensReferenceKind,
) {
  const better =
    kind === "constructed" ? 3 : kind === "rendered" ? 2 : 1;
  const existing = refs.find((item) => item.id === id);
  if (!existing) {
    refs.push({ id, kind });
    return;
  }
  const current = existing.kind === "constructed" ? 3 : existing.kind === "rendered" ? 2 : 1;
  if (better > current) {
    existing.kind = kind;
  }
}

function referencesFromSurface(surface: LensRenderedSurface): LensVisibleReference[] {
  const refs: LensVisibleReference[] = [];
  if (surface.benchVisible) {
    addRef(refs, "object", "rendered");
    addRef(refs, "lens", "rendered");
    addRef(refs, "screen", "rendered");
    addRef(refs, "f-marks", "rendered");
  }
  if (surface.officialImageVisible) {
    addRef(refs, "visible-image-state", "rendered");
  }
  if (surface.studentRayCount > 0) {
    addRef(refs, "ray", "constructed");
  }
  if (surface.studentRayCount >= 2) {
    addRef(refs, "meeting-point", "constructed");
  }
  if (surface.modelRayEditorVisible || surface.explainMeetingQuestionVisible || surface.transferMeetingQuestionVisible) {
    addRef(refs, "ray", "textual");
  }
  if (surface.explainMeetingQuestionVisible || surface.transferMeetingQuestionVisible || surface.modelRayEditorVisible) {
    addRef(refs, "meeting-point", "textual");
  }
  if (surface.predictionTextVisible) {
    addRef(refs, "committed-prediction", "textual");
  }
  if (surface.modelImageQuestionVisible) {
    addRef(refs, "image-consequence", "textual");
  }
  if (surface.transferScenarioVisible) {
    addRef(refs, "new-situation", "textual");
    addRef(refs, "image-consequence", "textual");
  }
  if (surface.examStemVisible) {
    addRef(refs, "exam-stem", "textual");
  }
  return refs;
}
