import { CART_COMPARE_OPTIONS } from "@/lib/content/horizontal-force-cart";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { firstCommittedCartPrediction } from "@/lib/learning/cart-predict";
import {
  CART_EXPERIMENT_A,
  CART_EXPERIMENT_B,
  CART_EXPERIMENT_C,
  CART_EXPERIMENT_ORDER,
  runCartExperiment,
  type CartExperimentId,
  type CartExperimentResult,
} from "@/lib/physics/horizontal-force-cart";
import type { ExperimentEvidence, LearningSession } from "@/types/learning";

export type CartObservedResult = {
  speedChange: "" | "up" | "down" | "none";
  directionChanged: "" | "yes" | "no";
  motionStateChange:
    | ""
    | "started-moving"
    | "sped-up"
    | "slowed-down"
    | "reversed"
    | "unchanged";
};

export function emptyCartObservedResult(): CartObservedResult {
  return {
    speedChange: "",
    directionChanged: "",
    motionStateChange: "",
  };
}

export function asCartObservedResult(
  observed: object | undefined,
): CartObservedResult {
  if (!observed || typeof observed !== "object") {
    return emptyCartObservedResult();
  }
  const record = observed as Record<string, unknown>;
  const speedChange =
    record.speedChange === "up" ||
    record.speedChange === "down" ||
    record.speedChange === "none"
      ? record.speedChange
      : "";
  const directionChanged =
    record.directionChanged === "yes" || record.directionChanged === "no"
      ? record.directionChanged
      : "";
  const motionStateChange =
    record.motionStateChange === "started-moving" ||
    record.motionStateChange === "sped-up" ||
    record.motionStateChange === "slowed-down" ||
    record.motionStateChange === "reversed" ||
    record.motionStateChange === "unchanged"
      ? record.motionStateChange
      : "";
  return { speedChange, directionChanged, motionStateChange };
}

export function hasCompleteCartObservedResult(
  observed: object | undefined,
): boolean {
  const result = asCartObservedResult(observed);
  return (
    result.speedChange !== "" &&
    result.directionChanged !== "" &&
    result.motionStateChange !== ""
  );
}

export function isCartComparison(
  value: string,
): value is "same" | "different" | "partial" {
  return CART_COMPARE_OPTIONS.some((option) => option.value === value);
}

export function cartComparisonLabel(value: string): string {
  return (
    CART_COMPARE_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}

export function canRunCartExperiment(
  session: LearningSession,
  experimentId: CartExperimentId,
): boolean {
  const prediction = firstCommittedCartPrediction(
    session.predictions,
    experimentId,
  );
  if (!prediction) {
    return false;
  }
  if (experimentId === CART_EXPERIMENT_B) {
    return hasClosedCartExperiment(session, CART_EXPERIMENT_A);
  }
  if (experimentId === CART_EXPERIMENT_C) {
    return hasClosedCartExperiment(session, CART_EXPERIMENT_B);
  }
  return true;
}

export function activeIncompleteCartEvidence(
  session: LearningSession,
  experimentId: CartExperimentId,
): ExperimentEvidence | undefined {
  return [...session.experimentEvidence]
    .reverse()
    .find(
      (evidence) =>
        evidence.experimentId === experimentId && evidence.sufficient !== true,
    );
}

export function firstClosedCartEvidence(
  session: LearningSession,
  experimentId: CartExperimentId,
): ExperimentEvidence | undefined {
  return session.experimentEvidence.find(
    (evidence) =>
      evidence.experimentId === experimentId && isCartExperimentClosed(evidence),
  );
}

export function isCartExperimentClosed(evidence: ExperimentEvidence): boolean {
  if (evidence.sufficient === true) {
    return true;
  }
  if (!evidence.experimentId || !evidence.interventionAt || !evidence.physicsResult) {
    return false;
  }
  if (!evidence.authoredBeforeIntervention) {
    return false;
  }
  if (!hasCompleteCartObservedResult(evidence.observedResult)) {
    return false;
  }
  if (!evidence.comparison || !isCartComparison(evidence.comparison)) {
    return false;
  }
  return hasOwnWords(evidence.reflection);
}

export function hasClosedCartExperiment(
  session: LearningSession,
  experimentId: CartExperimentId,
): boolean {
  return session.experimentEvidence.some(
    (evidence) =>
      evidence.experimentId === experimentId && isCartExperimentClosed(evidence),
  );
}

export function hasCompletedCartExperiments(session: LearningSession): boolean {
  return CART_EXPERIMENT_ORDER.every((experimentId) =>
    hasClosedCartExperiment(session, experimentId),
  );
}

export function activeCartExperimentId(
  session: LearningSession,
): CartExperimentId | null {
  if (!hasClosedCartExperiment(session, CART_EXPERIMENT_A)) {
    return CART_EXPERIMENT_A;
  }
  if (!hasClosedCartExperiment(session, CART_EXPERIMENT_B)) {
    return CART_EXPERIMENT_B;
  }
  if (!hasClosedCartExperiment(session, CART_EXPERIMENT_C)) {
    return CART_EXPERIMENT_C;
  }
  return null;
}

export function runSceneCartExperiment(
  experimentId: CartExperimentId,
): CartExperimentResult {
  return runCartExperiment(experimentId);
}

export function authoredBeforeIntervention(
  committedAt: string,
  interventionAt: string,
): boolean {
  return committedAt <= interventionAt;
}

export function cartClosedExperimentReflection(
  session: LearningSession,
  experimentId: CartExperimentId,
): string | null {
  const evidence = firstClosedCartEvidence(session, experimentId);
  const reflection = evidence?.reflection?.trim();
  return reflection ? reflection : null;
}
