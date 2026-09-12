import type { SceneAdapter } from "@/lib/runtime/types";

const adapters = new Map<string, SceneAdapter>();

export function registerSceneAdapter(adapter: SceneAdapter): void {
  adapters.set(adapter.sceneId, adapter);
}

export function unregisterSceneAdapter(sceneId: string): void {
  adapters.delete(sceneId);
}

export function hasSceneAdapter(sceneId: string): boolean {
  return adapters.has(sceneId);
}

export function getSceneAdapter(sceneId: string): SceneAdapter {
  const adapter = adapters.get(sceneId);
  if (!adapter) {
    throw new Error(`No SceneAdapter registered for scene "${sceneId}".`);
  }
  return adapter;
}
