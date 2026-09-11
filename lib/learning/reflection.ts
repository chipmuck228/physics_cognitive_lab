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
    { id: "physicalDescription", label: "Describe phenomenon", value: profile.physicalDescription ?? 0 },
    { id: "causalExplanation", label: "Explain cause", value: profile.causalExplanation ?? 0 },
    { id: "modeling", label: "Build model", value: profile.modeling ?? 0 },
    { id: "transfer", label: "Transfer model", value: profile.transfer ?? 0 },
    {
      id: "independentProblemSolving",
      label: "Solve independently",
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
    return "You were able to connect temperature change with energy entering a system, and you used that idea in new situations. Your next challenge is distinguishing different ways energy can be transferred.";
  }

  if (modeling >= 4 && explanation >= 2) {
    return "You constructed the energy-to-temperature model. Your next challenge is using that same structure when the surface story changes.";
  }

  if (description >= 3 && explanation < 3) {
    return "You could describe the temperature change in physics language. Your next challenge is explaining what changes inside the system when energy enters.";
  }

  return "You left traces of observation and reasoning. Your next challenge is making the link between energy entering a system and temperature change more explicit.";
}
