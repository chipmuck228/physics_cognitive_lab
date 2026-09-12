import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { MODEL_RELATION_IDS } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/model";
import { applyTutorGuardrails, looksLikeAnswerLeak } from "@/lib/ai/guardrails";
import { accumulateEngineSceneEvidence } from "@/lib/learning/engine-evidence";
import {
  ENGINE_TRANSFER_RELATION_IDS,
  ENGINE_TRANSFER_TARGET_IDS,
  buildEngineTransferAttempt,
  completeEngineFullModelInput,
  completeEnginePartialTransferInput,
  emptyEngineTransferJudgments,
  engineTransferTarget,
  evaluateEngineTransfer,
  hasCompletedEngineTransfer,
} from "@/lib/learning/engine-transfer";
import { nextEngineHint } from "@/lib/learning/hint-ladder";
import { canLeaveStage } from "@/lib/learning/progression";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { LearningStage } from "@/types/learning";
import { TransferMode } from "@/types/physics-model";
import { modelReadySession, transferReadySession } from "./engine-fixtures";

const CHEMICAL = ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal;
const WORK = ENGINE_TRANSFER_RELATION_IDS.internalToWork;
const MECHANICAL = ENGINE_TRANSFER_RELATION_IDS.systemToMechanical;

describe("engine TRANSFER structured evaluation", () => {
  it("uses the motorcycle target as full-model without naming the model in the scenario", () => {
    const target = engineTransferTarget(ENGINE_TRANSFER_TARGET_IDS.motorcycle);
    expect(target?.transferMode).toBe(TransferMode.FULL_MODEL);
    expect(target?.scenario).toContain("摩托车");
    expect(target?.scenario).not.toContain(
      "chemical-energy-internal-energy-mechanical-energy",
    );
    expect(target?.scenario).not.toContain("只有后半段可以迁移");
  });

  it("rejects piston/surface recognition alone", () => {
    const evaluation = evaluateEngineTransfer({
      targetId: ENGINE_TRANSFER_TARGET_IDS.motorcycle,
      judgments: emptyEngineTransferJudgments(),
      relationOrder: [],
      surfaceCueSelected: true,
      studentExplanation: "都有活塞，所以是同一个模型。",
      timestamp: "t",
    });
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.failureKinds).toContain("surface-cue");
  });

  it("accepts a valid causal relation mapping in the new context", () => {
    const attempt = buildEngineTransferAttempt(completeEngineFullModelInput("t"));
    expect(attempt.accepted).toBe(true);
    expect(attempt.targetId).toBe(ENGINE_TRANSFER_TARGET_IDS.motorcycle);
    expect(attempt.transferMode).toBe(TransferMode.FULL_MODEL);
    expect(attempt.selectedRelations).toEqual(
      expect.arrayContaining([
        MODEL_RELATION_IDS.chemicalConvertsToInternal,
        MODEL_RELATION_IDS.internalEnergyChangesState,
        MODEL_RELATION_IDS.workingGasDoesWork,
        MODEL_RELATION_IDS.mechanicalEnergyOutput,
      ]),
    );
    expect(attempt.failureKinds).toEqual([]);
  });

  it("fails when the working-substance change is missing", () => {
    const input = completeEngineFullModelInput("t");
    input.judgments[WORK] = "";
    input.relationOrder = [CHEMICAL, MECHANICAL];
    const evaluation = evaluateEngineTransfer(input);
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.failureKinds).toContain("missing-gas-state");
  });

  it("fails when the work / mechanical interaction is missing", () => {
    const input = completeEngineFullModelInput("t");
    input.judgments[WORK] = "";
    input.relationOrder = [CHEMICAL, MECHANICAL];
    const evaluation = evaluateEngineTransfer(input);
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.failureKinds).toContain("missing-work");
  });

  it("fails when causal order is reversed", () => {
    const input = completeEngineFullModelInput("t");
    input.relationOrder = [MECHANICAL, WORK, CHEMICAL];
    const evaluation = evaluateEngineTransfer(input);
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.failureKinds).toContain("incorrect-order");
  });

  it("stores structured transfer evidence on a successful attempt", () => {
    const attempt = buildEngineTransferAttempt(completeEngineFullModelInput("t"));
    expect(attempt.scenarioId).toBe(ENGINE_TRANSFER_TARGET_IDS.motorcycle);
    expect(attempt.selectedRelations?.length).toBeGreaterThan(0);
    expect(attempt.accepted).toBe(true);
    expect(JSON.stringify(attempt)).not.toContain('"L5"');
  });

  it("treats steam as partial-structure and does not require expectedModelId", () => {
    const target = engineTransferTarget(ENGINE_TRANSFER_TARGET_IDS.steam);
    expect(target?.transferMode).toBe(TransferMode.PARTIAL_STRUCTURE);
    expect(target?.expectedModelId).toBeUndefined();
    expect(target?.transferableRelations).toEqual([
      MODEL_RELATION_IDS.internalEnergyChangesState,
      MODEL_RELATION_IDS.workingGasDoesWork,
      MODEL_RELATION_IDS.mechanicalEnergyOutput,
    ]);
    expect(target?.nonTransferableRelations).toEqual([
      MODEL_RELATION_IDS.chemicalConvertsToInternal,
    ]);
  });

  it("treats internal/state → work → mechanical structure as transferable for steam", () => {
    const attempt = buildEngineTransferAttempt(completeEnginePartialTransferInput("t"));
    expect(attempt.accepted).toBe(true);
    expect(attempt.selectedRelations).toEqual(
      expect.arrayContaining([
        MODEL_RELATION_IDS.internalEnergyChangesState,
        MODEL_RELATION_IDS.workingGasDoesWork,
        MODEL_RELATION_IDS.mechanicalEnergyOutput,
      ]),
    );
    expect(attempt.selectedRelations).not.toContain(
      MODEL_RELATION_IDS.chemicalConvertsToInternal,
    );
  });

  it("does not automatically transfer chemical-energy → internal-energy on steam", () => {
    const input = completeEnginePartialTransferInput("t");
    input.judgments[CHEMICAL] = "applies";
    const evaluation = evaluateEngineTransfer(input);
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.failureKinds).toContain("chemical-source-forced");
  });

  it("fails selecting the entire original model blindly on steam", () => {
    const evaluation = evaluateEngineTransfer({
      targetId: ENGINE_TRANSFER_TARGET_IDS.steam,
      judgments: {
        [CHEMICAL]: "applies",
        [WORK]: "applies",
        [MECHANICAL]: "applies",
      },
      relationOrder: [CHEMICAL, WORK, MECHANICAL],
      surfaceCueSelected: false,
      studentExplanation: "这和刚才完全一样，整条模型都能搬过来。",
      timestamp: "t",
    });
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.failureKinds).toContain("blind-full-model");
  });

  it("passes when transferred and non-transferred relations are distinguished", () => {
    const evaluation = evaluateEngineTransfer(completeEnginePartialTransferInput("t"));
    expect(evaluation.accepted).toBe(true);
    expect(evaluation.failureKinds).toEqual([]);
  });

  it("keeps MODEL success at most L4", () => {
    const session = transferReadySession();
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(accumulated.constructedValidCausalModel).toBe(true);
    expect(accumulated.successfulTransfer).toBe(false);
    expect(deriveModelEvidenceLevel(accumulated)).toBe("L4");
  });

  it("does not set L5 from one valid transfer alone", () => {
    const session = {
      ...transferReadySession(),
      transferAttempts: [buildEngineTransferAttempt(completeEngineFullModelInput("t"))],
    };
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(hasCompletedEngineTransfer(session.transferAttempts)).toBe(false);
    expect(accumulated.successfulTransfer).toBe(false);
    expect(deriveModelEvidenceLevel(accumulated)).toBe("L4");
    expect(JSON.stringify(session)).not.toContain('"L5"');
  });

  it("can derive L5 after the required full-model and partial-structure pair", () => {
    const session = {
      ...transferReadySession(),
      transferAttempts: [
        buildEngineTransferAttempt(completeEngineFullModelInput("t1")),
        buildEngineTransferAttempt(completeEnginePartialTransferInput("t2")),
      ],
    };
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(accumulated.successfulTransfer).toBe(true);
    expect(deriveModelEvidenceLevel(accumulated)).toBe("L5");
    expect(JSON.stringify(session)).not.toContain('"L5"');
    expect(JSON.stringify(session)).not.toContain('"L6"');
  });

  it("never writes L5 in Scene transfer or evidence code", () => {
    const transferSource = readFileSync("lib/learning/engine-transfer.ts", "utf8");
    const evidenceSource = readFileSync("lib/learning/engine-evidence.ts", "utf8");
    expect(transferSource).not.toContain('"L5"');
    expect(evidenceSource).not.toContain('"L5"');
    expect(evidenceSource).not.toContain('"L6"');
  });

  it("cannot create L6 from TRANSFER", () => {
    const session = {
      ...transferReadySession(),
      transferAttempts: [
        buildEngineTransferAttempt(completeEngineFullModelInput("t1")),
        buildEngineTransferAttempt(completeEnginePartialTransferInput("t2")),
      ],
    };
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(accumulated.independentAiOffSuccess).toBeUndefined();
    expect(accumulated.llmDisabledDuringIndependent).toBeUndefined();
    expect(deriveModelEvidenceLevel(accumulated)).not.toBe("L6");
  });

  it("gives a first hint that points to relations rather than the model answer", () => {
    const hint = nextEngineHint([], LearningStage.TRANSFER);
    expect(hint?.id).toBe("H1");
    expect(hint?.prompt).not.toContain("chemical-energy-internal-energy-mechanical-energy");
    expect(hint?.prompt).not.toContain("只有后半段可以迁移");
    expect(hint?.prompt).not.toContain("这和刚才是同一条能量链");
  });

  it("rejects tutor leaks that name the model or reveal the steam split", () => {
    expect(
      looksLikeAnswerLeak(
        LearningStage.TRANSFER,
        "这个情境也使用 chemical-energy-internal-energy-mechanical-energy",
        "four-stroke-engine",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.TRANSFER,
        "只有后半段可以迁移。",
        "four-stroke-engine",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.TRANSFER,
        "先别看装置名字。看看什么发生了变化？",
        "four-stroke-engine",
      ),
    ).toBe(false);
    const blocked = applyTutorGuardrails(
      {
        action: "HINT",
        message: "这和刚才是同一条能量链",
        cognitiveGoal: "transfer",
        revealsAnswer: false,
        misconceptionDetected: null,
        confidence: "high",
        suggestedNextStage: null,
      },
      LearningStage.TRANSFER,
      "four-stroke-engine",
    );
    expect(blocked.message).not.toContain("同一条能量链");
  });

  it("keeps failed transfer attempts in history", () => {
    const failed = buildEngineTransferAttempt({
      targetId: ENGINE_TRANSFER_TARGET_IDS.motorcycle,
      judgments: emptyEngineTransferJudgments(),
      relationOrder: [],
      surfaceCueSelected: true,
      studentExplanation: "都有活塞。",
      timestamp: "t1",
    });
    const passed = buildEngineTransferAttempt(completeEngineFullModelInput("t2"));
    const attempts = [failed, passed];
    expect(failed.accepted).toBe(false);
    expect(attempts).toHaveLength(2);
    expect(attempts[0]?.surfaceCueSelected).toBe(true);
  });

  it("opens EXAM after TRANSFER success and keeps AI_OFF behind EXAM", () => {
    const session = {
      ...transferReadySession(),
      transferAttempts: [
        buildEngineTransferAttempt(completeEngineFullModelInput("t1")),
        buildEngineTransferAttempt(completeEnginePartialTransferInput("t2")),
      ],
    };
    expect(hasCompletedEngineTransfer(session.transferAttempts)).toBe(true);
    expect(canLeaveStage(session, LearningStage.EXAM)).toBe(true);
    expect(
      canLeaveStage(
        { ...session, stage: LearningStage.EXAM },
        LearningStage.AI_OFF,
      ),
    ).toBe(false);
    expect(canLeaveStage(modelReadySession(), LearningStage.TRANSFER)).toBe(false);
  });
});
