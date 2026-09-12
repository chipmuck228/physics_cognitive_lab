import {
  ENGINE_EXPLAIN_STEP1,
  ENGINE_EXPLAIN_STEP2,
  ENGINE_EXPLAIN_STEP3,
} from "@/lib/content/four-stroke-engine";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExplanationEvidence } from "@/types/learning";

export interface EngineExplainInput {
  firstChange: string;
  gasEffect: string;
  mechanicalGain: string;
  studentExplanation: string;
}

export interface EngineExplainEvaluation {
  referencesCombustionOrEnergyRelease: boolean;
  identifiesWorkingGasChange: boolean;
  identifiesMechanicalInteraction: boolean;
  identifiesWorkLikeCausalLink: boolean;
  distinguishesCombustionFromDirectMechanicalOutput: boolean;
  treatsCombustionAsDirectOutput: boolean;
  hasMeaningfulExplanation: boolean;
  sufficient: boolean;
}

export function evaluateEngineExplanation(
  input: EngineExplainInput,
): EngineExplainEvaluation {
  const identifiesWorkingGasChange = input.firstChange === "working-gas";
  const identifiesMechanicalInteraction = input.gasEffect === "gas-pushes";
  const identifiesWorkLikeCausalLink = input.mechanicalGain === "work-like";
  const treatsCombustionAsDirectOutput =
    input.firstChange === "direct-crank" ||
    input.gasEffect === "fire-turns" ||
    input.mechanicalGain === "fire-is-power";
  const distinguishesCombustionFromDirectMechanicalOutput =
    !treatsCombustionAsDirectOutput;
  const referencesCombustionOrEnergyRelease =
    identifiesWorkingGasChange || /燃烧|燃料/.test(input.studentExplanation);
  const hasMeaningfulExplanation = hasOwnWords(input.studentExplanation);

  return {
    referencesCombustionOrEnergyRelease,
    identifiesWorkingGasChange,
    identifiesMechanicalInteraction,
    identifiesWorkLikeCausalLink,
    distinguishesCombustionFromDirectMechanicalOutput,
    treatsCombustionAsDirectOutput,
    hasMeaningfulExplanation,
    sufficient:
      identifiesWorkingGasChange &&
      identifiesMechanicalInteraction &&
      distinguishesCombustionFromDirectMechanicalOutput &&
      input.mechanicalGain !== "stroke-names" &&
      hasMeaningfulExplanation,
  };
}

export function hasSufficientEngineExplanation(
  explanations: ExplanationEvidence[],
): boolean {
  return explanations.some((explanation) => {
    if (explanation.sufficient === true) {
      return (
        explanation.identifiesWorkingGasChange === true &&
        explanation.identifiesMechanicalInteraction === true &&
        explanation.distinguishesCombustionFromDirectMechanicalOutput === true
      );
    }
    if (!explanation.engineAnswers) {
      return false;
    }
    return evaluateEngineExplanation({
      firstChange: explanation.engineAnswers.firstChange,
      gasEffect: explanation.engineAnswers.gasEffect,
      mechanicalGain: explanation.engineAnswers.mechanicalGain,
      studentExplanation: explanation.text,
    }).sufficient;
  });
}

export const ENGINE_EXPLAIN_DRAFT_KIND = "engine-explain-draft";

export interface EngineExplainDraft {
  kind: typeof ENGINE_EXPLAIN_DRAFT_KIND;
  firstChange: string;
  gasEffect: string;
  mechanicalGain: string;
  studentExplanation: string;
}

export function latestEngineExplainDraft(
  events: Array<{ metadata?: Record<string, unknown> }>,
): EngineExplainDraft | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const metadata = events[index]?.metadata;
    if (metadata?.kind === ENGINE_EXPLAIN_DRAFT_KIND) {
      return {
        kind: ENGINE_EXPLAIN_DRAFT_KIND,
        firstChange: typeof metadata.firstChange === "string" ? metadata.firstChange : "",
        gasEffect: typeof metadata.gasEffect === "string" ? metadata.gasEffect : "",
        mechanicalGain:
          typeof metadata.mechanicalGain === "string" ? metadata.mechanicalGain : "",
        studentExplanation:
          typeof metadata.studentExplanation === "string"
            ? metadata.studentExplanation
            : "",
      };
    }
  }
  return null;
}

export function explainOptionLabel(
  step: 1 | 2 | 3,
  value: string,
): string {
  const options =
    step === 1
      ? ENGINE_EXPLAIN_STEP1
      : step === 2
        ? ENGINE_EXPLAIN_STEP2
        : ENGINE_EXPLAIN_STEP3;
  return options.find((option) => option.value === value)?.label ?? value;
}
