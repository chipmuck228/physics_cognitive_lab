import { canLeaveStage, hasCompletedCognitiveStep } from "@/lib/learning/progression";
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
    ).toBe(false);
    expect(
      canLeaveStage(
        {
          ...observing,
          observations: [
            {
              text: "面包摸起来更热了。",
              timestamp: "t",
              selectedOptionIds: ["bread-warmer"],
              sufficient: true,
            },
          ],
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
              text: "面包的温度升高了。",
              object: "bread",
              quantity: "temperature",
              change: "increases",
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
          reasoning: "加热更久，进入面包的能量会更多。",
          timestamp: "2026-09-11T00:01:00.000Z",
          experimentId: "more-energy-in-no-phase-change",
          committed: true,
        },
      ],
      sceneData: {
        experimentHistory: [
          {
            finalTemperatureC: 35,
            energyInputJ: 15000,
            deltaTemperatureC: 15,
          },
        ],
      },
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
              experimentId: "more-energy-in-no-phase-change",
              prediction: "temperature increases",
              predictionReason: "加热更久，进入面包的能量会更多。",
              committedAt: "2026-09-11T00:01:00.000Z",
              interventionAt: "2026-09-11T00:02:00.000Z",
              authoredBeforeIntervention: true,
              actualResult: {
                finalTemperatureC: 50,
                energyInputJ: 30000,
                deltaTemperatureC: 15,
              },
              comparison: "same",
              predictionComparison: "same",
              reflection: "再做一次后，能量更多，面包更热。",
              parameters: {
                powerW: 500,
                heatingTimeSec: 60,
                initialTemperatureC: 35,
              },
              timestamp: "2026-09-11T00:03:00.000Z",
              sufficient: true,
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

  it("lets Scene 02 leave ENTRY for OBSERVE", () => {
    const session = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "session-engine",
      "four-stroke-engine",
    );

    expect(canLeaveStage(session, LearningStage.OBSERVE)).toBe(true);
    expect(canLeaveStage(session, LearningStage.DESCRIBE)).toBe(false);
  });

  it("blocks Scene 02 OBSERVE → DESCRIBE until structured observation evidence exists", () => {
    const observing = {
      ...createSession(
        () => "2026-09-11T00:00:00.000Z",
        () => "session-engine",
        "four-stroke-engine",
      ),
      stage: LearningStage.OBSERVE,
    };

    expect(canLeaveStage(observing, LearningStage.DESCRIBE)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...observing,
          observations: [
            {
              text: "活塞会上下运动",
              timestamp: "t",
              selectedOptionIds: ["piston-up-down"],
              watchedFullCycle: true,
              sufficient: false,
            },
          ],
        },
        LearningStage.DESCRIBE,
      ),
    ).toBe(false);
    expect(
      canLeaveStage(
        {
          ...observing,
          observations: [
            {
              text: "活塞会上下运动；有时进气门打开",
              timestamp: "t",
              selectedOptionIds: ["piston-up-down", "intake-opens"],
              watchedFullCycle: true,
              sufficient: true,
            },
          ],
        },
        LearningStage.DESCRIBE,
      ),
    ).toBe(true);
  });

  it("lets Scene 02 leave DESCRIBE for PREDICT after structured description evidence", () => {
    const describing = {
      ...createSession(
        () => "2026-09-11T00:00:00.000Z",
        () => "session-engine",
        "four-stroke-engine",
      ),
      stage: LearningStage.DESCRIBE,
      observations: [
        {
          text: "活塞会上下运动；有时进气门打开",
          timestamp: "t",
          selectedOptionIds: ["piston-up-down", "intake-opens"],
          sufficient: true,
        },
      ],
      descriptions: [
        {
          text: "活塞向下运动，这里出现了燃烧。",
          timestamp: "t",
          sufficient: true,
          pistonMotionCorrect: true,
          intakeValveStateCorrect: true,
          combustionStateCorrect: true,
          distinguishesPowerEvent: true,
        },
      ],
    };

    expect(canLeaveStage(describing, LearningStage.PREDICT)).toBe(true);
    expect(canLeaveStage(describing, LearningStage.EXPERIMENT)).toBe(false);
    expect(canLeaveStage(describing, LearningStage.EXPLAIN)).toBe(false);
    expect(canLeaveStage(describing, LearningStage.COMPLETE)).toBe(false);
  });

  it("requires a committed Scene 02 prediction before EXPERIMENT", () => {
    const predicting = {
      ...createSession(
        () => "2026-09-11T00:00:00.000Z",
        () => "session-engine",
        "four-stroke-engine",
      ),
      stage: LearningStage.PREDICT,
      predictions: [
        {
          prediction: "no-main-output",
          reasoning: "",
          timestamp: "t",
          experimentId: "ignition-energy-release" as const,
          committed: true,
        },
      ],
    };

    expect(canLeaveStage(predicting, LearningStage.EXPERIMENT)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...predicting,
          predictions: [
            {
              prediction: "main-output",
              reasoning: "它还在动，所以应该还有主要动力。",
              timestamp: "t",
              experimentId: "ignition-energy-release" as const,
              committed: true,
            },
          ],
        },
        LearningStage.EXPERIMENT,
      ),
    ).toBe(true);
  });

  it("lets Scene 02 leave EXPERIMENT for EXPLAIN after both experiments close", () => {
    const experimenting = {
      ...createSession(
        () => "2026-09-11T00:00:00.000Z",
        () => "session-engine",
        "four-stroke-engine",
      ),
      stage: LearningStage.EXPERIMENT,
      predictions: [
        {
          prediction: "no-main-output",
          reasoning: "我猜没有燃烧就没有主要动力。",
          timestamp: "2026-09-11T00:01:00.000Z",
          experimentId: "ignition-energy-release" as const,
          committed: true,
        },
        {
          prediction: "no-main-output",
          reasoning: "活塞不能动应该就没有输出。",
          timestamp: "2026-09-11T00:05:00.000Z",
          experimentId: "immovable-mechanical-system" as const,
          committed: true,
        },
      ],
      experimentEvidence: [
        closedEngineEvidence("ignition-energy-release"),
        closedEngineEvidence("immovable-mechanical-system"),
      ],
    };

    expect(hasCompletedCognitiveStep(experimenting, LearningStage.EXPERIMENT)).toBe(
      true,
    );
    expect(canLeaveStage(experimenting, LearningStage.EXPLAIN)).toBe(true);
    expect(canLeaveStage(experimenting, LearningStage.MODEL)).toBe(false);
    expect(canLeaveStage(experimenting, LearningStage.TRANSFER)).toBe(false);
    expect(canLeaveStage(experimenting, LearningStage.COMPLETE)).toBe(false);
  });

  it("requires Scene 02 causal EXPLAIN evidence before MODEL", () => {
    const explaining = {
      ...createSession(
        () => "2026-09-11T00:00:00.000Z",
        () => "session-engine",
        "four-stroke-engine",
      ),
      stage: LearningStage.EXPLAIN,
      explanations: [
        {
          text: "燃烧让曲轴转。",
          timestamp: "t",
          engineAnswers: {
            firstChange: "direct-crank",
            gasEffect: "fire-turns",
            mechanicalGain: "fire-is-power",
          },
          sufficient: false,
        },
      ],
    };

    expect(canLeaveStage(explaining, LearningStage.MODEL)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...explaining,
          explanations: [
            {
              text: "燃烧以后气体变了，再推动活塞。",
              timestamp: "t",
              identifiesWorkingGasChange: true,
              identifiesMechanicalInteraction: true,
              distinguishesCombustionFromDirectMechanicalOutput: true,
              engineAnswers: {
                firstChange: "working-gas",
                gasEffect: "gas-pushes",
                mechanicalGain: "work-like",
              },
              sufficient: true,
            },
          ],
        },
        LearningStage.MODEL,
      ),
    ).toBe(true);
  });

  it("opens TRANSFER after a valid Scene 02 MODEL and stops before EXAM", () => {
    const modeling = {
      ...createSession(
        () => "2026-09-11T00:00:00.000Z",
        () => "session-engine",
        "four-stroke-engine",
      ),
      stage: LearningStage.MODEL,
      modelAttempts: [
        {
          nodes: [
            "fuel-chemical-energy",
            "working-gas-internal-energy-or-state",
            "mechanical-system",
            "mechanical-energy",
          ],
          connections: [
            {
              from: "fuel-chemical-energy",
              to: "working-gas-internal-energy-or-state",
              kind: "conversion" as const,
            },
            {
              from: "working-gas-internal-energy-or-state",
              to: "mechanical-system",
              kind: "work" as const,
            },
            {
              from: "mechanical-system",
              to: "mechanical-energy",
              kind: "gains" as const,
            },
          ],
          correctStructure: true,
          timestamp: "t",
        },
      ],
    };

    expect(hasCompletedCognitiveStep(modeling, LearningStage.MODEL)).toBe(true);
    expect(canLeaveStage(modeling, LearningStage.TRANSFER)).toBe(true);
    expect(canLeaveStage(modeling, LearningStage.EXAM)).toBe(false);
    expect(canLeaveStage(modeling, LearningStage.COMPLETE)).toBe(false);
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
              text: "能量进入面包后，面包的内能变了，温度升高。",
              timestamp: "t",
              sufficient: true,
              identifiesPartialEnergyRelation: true,
              microwaveAnswers: {
                energyTransfer: "energy-entered",
                link: "u-and-t",
              },
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

  it("requires the kettle and ice transfer pair before EXAM", () => {
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
              scenarioId: "near-kettle-heating-water",
              targetId: "near-kettle-heating-water",
              transferMode: "full-model" as const,
              response: "能量进入壶里的水，水的内能增加，所以温度升高。",
              accepted: true,
              timestamp: "t",
            },
            {
              scenarioId: "far-ice-absorbs-energy",
              targetId: "far-ice-absorbs-energy",
              transferMode: "boundary-contrast" as const,
              response: "能量还可以进入冰块，但温度不一定升高。",
              accepted: true,
              timestamp: "t",
            },
          ],
        },
        LearningStage.EXAM,
      ),
    ).toBe(true);
  });

  it("requires the reconstructed exam set before AI_OFF", () => {
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
            completeExamAttempt("exam-temperature-is-not-internal-energy"),
            completeExamAttempt("exam-energy-in-need-not-raise-temperature"),
            completeExamAttempt("exam-hotter-not-always-more-internal-energy"),
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
    patternId: questionId,
    representation: ["temperature"],
    modelFocus: "温度不是内能",
    modelRecognition: "温度不是内能",
    selectedAnswer: "a",
    reasoning: "温度不是内能，还要看条件。",
    correct: true,
    correctness: true,
    timestamp: "t",
  };
}

function closedEngineEvidence(
  experimentId: "ignition-energy-release" | "immovable-mechanical-system",
) {
  const isA = experimentId === "ignition-energy-release";
  return {
    prediction: "no-main-output",
    predictionReason: "我猜不会有主要动力。",
    actualResult: {
      finalTemperatureC: 0,
      energyInputJ: 0,
      deltaTemperatureC: 0,
    },
    predictionComparison: "不一样",
    reflection: isA
      ? "燃烧对产生动力好像很重要。"
      : "燃烧发生了，但活塞不能动，所以没有正常输出。",
    parameters: {
      powerW: 0,
      heatingTimeSec: 0,
      initialTemperatureC: 0,
    },
    timestamp: "2026-09-11T00:02:00.000Z",
    experimentId,
    committedAt: "2026-09-11T00:01:00.000Z",
    interventionAt: "2026-09-11T00:02:00.000Z",
    intervention: isA
      ? { combustionEnabled: false, pistonCanMove: true }
      : { combustionEnabled: true, pistonCanMove: false },
    observedResult: {
      combustionOccurred: isA ? ("no" as const) : ("yes" as const),
      mechanismMoving: isA ? ("yes" as const) : ("no" as const),
      mainOutputOccurred: "no" as const,
    },
    comparison: "different" as const,
    physicsResult: {
      combustionOccurred: !isA,
      mainOutputOccurred: false,
      workTransfer: isA ? "none" : "blocked",
      mechanicalOutput: isA ? "none" : "blocked",
      crankshaftMoving: isA,
      workingGasState: isA ? "compressed-unburned" : "combusted-hot",
      pistonDirection: isA ? "down" : "held",
    },
    authoredBeforeIntervention: true,
    sufficient: true,
  };
}
