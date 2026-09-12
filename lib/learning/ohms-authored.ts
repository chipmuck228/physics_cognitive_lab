/**
 * Deterministic authored-relation probes for ohms-law.
 * These check control → I direction. They do not assign L-levels.
 */

export type OhmsAuthoredFailureKind =
  | "missing"
  | "generic"
  | "formula-only"
  | "noun-sandwich"
  | "token-sandwich"
  | "no-control"
  | "wrong-direction"
  | "wrong-consequence-quantity"
  | "negated"
  | "reversed-control"
  | "one-control-only"
  | "missing-boundary"
  | "fixed-proportion"
  | "generic-boundary"
  | "missing-rearrangement-reject";

export interface OhmsAuthoredRelation {
  sameRLargerI: boolean;
  sameUSmallerI: boolean;
  wrongDirection: boolean;
  reversedControl: boolean;
  negatedRequiredIncrease: boolean;
  tokenSandwich: boolean;
  wrongConsequenceQuantity: boolean;
  genericPhysics: boolean;
  formulaOnly: boolean;
  nounSandwich: boolean;
  mentionsBoundary: boolean;
  claimsFixedProportion: boolean;
  rejectsManufacture: boolean;
  manufacturesR: boolean;
}

export function compactOhmsAuthored(text: string): string {
  return text.replace(/\s+/g, "");
}

export function analyzeOhmsAuthoredRelation(text: string): OhmsAuthoredRelation {
  const compact = compactOhmsAuthored(text);
  const parts = authoredSegments(compact);
  let sameRLargerI = false;
  let sameUSmallerI = false;
  let wrongDirection = false;
  let reversedControl = false;
  let negatedRequiredIncrease = false;

  for (const part of parts) {
    const rHeld = hasRHeld(part);
    const uHeld = hasUHeld(part);
    const uUp = hasUIncrease(part);
    const rUp = hasRIncrease(part);
    const iUp = hasIIncrease(part);
    const iDown = hasIDecrease(part);
    const negatedIUp = hasNegatedIIncrease(part);

    if (negatedIUp && (rHeld || uUp)) {
      negatedRequiredIncrease = true;
    }
    if (rHeld && uUp && iDown && !iUp) {
      wrongDirection = true;
    }
    if (uHeld && rUp && iUp && !iDown) {
      reversedControl = true;
    }
    if (rHeld && uUp && iUp && !negatedIUp && !iDown) {
      sameRLargerI = true;
    }
    if (uHeld && rUp && iDown && !hasNegatedIDecrease(part)) {
      sameUSmallerI = true;
    }
  }

  const formulaOnly = looksLikeFormulaOnly(compact);
  const nounSandwich = /电流电压电阻/.test(compact) && !sameRLargerI && !sameUSmallerI;
  const tokenSandwich = looksLikeTokenSandwich(compact, sameRLargerI || sameUSmallerI);
  const wrongConsequenceQuantity = looksLikeWrongConsequenceQuantity(compact);
  const genericPhysics = looksLikeGenericPhysics(compact, sameRLargerI || sameUSmallerI);
  const mentionsBoundary = looksLikeBoundary(compact);
  const claimsFixedProportion = looksLikeFixedProportionClaim(compact);
  const manufacturesR = looksLikeManufacturesR(compact);
  const rejectsManufacture = looksLikeRejectsManufacture(compact);

  return {
    sameRLargerI,
    sameUSmallerI,
    wrongDirection,
    reversedControl,
    negatedRequiredIncrease,
    tokenSandwich,
    wrongConsequenceQuantity,
    genericPhysics,
    formulaOnly,
    nounSandwich,
    mentionsBoundary,
    claimsFixedProportion,
    rejectsManufacture,
    manufacturesR,
  };
}

export function evaluateOhmsTwoControlAuthored(text: string): {
  ok: boolean;
  failureKind: OhmsAuthoredFailureKind | "ok";
} {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, failureKind: "missing" };
  }
  const compact = compactOhmsAuthored(trimmed);
  if (looksLikeGenericSlogan(compact) || compact.length < 8) {
    return { ok: false, failureKind: "generic" };
  }
  const relation = analyzeOhmsAuthoredRelation(trimmed);
  if (relation.formulaOnly) {
    return { ok: false, failureKind: "formula-only" };
  }
  if (relation.nounSandwich) {
    return { ok: false, failureKind: "noun-sandwich" };
  }
  if (relation.tokenSandwich) {
    return { ok: false, failureKind: "token-sandwich" };
  }
  if (relation.genericPhysics) {
    return { ok: false, failureKind: "generic" };
  }
  if (relation.wrongConsequenceQuantity) {
    return { ok: false, failureKind: "wrong-consequence-quantity" };
  }
  if (relation.negatedRequiredIncrease) {
    return { ok: false, failureKind: "negated" };
  }
  if (relation.wrongDirection) {
    return { ok: false, failureKind: "wrong-direction" };
  }
  if (relation.reversedControl) {
    return { ok: false, failureKind: "reversed-control" };
  }
  if (relation.sameRLargerI && relation.sameUSmallerI) {
    return { ok: true, failureKind: "ok" };
  }
  if (relation.sameRLargerI || relation.sameUSmallerI) {
    return { ok: false, failureKind: "one-control-only" };
  }
  return { ok: false, failureKind: "no-control" };
}

export function evaluateOhmsOneCorrectControlAuthored(text: string): {
  ok: boolean;
  failureKind: OhmsAuthoredFailureKind | "ok";
} {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, failureKind: "missing" };
  }
  const compact = compactOhmsAuthored(trimmed);
  if (looksLikeGenericSlogan(compact) || !hasOwnHan(compact)) {
    return { ok: false, failureKind: "generic" };
  }
  const relation = analyzeOhmsAuthoredRelation(trimmed);
  if (relation.formulaOnly) {
    return { ok: false, failureKind: "formula-only" };
  }
  if (relation.nounSandwich || relation.tokenSandwich) {
    return { ok: false, failureKind: "token-sandwich" };
  }
  if (relation.genericPhysics) {
    return { ok: false, failureKind: "generic" };
  }
  if (relation.wrongConsequenceQuantity) {
    return { ok: false, failureKind: "wrong-consequence-quantity" };
  }
  if (relation.negatedRequiredIncrease) {
    return { ok: false, failureKind: "negated" };
  }
  if (relation.wrongDirection || relation.reversedControl) {
    return { ok: false, failureKind: relation.wrongDirection ? "wrong-direction" : "reversed-control" };
  }
  if (relation.sameRLargerI || relation.sameUSmallerI) {
    return { ok: true, failureKind: "ok" };
  }
  return { ok: false, failureKind: "no-control" };
}

export function evaluateOhmsBoundaryAuthored(text: string): {
  ok: boolean;
  failureKind: OhmsAuthoredFailureKind | "ok";
} {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, failureKind: "missing" };
  }
  const compact = compactOhmsAuthored(trimmed);
  if (looksLikeGenericSlogan(compact) || /^(情况不一样|不一样|不同)+[。.!！]*$/.test(compact)) {
    return { ok: false, failureKind: "generic-boundary" };
  }
  const relation = analyzeOhmsAuthoredRelation(trimmed);
  if (relation.formulaOnly && !relation.mentionsBoundary) {
    return { ok: false, failureKind: "formula-only" };
  }
  if (relation.claimsFixedProportion && !relation.mentionsBoundary) {
    return { ok: false, failureKind: "fixed-proportion" };
  }
  if (
    !relation.mentionsBoundary &&
    (relation.tokenSandwich || relation.nounSandwich || relation.genericPhysics)
  ) {
    return { ok: false, failureKind: "token-sandwich" };
  }
  if (relation.sameRLargerI && !relation.mentionsBoundary) {
    return { ok: false, failureKind: "fixed-proportion" };
  }
  if (!relation.mentionsBoundary) {
    return { ok: false, failureKind: "missing-boundary" };
  }
  return { ok: true, failureKind: "ok" };
}

export function evaluateOhmsRearrangementAuthored(text: string): {
  ok: boolean;
  failureKind: OhmsAuthoredFailureKind | "ok";
} {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, failureKind: "missing" };
  }
  const compact = compactOhmsAuthored(trimmed);
  if (looksLikeGenericSlogan(compact) || compact.length < 8) {
    return { ok: false, failureKind: "generic" };
  }
  const relation = analyzeOhmsAuthoredRelation(trimmed);
  if (relation.manufacturesR) {
    return { ok: false, failureKind: "wrong-direction" };
  }
  if (relation.formulaOnly && !relation.rejectsManufacture) {
    return { ok: false, failureKind: "formula-only" };
  }
  if (relation.tokenSandwich || relation.nounSandwich || relation.genericPhysics) {
    return { ok: false, failureKind: "token-sandwich" };
  }
  if (hasNegatedIIncrease(compact) || relation.negatedRequiredIncrease || relation.wrongDirection) {
    return {
      ok: false,
      failureKind: hasNegatedIIncrease(compact) || relation.negatedRequiredIncrease
        ? "negated"
        : "wrong-direction",
    };
  }
  if (/所以电压/.test(compact) && !/电流/.test(compact) && !/属性/.test(compact)) {
    return { ok: false, failureKind: "wrong-consequence-quantity" };
  }
  if (!relation.rejectsManufacture || !/电阻/.test(compact)) {
    return { ok: false, failureKind: "missing-rearrangement-reject" };
  }
  if (
    /电压.{0,6}(变了|调高|更大|变大)/.test(compact) &&
    hasIDecrease(compact) &&
    !hasIIncrease(compact)
  ) {
    return { ok: false, failureKind: "wrong-direction" };
  }
  return { ok: true, failureKind: "ok" };
}

function authoredSegments(compact: string): string[] {
  const parts = compact
    .split(/[。.!！；;]/)
    .flatMap((part) => part.split(/(?=换(?:更高|更大|电阻|电压|一节|一个))/))
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  return parts.length > 0 ? parts : [compact];
}

function hasRHeld(part: string): boolean {
  return /电阻(可以看成)?(不变|没变|相同|一样)|同一个电阻/.test(part);
}

function hasUHeld(part: string): boolean {
  return /电压(可以看成)?(不变|没变|相同|一样)|同一个电压/.test(part);
}

function hasUIncrease(part: string): boolean {
  return /电压.{0,2}(更大|变大|增大|升高|更高)|更高电压/.test(part);
}

function hasRIncrease(part: string): boolean {
  return /电阻.{0,2}(更大|变大|增大|更高|更细)|(更大|更细).{0,6}电阻/.test(part);
}

function hasIIncrease(part: string): boolean {
  return /电流.{0,2}(更大|变大|增大)/.test(part);
}

function hasIDecrease(part: string): boolean {
  return /电流.{0,2}(更小|变小|减小)/.test(part);
}

function hasNegatedIIncrease(part: string): boolean {
  return /不(会|能|是).{0,12}电流.{0,8}(更大|变大|增大)|电流.{0,6}不(会|能).{0,6}(更大|变大|增大)|并不会让电流/.test(
    part,
  );
}

function hasNegatedIDecrease(part: string): boolean {
  return /不(会|能).{0,12}电流.{0,8}(更小|变小|减小)/.test(part);
}

function looksLikeFormulaOnly(compact: string): boolean {
  return /^(电流等于电压除以电阻|I=U\/R|I＝U／R|套公式就行)+[。.!！]*$/i.test(compact);
}

function looksLikeGenericSlogan(compact: string): boolean {
  return /^(好好|我觉得这样|不知道|随便写写|可以的)+[。.!！]*$/.test(compact);
}

function looksLikeTokenSandwich(compact: string, hasValidRelation: boolean): boolean {
  if (hasValidRelation) {
    return false;
  }
  const hasI = /电流/.test(compact);
  const hasU = /电压/.test(compact);
  const hasR = /电阻/.test(compact);
  const hasIDirection = hasIIncrease(compact) || hasIDecrease(compact);
  if (hasI && hasU && hasR && !hasIDirection) {
    return true;
  }
  return /电阻.{0,8}(不变|没变).{0,12}电压.{0,8}(更大|变大|增大)电流$/.test(compact);
}

function looksLikeWrongConsequenceQuantity(compact: string): boolean {
  return (
    /电压.{0,8}(不变|没变).{0,16}电阻.{0,8}(更大|变大).{0,12}所以电压.{0,8}(更大|变大)/.test(
      compact,
    ) ||
    /电阻.{0,8}(不变|没变).{0,16}电压.{0,8}(更大|变大).{0,12}所以电阻.{0,8}(更大|变大)/.test(
      compact,
    )
  );
}

function looksLikeGenericPhysics(compact: string, hasValidRelation: boolean): boolean {
  if (hasValidRelation) {
    return false;
  }
  return /都是物理量|三个量都要看|电流电压电阻都|都是电路/.test(compact);
}

function looksLikeBoundary(compact: string): boolean {
  return /电阻.{0,8}(会变|可能变|可能会变)|不能.{0,16}(固定电阻|看成不变)|不能说电压加倍|不能再用固定/.test(
    compact,
  );
}

function looksLikeFixedProportionClaim(compact: string): boolean {
  if (looksLikeBoundary(compact)) {
    return false;
  }
  return /电压加倍电流一定加倍|电阻不变电流一定成正比/.test(compact);
}

function looksLikeManufacturesR(compact: string): boolean {
  return (
    !/没有制造|不是制造|并没有制造/.test(compact) &&
    /制造.{0,6}电阻|电阻一定变成一个新的|分子变大所以电阻变大/.test(compact)
  );
}

function looksLikeRejectsManufacture(compact: string): boolean {
  return /没有制造|不是制造|并没有制造|不是被?算出来才有|电阻是.{0,8}属性/.test(compact);
}

function hasOwnHan(text: string): boolean {
  return (text.match(/[\u4e00-\u9fff]/g) ?? []).length >= 2;
}
