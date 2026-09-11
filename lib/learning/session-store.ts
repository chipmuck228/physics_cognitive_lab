import { createSession } from "@/lib/learning/session";
import {
  clearSession,
  loadSession,
  saveSession,
} from "@/lib/learning/session-storage";
import type { LearningSession } from "@/types/learning";

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

export function getSessionSnapshot(): LearningSession {
  if (!current) {
    current = loadSession() ?? createSession();
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
): void {
  const next = updater(getSessionSnapshot());
  if (next === current) {
    return;
  }
  replaceSession(next);
}

export function resetSessionMemory(): void {
  current = null;
}

export function resetStoredSession(): void {
  clearSession();
  current = createSession();
  saveSession(current);
  notify();
}
