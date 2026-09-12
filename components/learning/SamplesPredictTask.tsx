import { OutcomePredictTask } from "@/components/learning/dsl/OutcomePredictTask";
import { SAMPLES_COPY } from "@/lib/content/equal-volume-material-samples";

interface SamplesPredictTaskProps {
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

export function SamplesPredictTask(props: SamplesPredictTaskProps) {
  return (
    <OutcomePredictTask
      copy={{
        instruction: SAMPLES_COPY.predictInstruction,
        reasonLabel: SAMPLES_COPY.reasonLabel,
        reasonPlaceholder: SAMPLES_COPY.reasonPlaceholder,
        submit: SAMPLES_COPY.predictSubmit,
        needBoth: SAMPLES_COPY.predictNeedBoth,
        lockedLabel: SAMPLES_COPY.predictLocked,
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
      testId="samples-predict-task"
      radioName="samples-prediction"
      reasonId="samples-predict-reason"
    />
  );
}
