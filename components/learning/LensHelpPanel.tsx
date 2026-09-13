import { Button } from "@/components/common/Button";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_HELP_INTENTS,
  nextLensHelpPrompt,
  type LensHelpIntentId,
} from "@/lib/learning/lens-help-intents";

interface LensHelpPanelProps {
  intentId: LensHelpIntentId | "";
  prompts: string[];
  onSelectIntent: (intentId: LensHelpIntentId) => void;
  onRevealNext: () => void;
}

export function LensHelpPanel({
  intentId,
  prompts,
  onSelectIntent,
  onRevealNext,
}: LensHelpPanelProps) {
  const canReveal = intentId ? Boolean(nextLensHelpPrompt(intentId, prompts.length)) : false;
  return (
    <div className="space-y-3" data-testid="lens-help-panel">
      <p className="text-sm font-medium">需要帮忙？先说卡在哪。</p>
      <div className="flex flex-wrap gap-2">
        {LENS_HELP_INTENTS.map((intent) => (
          <Button
            key={intent.id}
            variant={intentId === intent.id ? "secondary" : "ghost"}
            onClick={() => onSelectIntent(intent.id)}
            data-testid={`lens-help-${intent.id}`}
          >
            {intent.label}
          </Button>
        ))}
      </div>
      {prompts.map((prompt) => (
        <ValidationMessage key={prompt} kind="info">
          {prompt}
        </ValidationMessage>
      ))}
      {canReveal ? (
        <Button variant="ghost" onClick={onRevealNext} data-testid="lens-help-next">
          再想一层
        </Button>
      ) : null}
    </div>
  );
}
