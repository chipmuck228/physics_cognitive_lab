import { LookbackCompleteView } from "@/components/learning/dsl/LookbackCompleteView";
import { SAMPLES_COMPLETE_COPY } from "@/lib/content/equal-volume-material-samples";

interface SamplesCompleteViewProps {
  prediction: string;
  experiment: string;
  model: string;
  transfer: string;
  independent: string;
}

export function SamplesCompleteView({
  prediction,
  experiment,
  model,
  transfer,
  independent,
}: SamplesCompleteViewProps) {
  return (
    <LookbackCompleteView
      copy={{
        title: SAMPLES_COMPLETE_COPY.title,
        caution: SAMPLES_COMPLETE_COPY.caution,
        theme: SAMPLES_COMPLETE_COPY.theme,
        demonstratedTitle: SAMPLES_COMPLETE_COPY.demonstratedTitle,
        demonstrated: SAMPLES_COMPLETE_COPY.demonstrated,
        reviewTitle: SAMPLES_COMPLETE_COPY.reviewTitle,
      }}
      review={[
        { id: "predict", label: SAMPLES_COMPLETE_COPY.reviewPredict, value: prediction },
        { id: "experiment", label: SAMPLES_COMPLETE_COPY.reviewExperiment, value: experiment },
        { id: "model", label: SAMPLES_COMPLETE_COPY.reviewModel, value: model },
        { id: "transfer", label: SAMPLES_COMPLETE_COPY.reviewTransfer, value: transfer },
        { id: "independent", label: SAMPLES_COMPLETE_COPY.reviewIndependent, value: independent },
      ]}
      testId="samples-complete"
      reviewTestId="samples-complete-review"
    />
  );
}
