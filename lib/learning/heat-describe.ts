import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { DescriptionEvidence } from "@/types/learning";

export type HeatDescribeObject = "samples" | "heater-only" | "labels-only" | "";
export type HeatMassRelation = "same" | "different" | "unsure" | "";
export type HeatTemperatureRelation = "different" | "same" | "unsure" | "";

export interface HeatDescribeInput {
  object: HeatDescribeObject;
  massRelation: HeatMassRelation;
  temperatureRelation: HeatTemperatureRelation;
  studentDescription: string;
}

export interface HeatDescribeEvaluation {
  objectIsSamples: boolean;
  noticedSameMass: boolean;
  noticedDifferentRise: boolean;
  hasMeaningfulDescription: boolean;
  sufficient: boolean;
}

export function evaluateHeatDescription(
  input: HeatDescribeInput,
): HeatDescribeEvaluation {
  const objectIsSamples = input.object === "samples";
  const noticedSameMass = input.massRelation === "same";
  const noticedDifferentRise = input.temperatureRelation === "different";
  const hasMeaningfulDescription = hasOwnWords(input.studentDescription);

  return {
    objectIsSamples,
    noticedSameMass,
    noticedDifferentRise,
    hasMeaningfulDescription,
    sufficient:
      objectIsSamples &&
      noticedSameMass &&
      noticedDifferentRise &&
      hasMeaningfulDescription,
  };
}

export function hasSufficientHeatDescription(
  descriptions: DescriptionEvidence[],
): boolean {
  return descriptions.some((description) => description.sufficient === true);
}

export function emptyHeatDescribeInput(): HeatDescribeInput {
  return {
    object: "",
    massRelation: "",
    temperatureRelation: "",
    studentDescription: "",
  };
}
