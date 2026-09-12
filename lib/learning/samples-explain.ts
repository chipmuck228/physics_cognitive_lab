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

const MISCONCEPTION_VALUES = new Set([
  "density-is-mass",
  "density-is-size",
  "heavier-always-denser",
  "bigger-always-denser",
  "cut-lowers-density",
  "mass-down-density-down",
]);

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
    input.densityVsMass === "not-same" &&
    !selected.includes("density-is-mass") &&
    !selected.includes("density-is-size");
  const usesMassVolumeRatio =
    input.sameVolume === "heavier-denser" &&
    input.sameMass === "larger-less-dense";
  const checksUniformCutCondition = input.uniformCut === "density-unchanged";
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
    densityVsMass: "not-same",
    sameVolume: "heavier-denser",
    sameMass: "larger-less-dense",
    uniformCut: "density-unchanged",
    studentExplanation:
      "密度不是更重也不是更大。体积相同时更沉的更密，质量相同时更大的更疏，均匀切开后密度不必变。",
  };
}
