import {
  buildCognitiveProfile,
  summarizeReflection,
} from "@/lib/learning/reflection";
import { createSession } from "@/lib/learning/session";
import { describe, expect, it } from "vitest";

describe("reflection profile", () => {
  it("stays cautious and evidence-based", () => {
    const session = createSession();
    const profile = buildCognitiveProfile({
      ...session,
      descriptions: [
        {
          text: "The temperature of the bread increased.",
          quantity: "temperature",
          change: "increase",
          timestamp: "t",
        },
      ],
      explanations: [
        {
          text: "Energy entered the bread so its internal energy changed and its temperature increased.",
          explanationLevel: 3,
          timestamp: "t",
        },
      ],
      modelAttempts: [
        {
          nodes: [
            "energy enters",
            "internal energy changes",
            "temperature increases",
          ],
          connections: [],
          correctStructure: true,
          timestamp: "t",
        },
      ],
    });

    expect(profile.physicalDescription).toBe(4);
    expect(profile.causalExplanation).toBe(3);
    expect(profile.modeling).toBe(4);
    expect(summarizeReflection(profile)).not.toMatch(/mastered/i);
  });
});
