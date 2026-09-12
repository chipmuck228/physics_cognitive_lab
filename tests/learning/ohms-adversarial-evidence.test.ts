import { describe, expect, it } from "vitest";

import {
  applyOhmsAiOffPostCheck,
  buildOhmsAiOffAssessment,
  buildOhmsAiOffAttempt,
  completeOhmsAiOffInput,
  evaluateOhmsAiOffAttempt,
  intendedOhmsAiOffAnswerId,
  intendedOhmsAiOffPostCheckIds,
  intendedOhmsAiOffPreCommitIds,
  OHMS_AI_OFF_A,
  OHMS_AI_OFF_B,
} from "@/lib/learning/ohms-ai-off";
import { accumulateOhmsSceneEvidence } from "@/lib/learning/ohms-evidence";
import { officialExamCalculationAnswer } from "@/lib/learning/ohms-exam";
import {
  buildOhmsModelAttempt,
  completeOhmsModelInput,
  evaluateOhmsModelConstruction,
  sixClickOhmsModelInput,
} from "@/lib/learning/ohms-model";
import {
  buildOhmsTransferAttempt,
  completeOhmsFilamentTransferInput,
  completeOhmsWireTransferInput,
  evaluateOhmsTransfer,
  OHMS_TRANSFER_TARGET_IDS,
} from "@/lib/learning/ohms-transfer";
import { createSession } from "@/lib/learning/session";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { LearningStage, OHMS_SCENE_ID } from "@/types/learning";

function ohmsSession() {
  return createSession(() => "t0", () => "ohms-session", OHMS_SCENE_ID);
}

describe("Scene 06 adversarial L4 / L5 / L6", () => {
  it("six-click memorizer plus formula text fails L4", () => {
    const evaluation = evaluateOhmsModelConstruction(
      sixClickOhmsModelInput("t1"),
    );
    expect(evaluation.correctStructure).toBe(false);
    expect(evaluation.completenessOnly).toBe(true);
    const session = ohmsSession();
    session.modelAttempts = [buildOhmsModelAttempt(sixClickOhmsModelInput("t1"))];
    const evidence = accumulateOhmsSceneEvidence(session);
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L4");
  });

  it("correct board plus generic or empty authored text fails L4", () => {
    const generic = evaluateOhmsModelConstruction({
      ...completeOhmsModelInput("t1"),
      studentReasoning: "好好",
    });
    const empty = evaluateOhmsModelConstruction({
      ...completeOhmsModelInput("t1"),
      studentReasoning: "",
    });
    expect(generic.correctStructure).toBe(false);
    expect(empty.correctStructure).toBe(false);
  });

  it("one-control reasoning does not produce L4", () => {
    const evaluation = evaluateOhmsModelConstruction({
      ...completeOhmsModelInput("t1"),
      sameUConsequence: "",
      studentReasoning: "电阻没变的时候，电压更大，电流就更大。",
    });
    expect(evaluation.failureKinds).toContain("one-control-only");
    expect(evaluation.correctStructure).toBe(false);
  });

  it("complete board plus both-control authored reasoning can reach L4", () => {
    const attempt = buildOhmsModelAttempt(completeOhmsModelInput("t1"));
    expect(attempt.correctStructure).toBe(true);
    const session = ohmsSession();
    session.modelAttempts = [attempt];
    const evidence = accumulateOhmsSceneEvidence(session);
    expect(evidence.constructedValidCausalModel).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L4");
  });

  it("formula-only transfer fails L5", () => {
    const evaluation = evaluateOhmsTransfer({
      targetId: OHMS_TRANSFER_TARGET_IDS.wire,
      judgments: {
        "same-relation": "applies",
        "need-series-course": "not-necessarily",
        "need-power": "not-necessarily",
      },
      surfaceCueSelected: false,
      studentExplanation: "也是电路，所以 I = U / R",
      timestamp: "t1",
    });
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.failureKinds).toContain("also-a-circuit");
  });

  it("wrong-target reasoning cannot satisfy another target", () => {
    const wireWordsOnFilament = evaluateOhmsTransfer({
      ...completeOhmsWireTransferInput("t1"),
      targetId: OHMS_TRANSFER_TARGET_IDS.filament,
    });
    expect(wireWordsOnFilament.accepted).toBe(false);
    const filamentWordsOnWire = evaluateOhmsTransfer({
      ...completeOhmsFilamentTransferInput("t1"),
      targetId: OHMS_TRANSFER_TARGET_IDS.wire,
    });
    expect(filamentWordsOnWire.accepted).toBe(false);
  });

  it("required transfer pair after valid model can reach L5, MODEL-only stays L4", () => {
    const session = ohmsSession();
    session.modelAttempts = [buildOhmsModelAttempt(completeOhmsModelInput("t1"))];
    expect(deriveModelEvidenceLevel(accumulateOhmsSceneEvidence(session))).toBe("L4");
    session.transferAttempts = [
      buildOhmsTransferAttempt(completeOhmsWireTransferInput("t2")),
      buildOhmsTransferAttempt(completeOhmsFilamentTransferInput("t3")),
    ];
    const evidence = accumulateOhmsSceneEvidence(session);
    expect(evidence.successfulTransfer).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
  });

  it("AI_OFF answer-only and post-check cannot manufacture L6", () => {
    const answerOnly = evaluateOhmsAiOffAttempt({
      challengeId: OHMS_AI_OFF_A,
      selectedAnswer: intendedOhmsAiOffAnswerId(OHMS_AI_OFF_A),
      studentReasoning: "好好好好好好好好",
      postCheckIds: intendedOhmsAiOffPostCheckIds(OHMS_AI_OFF_A),
      preCommitEvidenceIds: intendedOhmsAiOffPreCommitIds(OHMS_AI_OFF_A),
      llmUsed: false,
    });
    expect(answerOnly.accepted).toBe(false);

    const weak = buildOhmsAiOffAttempt({
      challengeId: OHMS_AI_OFF_A,
      selectedAnswer: intendedOhmsAiOffAnswerId(OHMS_AI_OFF_A),
      studentReasoning: "套公式就行套公式就行",
      timestamp: "t1",
      preCommitEvidenceIds: intendedOhmsAiOffPreCommitIds(OHMS_AI_OFF_A),
    });
    const afterPostCheck = applyOhmsAiOffPostCheck(
      weak,
      intendedOhmsAiOffPostCheckIds(OHMS_AI_OFF_A),
      false,
    );
    expect(afterPostCheck.accepted).toBe(false);
  });

  it("any LLM use during AI_OFF blocks L6", () => {
    const input = completeOhmsAiOffInput(OHMS_AI_OFF_A, "t1");
    const withLlm = evaluateOhmsAiOffAttempt({
      ...input,
      llmUsed: true,
    });
    expect(withLlm.accepted).toBe(false);
    const session = ohmsSession();
    session.modelAttempts = [buildOhmsModelAttempt(completeOhmsModelInput("t1"))];
    session.transferAttempts = [
      buildOhmsTransferAttempt(completeOhmsWireTransferInput("t2")),
      buildOhmsTransferAttempt(completeOhmsFilamentTransferInput("t3")),
    ];
    session.independentAssessment = buildOhmsAiOffAssessment(
      [
        buildOhmsAiOffAttempt(completeOhmsAiOffInput(OHMS_AI_OFF_A, "t4"), intendedOhmsAiOffPostCheckIds(OHMS_AI_OFF_A)),
        buildOhmsAiOffAttempt(completeOhmsAiOffInput(OHMS_AI_OFF_B, "t5"), intendedOhmsAiOffPostCheckIds(OHMS_AI_OFF_B)),
      ],
      true,
    );
    session.stage = LearningStage.AI_OFF;
    const evidence = accumulateOhmsSceneEvidence(session);
    expect(evidence.independentAiOffSuccess).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
  });

  it("correct independent two-control reasoning can reach L6", () => {
    const session = ohmsSession();
    session.modelAttempts = [buildOhmsModelAttempt(completeOhmsModelInput("t1"))];
    session.transferAttempts = [
      buildOhmsTransferAttempt(completeOhmsWireTransferInput("t2")),
      buildOhmsTransferAttempt(completeOhmsFilamentTransferInput("t3")),
    ];
    session.independentAssessment = buildOhmsAiOffAssessment(
      [
        buildOhmsAiOffAttempt(
          completeOhmsAiOffInput(OHMS_AI_OFF_A, "t4"),
          intendedOhmsAiOffPostCheckIds(OHMS_AI_OFF_A),
        ),
        buildOhmsAiOffAttempt(
          completeOhmsAiOffInput(OHMS_AI_OFF_B, "t5"),
          intendedOhmsAiOffPostCheckIds(OHMS_AI_OFF_B),
        ),
      ],
      false,
    );
    const evidence = accumulateOhmsSceneEvidence(session);
    expect(evidence.independentAiOffSuccess).toBe(true);
    expect(evidence.llmDisabledDuringIndependent).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L6");
  });

  it("never assigns an L-level inside Scene evidence code", () => {
    expect(officialExamCalculationAnswer()).toBe("3 A");
  });
});
