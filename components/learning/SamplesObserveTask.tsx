import { ChecklistObserveTask } from "@/components/learning/dsl/ChecklistObserveTask";
import {
  SAMPLES_COPY,
  SAMPLES_OBSERVE_OPTIONS,
} from "@/lib/content/equal-volume-material-samples";

interface SamplesObserveTaskProps {
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
  onSubmit: () => void;
  onPlayDemo: () => void;
  needMore: boolean;
  saved: boolean;
  demoPlaying: boolean;
}

export function SamplesObserveTask({
  selectedOptionIds,
  onToggle,
  onSubmit,
  onPlayDemo,
  needMore,
  saved,
  demoPlaying,
}: SamplesObserveTaskProps) {
  return (
    <ChecklistObserveTask
      copy={{
        instruction: SAMPLES_COPY.observeInstruction,
        prompt: SAMPLES_COPY.observePrompt,
        submit: SAMPLES_COPY.observeSubmit,
        needMore: SAMPLES_COPY.observeNeedMore,
        saved: SAMPLES_COPY.observeSaved,
        playDemo: SAMPLES_COPY.playDemo,
        pauseDemo: SAMPLES_COPY.pauseDemo,
      }}
      options={SAMPLES_OBSERVE_OPTIONS}
      selectedOptionIds={selectedOptionIds}
      onToggle={onToggle}
      onSubmit={onSubmit}
      onPlayDemo={onPlayDemo}
      needMore={needMore}
      saved={saved}
      demoPlaying={demoPlaying}
      testId="samples-observe-task"
      playDemoTestId="samples-play-demo"
    />
  );
}
