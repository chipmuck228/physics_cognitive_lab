import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExplanationEvidence } from "@/types/learning";

export interface CartExplainInput {
  forceVsMotion: string;
  sameDirection: string;
  oppositeDirection: string;
  zeroNetForce: string;
  studentExplanation: string;
}

export interface CartExplainEvaluation {
  distinguishesForceFromMotion: boolean;
  connectsNonzeroForceToChange: boolean;
  treatsZeroNetForceAsUnchanged: boolean;
  doesNotRequireForwardForceToKeepMoving: boolean;
  rejectsForceMeansMotion: boolean;
  rejectsZeroMustStop: boolean;
  rejectsBalancedMeansNoForce: boolean;
  hasMeaningfulExplanation: boolean;
  sufficient: boolean;
}

const MISCONCEPTION_VALUES = new Set([
  "force-means-motion",
  "needs-forward-force",
  "must-stop",
  "balanced-means-no-force",
]);

export function evaluateCartExplanation(
  input: CartExplainInput,
): CartExplainEvaluation {
  const selected = [
    input.forceVsMotion,
    input.sameDirection,
    input.oppositeDirection,
    input.zeroNetForce,
  ];
  const rejectsForceMeansMotion = !selected.includes("force-means-motion");
  const rejectsZeroMustStop = !selected.includes("must-stop");
  const rejectsBalancedMeansNoForce = !selected.includes("balanced-means-no-force");
  const doesNotRequireForwardForceToKeepMoving = !selected.includes(
    "needs-forward-force",
  );
  const distinguishesForceFromMotion =
    input.forceVsMotion === "not-same" &&
    rejectsForceMeansMotion &&
    doesNotRequireForwardForceToKeepMoving;
  const connectsNonzeroForceToChange =
    input.sameDirection === "sped-up" && input.oppositeDirection === "slowed-down";
  const treatsZeroNetForceAsUnchanged =
    input.zeroNetForce === "unchanged" &&
    rejectsZeroMustStop &&
    rejectsBalancedMeansNoForce;
  const hasMeaningfulExplanation = hasOwnWords(input.studentExplanation);
  const hasMisconception = selected.some((value) => MISCONCEPTION_VALUES.has(value));

  return {
    distinguishesForceFromMotion,
    connectsNonzeroForceToChange,
    treatsZeroNetForceAsUnchanged,
    doesNotRequireForwardForceToKeepMoving,
    rejectsForceMeansMotion,
    rejectsZeroMustStop,
    rejectsBalancedMeansNoForce,
    hasMeaningfulExplanation,
    sufficient:
      distinguishesForceFromMotion &&
      connectsNonzeroForceToChange &&
      treatsZeroNetForceAsUnchanged &&
      doesNotRequireForwardForceToKeepMoving &&
      hasMeaningfulExplanation &&
      !hasMisconception,
  };
}

export function hasSufficientCartExplanation(
  explanations: ExplanationEvidence[],
): boolean {
  return explanations.some((explanation) => {
    if (explanation.sufficient === true) {
      return (
        explanation.distinguishesForceFromMotion === true &&
        explanation.connectsNonzeroForceToChange === true &&
        explanation.treatsZeroNetForceAsUnchanged === true &&
        explanation.doesNotRequireForwardForceToKeepMoving !== false
      );
    }
    if (!explanation.forceMotionAnswers) {
      return false;
    }
    return evaluateCartExplanation({
      forceVsMotion: explanation.forceMotionAnswers.forceVsMotion,
      sameDirection: explanation.forceMotionAnswers.sameDirection,
      oppositeDirection: explanation.forceMotionAnswers.oppositeDirection,
      zeroNetForce: explanation.forceMotionAnswers.zeroNetForce,
      studentExplanation: explanation.text,
    }).sufficient;
  });
}

export function emptyCartExplainInput(): CartExplainInput {
  return {
    forceVsMotion: "",
    sameDirection: "",
    oppositeDirection: "",
    zeroNetForce: "",
    studentExplanation: "",
  };
}

export function completeCartExplainInput(): CartExplainInput {
  return {
    forceVsMotion: "not-same",
    sameDirection: "sped-up",
    oppositeDirection: "slowed-down",
    zeroNetForce: "unchanged",
    studentExplanation: "顺着推会更快，顶着推会更慢，合力为零时原来在动的还可以继续动。",
  };
}
