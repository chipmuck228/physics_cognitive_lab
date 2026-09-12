import { describe, expect, it } from "vitest";

import { accumulateHeatSceneEvidence } from "@/lib/learning/heat-evidence";
import {
  HEAT_AI_OFF_CHALLENGE_IDS,
  applyHeatAiOffPostCheck,
  buildHeatAiOffAssessment,
  buildHeatAiOffAttempt,
  completeHeatAiOffAttempt,
  completeHeatAiOffInput,
  evaluateHeatAiOffAttempt,
  hasCompletedHeatAiOff,
  intendedHeatAiOffAnswerId,
} from "@/lib/learning/heat-ai-off";
import {
  buildHeatModelAttempt,
  completeHeatModelInput,
} from "@/lib/learning/heat-model";
import {
  buildHeatTransferAttempt,
  completeHeatIceTransferInput,
  completeHeatPotsTransferInput,
} from "@/lib/learning/heat-transfer";
import { createSession } from "@/lib/learning/session";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { HEAT_SAMPLES_SCENE_ID, LearningStage } from "@/types/learning";

describe("heat AI_OFF", () => {
  it("rejects answer-only and material-name-only reasoning", () => {
    const challengeId = HEAT_AI_OFF_CHALLENGE_IDS[0];
    const answerOnly = evaluateHeatAiOffAttempt({
      challengeId,
      selectedAnswer: intendedHeatAiOffAnswerId(challengeId),
      studentReasoning: "对",
      postCheckIds: [],
      llmUsed: false,
    });
    expect(answerOnly.accepted).toBe(false);

    const conclusionOnly = evaluateHeatAiOffAttempt({
      challengeId,
      selectedAnswer: intendedHeatAiOffAnswerId(challengeId),
      studentReasoning: "因为材料不同，所以升温不同。",
      postCheckIds: completeHeatAiOffInput(challengeId, "t").postCheckIds,
      llmUsed: false,
    });
    expect(conclusionOnly.accepted).toBe(false);
    expect(conclusionOnly.reasoningSignals.conclusionOnlyReasoning).toBe(true);
  });

  it("does not let post-check rewrite the committed response", () => {
    const input = completeHeatAiOffInput(HEAT_AI_OFF_CHALLENGE_IDS[0], "t");
    const committed = buildHeatAiOffAttempt(input, [], false);
    const after = applyHeatAiOffPostCheck(committed, input.postCheckIds, false);
    expect(after.selectedAnswer).toBe(committed.selectedAnswer);
    expect(after.studentReasoning).toBe(committed.studentReasoning);
    expect(after.accepted).toBe(true);
  });

  it("derives L6 only after both challenges, prior L5, and no AI", () => {
    const attempts = HEAT_AI_OFF_CHALLENGE_IDS.map((id, index) =>
      completeHeatAiOffAttempt(id, `t${index}`),
    );
    const session = {
      ...createSession(() => "t0", () => "heat-ai-off", HEAT_SAMPLES_SCENE_ID),
      stage: LearningStage.AI_OFF,
      modelAttempts: [buildHeatModelAttempt(completeHeatModelInput("t"))],
      transferAttempts: [
        buildHeatTransferAttempt(completeHeatPotsTransferInput("t1")),
        buildHeatTransferAttempt(completeHeatIceTransferInput("t2")),
      ],
      independentAssessment: buildHeatAiOffAssessment(attempts, false),
    };
    expect(hasCompletedHeatAiOff(session)).toBe(true);
    expect(deriveModelEvidenceLevel(accumulateHeatSceneEvidence(session))).toBe("L6");
  });
});
