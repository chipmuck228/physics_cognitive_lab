import { createLearningEvent } from "@/lib/learning/events";
import { LearningStage, type LearningEvent, type LearningSession } from "@/types/learning";

export const LENS_INTERACTION_TRACE_KIND = "lens-interaction";

export type LensInteractionTraceAction =
  | "move-object"
  | "move-screen"
  | "choose-object-station"
  | "construct-ray"
  | "run-intervention"
  | "prepare-trial"
  | "acknowledge-next-trial"
  | "cover-lens"
  | "record-observation"
  | "commit-prediction"
  | "record-observed-result"
  | "compare-with-prediction"
  | "author-reflection"
  | "submit-description"
  | "submit-explanation"
  | "submit-model"
  | "submit-transfer"
  | "submit-exam"
  | "commit-independent"
  | "request-help"
  | "revisit-entered"
  | "revisit-returned";

export interface LensInteractionTrace {
  action: LensInteractionTraceAction;
  stage: LearningStage;
  substep?: string;
  from?: string;
  to?: string;
  mode: "working" | "review";
  timestamp: string;
}

export function isLensInteractionEvent(event: LearningEvent): boolean {
  return (
    event.type === "student_response" &&
    event.metadata?.kind === LENS_INTERACTION_TRACE_KIND
  );
}

export function appendLensInteractionTrace(
  session: LearningSession,
  trace: Omit<LensInteractionTrace, "timestamp"> & { timestamp?: string },
): LearningSession {
  const timestamp = trace.timestamp ?? new Date().toISOString();
  return {
    ...session,
    events: [
      ...session.events,
      createLearningEvent(
        "student_response",
        trace.stage,
        {
          kind: LENS_INTERACTION_TRACE_KIND,
          action: trace.action,
          substep: trace.substep,
          from: trace.from,
          to: trace.to,
          mode: trace.mode,
        },
        () => timestamp,
      ),
    ],
  };
}

export function lensInteractionTraces(session: LearningSession): LensInteractionTrace[] {
  return session.events.flatMap((event) => {
    if (isLensInteractionEvent(event)) {
      const action = event.metadata?.action;
      if (typeof action !== "string") {
        return [];
      }
      return [
        {
          action: action as LensInteractionTraceAction,
          stage: event.stage,
          substep: typeof event.metadata?.substep === "string" ? event.metadata.substep : undefined,
          from: typeof event.metadata?.from === "string" ? event.metadata.from : undefined,
          to: typeof event.metadata?.to === "string" ? event.metadata.to : undefined,
          mode: event.metadata?.mode === "review" ? "review" : "working",
          timestamp: event.timestamp,
        },
      ];
    }
    return processFromExistingEvent(event);
  });
}

function processFromExistingEvent(event: LearningEvent): LensInteractionTrace[] {
  const mapped = existingAction(event.type);
  if (!mapped) {
    return [];
  }
  return [
    {
      action: mapped,
      stage: event.stage,
      from: stringify(event.metadata?.from ?? event.metadata?.experimentId),
      to: stringify(event.metadata?.to ?? event.metadata?.outcome),
      mode: "working",
      timestamp: event.timestamp,
    },
  ];
}

function existingAction(type: LearningEvent["type"]): LensInteractionTraceAction | null {
  if (type === "experiment_run") {
    return "run-intervention";
  }
  if (type === "prediction_made") {
    return "commit-prediction";
  }
  if (type === "model_submitted") {
    return "submit-model";
  }
  if (type === "transfer_attempted") {
    return "submit-transfer";
  }
  if (type === "exam_answered") {
    return "submit-exam";
  }
  return null;
}

function stringify(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function lensInteractionTraceLabel(trace: LensInteractionTrace): string {
  if (trace.action === "move-object") {
    return `物体从 ${stationLabel(trace.from)} 到 ${stationLabel(trace.to)}`;
  }
  if (trace.action === "move-screen") {
    return trace.to === "true" ? "光屏放到像的位置" : "光屏离开像的位置";
  }
  if (trace.action === "choose-object-station") {
    return `建构时选择物距：${stationLabel(trace.to)}`;
  }
  if (trace.action === "construct-ray") {
    return "自己装了一条光线";
  }
  if (trace.action === "prepare-trial") {
    return "光具座准备好这一次验证";
  }
  if (trace.action === "acknowledge-next-trial") {
    return "开始下一轮验证";
  }
  if (trace.action === "cover-lens") {
    return "遮住了透镜一部分";
  }
  if (trace.action === "run-intervention") {
    return "在光具座上完成了这次改变";
  }
  if (trace.action === "commit-prediction") {
    return "锁定了预测";
  }
  if (trace.action === "submit-model") {
    return "提交了模型";
  }
  if (trace.action === "request-help") {
    return "看了帮忙";
  }
  if (trace.action === "revisit-entered") {
    return "回看了前面的一步";
  }
  if (trace.action === "revisit-returned") {
    return "回到当前进度";
  }
  return "记下了一步";
}

function stationLabel(value?: string): string {
  if (value === "beyond-2f") {
    return "2F 外";
  }
  if (value === "at-2f") {
    return "2F";
  }
  if (value === "between-f-and-2f") {
    return "F 和 2F 之间";
  }
  if (value === "at-f") {
    return "焦点上";
  }
  if (value === "inside-f") {
    return "焦点以内";
  }
  return value || "原位置";
}
