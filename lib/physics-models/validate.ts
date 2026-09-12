import { STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { isCanonicalPhysicsModelId } from "@/lib/physics-models/canonical-ids";
import { isCognitiveActionId } from "@/lib/physics-models/cognitive-actions";
import { physicsModelSchema } from "@/lib/physics-models/schema";
import { ExperimentEvidenceKind, type PhysicsModel } from "@/types/physics-model";
import type { TutorAction } from "@/types/ai";
import type { LearningStage } from "@/types/learning";

export interface PhysicsModelValidationIssue {
  path: string;
  message: string;
}

export interface PhysicsModelValidationResult {
  ok: boolean;
  issues: PhysicsModelValidationIssue[];
}

const REQUIRED_EXPERIMENT_EVIDENCE: Array<(typeof ExperimentEvidenceKind)[keyof typeof ExperimentEvidenceKind]> =
  [
    ExperimentEvidenceKind.PREDICTION,
    ExperimentEvidenceKind.INTERVENTION,
    ExperimentEvidenceKind.OBSERVED_RESULT,
    ExperimentEvidenceKind.PREDICTION_VS_RESULT,
    ExperimentEvidenceKind.REFLECTION,
  ];

export function validatePhysicsModel(model: PhysicsModel): PhysicsModelValidationResult {
  const issues: PhysicsModelValidationIssue[] = [];
  const parsed = physicsModelSchema.safeParse(model);

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
      });
    }
    return { ok: false, issues };
  }

  if (!isCanonicalPhysicsModelId(model.id)) {
    issues.push({
      path: "id",
      message: `Model ID "${model.id}" is not registered in spec/physics-model-library.md.`,
    });
  }

  const quantityIds = collectUniqueIds(
    model.quantities.map((item) => item.id),
    "quantities",
    issues,
  );
  const conditionIds = collectUniqueIds(
    model.conditions.map((item) => item.id),
    "conditions",
    issues,
  );
  const misconceptionIds = collectUniqueIds(
    model.misconceptions.map((item) => item.id),
    "misconceptions",
    issues,
  );
  const phenomenonIds = collectUniqueIds(
    model.phenomena.map((item) => item.id),
    "phenomena",
    issues,
  );
  collectUniqueIds(
    model.experiments.map((item) => item.id),
    "experiments",
    issues,
  );
  collectUniqueIds(
    model.transferTargets.map((item) => item.id),
    "transferTargets",
    issues,
  );
  collectUniqueIds(
    model.examPatterns.map((item) => item.id),
    "examPatterns",
    issues,
  );
  collectUniqueIds(
    model.independentChallenges.map((item) => item.id),
    "independentChallenges",
    issues,
  );

  void conditionIds;

  const causalNodeIds = new Set(quantityIds);

  for (const [index, relation] of model.causalRelations.entries()) {
    if (!causalNodeIds.has(relation.from)) {
      issues.push({
        path: `causalRelations.${index}.from`,
        message: `Unknown causal endpoint "${relation.from}".`,
      });
    }
    if (!causalNodeIds.has(relation.to)) {
      issues.push({
        path: `causalRelations.${index}.to`,
        message: `Unknown causal endpoint "${relation.to}".`,
      });
    }
  }

  for (const [index, relation] of (model.energyRelations ?? []).entries()) {
    if (!causalNodeIds.has(relation.source)) {
      issues.push({
        path: `energyRelations.${index}.source`,
        message: `Unknown energy source "${relation.source}".`,
      });
    }
    if (!causalNodeIds.has(relation.destination)) {
      issues.push({
        path: `energyRelations.${index}.destination`,
        message: `Unknown energy destination "${relation.destination}".`,
      });
    }
  }

  for (const [index, example] of model.counterexamples.entries()) {
    if (example.requiredNewModel && !isCanonicalPhysicsModelId(example.requiredNewModel)) {
      issues.push({
        path: `counterexamples.${index}.requiredNewModel`,
        message: `Unregistered related model ID "${example.requiredNewModel}".`,
      });
    }
  }

  for (const [index, target] of model.transferTargets.entries()) {
    if (target.transferMode === "full-model") {
      if (!target.expectedModelId || !isCanonicalPhysicsModelId(target.expectedModelId)) {
        issues.push({
          path: `transferTargets.${index}.expectedModelId`,
          message: "full-model transfer requires a canonical expectedModelId.",
        });
      }
    }

    if (target.transferMode === "partial-structure") {
      if (!target.transferableRelations?.length || !target.nonTransferableRelations?.length) {
        issues.push({
          path: `transferTargets.${index}`,
          message:
            "partial-structure transfer requires transferableRelations and nonTransferableRelations.",
        });
      }
    }

    if (target.expectedModelId && !isCanonicalPhysicsModelId(target.expectedModelId)) {
      issues.push({
        path: `transferTargets.${index}.expectedModelId`,
        message: `Unregistered expectedModelId "${target.expectedModelId}".`,
      });
    }
  }

  for (const [index, pattern] of model.examPatterns.entries()) {
    if (!isCanonicalPhysicsModelId(pattern.testedModel)) {
      issues.push({
        path: `examPatterns.${index}.testedModel`,
        message: `Unregistered testedModel "${pattern.testedModel}".`,
      });
    }
    if (!pattern.options.includes(pattern.correctAnswer)) {
      issues.push({
        path: `examPatterns.${index}.correctAnswer`,
        message: "correctAnswer must be one of the listed options.",
      });
    }
    for (const [actionIndex, action] of pattern.requiredCognitiveActions.entries()) {
      if (!isCognitiveActionId(action)) {
        issues.push({
          path: `examPatterns.${index}.requiredCognitiveActions.${actionIndex}`,
          message: `"${action}" is not a canonical C1–C14 ID.`,
        });
      }
    }
  }

  for (const [index, challenge] of model.independentChallenges.entries()) {
    if (challenge.llmAllowed !== false) {
      issues.push({
        path: `independentChallenges.${index}.llmAllowed`,
        message: "AI_OFF challenges must set llmAllowed to false.",
      });
    }
    if (!isCanonicalPhysicsModelId(challenge.expectedModelId)) {
      issues.push({
        path: `independentChallenges.${index}.expectedModelId`,
        message: `Unregistered expectedModelId "${challenge.expectedModelId}".`,
      });
    }
  }

  for (const [index, experiment] of model.experiments.entries()) {
    const kinds = new Set(experiment.expectedEvidence.map((item) => item.kind));
    for (const kind of REQUIRED_EXPERIMENT_EVIDENCE) {
      const spec = experiment.expectedEvidence.find((item) => item.kind === kind);
      if (!kinds.has(kind) || !spec?.required) {
        issues.push({
          path: `experiments.${index}.expectedEvidence`,
          message: `Experiment must require UPLP evidence "${kind}".`,
        });
      }
    }
  }

  if (!model.phenomena.some((item) => item.modelRole === "anchor")) {
    issues.push({
      path: "phenomena",
      message: "A model must define at least one anchor phenomenon.",
    });
  }

  for (const [index, scene] of model.scenes.entries()) {
    if (!isCanonicalPhysicsModelId(scene.primaryModel)) {
      issues.push({
        path: `scenes.${index}.primaryModel`,
        message: `Unregistered primaryModel "${scene.primaryModel}".`,
      });
    }
    if (scene.primaryModel !== model.id) {
      issues.push({
        path: `scenes.${index}.primaryModel`,
        message: "Scene primaryModel must match this Physics Model id.",
      });
    }
    for (const [secondaryIndex, secondary] of (scene.secondaryModels ?? []).entries()) {
      if (!isCanonicalPhysicsModelId(secondary)) {
        issues.push({
          path: `scenes.${index}.secondaryModels.${secondaryIndex}`,
          message: `Unregistered secondaryModel "${secondary}".`,
        });
      }
    }
    if (!phenomenonIds.has(scene.phenomenonId)) {
      issues.push({
        path: `scenes.${index}.phenomenonId`,
        message: `Unknown phenomenon "${scene.phenomenonId}".`,
      });
    }
  }

  for (const misconception of model.misconceptions) {
    if (misconception.recommendedInterventions.length === 0) {
      issues.push({
        path: `misconceptions.${misconception.id}`,
        message: "Each misconception must include recommended interventions.",
      });
    }
  }

  for (const strategy of model.tutorPolicy.misconceptionStrategies) {
    if (!misconceptionIds.has(strategy.misconceptionId)) {
      issues.push({
        path: "tutorPolicy.misconceptionStrategies",
        message: `Unknown misconception "${strategy.misconceptionId}".`,
      });
    }
  }

  for (const stage of Object.keys(STAGE_TUTOR_POLICY) as LearningStage[]) {
    const allowed = model.tutorPolicy.allowedActionsByStage[stage] ?? [];
    const universal = STAGE_TUTOR_POLICY[stage];
    for (const action of allowed) {
      if (!universal.includes(action as TutorAction)) {
        issues.push({
          path: `tutorPolicy.allowedActionsByStage.${stage}`,
          message: `Action "${action}" is not permitted by UPLP at ${stage}.`,
        });
      }
    }
  }

  const completenessPaths: Array<[string, unknown]> = [
    ["coreIdea", model.coreIdea],
    ["quantities", model.quantities],
    ["causalRelations", model.causalRelations],
    ["conditions", model.conditions],
    ["counterexamples", model.counterexamples],
    ["misconceptions", model.misconceptions],
    ["phenomena", model.phenomena],
    ["experiments", model.experiments],
    ["transferTargets", model.transferTargets],
    ["examPatterns", model.examPatterns],
    ["tutorPolicy", model.tutorPolicy],
    ["independentChallenges", model.independentChallenges],
    ["modelEvaluator", model.modelEvaluator],
  ];

  for (const [path, value] of completenessPaths) {
    if (value == null || (Array.isArray(value) && value.length === 0) || value === "") {
      issues.push({
        path,
        message: "Required completeness field is missing.",
      });
    }
  }

  return { ok: issues.length === 0, issues };
}

function collectUniqueIds(
  ids: string[],
  path: string,
  issues: PhysicsModelValidationIssue[],
): Set<string> {
  const seen = new Set<string>();
  for (const [index, id] of ids.entries()) {
    if (seen.has(id)) {
      issues.push({
        path: `${path}.${index}.id`,
        message: `Duplicate ID "${id}".`,
      });
    }
    seen.add(id);
  }
  return seen;
}
