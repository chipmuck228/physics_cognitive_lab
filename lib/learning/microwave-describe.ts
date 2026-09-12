import { hasOwnWords } from "@/lib/learning/engine-describe";
import { isEverydayHeatOnly } from "@/lib/learning/microwave-text";
import type { DescriptionEvidence } from "@/types/learning";

export type MicrowaveDescribeObject = "bread" | "microwave-only" | "room" | "";
export type MicrowaveDescribeQuantity = "temperature" | "heat-stuff" | "color" | "";
export type MicrowaveDescribeChange = "increases" | "same" | "decreases" | "";

export interface MicrowaveDescribeInput {
  object: MicrowaveDescribeObject;
  quantity: MicrowaveDescribeQuantity;
  change: MicrowaveDescribeChange;
  studentDescription: string;
}

export interface MicrowaveDescribeEvaluation {
  objectIsBread: boolean;
  quantityIsTemperature: boolean;
  changeIsIncrease: boolean;
  hasMeaningfulDescription: boolean;
  everydayHeatOnly: boolean;
  sufficient: boolean;
}

export function evaluateMicrowaveDescription(
  input: MicrowaveDescribeInput,
): MicrowaveDescribeEvaluation {
  const objectIsBread = input.object === "bread";
  const quantityIsTemperature = input.quantity === "temperature";
  const changeIsIncrease = input.change === "increases";
  const everydayHeatOnly = isEverydayHeatOnly(input.studentDescription);
  const hasMeaningfulDescription =
    hasOwnWords(input.studentDescription) && !everydayHeatOnly;

  return {
    objectIsBread,
    quantityIsTemperature,
    changeIsIncrease,
    hasMeaningfulDescription,
    everydayHeatOnly,
    sufficient:
      objectIsBread &&
      quantityIsTemperature &&
      changeIsIncrease &&
      hasMeaningfulDescription,
  };
}

export function hasSufficientMicrowaveDescription(
  descriptions: DescriptionEvidence[],
): boolean {
  return descriptions.some((description) => {
    if (description.sufficient === true) {
      return (
        description.object === "bread" &&
        description.quantity === "temperature" &&
        description.change === "increases"
      );
    }
    return false;
  });
}

export function emptyMicrowaveDescribeInput(): MicrowaveDescribeInput {
  return {
    object: "",
    quantity: "",
    change: "",
    studentDescription: "",
  };
}

export function completeMicrowaveDescribeInput(): MicrowaveDescribeInput {
  return {
    object: "bread",
    quantity: "temperature",
    change: "increases",
    studentDescription: "面包的温度升高了。",
  };
}
