import { describe, expect, it } from "vitest";

import {
  ENGINE_MODEL_DISTRACTOR_NODES,
  ENGINE_MODEL_QUANTITY_NODES,
} from "@/lib/content/four-stroke-engine";
import {
  ENGINE_MODEL_NODE_IDS,
  ENGINE_STROKE_NODE_IDS,
  buildEngineModelAttempt,
  completeEngineModelInput,
  connectionsFromEngineSlots,
  evaluateEngineModelStructure,
  summarizeEngineModelAttempt,
} from "@/lib/learning/engine-model";
import { accumulateEngineSceneEvidence } from "@/lib/learning/engine-evidence";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { modelReadySession } from "./engine-fixtures";

describe("engine MODEL structured evaluation", () => {
  it("does not accept a four-stroke-name sequence as the target model", () => {
    const slots = [...ENGINE_STROKE_NODE_IDS];
    const evaluation = evaluateEngineModelStructure({
      slots,
      connections: connectionsFromEngineSlots(slots, ["conversion", "work", "gains"]),
      combustionEnablesConversion: true,
      timestamp: "t",
    });

    expect(evaluation.correctStructure).toBe(false);
    expect(evaluation.failureKinds).toContain("four-stroke-sequence");
  });

  it("accepts the complete structured causal chain", () => {
    const evaluation = evaluateEngineModelStructure(completeEngineModelInput("t"));
    expect(evaluation.correctStructure).toBe(true);
    expect(evaluation.failureKinds).toEqual([]);
  });

  it("fails when the working-gas state step is skipped", () => {
    const slots = [
      ENGINE_MODEL_NODE_IDS.fuel,
      ENGINE_MODEL_NODE_IDS.system,
      ENGINE_MODEL_NODE_IDS.mechanical,
      ENGINE_STROKE_NODE_IDS[0],
    ];
    const evaluation = evaluateEngineModelStructure({
      slots,
      connections: connectionsFromEngineSlots(slots, ["conversion", "work", "gains"]),
      combustionEnablesConversion: true,
      timestamp: "t",
    });

    expect(evaluation.correctStructure).toBe(false);
    expect(evaluation.failureKinds).toContain("missing-gas-state");
    expect(
      summarizeEngineModelAttempt(buildEngineModelAttempt({
        slots,
        connections: connectionsFromEngineSlots(slots, ["conversion", "work", "gains"]),
        combustionEnablesConversion: true,
        timestamp: "t",
      })),
    ).toContain("中间是不是少了一个真正发生变化的对象");
  });

  it("fails when the work / mechanical-interaction link is skipped", () => {
    const input = completeEngineModelInput("t");
    input.connections = input.connections.filter((connection) => connection.kind !== "work");
    const evaluation = evaluateEngineModelStructure(input);
    expect(evaluation.correctStructure).toBe(false);
    expect(evaluation.failureKinds).toContain("missing-work");
  });

  it("fails a direct combustion → mechanical output link", () => {
    const slots = [
      ENGINE_MODEL_NODE_IDS.combustionQuantity,
      ENGINE_MODEL_NODE_IDS.system,
      ENGINE_MODEL_NODE_IDS.mechanical,
      ENGINE_MODEL_NODE_IDS.fuel,
    ];
    const evaluation = evaluateEngineModelStructure({
      slots,
      connections: connectionsFromEngineSlots(slots, ["conversion", "gains", "work"]),
      combustionEnablesConversion: false,
      timestamp: "t",
    });

    expect(evaluation.correctStructure).toBe(false);
    expect(evaluation.failureKinds).toContain("direct-combustion-to-motion");
    expect(evaluation.failureKinds).toContain("combustion-as-quantity");
  });

  it("does not treat combustion as a quantity node", () => {
    const quantityIds: string[] = ENGINE_MODEL_QUANTITY_NODES.map((node) => node.id);
    const distractorIds: string[] = ENGINE_MODEL_DISTRACTOR_NODES.map((node) => node.id);
    expect(quantityIds).not.toContain(ENGINE_MODEL_NODE_IDS.combustionQuantity);
    expect(distractorIds).toContain(ENGINE_MODEL_NODE_IDS.combustionQuantity);

    const slots = [
      ENGINE_MODEL_NODE_IDS.fuel,
      ENGINE_MODEL_NODE_IDS.combustionQuantity,
      ENGINE_MODEL_NODE_IDS.system,
      ENGINE_MODEL_NODE_IDS.mechanical,
    ];
    const evaluation = evaluateEngineModelStructure({
      slots,
      connections: connectionsFromEngineSlots(slots, ["conversion", "work", "gains"]),
      combustionEnablesConversion: true,
      timestamp: "t",
    });
    expect(evaluation.failureKinds).toContain("combustion-as-quantity");
    expect(evaluation.correctStructure).toBe(false);
  });

  it("does not require compression work in the primary model", () => {
    const input = completeEngineModelInput("t");
    expect(input.slots).not.toContain("stroke-compression");
    expect(evaluateEngineModelStructure(input).correctStructure).toBe(true);
  });

  it("lets a structured successful model contribute L4 without writing L5/L6", () => {
    const session = {
      ...modelReadySession(),
      modelAttempts: [buildEngineModelAttempt(completeEngineModelInput("t"))],
    };
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(accumulated.constructedValidCausalModel).toBe(true);
    expect(deriveModelEvidenceLevel(accumulated)).toBe("L4");
    expect(JSON.stringify(session)).not.toContain('"L4"');
    expect(JSON.stringify(session)).not.toContain('"L5"');
    expect(JSON.stringify(session)).not.toContain('"L6"');
  });

  it("cannot create L5/L6 from MODEL text or keywords alone", () => {
    const session = {
      ...modelReadySession(),
      modelAttempts: [
        {
          nodes: ["化学能", "内能", "做功", "机械能"],
          connections: [],
          correctStructure: false,
          timestamp: "t",
        },
      ],
    };
    const accumulated = accumulateEngineSceneEvidence(session);
    const level = deriveModelEvidenceLevel(accumulated);
    expect(accumulated.constructedValidCausalModel).toBe(false);
    expect(level).not.toBe("L4");
    expect(level).not.toBe("L5");
    expect(level).not.toBe("L6");
  });

  it("retains failed attempts", () => {
    const failed = buildEngineModelAttempt({
      slots: [...ENGINE_STROKE_NODE_IDS],
      connections: [],
      combustionEnablesConversion: false,
      timestamp: "t1",
    });
    const passed = buildEngineModelAttempt(completeEngineModelInput("t2"));
    const attempts = [failed, passed];

    expect(failed.correctStructure).toBe(false);
    expect(attempts).toHaveLength(2);
    expect(attempts[0]?.failureKinds).toContain("four-stroke-sequence");
    expect(attempts[1]?.correctStructure).toBe(true);
  });
});
