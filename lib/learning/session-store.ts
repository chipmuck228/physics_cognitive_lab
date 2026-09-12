import { createSession } from "@/lib/learning/session";
import {
  clearSession,
  loadSession,
  saveSession,
} from "@/lib/learning/session-storage";
import type { LearningSession, SceneId } from "@/types/learning";

let current: LearningSession | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSessionSnapshot(
  sceneId: SceneId = "microwave-bread",
): LearningSession {
  if (!current || current.sceneId !== sceneId) {
    current = loadSession(sceneId) ?? createSession(
      () => new Date().toISOString(),
      () => crypto.randomUUID(),
      sceneId,
    );
  }
  return current;
}

export function getServerSessionSnapshot(): LearningSession | null {
  return null;
}

export function replaceSession(next: LearningSession): void {
  current = next;
  saveSession(next);
  notify();
}

export function updateSession(
  updater: (session: LearningSession) => LearningSession,
  sceneId?: SceneId,
): void {
  const next = updater(getSessionSnapshot(sceneId ?? current?.sceneId));
  if (next === current) {
    return;
  }
  replaceSession(next);
}

export function resetSessionMemory(): void {
  current = null;
}

export function resetStoredSession(
  sceneId: SceneId = "microwave-bread",
): void {
  clearSession(sceneId);
  current = createSession(
    () => new Date().toISOString(),
    () => crypto.randomUUID(),
    sceneId,
  );
  saveSession(current);
  notify();
}
