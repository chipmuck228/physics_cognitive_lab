import type { SceneAdapter } from "@/lib/runtime/types";
import { LearningStage } from "@/types/learning";

/**
 * Test-only adapter. Not a product Scene.
 * Uses density-mass-volume so the fixture is not an engine-like
 * four-node energy chain.
 */
export const DENSITY_FIXTURE_SCENE_ID = "runtime-density-fixture";

export function densityFixtureAdapter(): SceneAdapter {
  return {
    sceneId: DENSITY_FIXTURE_SCENE_ID,
    primaryModelId: "density-mass-volume",
    getInitialPhysicsState: () => ({
      sceneId: DENSITY_FIXTURE_SCENE_ID,
      state: { massG: 50, volumeCm3: 25 },
    }),
    getInitialSceneData: () => ({ trialNotes: [] }),
    getTutorContext: (session) => {
      const state = session.physicsState.state as {
        massG?: number;
        volumeCm3?: number;
      };
      const massG = typeof state.massG === "number" ? state.massG : 50;
      const volumeCm3 =
        typeof state.volumeCm3 === "number" ? state.volumeCm3 : 25;
      return {
        learningGoal:
          "Help the student compare mass and volume without naming the relation first.",
        currentPhysicsState: { massG, volumeCm3 },
        physicsSummary: `Physics state: mass ${massG} g, volume ${volumeCm3} cm3`,
        promptConstraint:
          "Ask about mass and volume. Do not give a density formula.",
      };
    },
    completion: {
      [LearningStage.ENTRY]: () => true,
      [LearningStage.OBSERVE]: (session) => session.observations.length > 0,
      [LearningStage.DESCRIBE]: (session) =>
        Array.isArray(session.sceneData.trialNotes) &&
        session.sceneData.trialNotes.length > 0,
      [LearningStage.PREDICT]: () => false,
      [LearningStage.EXPERIMENT]: () => false,
      [LearningStage.EXPLAIN]: () => false,
      [LearningStage.MODEL]: () => false,
      [LearningStage.TRANSFER]: () => false,
      [LearningStage.EXAM]: () => false,
      [LearningStage.AI_OFF]: () => false,
      [LearningStage.COMPLETE]: (session) => session.completed,
    },
    accumulateEvidence: () => ({}),
    assessmentOverlay: {},
  };
}
