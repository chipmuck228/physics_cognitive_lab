/**
 * Intended sitting and MODEL grammar locks for the PRE-reviewed model.
 * Intended sitting and MODEL grammar locks.
 * This file is not a SceneAdapter. Production Scene 07 uses the
 * adapter-owned runtime. metadata.status is prototype after POST.
 */
export const PRODUCTION_SCENE_ID = "convex-lens-optical-bench" as const;
export const PRODUCTION_PHYSICS_ENGINE = "deterministic-convex-lens-imaging" as const;

export const PRODUCTION_TRANSFER_REQUIRED_IDS = [
  "near-projector-real-enlarged",
  "far-magnifying-glass-virtual",
] as const;

export const PRODUCTION_TRANSFER_AVAILABLE_NOT_REQUIRED_IDS = [
  "medium-camera-real-reduced",
  "partial-eye-retina-receives-real-image",
  "boundary-plane-mirror-is-not-convex-lens",
] as const;

export const PRODUCTION_EXAM_PATTERN_IDS = [
  "exam-object-beyond-2f-properties",
  "exam-move-object-toward-f-real-image",
  "exam-inside-f-screen-cannot-receive",
  "exam-object-at-f-no-finite-image",
  "exam-cover-part-of-lens",
] as const;

export const PRODUCTION_AI_OFF_IDS = [
  "ai-off-unfamiliar-window-card-projection",
  "ai-off-boundary-magnifier-cannot-catch-virtual",
] as const;

/**
 * Official MODEL grammar. Readiness inference will likely report
 * relation-condition. Implementation must still use a spatial-ray
 * construction, not Scene 02–06 copies, not a five-row table, and
 * not a new generic shell.
 */
export const PRODUCTION_MODEL_REPRESENTATION = {
  kind: "spatial-ray-relation",
  board: "object / F / 2F / two canonical rays / meeting mode / image",
  forbiddenCopies: [
    "Scene 02 energy chain",
    "Scene 03 force/motion board",
    "Scene 04 mass/volume/density table",
    "Scene 05 Q = c m ΔT product board",
    "Scene 06 I = U / R relation board",
    "five-row F/2F mnemonic table as MODEL",
    "new generic interaction shell for optics",
  ],
} as const;
