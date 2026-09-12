export function normalizeMicrowaveText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

export function looksLikeNounSandwich(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  if (!normalized) {
    return false;
  }
  if (normalized === "能量内能温度" || normalized === "能量、内能、温度") {
    return true;
  }
  const hasEnergy = normalized.includes("能量");
  const hasInternal = normalized.includes("内能");
  const hasTemperature = normalized.includes("温度");
  return hasEnergy && hasInternal && hasTemperature && normalized.length <= 10;
}

export function looksLikeHeatSlogan(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  return (
    normalized === "吸收热量所以升温" ||
    normalized === "吸收热量所以温度升高" ||
    normalized.includes("吸收热量所以升温")
  );
}

export function looksLikeGenericAuthored(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  return (
    normalized === "好好" ||
    normalized === "我觉得这样不太对吧" ||
    normalized === "变热了" ||
    normalized === "变热了。"
  );
}

export function looksLikeSurfaceHeating(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  return (
    normalized.includes("也是加热") ||
    normalized.includes("也会变热") ||
    normalized.includes("都是加热") ||
    normalized.includes("都是微波炉") ||
    normalized.includes("都是加热装置")
  );
}

export function looksLikeGenericBoundaryTalk(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  return (
    normalized.includes("情况不一样") ||
    normalized === "还在加热" ||
    normalized.includes("还在加热") ||
    normalized.includes("看起来不一样")
  );
}

export function hasAuthoredModelDistinction(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  if (
    !normalized ||
    looksLikeNounSandwich(text) ||
    looksLikeHeatSlogan(text) ||
    looksLikeGenericAuthored(text)
  ) {
    return false;
  }
  if (
    normalized.includes("温度就是内能") ||
    normalized.includes("内能就是温度") ||
    normalized.includes("能量进来温度就必须") ||
    normalized.includes("吸收能量就一定升温")
  ) {
    return false;
  }
  return (
    /温度.{0,8}不是.{0,8}内能/.test(normalized) ||
    /内能.{0,8}不是.{0,8}温度/.test(normalized) ||
    /热不是(装在|一种东西|储存)/.test(normalized) ||
    /热是过程/.test(normalized) ||
    /温度不一定(升高|上升|变)/.test(normalized) ||
    /能量进来.{0,12}温度不一定/.test(normalized)
  );
}

export function hasAuthoredKettleTransfer(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  if (
    looksLikeSurfaceHeating(text) ||
    looksLikeNounSandwich(text) ||
    looksLikeGenericAuthored(text) ||
    looksLikeHeatSlogan(text)
  ) {
    return false;
  }
  const hasSystem = normalized.includes("水") || normalized.includes("壶");
  const hasEnergy = normalized.includes("能量") && normalized.includes("进入");
  const hasTemperatureRise =
    normalized.includes("温度") &&
    (normalized.includes("升高") || normalized.includes("上升"));
  return hasSystem && hasEnergy && hasTemperatureRise && !normalized.includes("冰");
}

export function hasAuthoredIceBoundary(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  if (
    looksLikeGenericBoundaryTalk(text) ||
    looksLikeSurfaceHeating(text) ||
    looksLikeNounSandwich(text) ||
    looksLikeGenericAuthored(text)
  ) {
    return false;
  }
  const ordinaryOnly =
    (normalized.includes("温度升高") || normalized.includes("也会变热")) &&
    !normalized.includes("不一定") &&
    !normalized.includes("可以不变") &&
    !normalized.includes("不必升高");
  if (ordinaryOnly) {
    return false;
  }
  const energyIn =
    normalized.includes("能量") &&
    (normalized.includes("进入") || normalized.includes("吸收") || normalized.includes("进来"));
  const temperatureNeedNot =
    normalized.includes("不一定") ||
    normalized.includes("可以不变") ||
    normalized.includes("不必升高");
  return energyIn && temperatureNeedNot;
}

export function hasAuthoredOrdinaryApplication(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  if (
    looksLikeNounSandwich(text) ||
    looksLikeHeatSlogan(text) ||
    looksLikeGenericAuthored(text) ||
    looksLikeSurfaceHeating(text) ||
    normalized.includes("因为是金属")
  ) {
    return false;
  }
  const energyIn = normalized.includes("能量") && normalized.includes("进入");
  const internal = normalized.includes("内能");
  const temperature = normalized.includes("温度") && (normalized.includes("升高") || normalized.includes("上升"));
  const distinction =
    /温度.{0,8}不是.{0,8}内能/.test(normalized) ||
    /热不是(装在|一种东西|储存)/.test(normalized);
  return energyIn && internal && temperature && distinction;
}

export function isEverydayHeatOnly(text: string): boolean {
  const normalized = normalizeMicrowaveText(text);
  return normalized === "变热了" || normalized === "变热了。" || normalized === "热了";
}
