import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { DescriptionEvidence } from "@/types/learning";

export type CartDescribeObject = "cart" | "track-only" | "arrow-only" | "";
export type CartInitialMotion = "still" | "moving-left" | "moving-right" | "";
export type CartForceDirection = "none" | "left" | "right" | "";
export type CartObservedChange =
  | "started-moving"
  | "sped-up"
  | "slowed-down"
  | "reversed"
  | "unchanged"
  | "";

export interface CartDescribeInput {
  object: CartDescribeObject;
  initialMotionState: CartInitialMotion;
  forceDirection: CartForceDirection;
  observedChange: CartObservedChange;
  studentDescription: string;
}

export interface CartDescribeEvaluation {
  objectIsCart: boolean;
  hasInitialMotion: boolean;
  hasForceDirection: boolean;
  noticedDemoChange: boolean;
  hasMeaningfulDescription: boolean;
  sufficient: boolean;
}

export function evaluateCartDescription(
  input: CartDescribeInput,
): CartDescribeEvaluation {
  const objectIsCart = input.object === "cart";
  const hasInitialMotion = input.initialMotionState === "still";
  const hasForceDirection =
    input.forceDirection === "right" || input.forceDirection === "none";
  const noticedDemoChange =
    input.observedChange === "started-moving" ||
    input.observedChange === "sped-up";
  const hasMeaningfulDescription = hasOwnWords(input.studentDescription);

  return {
    objectIsCart,
    hasInitialMotion,
    hasForceDirection,
    noticedDemoChange,
    hasMeaningfulDescription,
    sufficient:
      objectIsCart &&
      hasInitialMotion &&
      hasForceDirection &&
      noticedDemoChange &&
      hasMeaningfulDescription,
  };
}

export function hasSufficientCartDescription(
  descriptions: DescriptionEvidence[],
): boolean {
  return descriptions.some((description) => description.sufficient === true);
}

export function emptyCartDescribeInput(): CartDescribeInput {
  return {
    object: "",
    initialMotionState: "",
    forceDirection: "",
    observedChange: "",
    studentDescription: "",
  };
}
