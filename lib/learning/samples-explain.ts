import {
  SAMPLES_EXPLAIN_ACCEPTED,
  SAMPLES_EXPLAIN_REJECT_IDS,
} from "@/lib/content/equal-volume-material-samples";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExplanationEvidence } from "@/types/learning";

export interface SamplesExplainInput {
  densityVsMass: string;
  sameVolume: string;
  sameMass: string;
  uniformCut: string;
  studentExplanation: string;
}

export interface SamplesExplainEvaluation {
  distinguishesDensityFromMassOrSize: boolean;
  usesMassVolumeRatio: boolean;
  checksUniformCutCondition: boolean;
  rejectsHeavierAlwaysDenser: boolean;
  rejectsBiggerAlwaysDenser: boolean;
  rejectsCutLowersDensity: boolean;
  hasMeaningfulExplanation: boolean;
  sufficient: boolean;
}

const MISCONCEPTION_VALUES = new Set<string>(SAMPLES_EXPLAIN_REJECT_IDS);

export function evaluateSamplesExplanation(
  input: SamplesExplainInput,
): SamplesExplainEvaluation {
  const selected = [
    input.densityVsMass,
    input.sameVolume,
    input.sameMass,
    input.uniformCut,
  ];
  const rejectsHeavierAlwaysDenser = !selected.includes("heavier-always-denser");
  const rejectsBiggerAlwaysDenser = !selected.includes("bigger-always-denser");
  const rejectsCutLowersDensity =
    !selected.includes("cut-lowers-density") &&
    !selected.includes("mass-down-density-down");
  const distinguishesDensityFromMassOrSize =
    input.densityVsMass === SAMPLES_EXPLAIN_ACCEPTED.densityVsMass &&
    !selected.includes("density-is-mass") &&
    !selected.includes("density-is-size");
  const usesMassVolumeRatio =
    input.sameVolume === SAMPLES_EXPLAIN_ACCEPTED.sameVolume &&
    input.sameMass === SAMPLES_EXPLAIN_ACCEPTED.sameMass;
  const checksUniformCutCondition =
    input.uniformCut === SAMPLES_EXPLAIN_ACCEPTED.uniformCut;
  const hasMeaningfulExplanation = hasOwnWords(input.studentExplanation);
  const hasMisconception = selected.some((value) => MISCONCEPTION_VALUES.has(value));

  return {
    distinguishesDensityFromMassOrSize,
    usesMassVolumeRatio,
    checksUniformCutCondition,
    rejectsHeavierAlwaysDenser,
    rejectsBiggerAlwaysDenser,
    rejectsCutLowersDensity,
    hasMeaningfulExplanation,
    sufficient:
      distinguishesDensityFromMassOrSize &&
      usesMassVolumeRatio &&
      checksUniformCutCondition &&
      hasMeaningfulExplanation &&
      !hasMisconception,
  };
}

export function hasSufficientSamplesExplanation(
  explanations: ExplanationEvidence[],
): boolean {
  return explanations.some((explanation) => {
    if (explanation.sufficient === true) {
      return (
        explanation.distinguishesDensityFromMassOrSize === true &&
        explanation.usesMassVolumeRatio === true &&
        explanation.checksUniformCutCondition === true
      );
    }
    if (!explanation.densityAnswers) {
      return false;
    }
    return evaluateSamplesExplanation({
      densityVsMass: explanation.densityAnswers.densityVsMass,
      sameVolume: explanation.densityAnswers.sameVolume,
      sameMass: explanation.densityAnswers.sameMass,
      uniformCut: explanation.densityAnswers.uniformCut,
      studentExplanation: explanation.text,
    }).sufficient;
  });
}

export function emptySamplesExplainInput(): SamplesExplainInput {
  return {
    densityVsMass: "",
    sameVolume: "",
    sameMass: "",
    uniformCut: "",
    studentExplanation: "",
  };
}

export function completeSamplesExplainInput(): SamplesExplainInput {
  return {
    densityVsMass: SAMPLES_EXPLAIN_ACCEPTED.densityVsMass,
    sameVolume: SAMPLES_EXPLAIN_ACCEPTED.sameVolume,
    sameMass: SAMPLES_EXPLAIN_ACCEPTED.sameMass,
    uniformCut: SAMPLES_EXPLAIN_ACCEPTED.uniformCut,
    studentExplanation:
      "密度不是更重也不是更大。体积相同时更沉的更密，质量相同时更大的更疏，均匀切开后密度不必变。",
  };
}
