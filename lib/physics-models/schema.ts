import { TutorAction } from "@/types/ai";
import { LearningStage } from "@/types/learning";
import { ExperimentEvidenceKind, HintLevelId } from "@/types/physics-model";
import { z } from "zod";

const learningStageSchema = z.enum([
  LearningStage.ENTRY,
  LearningStage.OBSERVE,
  LearningStage.DESCRIBE,
  LearningStage.PREDICT,
  LearningStage.EXPERIMENT,
  LearningStage.EXPLAIN,
  LearningStage.MODEL,
  LearningStage.TRANSFER,
  LearningStage.EXAM,
  LearningStage.AI_OFF,
  LearningStage.COMPLETE,
]);

const tutorActionSchema = z.enum([
  TutorAction.ASK,
  TutorAction.HINT,
  TutorAction.CHALLENGE,
  TutorAction.ENCOURAGE,
  TutorAction.EXPLAIN,
]);

const hintLevelSchema = z.enum([
  HintLevelId.H1,
  HintLevelId.H2,
  HintLevelId.H3,
  HintLevelId.H4,
  HintLevelId.H5,
]);

const experimentEvidenceKindSchema = z.enum([
  ExperimentEvidenceKind.PREDICTION,
  ExperimentEvidenceKind.INTERVENTION,
  ExperimentEvidenceKind.OBSERVED_RESULT,
  ExperimentEvidenceKind.PREDICTION_VS_RESULT,
  ExperimentEvidenceKind.REFLECTION,
]);

const quantitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  symbol: z.string().optional(),
  unit: z.string().optional(),
  role: z.enum(["input", "state", "observable", "controlled", "derived"]),
  studentLanguage: z.array(z.string().min(1)).min(1),
  misconceptions: z.array(z.string().min(1)).optional(),
});

const causalRelationSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  relation: z.enum(["causes", "changes", "transfers", "converts", "depends-on"]),
  direction: z.enum(["increase", "decrease", "bidirectional"]).optional(),
  conditions: z.array(z.string().min(1)).optional(),
});

const energyRelationSchema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  mechanism: z.enum(["heat-transfer", "work", "conversion", "mixed"]),
  description: z.string().min(1),
  conditions: z.array(z.string().min(1)).optional(),
});

const conditionSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  importance: z.enum(["essential", "important", "contextual"]),
});

const counterexampleSchema = z.object({
  scenario: z.string().min(1),
  whyModelFails: z.string().min(1),
  requiredNewModel: z.string().min(1).optional(),
});

const tutorInterventionSchema = z.object({
  hintLevel: hintLevelSchema,
  action: tutorActionSchema,
  prompt: z.string().min(1),
});

const misconceptionSchema = z.object({
  id: z.string().min(1),
  statement: z.string().min(1),
  diagnosticSignals: z.array(z.string().min(1)).min(1),
  severity: z.enum(["low", "medium", "high"]),
  recommendedInterventions: z.array(tutorInterventionSchema).min(1),
});

const phenomenonSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  modelRole: z.enum(["anchor", "supporting", "transfer"]),
  observableChanges: z.array(z.string().min(1)).min(1),
  relatedVariables: z.array(z.string().min(1)).min(1),
});

const experimentOperationSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  variable: z.string().min(1).optional(),
  values: z.array(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const evidenceRequirementSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
});

const sceneDefinitionSchema = z.object({
  id: z.string().min(1),
  primaryModel: z.string().min(1),
  secondaryModels: z.array(z.string().min(1)).optional(),
  phenomenonId: z.string().min(1),
  visualType: z.enum(["interactive", "simulation", "observation", "exam"]),
  controllableVariables: z.array(z.string().min(1)),
  observableVariables: z.array(z.string().min(1)),
  experimentOperations: z.array(experimentOperationSchema),
  physicsEngine: z.string().min(1),
  targetEvidence: z.array(evidenceRequirementSchema).min(1),
});

const experimentEvidenceSpecSchema = z.object({
  kind: experimentEvidenceKindSchema,
  required: z.boolean(),
  notes: z.string().optional(),
});

const experimentDefinitionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  controllableVariables: z.array(z.string().min(1)).min(1),
  fixedVariables: z.array(z.string().min(1)),
  predictedVariables: z.array(z.string().min(1)).min(1),
  allowedOperations: z.array(experimentOperationSchema).min(1),
  expectedEvidence: z.array(experimentEvidenceSpecSchema).min(5),
  informationGain: z.enum(["low", "medium", "high"]),
});

const transferTargetBaseSchema = z.object({
  id: z.string().min(1),
  level: z.enum(["near", "medium", "far", "exam"]),
  scenario: z.string().min(1),
  surfaceFeatures: z.array(z.string().min(1)).min(1),
  deepStructure: z.array(z.string().min(1)).min(1),
  requiresConditionCheck: z.boolean().optional(),
});

const transferTargetSchema = z.discriminatedUnion("transferMode", [
  transferTargetBaseSchema.extend({
    transferMode: z.literal("full-model"),
    expectedModelId: z.string().min(1),
  }),
  transferTargetBaseSchema.extend({
    transferMode: z.literal("partial-structure"),
    expectedModelId: z.string().min(1).optional(),
    transferableRelations: z.array(z.string().min(1)).min(1),
    nonTransferableRelations: z.array(z.string().min(1)).min(1),
  }),
  transferTargetBaseSchema.extend({
    transferMode: z.literal("boundary-contrast"),
    expectedModelId: z.string().min(1).optional(),
  }),
]);

const examPatternSchema = z.object({
  id: z.string().min(1),
  format: z.enum([
    "multiple-choice",
    "fill-blank",
    "short-answer",
    "calculation",
    "diagram",
    "experimental",
  ]),
  representation: z.string().min(1),
  testedModel: z.string().min(1),
  commonDistractors: z.array(z.string().min(1)).optional(),
  requiredReasoning: z.array(z.string().min(1)).min(1),
  difficulty: z.enum(["basic", "medium", "advanced"]),
  requiredCognitiveActions: z.array(z.string().min(1)).min(1),
  stem: z.string().min(1),
  representationOptions: z.array(z.string().min(1)).min(2),
  modelOptions: z.array(z.string().min(1)).min(2),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.string().min(1),
  reasoningPrompt: z.string().min(1),
});

const tutorPolicySchema = z.object({
  allowedActionsByStage: z.record(learningStageSchema, z.array(tutorActionSchema)),
  answerLeakageRules: z.array(z.string().min(1)).min(1),
  hintLadder: z
    .array(
      z.object({
        id: hintLevelSchema,
        prompt: z.string().min(1),
      }),
    )
    .length(5),
  misconceptionStrategies: z.array(
    z.object({
      misconceptionId: z.string().min(1),
      approach: z.string().min(1),
    }),
  ),
  maxExplanationLength: z.number().int().positive().optional(),
});

const independentChallengeSchema = z.object({
  id: z.string().min(1),
  scenario: z.string().min(1),
  unfamiliarity: z.enum(["low", "medium", "high"]),
  question: z.string().min(1),
  expectedModelId: z.string().min(1),
  requiredEvidence: z.array(evidenceRequirementSchema).min(1),
  llmAllowed: z.literal(false),
});

const modelEvaluatorSchema = z.object({
  requiredComponents: z
    .record(z.string().min(1), z.string().min(1))
    .refine((value) => Object.keys(value).length >= 1, {
      message: "requiredComponents must include at least one model-owned component.",
    }),
  evidenceLevels: z.object({
    L1: z.string().min(1),
    L2: z.string().min(1),
    L3: z.string().min(1),
    L4: z.string().min(1),
    L5: z.string().min(1),
    L6: z.string().min(1),
  }),
});

export const physicsModelSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  coreIdea: z.string().min(1),
  domain: z
    .array(
      z.enum([
        "mechanics",
        "energy",
        "thermal",
        "electricity",
        "magnetism",
        "optics",
        "sound",
        "pressure",
        "matter",
        "measurement",
      ]),
    )
    .min(1),
  curriculum: z.object({
    grade: z.array(z.number().int()).min(1),
    units: z.array(z.string().min(1)).min(1),
    concepts: z.array(z.string().min(1)).min(1),
    formulas: z.array(z.string().min(1)).optional(),
    requiredExperiments: z.array(z.string().min(1)).optional(),
    examFrequency: z.enum(["low", "medium", "high"]).optional(),
  }),
  quantities: z.array(quantitySchema).min(1),
  causalRelations: z.array(causalRelationSchema).min(1),
  energyRelations: z.array(energyRelationSchema).optional(),
  conditions: z.array(conditionSchema).min(1),
  counterexamples: z.array(counterexampleSchema).min(1),
  misconceptions: z.array(misconceptionSchema).min(1),
  phenomena: z.array(phenomenonSchema).min(1),
  scenes: z.array(sceneDefinitionSchema).min(1),
  experiments: z.array(experimentDefinitionSchema).min(1),
  transferTargets: z.array(transferTargetSchema).min(1),
  examPatterns: z.array(examPatternSchema).min(1),
  tutorPolicy: tutorPolicySchema,
  independentChallenges: z.array(independentChallengeSchema).min(1),
  modelEvaluator: modelEvaluatorSchema,
  metadata: z.object({
    version: z.string().min(1),
    author: z.string().optional(),
    status: z.enum(["draft", "prototype", "validated", "production"]),
    sourceReferences: z.array(z.string().min(1)).min(1),
    lastReviewedAt: z.string().optional(),
    notes: z.array(z.string().min(1)).optional(),
  }),
});
