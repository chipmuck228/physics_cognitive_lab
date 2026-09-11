"use client";

import { useCallback, useState } from "react";

import { createLearningEvent } from "@/lib/learning/events";
import { updateSession } from "@/lib/learning/session-store";
import { canCallTutor, STAGE_TUTOR_POLICY } from "@/lib/learning/stage-policy";
import { SAFE_TUTOR_FALLBACK, type TutorResponseParsed } from "@/lib/ai/tutor-schema";
import { detectMisconceptionSignals } from "@/lib/content/misconceptions";
import { LearningStage, type LearningSession } from "@/types/learning";
import type { TutorAction } from "@/types/ai";

const STAGE_GOALS: Partial<Record<LearningStage, string>> = {
  [LearningStage.OBSERVE]: "help the student notice the physical change",
  [LearningStage.DESCRIBE]: "move from everyday wording toward physical quantities",
  [LearningStage.PREDICT]: "make a prediction and justify it without revealing the result",
  [LearningStage.EXPLAIN]: "improve the student's own causal explanation",
  [LearningStage.MODEL]: "help the student decide what belongs in the model",
  [LearningStage.TRANSFER]: "help the student notice a shared structure",
  [LearningStage.EXAM]: "help the student represent the problem without revealing the answer",
};

export function useTutor(session: LearningSession | null) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const allowed = Boolean(session && canCallTutor(session.stage));

  const askTutor = useCallback(
    async (studentResponse: string) => {
      if (!session || !canCallTutor(session.stage)) {
        return;
      }

      setLoading(true);
      try {
        const payload = {
          sessionId: session.sessionId,
          stage: session.stage,
          learningGoal: STAGE_GOALS[session.stage] ?? "support one next thinking step",
          studentResponse,
          currentPhysicsState: {
            initialTemperatureC: session.physicsState.initialTemperatureC,
            currentTemperatureC: session.physicsState.currentTemperatureC,
            powerW: session.physicsState.powerW,
            heatingTimeSec: session.physicsState.heatingTimeSec,
          },
          knownMisconceptions: detectMisconceptionSignals(studentResponse),
          allowedActions: STAGE_TUTOR_POLICY[session.stage],
        };

        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as TutorResponseParsed;
        const nextMessage = data.message || SAFE_TUTOR_FALLBACK.message;
        setMessage(nextMessage);
        recordTutorInteraction(session.stage, data.action ?? "ASK", nextMessage);
      } catch {
        setMessage(SAFE_TUTOR_FALLBACK.message);
      } finally {
        setLoading(false);
      }
    },
    [session],
  );

  return {
    allowed,
    message,
    loading,
    askTutor,
  };
}

function recordTutorInteraction(
  stage: LearningStage,
  action: TutorAction,
  nextMessage: string,
): void {
  updateSession((current) => ({
    ...current,
    aiInteractions: [
      ...current.aiInteractions,
      {
        id: crypto.randomUUID(),
        stage,
        action,
        message: nextMessage,
        timestamp: new Date().toISOString(),
      },
    ],
    events: [
      ...current.events,
      createLearningEvent("ai_interaction", stage, { action }),
    ],
  }));
}
