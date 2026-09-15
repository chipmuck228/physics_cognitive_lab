import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExplanationEvidence } from "@/types/learning";

export interface LensExplainInput {
  meetingFragment: string;
  screenFragment: string;
  studentExplanation: string;
}

const VALID_MEETING = new Set(["sometimes-receives"]);
const VALID_SCREEN = new Set(["visible-not-same"]);

export function evaluateLensExplanation(input: LensExplainInput) {
  const meetingOk = VALID_MEETING.has(input.meetingFragment);
  const screenOk = VALID_SCREEN.has(input.screenFragment);
  const sloganOnly = input.meetingFragment === "slogan-only";
  const noImageIfNoScreen = input.screenFragment === "no-image-if-no-screen";
  const hasMeaningfulExplanation = hasOwnWords(input.studentExplanation);
  const tableAsModel =
    /倒立缩小实像|五种情况/.test(input.studentExplanation.replace(/\s+/g, "")) &&
    !/接到|碰不到|看不见|光屏/.test(input.studentExplanation.replace(/\s+/g, ""));
  return {
    meetingOk,
    screenOk,
    sloganOnly,
    hasMeaningfulExplanation,
    sufficient:
      meetingOk &&
      screenOk &&
      hasMeaningfulExplanation &&
      !sloganOnly &&
      !noImageIfNoScreen &&
      !tableAsModel,
  };
}

export function hasSufficientLensExplanation(
  explanations: ExplanationEvidence[],
): boolean {
  return explanations.some((explanation) => {
    if (explanation.sufficient === true) {
      return true;
    }
    if (!explanation.lensAnswers) {
      return false;
    }
    return evaluateLensExplanation({
      meetingFragment: explanation.lensAnswers.meetingFragment,
      screenFragment: explanation.lensAnswers.screenFragment,
      studentExplanation: explanation.text,
    }).sufficient;
  });
}

export function emptyLensExplainInput(): LensExplainInput {
  return {
    meetingFragment: "",
    screenFragment: "",
    studentExplanation: "",
  };
}

export function completeLensExplainInput(): LensExplainInput {
  return {
    meetingFragment: "sometimes-receives",
    screenFragment: "visible-not-same",
    studentExplanation:
      "有的位置光屏能接到清楚的像，放到 F 或 F 里面怎么移都接不到。透过透镜能看见也不等于光屏能接到。",
  };
}
