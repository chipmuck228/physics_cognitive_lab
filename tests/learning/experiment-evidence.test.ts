import { describe, expect, it } from "vitest";

import {
  buildExperimentEvidence,
  hasCompletedExperimentEvidence,
  hasPostPredictionExperiment,
} from "@/lib/learning/experiment-evidence";
import { createSession } from "@/lib/learning/session";
import { LearningStage } from "@/types/learning";

function experimentSession() {
  return {
    ...createSession(),
    stage: LearningStage.EXPERIMENT,
    predictions: [
      {
        prediction: "temperature increases",
        reasoning: "Longer heating adds more energy.",
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
    events: [
      {
        type: "experiment_run" as const,
        stage: LearningStage.OBSERVE,
        timestamp: "2026-09-11T00:00:30.000Z",
        metadata: {
          finalTemperatureC: 35,
          energyInputJ: 15000,
          deltaTemperatureC: 15,
          powerW: 500,
          heatingTimeSec: 30,
          initialTemperatureC: 20,
        },
      },
    ],
  };
}

describe("experiment evidence", () => {
  it("does not let the OBSERVE run satisfy the EXPERIMENT gate", () => {
    const session = experimentSession();

    expect(hasPostPredictionExperiment(session)).toBe(false);
    expect(hasCompletedExperimentEvidence(session)).toBe(false);
    expect(
      buildExperimentEvidence({
        session,
        predictionComparison: "It matched my prediction.",
        reflection: "More energy made the bread hotter.",
      }),
    ).toBeNull();
  });

  it("requires a new run after the prediction plus comparison and reflection", () => {
    const session = {
      ...experimentSession(),
      events: [
        ...experimentSession().events,
        {
          type: "experiment_run" as const,
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
    };

    expect(hasPostPredictionExperiment(session)).toBe(true);
    expect(hasCompletedExperimentEvidence(session)).toBe(false);

    const evidence = buildExperimentEvidence({
      session,
      predictionComparison: "The temperature rose again, as I predicted.",
      reflection: "Changing time changed the energy that entered the bread.",
      timestamp: "2026-09-11T00:03:00.000Z",
    });

    expect(evidence).toMatchObject({
      prediction: "temperature increases",
      predictionReason: "Longer heating adds more energy.",
      actualResult: {
        finalTemperatureC: 50,
        energyInputJ: 30000,
        deltaTemperatureC: 15,
      },
      parameters: {
        powerW: 500,
        heatingTimeSec: 60,
        initialTemperatureC: 35,
      },
    });

    expect(
      hasCompletedExperimentEvidence({
        ...session,
        experimentEvidence: evidence ? [evidence] : [],
      }),
    ).toBe(true);
  });
});
