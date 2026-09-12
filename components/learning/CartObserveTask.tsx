import { ChecklistObserveTask } from "@/components/learning/dsl/ChecklistObserveTask";
import {
  CART_COPY,
  CART_OBSERVE_OPTIONS,
} from "@/lib/content/horizontal-force-cart";

interface CartObserveTaskProps {
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
  onSubmit: () => void;
  onPlayDemo: () => void;
  needMore: boolean;
  saved: boolean;
  demoPlaying: boolean;
}

export function CartObserveTask({
  selectedOptionIds,
  onToggle,
  onSubmit,
  onPlayDemo,
  needMore,
  saved,
  demoPlaying,
}: CartObserveTaskProps) {
  return (
    <ChecklistObserveTask
      copy={{
        instruction: CART_COPY.observeInstruction,
        prompt: CART_COPY.observePrompt,
        submit: CART_COPY.observeSubmit,
        needMore: CART_COPY.observeNeedMore,
        saved: CART_COPY.observeSaved,
        playDemo: CART_COPY.playDemo,
        pauseDemo: CART_COPY.pauseDemo,
      }}
      options={CART_OBSERVE_OPTIONS}
      selectedOptionIds={selectedOptionIds}
      onToggle={onToggle}
      onSubmit={onSubmit}
      onPlayDemo={onPlayDemo}
      needMore={needMore}
      saved={saved}
      demoPlaying={demoPlaying}
      testId="cart-observe-task"
      playDemoTestId="cart-play-demo"
    />
  );
}
