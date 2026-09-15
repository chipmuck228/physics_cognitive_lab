import type { AccumulatedModelEvidence } from "@/lib/physics-models/evidence";
import type {
  LearningSession,
  LearningStage,
  SceneId,
  ScenePhysicsState,
} from "@/types/learning";
import type { CanonicalPhysicsModelId } from "@/lib/physics-models/canonical-ids";

export interface ExamAssessmentDefinition {
  intendedRepresentation: string;
  intendedModel: string;
}

export interface IndependentJudgmentOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface IndependentPostCheckOption {
  id: string;
  label: string;
  required: boolean;
  distractor: boolean;
  /**
   * Scene 07 local-task scope. Overlay `required` means the relation belongs
   * to the challenge's full set; a local reasoning gate may require only the
   * scopes that this judgment actually used.
   */
  localScope?: "always" | "u-equals-f" | "u-less-than-f";
}

export interface IndependentAssessmentDefinition {
  judgments: IndependentJudgmentOption[];
  postCheck: IndependentPostCheckOption[];
}

/**
 * Production assessment answer semantics that the current canonical
 * Physics Model schema does not yet represent.
 *
 * PhysicsModel still owns challenge/exam identities, stems, and
 * canonical requiredEvidence. This overlay must not become a second
 * question bank.
 */
export interface AssessmentOverlay {
  exam?: Record<string, ExamAssessmentDefinition>;
  independent?: Record<string, IndependentAssessmentDefinition>;
}

export interface SceneExperimentResult {
  experimentId: string;
  result: unknown;
}

export interface SceneTutorContext {
  learningGoal: string;
  currentPhysicsState: Record<string, unknown>;
  physicsSummary: string;
  promptConstraint: string;
}

/**
 * Thin boundary from the universal learning runtime to Scene-owned
 * completion, evidence, physics initialization, and assessment overlay.
 *
 * Do not put Scene copy, visuals, or UI layout here.
 */
export interface SceneAdapter {
  sceneId: SceneId;
  primaryModelId: CanonicalPhysicsModelId | string;

  getInitialPhysicsState(): ScenePhysicsState;

  getInitialSceneData?: () => Record<string, unknown>;

  getTutorContext(session: LearningSession): SceneTutorContext;

  looksLikeTutorLeak?: (
    stage: LearningStage,
    message: string,
  ) => boolean;

  completion: Record<LearningStage, (session: LearningSession) => boolean>;

  accumulateEvidence(session: LearningSession): AccumulatedModelEvidence;

  assessmentOverlay: AssessmentOverlay;

  runExperiment?: (
    experimentId: string,
    input?: unknown,
  ) => SceneExperimentResult;
}
