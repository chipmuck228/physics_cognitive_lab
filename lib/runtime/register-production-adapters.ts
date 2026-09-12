import { fourStrokeEngineAdapter } from "@/lib/runtime/adapters/four-stroke-engine";
import { equalMassHeatedSamplesAdapter } from "@/lib/runtime/adapters/equal-mass-heated-samples";
import { simpleResistorCircuitAdapter } from "@/lib/runtime/adapters/simple-resistor-circuit";
import { equalVolumeMaterialSamplesAdapter } from "@/lib/runtime/adapters/equal-volume-material-samples";
import { horizontalForceCartAdapter } from "@/lib/runtime/adapters/horizontal-force-cart";
import { microwaveBreadAdapter } from "@/lib/runtime/adapters/microwave-bread";
import { hasSceneAdapter, registerSceneAdapter } from "@/lib/runtime/registry";

export function registerProductionSceneAdapters(): void {
  if (!hasSceneAdapter(microwaveBreadAdapter.sceneId)) {
    registerSceneAdapter(microwaveBreadAdapter);
  }
  if (!hasSceneAdapter(fourStrokeEngineAdapter.sceneId)) {
    registerSceneAdapter(fourStrokeEngineAdapter);
  }
  if (!hasSceneAdapter(horizontalForceCartAdapter.sceneId)) {
    registerSceneAdapter(horizontalForceCartAdapter);
  }
  if (!hasSceneAdapter(equalVolumeMaterialSamplesAdapter.sceneId)) {
    registerSceneAdapter(equalVolumeMaterialSamplesAdapter);
  }
  if (!hasSceneAdapter(equalMassHeatedSamplesAdapter.sceneId)) {
    registerSceneAdapter(equalMassHeatedSamplesAdapter);
  }
  if (!hasSceneAdapter(simpleResistorCircuitAdapter.sceneId)) {
    registerSceneAdapter(simpleResistorCircuitAdapter);
  }
}
