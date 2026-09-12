/**
 * Production sitting and MODEL grammar locks for the PRE-approved model.
 * This is not a SceneAdapter, physics engine, or UI.
 */
export const PRODUCTION_SCENE_ID = "equal-mass-heated-samples" as const;
export const PRODUCTION_PHYSICS_ENGINE = "deterministic-equal-mass-heat-samples" as const;

export const PRODUCTION_TRANSFER_REQUIRED_IDS = [
  "near-two-pots-water-and-oil",
  "far-ice-water-heated",
] as const;

export const PRODUCTION_TRANSFER_AVAILABLE_NOT_REQUIRED_IDS = [
  "medium-coastal-vs-inland",
  "far-car-cooling-water",
  "partial-microwave-bread-already-hot",
] as const;

export const PRODUCTION_EXAM_PATTERN_IDS = [
  "exam-heat-is-not-temperature",
  "exam-same-mass-same-delta-t-larger-c",
  "exam-same-mass-same-q-larger-c",
  "exam-calculate-q-from-c-m-delta-t",
  "exam-heating-without-temperature-rise",
] as const;

export const PRODUCTION_AI_OFF_IDS = [
  "ai-off-unfamiliar-two-lunchboxes",
  "ai-off-condition-ice-pack-stays-cold",
] as const;

/**
 * Official MODEL grammar. Readiness inference currently reports
 * relation-condition because it only maps density keys to
 * ratio-quantitative. Implementation must still use this board.
 */
export const PRODUCTION_MODEL_REPRESENTATION = {
  kind: "ratio-quantitative",
  board: "Q = c · m · ΔT product/ratio board",
  forbiddenCopies: [
    "Scene 02 energy chain",
    "Scene 03 force/motion board",
    "Scene 04 mass/volume/density table",
  ],
} as const;
