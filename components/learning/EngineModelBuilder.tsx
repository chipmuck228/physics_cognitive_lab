import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EngineEvidenceDrawer } from "@/components/learning/EngineEvidenceDrawer";
import {
  ENGINE_COPY,
  ENGINE_MODEL_COPY,
  ENGINE_MODEL_DISTRACTOR_NODES,
  ENGINE_MODEL_QUANTITY_NODES,
  ENGINE_MODEL_RELATIONS,
  ENGINE_MODEL_SLOT_COUNT,
} from "@/lib/content/four-stroke-engine";
import {
  engineModelNodeLabel,
  type EngineRelationKind,
} from "@/lib/learning/engine-model";

interface EngineModelBuilderProps {
  slots: string[];
  relationKinds: Array<EngineRelationKind | "">;
  combustionEnablesConversion: boolean;
  selectedId: string | null;
  feedback?: string | null;
  needStructure: boolean;
  evidenceA?: string | null;
  evidenceB?: string | null;
  hints: string[];
  canRevealHint: boolean;
  onSelectNode: (id: string) => void;
  onPlaceInSlot: (index: number) => void;
  onRelationChange: (index: number, kind: EngineRelationKind | "") => void;
  onCombustionChange: (enabled: boolean) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

const BANK_NODES = [...ENGINE_MODEL_QUANTITY_NODES, ...ENGINE_MODEL_DISTRACTOR_NODES];

export function EngineModelBuilder({
  slots,
  relationKinds,
  combustionEnablesConversion,
  selectedId,
  feedback,
  needStructure,
  evidenceA,
  evidenceB,
  hints,
  canRevealHint,
  onSelectNode,
  onPlaceInSlot,
  onRelationChange,
  onCombustionChange,
  onSubmit,
  onRevealHint,
}: EngineModelBuilderProps) {
  const placed = new Set(slots.filter(Boolean));
  const canSubmit = slots.some(Boolean);

  return (
    <div className="space-y-4" data-testid="engine-model-builder">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {ENGINE_MODEL_COPY.instruction}
      </p>

      <EngineEvidenceDrawer
        title={ENGINE_MODEL_COPY.evidenceTitle}
        evidenceA={evidenceA}
        evidenceB={evidenceB}
      />

      <Card className="space-y-3 p-4">
        <p className="text-sm font-medium text-[var(--ink)]">
          {ENGINE_MODEL_COPY.glossaryTitle}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {ENGINE_MODEL_COPY.glossaryChemical}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {ENGINE_MODEL_COPY.glossaryInternal}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {ENGINE_MODEL_COPY.glossaryWork}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {ENGINE_MODEL_COPY.glossaryMechanical}
        </p>
      </Card>

      <Card className="space-y-4 p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--ink)]">
            {ENGINE_MODEL_COPY.bankLabel}
          </p>
          <div className="flex flex-wrap gap-2" data-testid="engine-model-bank">
            {BANK_NODES.filter((node) => !placed.has(node.id)).map((node) => {
              const selected = selectedId === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  data-testid={`engine-model-node-${node.id}`}
                  onClick={() => onSelectNode(node.id)}
                  className={`rounded-full border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] ${
                    selected
                      ? "border-[var(--heat)] bg-[var(--heat)]/8 text-[var(--ink)]"
                      : "border-[var(--line)] bg-white text-[var(--ink-muted)] hover:border-[var(--ink-muted)]"
                  }`}
                  aria-pressed={selected}
                >
                  {node.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--ink)]">
            {ENGINE_MODEL_COPY.slotsLabel}
          </p>
          {Array.from({ length: ENGINE_MODEL_SLOT_COUNT }, (_, index) => (
            <div key={index} className="space-y-2">
              <button
                type="button"
                data-testid={`engine-model-slot-${index}`}
                onClick={() => onPlaceInSlot(index)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] ${
                  slots[index]
                    ? "border-[var(--heat)] bg-white text-[var(--ink)]"
                    : "border-dashed border-[var(--line)] bg-[var(--paper)] text-[var(--ink-muted)]"
                }`}
              >
                {slots[index] ? engineModelNodeLabel(slots[index]) : `格子 ${index + 1}`}
              </button>
              {index < ENGINE_MODEL_SLOT_COUNT - 1 ? (
                <div
                  className="flex flex-wrap gap-2"
                  data-testid={`engine-model-relation-${index}`}
                >
                  <span className="sr-only">{ENGINE_MODEL_COPY.relationLabel}</span>
                  <RelationChip
                    label={ENGINE_MODEL_COPY.relationNone}
                    selected={!relationKinds[index]}
                    onClick={() => onRelationChange(index, "")}
                  />
                  {ENGINE_MODEL_RELATIONS.map((relation) => (
                    <RelationChip
                      key={relation.value}
                      label={relation.label}
                      selected={relationKinds[index] === relation.value}
                      onClick={() => onRelationChange(index, relation.value)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
          <input
            type="checkbox"
            className="mt-1"
            data-testid="engine-model-combustion-enable"
            checked={combustionEnablesConversion}
            onChange={(event) => onCombustionChange(event.target.checked)}
          />
          <span className="space-y-1">
            <span className="block text-sm text-[var(--ink)]">
              {ENGINE_MODEL_COPY.combustionEnable}
            </span>
            <span className="block text-xs text-[var(--ink-muted)]">
              {ENGINE_MODEL_COPY.combustionNote}
            </span>
          </span>
        </label>

        {needStructure ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {ENGINE_MODEL_COPY.needStructure}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button onClick={onSubmit} disabled={!canSubmit}>
            {ENGINE_MODEL_COPY.submit}
          </Button>
        </div>
      </Card>

      {feedback ? (
        <Card className="p-4" data-testid="engine-model-feedback">
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{feedback}</p>
        </Card>
      ) : null}

      {hints.length > 0 ? (
        <Card className="space-y-2 p-4" data-testid="engine-hint-list">
          {hints.map((hint) => (
            <p key={hint} className="text-sm leading-relaxed text-[var(--ink-muted)]">
              {hint}
            </p>
          ))}
        </Card>
      ) : null}

      <div className="flex justify-start">
        <Button
          variant="secondary"
          onClick={onRevealHint}
          disabled={!canRevealHint}
          data-testid="engine-model-hint"
        >
          {canRevealHint ? ENGINE_COPY.explainHint : ENGINE_COPY.explainHintDone}
        </Button>
      </div>
    </div>
  );
}

function RelationChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-3 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] ${
        selected
          ? "border-[var(--heat)] bg-[var(--heat)]/8 text-[var(--ink)]"
          : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink-muted)]"
      }`}
    >
      {label}
    </button>
  );
}
