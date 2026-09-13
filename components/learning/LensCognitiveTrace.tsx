import { LENS_STAGE_LABELS } from "@/lib/content/convex-lens-optical-bench";
import {
  LENS_TRACE_STEPS,
  type LensCognitiveTraceItem,
} from "@/lib/learning/lens-cognitive-trace";
import { LearningStage } from "@/types/learning";

interface LensCognitiveTraceProps {
  items: LensCognitiveTraceItem[];
  progressStage: LearningStage;
  displayStage: LearningStage;
}

const SUMMARY_LABEL: Record<string, string> = {
  observe: "我的观察",
  describe: "我的说法",
  predict: "我的预测",
  experiment: "实验结果",
  explain: "我的解释",
  model: "我的模型",
  transfer: "新情境",
  exam: "考试",
  independent: "独立",
};

export function LensCognitiveTrace({
  items,
  progressStage,
  displayStage,
}: LensCognitiveTraceProps) {
  const summaries = items.filter((item) => item.summary);
  return (
    <details className="rounded-2xl border border-[var(--line)] px-4 py-3" data-testid="lens-cognitive-trace">
      <summary className="cursor-pointer text-sm font-medium text-[var(--ink)]">
        我走过的路
      </summary>
      <ol className="mt-3 flex flex-wrap gap-x-1 gap-y-1 text-xs text-[var(--ink-muted)]">
        {LENS_TRACE_STEPS.map((step, index) => {
          const current = step.stage === displayStage;
          return (
            <li key={step.id} className={current ? "font-medium text-[var(--ink)]" : undefined}>
              {index > 0 ? <span aria-hidden="true"> → </span> : null}
              {step.label}
            </li>
          );
        })}
      </ol>
      {summaries.length > 0 ? (
        <dl className="mt-3 space-y-2">
          {summaries.map((item) => (
            <div key={item.id}>
              <dt className="text-xs tracking-wide text-[var(--ink-muted)]">
                {SUMMARY_LABEL[item.id] ?? item.label}
              </dt>
              <dd className="text-sm leading-relaxed text-[var(--ink)]">{item.summary}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-3 text-sm text-[var(--ink-muted)]">还没有留下记录。</p>
      )}
      <p className="sr-only">
        {`当前进度：${LENS_STAGE_LABELS[progressStage]}。现在看到的是：${LENS_STAGE_LABELS[displayStage]}。这条痕迹不会改你已经提交的内容。`}
      </p>
    </details>
  );
}
