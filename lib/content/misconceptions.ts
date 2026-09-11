export interface MisconceptionDefinition {
  id: string;
  description: string;
  targetUnderstanding: string;
  diagnosticSignals: string[];
}

export const MISCONCEPTIONS: MisconceptionDefinition[] = [
  {
    id: "M01",
    description: "Heat is a substance stored inside an object.",
    targetUnderstanding: "Talk about energy transfer and temperature change, not heat as stuff.",
    diagnosticSignals: ["more heat inside", "stored heat", "filled with heat"],
  },
  {
    id: "M02",
    description: "If an object absorbs energy, its temperature must always increase.",
    targetUnderstanding: "Energy can change a system without an immediate temperature rise.",
    diagnosticSignals: ["absorbs energy so temperature must", "energy in always hotter"],
  },
  {
    id: "M03",
    description: "Higher temperature always means greater internal energy.",
    targetUnderstanding: "Internal energy also depends on mass, material, and the system.",
    diagnosticSignals: ["hotter always more internal energy", "higher temperature means more energy"],
  },
  {
    id: "M04",
    description: "All heating processes are the same physical process.",
    targetUnderstanding: "Temperature can rise through different energy-transfer mechanisms.",
    diagnosticSignals: ["all heating is the same", "everything that makes it hot is heat"],
  },
  {
    id: "M05",
    description: "Knowing a physics term means understanding the physical model.",
    targetUnderstanding: "A term is only useful if the student can use the relationship.",
    diagnosticSignals: ["this is internal energy", "the word is heat"],
  },
];

export function detectMisconceptionSignals(text: string): string[] {
  const normalized = text.toLowerCase();
  return MISCONCEPTIONS.filter((item) =>
    item.diagnosticSignals.some((signal) => normalized.includes(signal)),
  ).map((item) => item.id);
}
