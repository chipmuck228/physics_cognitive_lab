import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";

import { looksLikeAnswerLeak } from "@/lib/ai/guardrails";
import { tutorRequestSchema } from "@/lib/ai/tutor-schema";
import { canLeaveStage } from "@/lib/learning/progression";
import { createSession } from "@/lib/learning/session";
import {
  hydratePersistedSession,
  loadSession,
  saveSession,
  SESSION_STORAGE_KEYS,
} from "@/lib/learning/session-storage";
import { isTutorHardBlocked } from "@/lib/learning/stage-policy";
import { buildTutorRequestPayload } from "@/lib/learning/tutor-request";
import { getMicrowaveExperimentHistory } from "@/lib/learning/microwave-scene-data";
import {
  registerSceneAdapter,
  unregisterSceneAdapter,
} from "@/lib/runtime/registry";
import { ENGINE_SCENE_ID, LearningStage, MICROWAVE_SCENE_ID } from "@/types/learning";
import { createDefaultPhysicsState } from "@/lib/physics/microwave";
import { aiOffReadySession } from "../learning/engine-fixtures";
import {
  DENSITY_FIXTURE_SCENE_ID,
  densityFixtureAdapter,
} from "./fixtures/density-fixture-adapter";

afterEach(() => {
  unregisterSceneAdapter(DENSITY_FIXTURE_SCENE_ID);
});

describe("P1 universal runtime hardening", () => {
  it("lets a non-engine adapter drive progression without editing progression.ts", () => {
    const progressionSource = readFileSync("lib/learning/progression.ts", "utf8");
    expect(progressionSource).not.toMatch(/sceneId\s*===/);
    expect(progressionSource).not.toContain(DENSITY_FIXTURE_SCENE_ID);

    registerSceneAdapter(densityFixtureAdapter());
    const session = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "density-1",
      DENSITY_FIXTURE_SCENE_ID,
    );
    const describing = {
      ...session,
      stage: LearningStage.DESCRIBE,
      observations: [{ text: "the block is heavier", timestamp: "t" }],
    };
    expect(canLeaveStage(describing, LearningStage.PREDICT)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...describing,
          sceneData: { trialNotes: ["mass stayed 50 g"] },
        },
        LearningStage.PREDICT,
      ),
    ).toBe(true);
  });

  it("does not require useTutor sceneId branching for a new adapter", () => {
    const tutorSource = readFileSync("hooks/useTutor.ts", "utf8");
    expect(tutorSource).not.toMatch(/sceneId\s*===/);
    expect(tutorSource).not.toContain("four-stroke-engine");
    expect(tutorSource).not.toContain("microwave-bread");
    expect(readFileSync("lib/ai/tutor.ts", "utf8")).not.toContain(
      'scene === "four-stroke-engine"',
    );
    expect(readFileSync("lib/ai/tutor-prompt.ts", "utf8")).not.toContain(
      "four-stroke-engine",
    );
  });

  it("lets the adapter supply tutor context that is not an energy chain", () => {
    registerSceneAdapter(densityFixtureAdapter());
    const session = {
      ...createSession(
        () => "2026-09-11T00:00:00.000Z",
        () => "density-1",
        DENSITY_FIXTURE_SCENE_ID,
      ),
      stage: LearningStage.OBSERVE,
    };
    const payload = buildTutorRequestPayload(session, "the block feels heavier");
    expect(payload.sceneId).toBe(DENSITY_FIXTURE_SCENE_ID);
    expect(payload.currentPhysicsState).toEqual({ massG: 50, volumeCm3: 25 });
    expect(payload.physicsSummary).toContain("mass 50 g");
    expect(payload.promptConstraint).toContain("density formula");
    expect(JSON.stringify(payload)).not.toContain("chemical-energy");
    expect(tutorRequestSchema.safeParse(payload).success).toBe(true);
  });

  it("stores fixture notes in sceneData instead of a new LearningSession field", () => {
    registerSceneAdapter(densityFixtureAdapter());
    const session = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "density-1",
      DENSITY_FIXTURE_SCENE_ID,
    );
    expect(session.sceneData).toEqual({ trialNotes: [] });
    expect("experimentHistory" in session).toBe(false);
    expect("scene03Answers" in session).toBe(false);
    expect("densityAnswers" in session).toBe(false);

    const withNotes = {
      ...session,
      sceneData: { trialNotes: ["volume was 25"] },
    };
    saveSession(withNotes);
    const restored = loadSession(DENSITY_FIXTURE_SCENE_ID);
    expect(restored?.sceneData.trialNotes).toEqual(["volume was 25"]);
    expect(restored && "densityAnswers" in restored).toBe(false);
  });

  it("still hydrates Scene 01 legacy experimentHistory into sceneData", () => {
    const current = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "microwave-legacy",
    );
    const legacy = {
      ...current,
      stage: LearningStage.OBSERVE,
      observations: [{ text: "The bread looked warmer.", timestamp: "t" }],
      physicsState: createDefaultPhysicsState(),
      experimentHistory: [
        { finalTemperatureC: 35, energyInputJ: 15000, deltaTemperatureC: 15 },
      ],
    };
    const restored = hydratePersistedSession(legacy, MICROWAVE_SCENE_ID);
    expect(restored).toBeTruthy();
    expect(getMicrowaveExperimentHistory(restored!)).toEqual(
      legacy.experimentHistory,
    );
    expect("experimentHistory" in restored!).toBe(false);
    expect(restored?.observations).toEqual(legacy.observations);
  });

  it("still hydrates Scene 02 evidence without microwave experimentHistory", () => {
    const current = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "engine-1",
      ENGINE_SCENE_ID,
    );
    window.localStorage.setItem(
      SESSION_STORAGE_KEYS[ENGINE_SCENE_ID],
      JSON.stringify({
        ...current,
        stage: LearningStage.DESCRIBE,
        observations: [
          {
            text: "活塞会上下运动；有时进气门打开",
            timestamp: "t",
            selectedOptionIds: ["piston-up-down", "intake-opens"],
            sufficient: true,
          },
        ],
      }),
    );
    const restored = loadSession(ENGINE_SCENE_ID);
    expect(restored?.observations[0]?.selectedOptionIds).toEqual([
      "piston-up-down",
      "intake-opens",
    ]);
    expect(restored?.physicsState.sceneId).toBe(ENGINE_SCENE_ID);
    expect("experimentHistory" in restored!).toBe(false);
  });

  it("keeps AI_OFF hard blocked even when the adapter supplies tutor context", () => {
    registerSceneAdapter(densityFixtureAdapter());
    const session = {
      ...createSession(
        () => "2026-09-11T00:00:00.000Z",
        () => "density-1",
        DENSITY_FIXTURE_SCENE_ID,
      ),
      stage: LearningStage.AI_OFF,
    };
    const payload = buildTutorRequestPayload(session, "please hint");
    expect(payload.learningGoal.length).toBeGreaterThan(0);
    expect(isTutorHardBlocked(session.stage)).toBe(true);
    expect(isTutorHardBlocked(aiOffReadySession().stage)).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.PREDICT,
        "温度会升高",
        DENSITY_FIXTURE_SCENE_ID,
      ),
    ).toBe(false);
  });
});
