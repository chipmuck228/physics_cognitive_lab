import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExplanationEvidence } from "@/types/learning";

export interface HeatExplainInput {
  heatVsTemperature: string;
  sameMassSameQ: string;
  sameCSameQ: string;
  timeAndPhase: string;
  studentExplanation: string;
}

export interface HeatExplainEvaluation {
  distinguishesHeatFromTemperature: boolean;
  usesHeatMassTempRelation: boolean;
  checksNoPhaseChangeOrTimeNotQ: boolean;
  rejectsHotterMeansMoreHeat: boolean;
  rejectsSameTimeSameRise: boolean;
  hasMeaningfulExplanation: boolean;
  sufficient: boolean;
}

const MISCONCEPTION_VALUES = new Set([
  "hotter-more-heat",
  "c-is-temperature",
  "larger-c-larger-rise",
  "same-q-same-rise",
  "larger-mass-larger-rise",
  "same-material-same-rise",
  "time-is-q",
  "heating-always-rises",
]);

export function evaluateHeatExplanation(
  input: HeatExplainInput,
): HeatExplainEvaluation {
  const selected = [
    input.heatVsTemperature,
    input.sameMassSameQ,
    input.sameCSameQ,
    input.timeAndPhase,
  ];
  const distinguishesHeatFromTemperature = input.heatVsTemperature === "not-same";
  const usesHeatMassTempRelation =
    input.sameMassSameQ === "larger-c-smaller-rise" &&
    input.sameCSameQ === "larger-mass-smaller-rise";
  const checksNoPhaseChangeOrTimeNotQ = input.timeAndPhase === "time-not-q";
  const rejectsHotterMeansMoreHeat = !selected.includes("hotter-more-heat");
  const rejectsSameTimeSameRise = !selected.includes("time-is-q");
  const hasMeaningfulExplanation = hasOwnWords(input.studentExplanation);
  const hasMisconception = selected.some((value) => MISCONCEPTION_VALUES.has(value));

  return {
    distinguishesHeatFromTemperature,
    usesHeatMassTempRelation,
    checksNoPhaseChangeOrTimeNotQ,
    rejectsHotterMeansMoreHeat,
    rejectsSameTimeSameRise,
    hasMeaningfulExplanation,
    sufficient:
      distinguishesHeatFromTemperature &&
      usesHeatMassTempRelation &&
      checksNoPhaseChangeOrTimeNotQ &&
      hasMeaningfulExplanation &&
      !hasMisconception,
  };
}

export function hasSufficientHeatExplanation(
  explanations: ExplanationEvidence[],
): boolean {
  return explanations.some((explanation) => {
    if (explanation.sufficient === true) {
      return (
        explanation.distinguishesHeatFromTemperature === true &&
        explanation.usesHeatMassTempRelation === true &&
        explanation.checksNoPhaseChangeOrTimeNotQ === true
      );
    }
    if (!explanation.heatAnswers) {
      return false;
    }
    return evaluateHeatExplanation({
      heatVsTemperature: explanation.heatAnswers.heatVsTemperature,
      sameMassSameQ: explanation.heatAnswers.sameMassSameQ,
      sameCSameQ: explanation.heatAnswers.sameCSameQ,
      timeAndPhase: explanation.heatAnswers.timeAndPhase,
      studentExplanation: explanation.text,
    }).sufficient;
  });
}

export function emptyHeatExplainInput(): HeatExplainInput {
  return {
    heatVsTemperature: "",
    sameMassSameQ: "",
    sameCSameQ: "",
    timeAndPhase: "",
    studentExplanation: "",
  };
}

export function completeHeatExplainInput(): HeatExplainInput {
  return {
    heatVsTemperature: "not-same",
    sameMassSameQ: "larger-c-smaller-rise",
    sameCSameQ: "larger-mass-smaller-rise",
    timeAndPhase: "time-not-q",
    studentExplanation:
      "更烫不等于吸热更多。质量相同、能量相近时比热容大的升得慢；同样能量时质量大的升得慢。时间不是能量。",
  };
}
