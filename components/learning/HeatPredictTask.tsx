import { OutcomePredictTask } from "@/components/learning/dsl/OutcomePredictTask";
import { HEAT_COPY } from "@/lib/content/equal-mass-heated-samples";

interface HeatPredictTaskProps {
  question: string;
  outcomes: ReadonlyArray<{ value: string; label: string }>;
  outcome: string;
  reason: string;
  committedLabel?: string | null;
  locked?: boolean;
  needMore: boolean;
  onOutcomeChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onCommit: () => void;
}

export function HeatPredictTask(props: HeatPredictTaskProps) {
  return (
    <OutcomePredictTask
      copy={{
        instruction: HEAT_COPY.predictInstruction,
        reasonLabel: HEAT_COPY.reasonLabel,
        reasonPlaceholder: HEAT_COPY.reasonPlaceholder,
        submit: HEAT_COPY.predictSubmit,
        needBoth: HEAT_COPY.predictNeedBoth,
        lockedLabel: HEAT_COPY.predictLocked,
      }}
      question={props.question}
      outcomes={props.outcomes}
      outcome={props.outcome}
      reason={props.reason}
      committedLabel={props.committedLabel}
      locked={props.locked}
      needMore={props.needMore}
      onOutcomeChange={props.onOutcomeChange}
      onReasonChange={props.onReasonChange}
      onCommit={props.onCommit}
      testId="heat-predict-task"
      radioName="heat-prediction"
      reasonId="heat-predict-reason"
    />
  );
}
