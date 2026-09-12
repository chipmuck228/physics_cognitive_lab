import { detectMisconceptionSignals } from "@/lib/content/misconceptions";
import { STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { registerProductionSceneAdapters } from "@/lib/runtime/register-production-adapters";
import { getSceneAdapter } from "@/lib/runtime/registry";
import type { LearningSession } from "@/types/learning";
import type { TutorAction } from "@/types/ai";

registerProductionSceneAdapters();

export interface TutorRequestPayload {
  sessionId: string;
  sceneId: string;
  stage: LearningSession["stage"];
  learningGoal: string;
  studentResponse: string;
  currentPhysicsState: Record<string, unknown>;
  physicsSummary: string;
  promptConstraint: string;
  knownMisconceptions: string[];
  allowedActions: TutorAction[];
}

export function buildTutorRequestPayload(
  session: LearningSession,
  studentResponse: string,
): TutorRequestPayload {
  const context = getSceneAdapter(session.sceneId).getTutorContext(session);
  return {
    sessionId: session.sessionId,
    sceneId: session.sceneId,
    stage: session.stage,
    learningGoal: context.learningGoal,
    studentResponse,
    currentPhysicsState: context.currentPhysicsState,
    physicsSummary: context.physicsSummary,
    promptConstraint: context.promptConstraint,
    knownMisconceptions: detectMisconceptionSignals(studentResponse),
    allowedActions: STAGE_TUTOR_POLICY[session.stage],
  };
}
