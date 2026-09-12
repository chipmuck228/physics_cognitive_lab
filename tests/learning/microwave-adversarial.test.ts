import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { MODEL_CONDITION_IDS } from "@/content/physics-models/energy-internal-energy-temperature/model";
import { MODEL_RELATION_IDS } from "@/content/physics-models/energy-internal-energy-temperature/model";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { createSession } from "@/lib/learning/session";
import { accumulateMicrowaveSceneEvidence } from "@/lib/learning/microwave-evidence";
import {
  evaluateMicrowaveDescription,
  hasSufficientMicrowaveDescription,
} from "@/lib/learning/microwave-describe";
import {
  evaluateMicrowaveExplanation,
  hasSufficientMicrowaveExplanation,
} from "@/lib/learning/microwave-explain";
import {
  buildMicrowaveModelAttempt,
  completeMicrowaveModelInput,
  evaluateMicrowaveModelStructure,
  hasCompletedMicrowaveModel,
} from "@/lib/learning/microwave-model";
import {
  buildMicrowaveTransferAttempt,
  completeMicrowaveIceTransferInput,
  completeMicrowaveKettleTransferInput,
  evaluateMicrowaveTransfer,
  hasCompletedMicrowaveTransfer,
  MICROWAVE_ICE_TARGET_ID,
  MICROWAVE_KETTLE_TARGET_ID,
} from "@/lib/learning/microwave-transfer";
import {
  applyMicrowaveAiOffPostCheck,
  buildMicrowaveAiOffAttempt,
  completeMicrowaveAiOffInput,
  evaluateMicrowaveAiOffAttempt,
  MICROWAVE_AI_OFF_ICE_ID,
  MICROWAVE_AI_OFF_SPOON_ID,
} from "@/lib/learning/microwave-ai-off";
import {
  experimentClaimsAlwaysRaisesTemperature,
  isMicrowaveExperimentClosed,
} from "@/lib/learning/microwave-experiment";
import { completedMicrowaveExamAttempts } from "@/lib/learning/microwave-exam";
import type { ExperimentEvidence, LearningSession } from "@/types/learning";

function sessionWith(partial: Partial<LearningSession>): LearningSession {
  return { ...createSession(), ...partial };
}

describe("Scene 01 DESCRIBE L2", () => {
  it("does not let 变热了 alone establish L2", () => {
    expect(
      evaluateMicrowaveDescription({
        object: "bread",
        quantity: "temperature",
        change: "increases",
        studentDescription: "变热了",
      }).sufficient,
    ).toBe(false);
    expect(
      hasSufficientMicrowaveDescription([
        { text: "变热了", timestamp: "t", sufficient: false },
      ]),
    ).toBe(false);
  });

  it("accepts object + temperature + increases plus own words", () => {
    expect(
      evaluateMicrowaveDescription({
        object: "bread",
        quantity: "temperature",
        change: "increases",
        studentDescription: "面包的温度升高了。",
      }).sufficient,
    ).toBe(true);
  });
});

describe("Scene 01 EXPLAIN L3", () => {
  it("rejects a noun sandwich and does not set L4", () => {
    const evaluation = evaluateMicrowaveExplanation({
      energyTransfer: "energy-entered",
      link: "u-and-t",
      studentExplanation: "能量内能温度",
    });
    expect(evaluation.sufficient).toBe(false);
    const session = sessionWith({
      explanations: [
        {
          text: "能量内能温度",
          timestamp: "t",
          sufficient: false,
          microwaveAnswers: { energyTransfer: "energy-entered", link: "u-and-t" },
        },
      ],
    });
    const evidence = accumulateMicrowaveSceneEvidence(session);
    expect(evidence.identifiedRelations).toBeUndefined();
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L0");
  });

  it("accepts a partial relation without creating L4", () => {
    const evaluation = evaluateMicrowaveExplanation({
      energyTransfer: "energy-entered",
      link: "u-and-t",
      studentExplanation: "能量进入面包后，面包的内能变了，温度升高。",
    });
    expect(evaluation.sufficient).toBe(true);
    const session = sessionWith({
      explanations: [
        {
          text: "能量进入面包后，面包的内能变了，温度升高。",
          timestamp: "t",
          sufficient: true,
          identifiesPartialEnergyRelation: true,
          microwaveAnswers: { energyTransfer: "energy-entered", link: "u-and-t" },
        },
      ],
    });
    const evidence = accumulateMicrowaveSceneEvidence(session);
    expect(hasSufficientMicrowaveExplanation(session.explanations)).toBe(true);
    expect(evidence.identifiedRelations).toBe(true);
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L3");
  });
});

describe("Scene 01 MODEL L4", () => {
  const complete = completeMicrowaveModelInput("t");

  it("rejects temperature keyword only", () => {
    expect(
      evaluateMicrowaveModelStructure({
        ...complete,
        system: "",
        energyTransfer: "",
        internalEnergy: "",
        temperatureRelation: "",
        distinction: "",
        conditions: [],
        authoredDistinction: "温度",
      }).correctStructure,
    ).toBe(false);
  });

  it("rejects an energy/U/T noun sandwich", () => {
    expect(
      evaluateMicrowaveModelStructure({
        ...complete,
        authoredDistinction: "能量内能温度",
      }).correctStructure,
    ).toBe(false);
  });

  it("rejects 吸收热量所以升温 as full L4", () => {
    expect(
      evaluateMicrowaveModelStructure({
        ...complete,
        authoredDistinction: "吸收热量所以升温",
      }).correctStructure,
    ).toBe(false);
  });

  it("rejects correct structure plus 好好", () => {
    expect(
      evaluateMicrowaveModelStructure({
        ...complete,
        authoredDistinction: "好好",
      }).correctStructure,
    ).toBe(false);
  });

  it("rejects temperature = internal energy", () => {
    expect(
      evaluateMicrowaveModelStructure({
        ...complete,
        distinction: "t-is-u",
        authoredDistinction: "温度就是内能",
      }).correctStructure,
    ).toBe(false);
  });

  it("rejects energy in must always raise temperature", () => {
    expect(
      evaluateMicrowaveModelStructure({
        ...complete,
        temperatureRelation: "must-rise",
      }).correctStructure,
    ).toBe(false);
  });

  it("rejects arbitrary long meaningless text", () => {
    expect(
      evaluateMicrowaveModelStructure({
        ...complete,
        authoredDistinction: "今天天气很好我们去公园玩了一整天然后回家吃饭",
      }).correctStructure,
    ).toBe(false);
  });

  it("accepts intended relational structure plus distinction", () => {
    const attempt = buildMicrowaveModelAttempt(complete);
    expect(attempt.correctStructure).toBe(true);
    expect(hasCompletedMicrowaveModel([attempt])).toBe(true);
  });
});

describe("Scene 01 TRANSFER L5", () => {
  it("rejects 也是加热 and microwave surface similarity", () => {
    const kettle = completeMicrowaveKettleTransferInput("t");
    expect(
      evaluateMicrowaveTransfer({
        ...kettle,
        studentExplanation: "也是加热",
        surfaceCueSelected: true,
      }).accepted,
    ).toBe(false);
  });

  it("rejects a correct ice relation on the kettle target", () => {
    const ice = completeMicrowaveIceTransferInput("t");
    expect(
      evaluateMicrowaveTransfer({
        ...ice,
        targetId: MICROWAVE_KETTLE_TARGET_ID,
      }).accepted,
    ).toBe(false);
  });

  it("rejects ice + 还在加热 or 情况不一样", () => {
    const ice = completeMicrowaveIceTransferInput("t");
    expect(
      evaluateMicrowaveTransfer({ ...ice, studentExplanation: "还在加热" }).accepted,
    ).toBe(false);
    expect(
      evaluateMicrowaveTransfer({ ...ice, studentExplanation: "情况不一样" }).accepted,
    ).toBe(false);
  });

  it("rejects ordinary T-rise applied unchanged to ice", () => {
    const ice = completeMicrowaveIceTransferInput("t");
    expect(
      evaluateMicrowaveTransfer({
        ...ice,
        judgments: {
          ...ice.judgments,
          [MODEL_RELATION_IDS.internalEnergyMayChangeTemperature]: "applies",
          [MODEL_RELATION_IDS.energyInDoesNotAlwaysRaiseTemperature]: "not-necessarily",
        },
        studentExplanation: "能量进入水，水的内能增加，所以温度升高。",
      }).accepted,
    ).toBe(false);
  });

  it("accepts valid kettle plus valid ice", () => {
    const kettle = buildMicrowaveTransferAttempt(completeMicrowaveKettleTransferInput("t1"));
    const ice = buildMicrowaveTransferAttempt(completeMicrowaveIceTransferInput("t2"));
    expect(kettle.accepted).toBe(true);
    expect(ice.accepted).toBe(true);
    expect(hasCompletedMicrowaveTransfer([kettle, ice])).toBe(true);
    expect(ice.targetId).toBe(MICROWAVE_ICE_TARGET_ID);
    expect(kettle.targetId).toBe(MICROWAVE_KETTLE_TARGET_ID);
  });
});

describe("Scene 01 AI_OFF L6 provenance", () => {
  it("rejects answer-only, generic text, sandwich, slogan, and llmUsed", () => {
    const complete = completeMicrowaveAiOffInput(MICROWAVE_AI_OFF_SPOON_ID, "t");
    expect(
      evaluateMicrowaveAiOffAttempt({
        ...complete,
        studentReasoning: "",
        llmUsed: false,
      }).accepted,
    ).toBe(false);
    expect(
      evaluateMicrowaveAiOffAttempt({
        ...complete,
        studentReasoning: "好好好好好好好好",
        llmUsed: false,
      }).accepted,
    ).toBe(false);
    expect(
      evaluateMicrowaveAiOffAttempt({
        ...complete,
        studentReasoning: "能量内能温度能量内能",
        llmUsed: false,
      }).accepted,
    ).toBe(false);
    expect(
      evaluateMicrowaveAiOffAttempt({
        ...complete,
        studentReasoning: "吸收热量所以升温吸收热量所以升温",
        llmUsed: false,
      }).accepted,
    ).toBe(false);
    expect(
      evaluateMicrowaveAiOffAttempt({
        ...complete,
        llmUsed: true,
      }).accepted,
    ).toBe(false);
  });

  it("does not let correct post-checks manufacture missing pre-commit reasoning", () => {
    const weak = buildMicrowaveAiOffAttempt(
      {
        challengeId: MICROWAVE_AI_OFF_ICE_ID,
        selectedAnswer: completeMicrowaveAiOffInput(MICROWAVE_AI_OFF_ICE_ID, "t")
          .selectedAnswer,
        studentReasoning: "好好好好好好好好",
        preCommitEvidenceIds: [],
        timestamp: "t",
      },
      [],
      false,
    );
    const after = applyMicrowaveAiOffPostCheck(
      weak,
      completeMicrowaveAiOffInput(MICROWAVE_AI_OFF_ICE_ID, "t").postCheckIds,
      false,
    );
    expect(after.accepted).toBe(false);
    expect(after.reasoningSignals.identifiesConditionOrBoundary).toBeFalsy();
    expect(after.studentReasoning).toBe(weak.studentReasoning);
  });

  it("accepts genuine pre-commit A and B", () => {
    const a = completeMicrowaveAiOffInput(MICROWAVE_AI_OFF_SPOON_ID, "t1");
    const b = completeMicrowaveAiOffInput(MICROWAVE_AI_OFF_ICE_ID, "t2");
    expect(
      evaluateMicrowaveAiOffAttempt({ ...a, llmUsed: false }).accepted,
    ).toBe(true);
    expect(
      evaluateMicrowaveAiOffAttempt({ ...b, llmUsed: false }).accepted,
    ).toBe(true);
  });
});

describe("Scene 01 EXPERIMENT closure", () => {
  const base = {
    experimentId: "more-energy-in-no-phase-change",
    prediction: "temperature increases",
    predictionReason: "加热更久，能量会更多。",
    committedAt: "2026-09-12T00:01:00.000Z",
    interventionAt: "2026-09-12T00:02:00.000Z",
    authoredBeforeIntervention: true,
    actualResult: { finalTemperatureC: 50, energyInputJ: 30000, deltaTemperatureC: 15 },
    predictionComparison: "",
    reflection: "",
    comparison: "" as const,
    timestamp: "2026-09-12T00:02:00.000Z",
  };

  it("is incomplete without comparison or reflection", () => {
    expect(isMicrowaveExperimentClosed(base as ExperimentEvidence)).toBe(false);
    expect(
      isMicrowaveExperimentClosed({
        ...base,
        comparison: "same",
        predictionComparison: "same",
        reflection: "",
      } as ExperimentEvidence),
    ).toBe(false);
  });

  it("can close after a wrong prediction if comparison and reflection exist", () => {
    const closed = {
      ...base,
      prediction: "temperature decreases",
      comparison: "different" as const,
      predictionComparison: "different",
      reflection: "结果和我猜的不一样，温度其实升高了。",
    };
    expect(isMicrowaveExperimentClosed(closed as ExperimentEvidence)).toBe(true);
    expect(experimentClaimsAlwaysRaisesTemperature(closed as ExperimentEvidence)).toBe(
      false,
    );
  });
});

describe("Scene 01 accumulator", () => {
  it("never writes L-level strings and keeps MODEL-only at L4", () => {
    const source = readFileSync("lib/learning/microwave-evidence.ts", "utf8");
    expect(source).not.toMatch(/"L4"|"L5"|"L6"/);
    const model = buildMicrowaveModelAttempt(completeMicrowaveModelInput("t"));
    const evidence = accumulateMicrowaveSceneEvidence(
      sessionWith({ modelAttempts: [model] }),
    );
    expect(evidence.constructedValidCausalModel).toBe(true);
    expect(evidence.successfulTransfer).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L4");
  });

  it("cannot manufacture L5 from transfer without MODEL, or L6 from exam", () => {
    const kettle = buildMicrowaveTransferAttempt(completeMicrowaveKettleTransferInput("t1"));
    const ice = buildMicrowaveTransferAttempt(completeMicrowaveIceTransferInput("t2"));
    const transferOnly = accumulateMicrowaveSceneEvidence(
      sessionWith({ transferAttempts: [kettle, ice] }),
    );
    expect(deriveModelEvidenceLevel(transferOnly)).not.toBe("L5");
    expect(deriveModelEvidenceLevel(transferOnly)).not.toBe("L6");

    const examOnly = accumulateMicrowaveSceneEvidence(
      sessionWith({ examAttempts: completedMicrowaveExamAttempts() }),
    );
    expect(deriveModelEvidenceLevel(examOnly)).not.toBe("L6");

    const model = buildMicrowaveModelAttempt(completeMicrowaveModelInput("t"));
    const modelPlusIncomplete = accumulateMicrowaveSceneEvidence(
      sessionWith({ modelAttempts: [model], transferAttempts: [kettle] }),
    );
    expect(deriveModelEvidenceLevel(modelPlusIncomplete)).toBe("L4");
  });

  it("reaches L5 only after MODEL plus the required pair, and L6 only after AI_OFF", () => {
    const model = buildMicrowaveModelAttempt(completeMicrowaveModelInput("t"));
    const kettle = buildMicrowaveTransferAttempt(completeMicrowaveKettleTransferInput("t1"));
    const ice = buildMicrowaveTransferAttempt(completeMicrowaveIceTransferInput("t2"));
    const l5 = accumulateMicrowaveSceneEvidence(
      sessionWith({
        modelAttempts: [model],
        transferAttempts: [kettle, ice],
      }),
    );
    expect(deriveModelEvidenceLevel(l5)).toBe("L5");

    const a = completeMicrowaveAiOffInput(MICROWAVE_AI_OFF_SPOON_ID, "t3");
    const b = completeMicrowaveAiOffInput(MICROWAVE_AI_OFF_ICE_ID, "t4");
    const l6 = accumulateMicrowaveSceneEvidence(
      sessionWith({
        modelAttempts: [model],
        transferAttempts: [kettle, ice],
        independentAssessment: {
          explanation: `${a.studentReasoning}\n${b.studentReasoning}`,
          examResponses: {},
          completedWithoutAI: true,
          llmUsed: false,
          challengeAttempts: [
            buildMicrowaveAiOffAttempt(a, a.postCheckIds, false),
            buildMicrowaveAiOffAttempt(b, b.postCheckIds, false),
          ],
        },
      }),
    );
    expect(deriveModelEvidenceLevel(l6)).toBe("L6");
    expect(MODEL_CONDITION_IDS.noPhaseChange).toBe("no-phase-change");
  });
});
