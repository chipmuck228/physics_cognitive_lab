import { canLeaveStage } from "@/lib/learning/progression";
import { createSession } from "@/lib/learning/session";
import { LearningStage } from "@/types/learning";
import { describe, expect, it } from "vitest";

describe("progression gates", () => {
  it("lets the student leave ENTRY for OBSERVE", () => {
    const session = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "session-1",
    );

    expect(canLeaveStage(session, LearningStage.OBSERVE)).toBe(true);
    expect(canLeaveStage(session, LearningStage.DESCRIBE)).toBe(false);
  });

  it("blocks OBSERVE → DESCRIBE until an observation exists", () => {
    const session = createSession();
    const observing = { ...session, stage: LearningStage.OBSERVE };

    expect(canLeaveStage(observing, LearningStage.DESCRIBE)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...observing,
          observations: [{ text: "The bread looked warmer.", timestamp: "t" }],
        },
        LearningStage.DESCRIBE,
      ),
    ).toBe(true);
  });

  it("blocks DESCRIBE → PREDICT until a physics description exists", () => {
    const session = {
      ...createSession(),
      stage: LearningStage.DESCRIBE,
      observations: [{ text: "The bread got hotter.", timestamp: "t" }],
    };

    expect(canLeaveStage(session, LearningStage.PREDICT)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...session,
          descriptions: [
            {
              text: "The bread became hot.",
              object: "bread",
              timestamp: "t",
            },
          ],
        },
        LearningStage.PREDICT,
      ),
    ).toBe(false);
    expect(
      canLeaveStage(
        {
          ...session,
          descriptions: [
            {
              text: "The temperature of the bread increased.",
              object: "bread",
              quantity: "temperature",
              change: "increase",
              sufficient: true,
              timestamp: "t",
            },
          ],
        },
        LearningStage.PREDICT,
      ),
    ).toBe(true);
  });

  it("blocks EXPERIMENT → EXPLAIN until a post-prediction run and comparison exist", () => {
    const session = {
      ...createSession(),
      stage: LearningStage.EXPERIMENT,
      predictions: [
        {
          prediction: "temperature increases",
          reasoning: "More heating time adds more energy.",
          timestamp: "2026-09-11T00:01:00.000Z",
        },
      ],
      experimentHistory: [
        {
          finalTemperatureC: 35,
          energyInputJ: 15000,
          deltaTemperatureC: 15,
        },
      ],
    };

    expect(canLeaveStage(session, LearningStage.EXPLAIN)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...session,
          events: [
            ...session.events,
            {
              type: "experiment_run",
              stage: LearningStage.EXPERIMENT,
              timestamp: "2026-09-11T00:02:00.000Z",
              metadata: {
                finalTemperatureC: 50,
                energyInputJ: 30000,
                deltaTemperatureC: 15,
                powerW: 500,
                heatingTimeSec: 60,
                initialTemperatureC: 35,
              },
            },
          ],
          experimentEvidence: [
            {
              prediction: "temperature increases",
              predictionReason: "More heating time adds more energy.",
              actualResult: {
                finalTemperatureC: 50,
                energyInputJ: 30000,
                deltaTemperatureC: 15,
              },
              predictionComparison: "The temperature rose further, matching my prediction.",
              reflection: "A longer run added more energy and the bread got hotter.",
              parameters: {
                powerW: 500,
                heatingTimeSec: 60,
                initialTemperatureC: 35,
              },
              timestamp: "2026-09-11T00:03:00.000Z",
            },
          ],
        },
        LearningStage.EXPLAIN,
      ),
    ).toBe(true);
  });

  it("still allows going back without new evidence", () => {
    const session = {
      ...createSession(),
      stage: LearningStage.OBSERVE,
    };

    expect(canLeaveStage(session, LearningStage.ENTRY)).toBe(true);
  });

  it("requires explanation evidence before MODEL", () => {
    const session = {
      ...createSession(),
      stage: LearningStage.EXPLAIN,
    };

    expect(canLeaveStage(session, LearningStage.MODEL)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...session,
          explanations: [
            {
              text: "Energy entered the bread so its internal energy changed and its temperature increased.",
              explanationLevel: 3,
              timestamp: "t",
            },
          ],
        },
        LearningStage.MODEL,
      ),
    ).toBe(true);
  });

  it("requires a correct model before TRANSFER", () => {
    const session = {
      ...createSession(),
      stage: LearningStage.MODEL,
    };

    expect(canLeaveStage(session, LearningStage.TRANSFER)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...session,
          modelAttempts: [
            {
              nodes: [
                "energy enters",
                "internal energy changes",
                "temperature increases",
              ],
              connections: [
                { from: "energy enters", to: "internal energy changes" },
                {
                  from: "internal energy changes",
                  to: "temperature increases",
                },
              ],
              correctStructure: true,
              timestamp: "t",
            },
          ],
        },
        LearningStage.TRANSFER,
      ),
    ).toBe(true);
  });

  it("requires all transfer scenarios before EXAM", () => {
    const session = {
      ...createSession(),
      stage: LearningStage.TRANSFER,
    };

    expect(canLeaveStage(session, LearningStage.EXAM)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...session,
          transferAttempts: [
            {
              scenarioId: "hot-water-bag",
              response: "Energy moves into the hand so it gets warmer.",
              identifiedSharedModel: true,
              timestamp: "t",
            },
            {
              scenarioId: "rubbing-hands",
              response: "Energy changes and the hands become warm.",
              identifiedSharedModel: true,
              timestamp: "t",
            },
            {
              scenarioId: "electric-kettle",
              response: "Energy enters the water and the temperature rises.",
              identifiedSharedModel: true,
              timestamp: "t",
            },
          ],
        },
        LearningStage.EXAM,
      ),
    ).toBe(true);
  });

  it("requires the full exam set before AI_OFF", () => {
    const session = {
      ...createSession(),
      stage: LearningStage.EXAM,
    };

    expect(canLeaveStage(session, LearningStage.AI_OFF)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...session,
          examAttempts: [
            completeExamAttempt("exam-q1"),
            completeExamAttempt("exam-q2"),
            completeExamAttempt("exam-q3"),
            completeExamAttempt("exam-q4"),
            completeExamAttempt("exam-q5"),
          ],
        },
        LearningStage.AI_OFF,
      ),
    ).toBe(true);
  });
});

function completeExamAttempt(questionId: string) {
  return {
    questionId,
    representation: ["temperature"],
    modelFocus: "energy enters -> internal energy changes -> temperature increases",
    modelRecognition: "energy enters -> internal energy changes -> temperature increases",
    selectedAnswer: "a",
    reasoning: "The model connects energy, internal energy, and temperature.",
    correct: true,
    correctness: true,
    timestamp: "t",
  };
}
