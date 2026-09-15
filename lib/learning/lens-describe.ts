import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { DescriptionEvidence } from "@/types/learning";

export interface LensDescribeInput {
  object: "optical-bench" | "only-screen" | "only-lens" | "";
  quantities: "object-f-image-screen" | "image-is-screen" | "unsure" | "";
  change: "object-or-screen-changes-view" | "always-same" | "just-changed" | "";
  studentDescription: string;
}

const VAGUE = /^(变了|像不一样|不一样|好看|变模糊了)?[。.!！]*$/;

export function evaluateLensDescription(input: LensDescribeInput) {
  const objectOk = input.object === "optical-bench";
  const quantitiesOk = input.quantities === "object-f-image-screen";
  const changeOk = input.change === "object-or-screen-changes-view";
  // Physics: the learner must distinguish object / F / image / screen and say
  // a visible change in ordinary Grade-9 Chinese. Token length is a vagueness
  // floor, not a required textbook word. "变了" still fails; a short ordinary
  // sentence may pass.
  const compact = input.studentDescription.replace(/\s+/g, "");
  const notVague = !VAGUE.test(compact) && compact.length >= 4;
  const hasMeaningfulDescription = hasOwnWords(input.studentDescription) && notVague;
  return {
    objectOk,
    quantitiesOk,
    changeOk,
    hasMeaningfulDescription,
    sufficient: objectOk && quantitiesOk && changeOk && hasMeaningfulDescription,
  };
}

export function hasSufficientLensDescription(
  descriptions: DescriptionEvidence[],
): boolean {
  return descriptions.some((description) => description.sufficient === true);
}

export function emptyLensDescribeInput(): LensDescribeInput {
  return {
    object: "",
    quantities: "",
    change: "",
    studentDescription: "",
  };
}
