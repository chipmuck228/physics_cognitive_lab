import { LearningStage, type ExperimentEvidence, type LearningSession } from "@/types/learning";

export function hasPostPredictionExperiment(session: LearningSession): boolean {
  const prediction = session.predictions.at(-1);
  if (!prediction) {
    return false;
  }

  return session.events.some(
    (event) =>
      event.type === "experiment_run" &&
      event.stage === LearningStage.EXPERIMENT &&
      event.timestamp >= prediction.timestamp,
  );
}

export function getLatestPostPredictionExperiment(session: LearningSession): {
  actualResult: ExperimentEvidence["actualResult"];
  parameters: ExperimentEvidence["parameters"];
  timestamp: string;
} | null {
  const prediction = session.predictions.at(-1);
  if (!prediction) {
    return null;
  }

  const run = [...session.events]
    .reverse()
    .find(
      (event) =>
        event.type === "experiment_run" &&
        event.stage === LearningStage.EXPERIMENT &&
        event.timestamp >= prediction.timestamp,
    );

  const metadata = run?.metadata;
  if (!run || !metadata) {
    return null;
  }

  const actualResult = {
    finalTemperatureC: numberFrom(metadata.finalTemperatureC),
    energyInputJ: numberFrom(metadata.energyInputJ),
    deltaTemperatureC: numberFrom(metadata.deltaTemperatureC),
  };
  const parameters = {
    powerW: numberFrom(metadata.powerW),
    heatingTimeSec: numberFrom(metadata.heatingTimeSec),
    initialTemperatureC: numberFrom(metadata.initialTemperatureC),
  };

  if (
    actualResult.finalTemperatureC === null ||
    actualResult.energyInputJ === null ||
    actualResult.deltaTemperatureC === null ||
    parameters.powerW === null ||
    parameters.heatingTimeSec === null ||
    parameters.initialTemperatureC === null
  ) {
    return null;
  }

  return {
    actualResult: {
      finalTemperatureC: actualResult.finalTemperatureC,
      energyInputJ: actualResult.energyInputJ,
      deltaTemperatureC: actualResult.deltaTemperatureC,
    },
    parameters: {
      powerW: parameters.powerW,
      heatingTimeSec: parameters.heatingTimeSec,
      initialTemperatureC: parameters.initialTemperatureC,
    },
    timestamp: run.timestamp,
  };
}

export function isExperimentEvidenceComplete(
  evidence: ExperimentEvidence | undefined,
): boolean {
  if (!evidence) {
    return false;
  }

  return (
    evidence.prediction.trim().length > 0 &&
    evidence.predictionReason.trim().length > 0 &&
    evidence.predictionComparison.trim().length >= 8 &&
    evidence.reflection.trim().length >= 8 &&
    Number.isFinite(evidence.actualResult?.finalTemperatureC)
  );
}

export function hasCompletedExperimentEvidence(session: LearningSession): boolean {
  if (!hasPostPredictionExperiment(session)) {
    return false;
  }

  return (session.experimentEvidence ?? []).some((evidence) =>
    isExperimentEvidenceComplete(evidence),
  );
}

export function buildExperimentEvidence(input: {
  session: LearningSession;
  predictionComparison: string;
  reflection: string;
  timestamp?: string;
}): ExperimentEvidence | null {
  const prediction = input.session.predictions.at(-1);
  const run = getLatestPostPredictionExperiment(input.session);
  if (!prediction || !run) {
    return null;
  }

  return {
    prediction: prediction.prediction,
    predictionReason: prediction.reasoning,
    actualResult: run.actualResult,
    predictionComparison: input.predictionComparison.trim(),
    reflection: input.reflection.trim(),
    parameters: run.parameters,
    timestamp: input.timestamp ?? new Date().toISOString(),
  };
}

function numberFrom(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
