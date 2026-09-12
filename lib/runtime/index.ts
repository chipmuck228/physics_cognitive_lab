import { registerProductionSceneAdapters } from "@/lib/runtime/register-production-adapters";

registerProductionSceneAdapters();

export type {
  AssessmentOverlay,
  ExamAssessmentDefinition,
  IndependentAssessmentDefinition,
  IndependentJudgmentOption,
  IndependentPostCheckOption,
  SceneAdapter,
  SceneExperimentResult,
  SceneTutorContext,
} from "@/lib/runtime/types";
export {
  getSceneAdapter,
  hasSceneAdapter,
  registerSceneAdapter,
  unregisterSceneAdapter,
} from "@/lib/runtime/registry";
export { microwaveBreadAdapter } from "@/lib/runtime/adapters/microwave-bread";
export { fourStrokeEngineAdapter } from "@/lib/runtime/adapters/four-stroke-engine";
export { horizontalForceCartAdapter } from "@/lib/runtime/adapters/horizontal-force-cart";
export { equalVolumeMaterialSamplesAdapter } from "@/lib/runtime/adapters/equal-volume-material-samples";
export { equalMassHeatedSamplesAdapter } from "@/lib/runtime/adapters/equal-mass-heated-samples";
export { simpleResistorCircuitAdapter } from "@/lib/runtime/adapters/simple-resistor-circuit";
export {
  defaultCartScenePhysics,
  defaultEngineScenePhysics,
  defaultMicrowaveScenePhysics,
  defaultHeatSamplesScenePhysics,
  defaultOhmsScenePhysics,
  defaultSamplesScenePhysics,
  getCartPhysicsState,
  getHeatSamplesPhysicsState,
  getOhmsPhysicsState,
  getEnginePhysicsState,
  getMicrowavePhysicsState,
  getSamplesPhysicsState,
  isCartScenePhysics,
  isEngineScenePhysics,
  isMicrowaveScenePhysics,
  isHeatSamplesScenePhysics,
  isSamplesScenePhysics,
  wrapCartPhysicsState,
  wrapHeatSamplesPhysicsState,
  wrapOhmsPhysicsState,
  wrapEnginePhysicsState,
  wrapMicrowavePhysicsState,
  wrapSamplesPhysicsState,
} from "@/lib/runtime/physics-state";
