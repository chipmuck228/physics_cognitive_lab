import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExplanationEvidence } from "@/types/learning";

export interface OhmsExplainInput {
  quantitiesDistinct: string;
  sameR: string;
  sameU: string;
  studentExplanation: string;
}

const MISCONCEPTION = new Set([
  "same-thing",
  "voltage-alone",
  "larger-r-larger-i",
  "formula-enough",
]);

export function evaluateOhmsExplanation(input: OhmsExplainInput) {
  const quantitiesDistinct = input.quantitiesDistinct === "distinct";
  const sameROk = input.sameR === "larger-u-larger-i";
  const sameUOk = input.sameU === "larger-r-smaller-i";
  const hasMeaningfulExplanation = hasOwnWords(input.studentExplanation);
  const hasMisconception = [input.quantitiesDistinct, input.sameR, input.sameU].some(
    (value) => MISCONCEPTION.has(value),
  );
  const oneControl = sameROk || sameUOk;
  return {
    quantitiesDistinct,
    usesPartialRelation: oneControl,
    hasMeaningfulExplanation,
    sufficient:
      quantitiesDistinct &&
      oneControl &&
      hasMeaningfulExplanation &&
      !hasMisconception,
    completeBothControls: sameROk && sameUOk,
  };
}

export function hasSufficientOhmsExplanation(
  explanations: ExplanationEvidence[],
): boolean {
  return explanations.some((explanation) => {
    if (explanation.sufficient === true) {
      return true;
    }
    if (!explanation.ohmsAnswers) {
      return false;
    }
    return evaluateOhmsExplanation({
      quantitiesDistinct: explanation.ohmsAnswers.quantitiesDistinct,
      sameR: explanation.ohmsAnswers.sameR,
      sameU: explanation.ohmsAnswers.sameU,
      studentExplanation: explanation.text,
    }).sufficient;
  });
}

export function emptyOhmsExplainInput(): OhmsExplainInput {
  return {
    quantitiesDistinct: "",
    sameR: "",
    sameU: "",
    studentExplanation: "",
  };
}

export function completeOhmsExplainInput(): OhmsExplainInput {
  return {
    quantitiesDistinct: "distinct",
    sameR: "larger-u-larger-i",
    sameU: "",
    studentExplanation: "电流、电压、电阻不是一回事。电阻不变时，电压更大电流更大。",
  };
}
