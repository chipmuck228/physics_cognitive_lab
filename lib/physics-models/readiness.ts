import { validatePhysicsModel } from "@/lib/physics-models/validate";
import type { AssessmentOverlay } from "@/lib/runtime/types";
import type { PhysicsModel, SceneDefinition } from "@/types/physics-model";

/**
 * Engineering readiness for implementing a Physics Model as a Scene.
 * This is not educational validation and does not assign L-levels.
 */
export type PhysicsModelReadinessStatus =
  | "IMPLEMENTATION_READY"
  | "NOT_READY"
  | "BLOCKED_BY_SCHEMA"
  | "BLOCKED_BY_RUNTIME"
  | "AMBIGUOUS_PHYSICS";

export interface PhysicsModelReadinessIssue {
  path: string;
  message: string;
}

export interface PhysicsModelReadinessResult {
  status: PhysicsModelReadinessStatus;
  missing: PhysicsModelReadinessIssue[];
  blockers: PhysicsModelReadinessIssue[];
  warnings: PhysicsModelReadinessIssue[];
}

const ENERGY_CHAIN_COMPONENT_IDS = [
  "identifiesEnergySource",
  "identifiesInternalEnergyChange",
  "identifiesWorkProcess",
  "identifiesMechanicalOutput",
  "preservesCausalOrder",
] as const;

const RATIO_COMPONENT_IDS = [
  "identifiesDensity",
  "usesMassVolumeRatio",
] as const;

export type ModelRepresentationKind =
  | "energy-chain"
  | "relation-condition"
  | "ratio-quantitative";

export function inferModelRepresentationKind(
  model: PhysicsModel,
): ModelRepresentationKind {
  if ((model.energyRelations?.length ?? 0) > 0) {
    return "energy-chain";
  }
  const componentIds = Object.keys(model.modelEvaluator?.requiredComponents ?? {});
  if (RATIO_COMPONENT_IDS.every((id) => componentIds.includes(id))) {
    return "ratio-quantitative";
  }
  return "relation-condition";
}

export function validatePhysicsModelReadiness(
  model: PhysicsModel,
  sceneDefinition: SceneDefinition,
  overlay?: AssessmentOverlay,
): PhysicsModelReadinessResult {
  const missing: PhysicsModelReadinessIssue[] = [];
  const blockers: PhysicsModelReadinessIssue[] = [];
  const warnings: PhysicsModelReadinessIssue[] = [];

  const schema = validatePhysicsModel(model);
  let blockedBySchema = false;
  let blockedByRuntime = false;
  let ambiguousPhysics = false;

  if (!schema.ok) {
    for (const issue of schema.issues) {
      const runtimeIssue = isRuntimePolicyIssue(issue.path, issue.message);
      const physicsIssue = isAmbiguousPhysicsIssue(issue.path, issue.message);
      if (runtimeIssue) {
        blockedByRuntime = true;
        blockers.push({ path: issue.path, message: issue.message });
      } else if (physicsIssue) {
        ambiguousPhysics = true;
        blockers.push({ path: issue.path, message: issue.message });
      } else {
        blockedBySchema = true;
        blockers.push({ path: issue.path, message: issue.message });
      }
    }
  }

  if (!sceneDefinition?.id) {
    missing.push({
      path: "sceneDefinition.id",
      message: "SceneDefinition is required before implementation.",
    });
  } else {
    const declared = model.scenes.find((scene) => scene.id === sceneDefinition.id);
    if (!declared) {
      missing.push({
        path: "sceneDefinition.id",
        message: `Scene "${sceneDefinition.id}" is not declared on this Physics Model.`,
      });
    }
  }

  if (sceneDefinition.primaryModel !== model.id) {
    blockers.push({
      path: "sceneDefinition.primaryModel",
      message: "Scene primaryModel must match the Physics Model id.",
    });
    blockedBySchema = true;
  }

  if (!sceneDefinition.physicsEngine?.trim()) {
    missing.push({
      path: "sceneDefinition.physicsEngine",
      message: "A named deterministic physics engine is required.",
    });
  } else if (/llm|language-model|narrative/i.test(sceneDefinition.physicsEngine)) {
    blockers.push({
      path: "sceneDefinition.physicsEngine",
      message: "Physics engine must be deterministic code, not an LLM or narrative source.",
    });
    blockedByRuntime = true;
  }

  const componentIds = Object.keys(model.modelEvaluator?.requiredComponents ?? {});
  if (componentIds.length === 0) {
    missing.push({
      path: "modelEvaluator.requiredComponents",
      message: "Evaluator must declare model-owned requiredComponents.",
    });
  }

  const hasEnergyRelations = (model.energyRelations?.length ?? 0) > 0;
  const energyChainKeys = ENERGY_CHAIN_COMPONENT_IDS.filter((id) =>
    componentIds.includes(id),
  );
  if (!hasEnergyRelations && energyChainKeys.length > 0) {
    blockers.push({
      path: "modelEvaluator.requiredComponents",
      message:
        "Energy-chain evaluator keys are present but energyRelations is empty. Do not copy Scene 02's MODEL grammar onto a non-energy model.",
    });
    ambiguousPhysics = true;
  }

  const representationKind = inferModelRepresentationKind(model);
  if (representationKind === "energy-chain") {
    warnings.push({
      path: "energyRelations",
      message:
        "Energy relations exist. MODEL UI should present this model's chain/flow, not a force/motion board or a mass-volume ratio table.",
    });
  } else if (representationKind === "ratio-quantitative") {
    warnings.push({
      path: "modelRepresentation",
      message:
        "Inferred MODEL presentation kind: ratio-quantitative. Use a mass/volume/density ratio table. Do not copy Scene 02's energy chain or Scene 03's force board.",
    });
  } else {
    warnings.push({
      path: "energyRelations",
      message:
        "No energyRelations. MODEL UI must be relation/condition (or another non-chain grammar), not Scene 02's energy chain.",
    });
    warnings.push({
      path: "modelRepresentation",
      message: `Inferred MODEL presentation kind: ${representationKind}. Confirm before copying another Scene's builder.`,
    });
  }

  if (overlay == null) {
    missing.push({
      path: "assessmentOverlay",
      message:
        "AssessmentOverlay is required for production EXAM intended representation/model and AI_OFF judgments.",
    });
  } else {
    const examIds = new Set(model.examPatterns.map((pattern) => pattern.id));
    const overlayExamIds = Object.keys(overlay.exam ?? {});
    const coveredExam = overlayExamIds.filter((id) => examIds.has(id));
    if (model.examPatterns.length > 0 && coveredExam.length === 0) {
      missing.push({
        path: "assessmentOverlay.exam",
        message: "Overlay must cover at least one canonical exam pattern that will ship.",
      });
    }
    for (const id of overlayExamIds) {
      if (!examIds.has(id)) {
        warnings.push({
          path: `assessmentOverlay.exam.${id}`,
          message: "Overlay exam id is not a canonical examPattern on this model.",
        });
      } else {
        const entry = overlay.exam?.[id];
        if (!entry?.intendedRepresentation?.trim() || !entry.intendedModel?.trim()) {
          missing.push({
            path: `assessmentOverlay.exam.${id}`,
            message: "Intended representation and intended model are required.",
          });
        }
      }
    }
    for (const pattern of model.examPatterns) {
      if (!overlay.exam?.[pattern.id]) {
        warnings.push({
          path: `examPatterns.${pattern.id}`,
          message:
            "Canonical exam pattern has no overlay entry. Allowed if it is omitted from the production sitting; do not infer intended representation from options[0].",
        });
      }
    }

    const challengeIds = new Set(
      model.independentChallenges.map((challenge) => challenge.id),
    );
    for (const challenge of model.independentChallenges) {
      const independent = overlay.independent?.[challenge.id];
      if (!independent) {
        missing.push({
          path: `assessmentOverlay.independent.${challenge.id}`,
          message: "Every AI_OFF challenge needs overlay judgments and post-checks.",
        });
        continue;
      }
      const correctCount = independent.judgments.filter((item) => item.correct).length;
      if (correctCount !== 1) {
        missing.push({
          path: `assessmentOverlay.independent.${challenge.id}.judgments`,
          message: "Exactly one overlay judgment must be marked correct.",
        });
      }
      if (!independent.postCheck.some((item) => item.required && !item.distractor)) {
        missing.push({
          path: `assessmentOverlay.independent.${challenge.id}.postCheck`,
          message: "At least one required non-distractor post-check is required.",
        });
      }
    }
    for (const id of Object.keys(overlay.independent ?? {})) {
      if (!challengeIds.has(id)) {
        warnings.push({
          path: `assessmentOverlay.independent.${id}`,
          message: "Overlay independent id is not a canonical independentChallenge.",
        });
      }
    }
  }

  if (!model.transferTargets.some((target) => target.transferMode === "full-model")) {
    warnings.push({
      path: "transferTargets",
      message:
        "No full-model transfer target. Confirm the production TRANSFER pair is still structurally valid.",
    });
  }

  if (model.metadata.status === "validated" || model.metadata.status === "production") {
    warnings.push({
      path: "metadata.status",
      message:
        "Readiness and passing tests must not be treated as educational validation.",
    });
  }

  const status = resolveStatus({
    blockedBySchema,
    blockedByRuntime,
    ambiguousPhysics,
    missingCount: missing.length,
  });

  return { status, missing, blockers, warnings };
}

function resolveStatus(flags: {
  blockedBySchema: boolean;
  blockedByRuntime: boolean;
  ambiguousPhysics: boolean;
  missingCount: number;
}): PhysicsModelReadinessStatus {
  if (flags.blockedBySchema) {
    return "BLOCKED_BY_SCHEMA";
  }
  if (flags.blockedByRuntime) {
    return "BLOCKED_BY_RUNTIME";
  }
  if (flags.ambiguousPhysics) {
    return "AMBIGUOUS_PHYSICS";
  }
  if (flags.missingCount > 0) {
    return "NOT_READY";
  }
  return "IMPLEMENTATION_READY";
}

function isRuntimePolicyIssue(path: string, message: string): boolean {
  return (
    path.startsWith("tutorPolicy.allowedActionsByStage") ||
    path.includes("llmAllowed") ||
    /not permitted by UPLP/i.test(message)
  );
}

function isAmbiguousPhysicsIssue(path: string, message: string): boolean {
  return (
    path.startsWith("causalRelations") ||
    path.startsWith("energyRelations") ||
    /Unknown causal endpoint|Unknown energy source|Unknown energy destination/i.test(
      message,
    )
  );
}
