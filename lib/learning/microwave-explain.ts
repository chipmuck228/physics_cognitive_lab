import { hasOwnWords } from "@/lib/learning/engine-describe";
import {
  looksLikeHeatSlogan,
  looksLikeNounSandwich,
} from "@/lib/learning/microwave-text";
import type { ExplanationEvidence } from "@/types/learning";

export interface MicrowaveExplainInput {
  energyTransfer: string;
  link: string;
  studentExplanation: string;
}

export interface MicrowaveExplainEvaluation {
  identifiesEnergyTransfer: boolean;
  identifiesInternalEnergyChange: boolean;
  identifiesTemperatureRelation: boolean;
  hasMeaningfulExplanation: boolean;
  sufficient: boolean;
}

export function evaluateMicrowaveExplanation(
  input: MicrowaveExplainInput,
): MicrowaveExplainEvaluation {
  const identifiesEnergyTransfer = input.energyTransfer === "energy-entered";
  const identifiesInternalEnergyChange = input.link === "u-and-t";
  const identifiesTemperatureRelation =
    input.link === "energy-and-t" || input.link === "u-and-t";
  const hasMeaningfulExplanation =
    hasOwnWords(input.studentExplanation) &&
    !looksLikeNounSandwich(input.studentExplanation) &&
    !looksLikeHeatSlogan(input.studentExplanation);
  const hasMisconception =
    input.energyTransfer === "heat-stored" ||
    input.link === "t-is-u" ||
    input.link === "microwave-only";

  return {
    identifiesEnergyTransfer,
    identifiesInternalEnergyChange,
    identifiesTemperatureRelation,
    hasMeaningfulExplanation,
    sufficient:
      (identifiesEnergyTransfer || identifiesInternalEnergyChange) &&
      identifiesTemperatureRelation &&
      hasMeaningfulExplanation &&
      !hasMisconception,
  };
}

export function hasSufficientMicrowaveExplanation(
  explanations: ExplanationEvidence[],
): boolean {
  return explanations.some((explanation) => {
    if (explanation.sufficient === true) {
      return explanation.identifiesPartialEnergyRelation === true;
    }
    if (!explanation.microwaveAnswers) {
      return false;
    }
    return evaluateMicrowaveExplanation({
      energyTransfer: explanation.microwaveAnswers.energyTransfer,
      link: explanation.microwaveAnswers.link,
      studentExplanation: explanation.text,
    }).sufficient;
  });
}

export function emptyMicrowaveExplainInput(): MicrowaveExplainInput {
  return {
    energyTransfer: "",
    link: "",
    studentExplanation: "",
  };
}

export function completeMicrowaveExplainInput(): MicrowaveExplainInput {
  return {
    energyTransfer: "energy-entered",
    link: "u-and-t",
    studentExplanation: "能量进入面包后，面包的内能变了，温度升高。",
  };
}
