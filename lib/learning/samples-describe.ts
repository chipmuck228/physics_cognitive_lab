import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { DescriptionEvidence } from "@/types/learning";

export type SamplesDescribeObject = "samples" | "scale-only" | "labels-only" | "";
export type SamplesSizeRelation = "same" | "different" | "unsure" | "";
export type SamplesMassRelation = "different" | "same" | "unsure" | "";

export interface SamplesDescribeInput {
  object: SamplesDescribeObject;
  sizeRelation: SamplesSizeRelation;
  massRelation: SamplesMassRelation;
  studentDescription: string;
}

export interface SamplesDescribeEvaluation {
  objectIsSamples: boolean;
  noticedSameSize: boolean;
  noticedMassDifference: boolean;
  hasMeaningfulDescription: boolean;
  sufficient: boolean;
}

export function evaluateSamplesDescription(
  input: SamplesDescribeInput,
): SamplesDescribeEvaluation {
  const objectIsSamples = input.object === "samples";
  const noticedSameSize = input.sizeRelation === "same";
  const noticedMassDifference = input.massRelation === "different";
  const hasMeaningfulDescription = hasOwnWords(input.studentDescription);

  return {
    objectIsSamples,
    noticedSameSize,
    noticedMassDifference,
    hasMeaningfulDescription,
    sufficient:
      objectIsSamples &&
      noticedSameSize &&
      noticedMassDifference &&
      hasMeaningfulDescription,
  };
}

export function hasSufficientSamplesDescription(
  descriptions: DescriptionEvidence[],
): boolean {
  return descriptions.some((description) => description.sufficient === true);
}

export function emptySamplesDescribeInput(): SamplesDescribeInput {
  return {
    object: "",
    sizeRelation: "",
    massRelation: "",
    studentDescription: "",
  };
}
