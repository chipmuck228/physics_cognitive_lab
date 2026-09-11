export interface TransferScenarioDefinition {
  id: string;
  title: string;
  situation: string;
  prompt: string;
  focus: string;
}

export const TRANSFER_SCENARIOS: TransferScenarioDefinition[] = [
  {
    id: "hot-water-bag",
    title: "Hot-water bag",
    situation: "A hot-water bag is placed against a person's hand. After a while, the hand becomes warmer.",
    prompt: "Can the model you just built help explain why the hand becomes warmer?",
    focus: "Notice the shared structure even though the energy reaches the object in a different way.",
  },
  {
    id: "rubbing-hands",
    title: "Rubbing hands",
    situation: "Two hands are rubbed together and then feel warm.",
    prompt: "Why can the hands become warm in this situation?",
    focus: "Separate the common result from the mechanism that caused it.",
  },
  {
    id: "electric-kettle",
    title: "Electric kettle",
    situation: "An electric kettle heats water and the water temperature rises.",
    prompt: "What is similar between this situation and the microwave bread?",
    focus: "Look for the abstract model, not just the surface story.",
  },
] as const;

export const REQUIRED_TRANSFER_SCENARIO_IDS = TRANSFER_SCENARIOS.map(
  (scenario) => scenario.id,
);
