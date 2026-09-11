export const SCENE_OBJECT = "bread";
export const PHYSICS_QUANTITY = "temperature";
export const PHYSICS_CHANGE = "increase";

const OBJECT_PATTERNS = [/\bbread\b/i, /\btoast\b/i, /\bloaf\b/i, /\bslice\b/i];

const QUANTITY_PATTERNS = [
  /\btemperatures?\b/i,
  /\btemp\b/i,
  /°\s*c\b/i,
  /\bdegrees?\b/i,
];

const INCREASE_PATTERNS = [
  /\bincreas(?:e|ed|es|ing)\b/i,
  /\brose\b/i,
  /\brisen\b/i,
  /\brises\b/i,
  /\bwent\s+up\b/i,
  /\bgoes\s+up\b/i,
  /\bgot\s+higher\b/i,
  /\bbecame\s+higher\b/i,
  /\braised\b/i,
];

export interface DescriptionEvaluation {
  object?: string;
  quantity?: string;
  change?: string;
  sufficient: boolean;
}

/**
 * Lightweight deterministic evaluator for DESCRIBE evidence.
 * The LLM is not the authority for this gate.
 *
 * Required semantic structure:
 * object = bread (explicit, or implied by the microwave-bread scene)
 * quantity = temperature
 * change = increase
 */
export function evaluateDescription(
  text: string,
  contextObject: string = SCENE_OBJECT,
): DescriptionEvaluation {
  const normalized = normalizeDescription(text);
  const objectMentioned = OBJECT_PATTERNS.some((pattern) => pattern.test(normalized));
  const quantity = QUANTITY_PATTERNS.some((pattern) => pattern.test(normalized))
    ? PHYSICS_QUANTITY
    : undefined;
  const change = INCREASE_PATTERNS.some((pattern) => pattern.test(normalized))
    ? PHYSICS_CHANGE
    : undefined;

  const object =
    objectMentioned || (quantity === PHYSICS_QUANTITY && change === PHYSICS_CHANGE)
      ? contextObject
      : undefined;

  return {
    object,
    quantity,
    change,
    sufficient:
      object === contextObject &&
      quantity === PHYSICS_QUANTITY &&
      change === PHYSICS_CHANGE,
  };
}

export function isSufficientPhysicsDescription(
  text: string,
  contextObject: string = SCENE_OBJECT,
): boolean {
  return evaluateDescription(text, contextObject).sufficient;
}

export function hasSufficientDescription(
  descriptions: Array<{
    object?: string;
    quantity?: string;
    change?: string;
    sufficient?: boolean;
    text?: string;
  }>,
): boolean {
  return descriptions.some((description) => {
    if (description.sufficient) {
      return true;
    }

    if (
      description.object === SCENE_OBJECT &&
      description.quantity === PHYSICS_QUANTITY &&
      description.change === PHYSICS_CHANGE
    ) {
      return true;
    }

    return description.text
      ? isSufficientPhysicsDescription(description.text)
      : false;
  });
}

function normalizeDescription(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
