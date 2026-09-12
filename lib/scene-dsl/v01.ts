import { z } from "zod";

import { LEARNING_STAGE_ORDER, LearningStage } from "@/types/learning";

export const SCENE_DSL_V01_PHYSICS_PLUGINS = [
  "deterministic-equal-volume-samples",
] as const;

export const SCENE_DSL_V01_MODEL_PLUGINS = ["ratio-quantitative"] as const;

export const SCENE_DSL_V01_EVALUATOR_PLUGINS = [
  "density-mass-volume-samples",
] as const;

export const SCENE_DSL_V01_EVIDENCE_PREDICATES = [
  "samples-observation",
  "samples-description",
  "samples-explanation",
  "samples-model",
  "samples-transfer",
  "samples-ai-off",
  "llm-disabled",
] as const;

export const SCENE_DSL_V01_HINT_SOURCES = ["physics-model"] as const;

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

const labeledValueSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const labeledIdSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  distractor: z.boolean().optional(),
});

export const sceneDslV01Schema = z
  .object({
    identity: z.object({
      sceneId: z.literal("equal-volume-material-samples"),
      primaryModelId: z.literal("density-mass-volume"),
    }),
    plugins: z.object({
      physics: z.enum(SCENE_DSL_V01_PHYSICS_PLUGINS),
      modelRepresentation: z.enum(SCENE_DSL_V01_MODEL_PLUGINS),
      evaluator: z.enum(SCENE_DSL_V01_EVALUATOR_PLUGINS),
    }),
    stageOrder: z
      .array(learningStageSchema)
      .length(LEARNING_STAGE_ORDER.length),
    stagePrompts: z.record(learningStageSchema, z.string().min(1).optional()),
    stageFooters: z.record(learningStageSchema, z.string().optional()),
    tutorGoals: z
      .object({
        [LearningStage.OBSERVE]: z.string().min(1),
        [LearningStage.DESCRIBE]: z.string().min(1),
        [LearningStage.PREDICT]: z.string().min(1),
        [LearningStage.EXPERIMENT]: z.string().min(1),
        [LearningStage.EXPLAIN]: z.string().min(1),
        [LearningStage.MODEL]: z.string().min(1),
        [LearningStage.TRANSFER]: z.string().min(1),
        [LearningStage.EXAM]: z.string().min(1),
      })
      .strict(),
    copy: z.object({
      landingKicker: z.string().min(1),
      landingTitle: z.string().min(1),
      landingBody: z.string().min(1),
      landingCta: z.string().min(1),
      observeInstruction: z.string().min(1),
      observePrompt: z.string().min(1),
      observeSubmit: z.string().min(1),
      observeNeedMore: z.string().min(1),
      observeSaved: z.string().min(1),
      playDemo: z.string().min(1),
      pauseDemo: z.string().min(1),
      predictInstruction: z.string().min(1),
      reasonLabel: z.string().min(1),
      reasonPlaceholder: z.string().min(1),
      predictSubmit: z.string().min(1),
      predictNeedBoth: z.string().min(1),
      predictLocked: z.string().min(1),
      completeTitle: z.string().min(1),
      completeCaution: z.string().min(1),
      completeTheme: z.string().min(1),
      massUnit: z.string().min(1),
      volumeUnit: z.string().min(1),
      densityUnit: z.string().min(1),
    }),
    observe: z.object({
      options: z.array(labeledIdSchema).min(1),
      requiredIds: z.array(z.string().min(1)).min(1),
    }),
    describe: z.object({
      accepted: z.object({
        object: z.string().min(1),
        sizeRelation: z.string().min(1),
        massRelation: z.string().min(1),
      }),
    }),
    predict: z.object({
      outcomes: z.array(labeledValueSchema).min(1),
    }),
    explain: z.object({
      accepted: z.object({
        densityVsMass: z.string().min(1),
        sameVolume: z.string().min(1),
        sameMass: z.string().min(1),
        uniformCut: z.string().min(1),
      }),
      rejectIds: z.array(z.string().min(1)).min(1),
    }),
    transfer: z.object({
      requiredFullModelIds: z.array(z.string().min(1)).min(1),
      boundaryTargetId: z.string().min(1),
      relationIds: z.array(z.string().min(1)).min(1),
    }),
    exam: z.object({
      patternIds: z.array(z.string().min(1)).min(1),
      maxAttemptsPerItem: z.number().int().positive(),
    }),
    aiOff: z.object({
      challengeIds: z.array(z.string().min(1)).min(1),
      tutorEnabled: z.literal(false),
    }),
    hintLadder: z.object({
      source: z.enum(SCENE_DSL_V01_HINT_SOURCES),
    }),
    evidenceBindings: z.object({
      observedPhenomenon: z.array(z.enum(SCENE_DSL_V01_EVIDENCE_PREDICATES)),
      identifiedQuantities: z.array(z.enum(SCENE_DSL_V01_EVIDENCE_PREDICATES)),
      identifiedRelations: z.array(z.enum(SCENE_DSL_V01_EVIDENCE_PREDICATES)),
      constructedValidCausalModel: z.array(
        z.enum(SCENE_DSL_V01_EVIDENCE_PREDICATES),
      ),
      successfulTransfer: z.array(z.enum(SCENE_DSL_V01_EVIDENCE_PREDICATES)),
      independentAiOffSuccess: z.array(z.enum(SCENE_DSL_V01_EVIDENCE_PREDICATES)),
    }),
  })
  .superRefine((value, ctx) => {
    if (value.stageOrder.join(",") !== LEARNING_STAGE_ORDER.join(",")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stageOrder"],
        message: "stageOrder must match canonical UPLP LEARNING_STAGE_ORDER",
      });
    }
    for (const stage of LEARNING_STAGE_ORDER) {
      if (stage === LearningStage.ENTRY || stage === LearningStage.COMPLETE) {
        continue;
      }
      if (!value.stagePrompts[stage]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stagePrompts", stage],
          message: `missing required prompt for ${stage}`,
        });
      }
    }
    const observeIds = new Set(value.observe.options.map((option) => option.id));
    for (const requiredId of value.observe.requiredIds) {
      if (!observeIds.has(requiredId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["observe", "requiredIds"],
          message: `required observe id is not in options: ${requiredId}`,
        });
      }
    }
  });

export type SceneDslV01 = z.infer<typeof sceneDslV01Schema>;

export interface SceneDslV01Catalogs {
  transferTargetIds: readonly string[];
  examPatternIds: readonly string[];
  independentChallenges: ReadonlyArray<{ id: string; llmAllowed: boolean }>;
}

export function parseSceneDslV01(
  input: unknown,
  catalogs: SceneDslV01Catalogs,
): SceneDslV01 {
  const parsed = sceneDslV01Schema.parse(input);
  const transferIds = new Set(catalogs.transferTargetIds);
  const examIds = new Set(catalogs.examPatternIds);
  const challengeById = new Map(
    catalogs.independentChallenges.map((challenge) => [challenge.id, challenge]),
  );

  for (const targetId of [
    ...parsed.transfer.requiredFullModelIds,
    parsed.transfer.boundaryTargetId,
  ]) {
    if (!transferIds.has(targetId)) {
      throw new Error(`Unknown transfer target reference: ${targetId}`);
    }
  }
  for (const patternId of parsed.exam.patternIds) {
    if (!examIds.has(patternId)) {
      throw new Error(`Unknown exam pattern reference: ${patternId}`);
    }
  }
  if (parsed.aiOff.tutorEnabled) {
    throw new Error("AI_OFF config must not enable Tutor");
  }
  for (const challengeId of parsed.aiOff.challengeIds) {
    const challenge = challengeById.get(challengeId);
    if (!challenge) {
      throw new Error(`Unknown AI_OFF challenge reference: ${challengeId}`);
    }
    if (challenge.llmAllowed !== false) {
      throw new Error(`AI_OFF challenge must keep llmAllowed false: ${challengeId}`);
    }
  }
  return parsed;
}
