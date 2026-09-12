import { SAMPLES_DESCRIBE_ACCEPTED } from "@/lib/content/equal-volume-material-samples";
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
  const objectIsSamples = input.object === SAMPLES_DESCRIBE_ACCEPTED.object;
  const noticedSameSize = input.sizeRelation === SAMPLES_DESCRIBE_ACCEPTED.sizeRelation;
  const noticedMassDifference =
    input.massRelation === SAMPLES_DESCRIBE_ACCEPTED.massRelation;
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
