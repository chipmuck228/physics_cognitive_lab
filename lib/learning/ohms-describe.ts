import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { DescriptionEvidence } from "@/types/learning";

export interface OhmsDescribeInput {
  object: "resistor-circuit" | "battery-only" | "wires-only" | "";
  quantities: "i-u-r" | "current-only" | "unsure" | "";
  change: "readings-differ" | "all-same" | "unsure" | "";
  studentDescription: string;
}

export function evaluateOhmsDescription(input: OhmsDescribeInput) {
  const objectOk = input.object === "resistor-circuit";
  const quantitiesOk = input.quantities === "i-u-r";
  const changeOk = input.change === "readings-differ";
  const hasMeaningfulDescription = hasOwnWords(input.studentDescription);
  return {
    objectOk,
    quantitiesOk,
    changeOk,
    hasMeaningfulDescription,
    sufficient: objectOk && quantitiesOk && changeOk && hasMeaningfulDescription,
  };
}

export function hasSufficientOhmsDescription(
  descriptions: DescriptionEvidence[],
): boolean {
  return descriptions.some((description) => description.sufficient === true);
}

export function emptyOhmsDescribeInput(): OhmsDescribeInput {
  return {
    object: "",
    quantities: "",
    change: "",
    studentDescription: "",
  };
}
