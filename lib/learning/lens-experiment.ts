import { LENS_COMPARE_OPTIONS, lensExperimentTitle, lensObservedLabel } from "@/lib/content/convex-lens-optical-bench";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { firstCommittedLensPrediction } from "@/lib/learning/lens-predict";
import {
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_B,
  LENS_EXPERIMENT_C,
  LENS_EXPERIMENT_D,
  LENS_EXPERIMENT_ORDER,
  runConvexLensExperiment,
  type ConvexLensExperimentResult,
  type ConvexLensSceneState,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";
import type { ExperimentEvidence, LearningSession } from "@/types/learning";

export type LensObservedResult = {
  screen: "" | "clear" | "blurred-or-absent" | "never";
  sizeOrCover: "" | "larger" | "smaller" | "whole-dimmer" | "half-gone" | "no-finite";
};

export function emptyLensObservedResult(): LensObservedResult {
  return { screen: "", sizeOrCover: "" };
}

export function asLensObservedResult(observed: object | undefined): LensObservedResult {
  if (!observed || typeof observed !== "object") {
    return emptyLensObservedResult();
  }
  const record = observed as Record<string, unknown>;
  return {
    screen: asField(record.screen, ["clear", "blurred-or-absent", "never"]),
    sizeOrCover: asField(record.sizeOrCover, [
      "larger",
      "smaller",
      "whole-dimmer",
      "half-gone",
      "no-finite",
    ]),
  };
}

export function hasCompleteLensObservedResult(observed: object | undefined): boolean {
  const result = asLensObservedResult(observed);
  return result.screen !== "" && result.sizeOrCover !== "";
}

export function isLensComparison(
  value: string,
): value is "same" | "different" | "partial" {
  return LENS_COMPARE_OPTIONS.some((option) => option.value === value);
}

export function lensComparisonLabel(value: string): string {
  return (
    LENS_COMPARE_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}

export function canRunLensExperiment(
  session: LearningSession,
  experimentId: LensExperimentId,
): boolean {
  const prediction = firstCommittedLensPrediction(session.predictions, experimentId);
  if (!prediction) {
    return false;
  }
  if (experimentId === LENS_EXPERIMENT_A) {
    return true;
  }
  if (experimentId === LENS_EXPERIMENT_B) {
    return hasClosedLensExperiment(session, LENS_EXPERIMENT_A);
  }
  if (experimentId === LENS_EXPERIMENT_C) {
    return hasClosedLensExperiment(session, LENS_EXPERIMENT_B);
  }
  return hasClosedLensExperiment(session, LENS_EXPERIMENT_C);
}

export function activeIncompleteLensEvidence(
  session: LearningSession,
  experimentId: LensExperimentId,
): ExperimentEvidence | undefined {
  return [...session.experimentEvidence]
    .reverse()
    .find(
      (evidence) =>
        evidence.experimentId === experimentId && evidence.sufficient !== true,
    );
}

export function firstClosedLensEvidence(
  session: LearningSession,
  experimentId: LensExperimentId,
): ExperimentEvidence | undefined {
  return session.experimentEvidence.find(
    (evidence) =>
      evidence.experimentId === experimentId && isLensExperimentClosed(evidence),
  );
}

export function isLensExperimentClosed(evidence: ExperimentEvidence): boolean {
  if (evidence.sufficient === true) {
    return true;
  }
  if (!evidence.experimentId || !evidence.interventionAt || !evidence.physicsResult) {
    return false;
  }
  if (!evidence.authoredBeforeIntervention) {
    return false;
  }
  if (
    !isLensExperimentId(evidence.experimentId) ||
    !hasCompleteLensObservedResult(evidence.observedResult)
  ) {
    return false;
  }
  if (!evidence.comparison || !isLensComparison(evidence.comparison)) {
    return false;
  }
  return hasOwnWords(evidence.reflection);
}

export function hasClosedLensExperiment(
  session: LearningSession,
  experimentId: LensExperimentId,
): boolean {
  return session.experimentEvidence.some(
    (evidence) =>
      evidence.experimentId === experimentId && isLensExperimentClosed(evidence),
  );
}

export function hasCompletedLensExperiments(session: LearningSession): boolean {
  return LENS_EXPERIMENT_ORDER.every((experimentId) =>
    hasClosedLensExperiment(session, experimentId),
  );
}

export function lensClosedExperimentRecap(
  session: LearningSession,
): Array<{ title: string; result: string }> {
  return LENS_EXPERIMENT_ORDER.flatMap((experimentId) => {
    const evidence = firstClosedLensEvidence(session, experimentId);
    if (!evidence) {
      return [];
    }
    const observed = asLensObservedResult(evidence.observedResult);
    return [
      {
        title: lensExperimentTitle(experimentId),
        result: `${lensObservedLabel("screen", observed.screen)}；${lensObservedLabel("sizeOrCover", observed.sizeOrCover)}`,
      },
    ];
  });
}

export function lensClosedExperimentReflection(
  session: LearningSession,
  experimentId: LensExperimentId,
): string | undefined {
  return firstClosedLensEvidence(session, experimentId)?.reflection;
}

export function activeLensExperimentId(
  session: LearningSession,
): LensExperimentId | null {
  if (!hasClosedLensExperiment(session, LENS_EXPERIMENT_A)) {
    return LENS_EXPERIMENT_A;
  }
  if (!hasClosedLensExperiment(session, LENS_EXPERIMENT_B)) {
    return LENS_EXPERIMENT_B;
  }
  if (!hasClosedLensExperiment(session, LENS_EXPERIMENT_C)) {
    return LENS_EXPERIMENT_C;
  }
  if (!hasClosedLensExperiment(session, LENS_EXPERIMENT_D)) {
    return LENS_EXPERIMENT_D;
  }
  return null;
}

export function runSceneLensExperiment(
  experimentId: LensExperimentId,
  current?: ConvexLensSceneState,
): ConvexLensExperimentResult {
  return runConvexLensExperiment(experimentId, current);
}

export function authoredBeforeIntervention(
  committedAt: string,
  interventionAt: string,
): boolean {
  return committedAt <= interventionAt;
}

export function patchIncompleteLensEvidence(
  session: LearningSession,
  experimentId: LensExperimentId,
  updater: (evidence: ExperimentEvidence) => ExperimentEvidence,
): LearningSession {
  const index = [...session.experimentEvidence]
    .map((item, itemIndex) => ({ item, itemIndex }))
    .reverse()
    .find(
      ({ item }) => item.experimentId === experimentId && item.sufficient !== true,
    )?.itemIndex;
  if (index == null) {
    return session;
  }
  return {
    ...session,
    experimentEvidence: session.experimentEvidence.map((item, itemIndex) =>
      itemIndex === index ? updater(item) : item,
    ),
  };
}

function isLensExperimentId(value: string): value is LensExperimentId {
  return (LENS_EXPERIMENT_ORDER as readonly string[]).includes(value);
}

function asField<T extends string>(value: unknown, allowed: readonly T[]): T | "" {
  return allowed.includes(value as T) ? (value as T) : "";
}
