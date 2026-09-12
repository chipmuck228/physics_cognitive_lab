import { classifyExplanationLevel } from "@/lib/learning/explanation";
import { independentExplanationUsesModel } from "@/lib/learning/independent";
import type {
  LearningSession,
  StudentCognitiveProfile,
} from "@/types/learning";

export interface ReflectionDimension {
  id: keyof StudentCognitiveProfile;
  label: string;
  value: number;
}

export function buildCognitiveProfile(
  session: LearningSession,
): StudentCognitiveProfile {
  const latestDescription = session.descriptions.at(-1);
  const latestExplanation = session.explanations.at(-1);
  const sharedTransfers = session.transferAttempts.filter(
    (attempt) => attempt.identifiedSharedModel,
  ).length;
  const independentText = session.independentAssessment?.explanation ?? "";

  let physicalDescription = 0;
  if (latestDescription) {
    physicalDescription =
      latestDescription.quantity && latestDescription.change ? 4 : 2;
  }

  const causalExplanation = latestExplanation?.explanationLevel ?? 0;
  const modeling = session.modelAttempts.some((attempt) => attempt.correctStructure)
    ? 4
    : session.modelAttempts.length > 0
      ? 2
      : 0;
  const transfer =
    session.transferAttempts.length === 0
      ? 0
      : Math.min(4, Math.round((sharedTransfers / 3) * 4) || 1);

  let independentProblemSolving = 0;
  if (session.independentAssessment?.explanation) {
    independentProblemSolving = independentExplanationUsesModel(independentText)
      ? classifyExplanationLevel(independentText) >= 3
        ? 4
        : 3
      : 2;
  }

  return {
    physicalDescription,
    causalExplanation,
    modeling,
    transfer,
    independentProblemSolving,
  };
}

export function reflectionDimensions(
  profile: StudentCognitiveProfile,
): ReflectionDimension[] {
  return [
    { id: "physicalDescription", label: "说清楚发生了什么", value: profile.physicalDescription ?? 0 },
    { id: "causalExplanation", label: "说清为什么", value: profile.causalExplanation ?? 0 },
    { id: "modeling", label: "把想法连起来", value: profile.modeling ?? 0 },
    { id: "transfer", label: "换个情况也能解释", value: profile.transfer ?? 0 },
    {
      id: "independentProblemSolving",
      label: "自己完成",
      value: profile.independentProblemSolving ?? 0,
    },
  ];
}

export function summarizeReflection(profile: StudentCognitiveProfile): string {
  const description = profile.physicalDescription ?? 0;
  const explanation = profile.causalExplanation ?? 0;
  const modeling = profile.modeling ?? 0;
  const transfer = profile.transfer ?? 0;
  const independent = profile.independentProblemSolving ?? 0;

  if (explanation >= 3 && transfer >= 3 && independent >= 3) {
    return "你把温度变化和能量进入联系起来了，换个情况也能这样想。接下来可以再分清：能量进来的方式不一定相同。";
  }

  if (modeling >= 4 && explanation >= 2) {
    return "你把能量进入和温度升高连起来了。接下来可以看看：情况换了，这个想法还能不能用。";
  }

  if (description >= 3 && explanation < 3) {
    return "你已经能用温度来描述变化。接下来可以再想：能量进入以后，系统里面发生了什么。";
  }

  return "你留下了观察和思考。接下来可以把“能量进入”和“温度升高”之间的关系说得更清楚。";
}
