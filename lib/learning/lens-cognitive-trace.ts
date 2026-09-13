import { LearningStage, type LearningSession } from "@/types/learning";

export interface LensCognitiveTraceItem {
  id: string;
  label: string;
  stage: LearningStage;
  summary: string | null;
}

export const LENS_TRACE_STEPS: readonly {
  id: string;
  label: string;
  stage: LearningStage;
}[] = [
  { id: "observe", label: "观察", stage: LearningStage.OBSERVE },
  { id: "describe", label: "描述", stage: LearningStage.DESCRIBE },
  { id: "predict", label: "预测", stage: LearningStage.PREDICT },
  { id: "experiment", label: "验证", stage: LearningStage.EXPERIMENT },
  { id: "explain", label: "解释", stage: LearningStage.EXPLAIN },
  { id: "model", label: "建模", stage: LearningStage.MODEL },
  { id: "transfer", label: "新情境", stage: LearningStage.TRANSFER },
  { id: "exam", label: "考试", stage: LearningStage.EXAM },
  { id: "independent", label: "独立", stage: LearningStage.AI_OFF },
];

export function lensCognitiveTraceItems(session: LearningSession): LensCognitiveTraceItem[] {
  return LENS_TRACE_STEPS.map((step) => ({
    ...step,
    summary: summaryFor(step.id, session),
  }));
}

function summaryFor(id: string, session: LearningSession): string | null {
  if (id === "observe") {
    return session.observations.at(-1)?.text?.trim() || null;
  }
  if (id === "describe") {
    return session.descriptions.at(-1)?.text?.trim() || null;
  }
  if (id === "predict") {
    const latest = session.predictions.at(-1);
    if (!latest) {
      return null;
    }
    return latest.reasoning?.trim() || latest.prediction || null;
  }
  if (id === "experiment") {
    const latest = session.experimentEvidence.at(-1);
    return latest?.reflection?.trim() || latest?.predictionComparison || null;
  }
  if (id === "explain") {
    return session.explanations.at(-1)?.text?.trim() || null;
  }
  if (id === "model") {
    return session.modelAttempts.at(-1)?.studentReasoning?.trim() || null;
  }
  if (id === "transfer") {
    const latest = session.transferAttempts.at(-1);
    return latest?.response?.trim() || latest?.conditionReasoning?.trim() || null;
  }
  if (id === "exam") {
    return session.examAttempts.at(-1)?.reasoning?.trim() || null;
  }
  return session.independentAssessment?.challengeAttempts?.at(-1)?.studentReasoning?.trim() || null;
}
