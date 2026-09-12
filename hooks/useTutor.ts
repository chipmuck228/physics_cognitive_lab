"use client";

import { useCallback, useState } from "react";

import { createLearningEvent } from "@/lib/learning/events";
import { updateSession } from "@/lib/learning/session-store";
import {
  canCallTutor,
  isTutorHardBlocked,
} from "@/lib/learning/stage-policy";
import { buildTutorRequestPayload } from "@/lib/learning/tutor-request";
import { SAFE_TUTOR_FALLBACK, type TutorResponseParsed } from "@/lib/ai/tutor-schema";
import { LearningStage, type LearningSession } from "@/types/learning";
import type { TutorAction } from "@/types/ai";

export function useTutor(session: LearningSession | null) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const blocked = Boolean(session && isTutorHardBlocked(session.stage));
  const allowed = Boolean(
    session && canCallTutor(session.stage) && !blocked,
  );
  const visibleMessage = blocked ? null : message;
  const visibleLoading = blocked ? false : loading;

  const askTutor = useCallback(
    async (studentResponse: string) => {
      if (
        !session ||
        isTutorHardBlocked(session.stage) ||
        !canCallTutor(session.stage)
      ) {
        return;
      }

      setLoading(true);
      try {
        const payload = buildTutorRequestPayload(session, studentResponse);
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as TutorResponseParsed;
        const nextMessage = data.message || SAFE_TUTOR_FALLBACK.message;
        setMessage(nextMessage);
        recordTutorInteraction(
          session.stage,
          data.action ?? "ASK",
          nextMessage,
          session.sceneId,
        );
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
    message: visibleMessage,
    loading: visibleLoading,
    askTutor,
  };
}

function recordTutorInteraction(
  stage: LearningStage,
  action: TutorAction,
  nextMessage: string,
  sceneId: LearningSession["sceneId"],
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
  }), sceneId);
}
