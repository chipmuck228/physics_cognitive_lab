import { ChecklistObserveTask } from "@/components/learning/dsl/ChecklistObserveTask";
import {
  HEAT_COPY,
  HEAT_OBSERVE_OPTIONS,
} from "@/lib/content/equal-mass-heated-samples";

interface HeatObserveTaskProps {
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
  onSubmit: () => void;
  onPlayDemo: () => void;
  needMore: boolean;
  saved: boolean;
  demoPlaying: boolean;
}

export function HeatObserveTask({
  selectedOptionIds,
  onToggle,
  onSubmit,
  onPlayDemo,
  needMore,
  saved,
  demoPlaying,
}: HeatObserveTaskProps) {
  return (
    <ChecklistObserveTask
      copy={{
        instruction: HEAT_COPY.observeInstruction,
        prompt: HEAT_COPY.observePrompt,
        submit: HEAT_COPY.observeSubmit,
        needMore: HEAT_COPY.observeNeedMore,
        saved: HEAT_COPY.observeSaved,
        playDemo: HEAT_COPY.playDemo,
        pauseDemo: HEAT_COPY.pauseDemo,
      }}
      options={HEAT_OBSERVE_OPTIONS}
      selectedOptionIds={selectedOptionIds}
      onToggle={onToggle}
      onSubmit={onSubmit}
      onPlayDemo={onPlayDemo}
      needMore={needMore}
      saved={saved}
      demoPlaying={demoPlaying}
      testId="heat-observe-task"
      playDemoTestId="heat-play-demo"
    />
  );
}
