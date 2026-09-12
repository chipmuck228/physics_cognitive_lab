import { OutcomePredictTask } from "@/components/learning/dsl/OutcomePredictTask";
import { CART_COPY, CART_PREDICT_OUTCOMES } from "@/lib/content/horizontal-force-cart";

interface CartPredictTaskProps {
  question: string;
  outcome: string;
  reason: string;
  committedLabel?: string | null;
  locked?: boolean;
  needMore: boolean;
  onOutcomeChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onCommit: () => void;
}

export function CartPredictTask(props: CartPredictTaskProps) {
  return (
    <OutcomePredictTask
      copy={{
        instruction: CART_COPY.predictInstruction,
        reasonLabel: CART_COPY.reasonLabel,
        reasonPlaceholder: CART_COPY.reasonPlaceholder,
        submit: CART_COPY.predictSubmit,
        needBoth: CART_COPY.predictNeedBoth,
        lockedLabel: CART_COPY.predictLocked,
      }}
      question={props.question}
      outcomes={CART_PREDICT_OUTCOMES}
      outcome={props.outcome}
      reason={props.reason}
      committedLabel={props.committedLabel}
      locked={props.locked}
      needMore={props.needMore}
      onOutcomeChange={props.onOutcomeChange}
      onReasonChange={props.onReasonChange}
      onCommit={props.onCommit}
      testId="cart-predict-task"
      radioName="cart-prediction"
      reasonId="cart-predict-reason"
    />
  );
}
