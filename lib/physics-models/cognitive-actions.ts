/**
 * Canonical C1–C14 IDs from spec/cognitive-action-taxonomy.md.
 * Meanings are owned by that document. Do not redefine them here.
 */
export const COGNITIVE_ACTION_IDS = [
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
  "C10",
  "C11",
  "C12",
  "C13",
  "C14",
] as const;

export type CognitiveActionId = (typeof COGNITIVE_ACTION_IDS)[number];

export function isCognitiveActionId(id: string): id is CognitiveActionId {
  return (COGNITIVE_ACTION_IDS as readonly string[]).includes(id);
}
