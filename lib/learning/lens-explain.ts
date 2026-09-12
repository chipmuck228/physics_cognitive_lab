import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExplanationEvidence } from "@/types/learning";

export interface LensExplainInput {
  meetingFragment: string;
  screenFragment: string;
  studentExplanation: string;
}

const VALID_MEETING = new Set([
  "actual-convergence",
  "backward-extension",
  "no-finite-meeting",
]);
const VALID_SCREEN = new Set(["screen-receives-real", "virtual-not-on-screen"]);

export function evaluateLensExplanation(input: LensExplainInput) {
  const meetingOk = VALID_MEETING.has(input.meetingFragment);
  const screenOk = VALID_SCREEN.has(input.screenFragment);
  const sloganOnly = input.meetingFragment === "slogan-only";
  const noImageIfNoScreen = input.screenFragment === "no-image-if-no-screen";
  const hasMeaningfulExplanation = hasOwnWords(input.studentExplanation);
  const tableAsModel = /倒立缩小实像|五种情况/.test(input.studentExplanation.replace(/\s+/g, ""))
    && !/真正会聚|反向延长|不相交/.test(input.studentExplanation.replace(/\s+/g, ""));
  return {
    meetingOk,
    screenOk,
    sloganOnly,
    hasMeaningfulExplanation,
    sufficient:
      (meetingOk || screenOk) &&
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
    meetingFragment: "actual-convergence",
    screenFragment: "virtual-not-on-screen",
    studentExplanation: "有的位置光线真正会聚，光屏才能接到；焦点以内只有反向延长线相交，屏接不到。",
  };
}
