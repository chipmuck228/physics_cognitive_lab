import { createLearningEvent } from "@/lib/learning/events";
import { canLeaveStage } from "@/lib/learning/progression";
import { buildCognitiveProfile } from "@/lib/learning/reflection";
import { nextStage } from "@/lib/learning/state-machine";
import { LearningStage, type LearningSession } from "@/types/learning";

export function advanceIfReady(session: LearningSession): LearningSession {
  const target = nextStage(session.stage);
  if (!target || !canLeaveStage(session, target)) {
    return session;
  }

  const events = [
    ...session.events,
    createLearningEvent("stage_entered", target),
  ];

  if (target === LearningStage.AI_OFF) {
    events.push(createLearningEvent("ai_off_started", target));
  }

  if (target === LearningStage.COMPLETE) {
    events.push(createLearningEvent("session_completed", target));
  }

  return {
    ...session,
    stage: target,
    completed: target === LearningStage.COMPLETE || session.completed,
    cognitiveProfile:
      target === LearningStage.COMPLETE
        ? buildCognitiveProfile(session)
        : session.cognitiveProfile,
    events,
  };
}
