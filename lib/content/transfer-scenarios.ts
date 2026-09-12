export interface TransferScenarioDefinition {
  id: string;
  title: string;
  situation: string;
  prompt: string;
  focus: string;
}

export const TRANSFER_SCENARIOS: TransferScenarioDefinition[] = [
  {
    id: "hot-water-bag",
    title: "热水袋",
    situation:
      "刚才我们研究了微波炉里的面包。如果现在变成一个热水袋贴在手上，过一会儿手会变暖。",
    prompt: "你还能用刚才的想法解释吗？",
    focus: "先想：能量怎样到手上，手为什么会变暖。",
  },
  {
    id: "rubbing-hands",
    title: "搓手",
    situation: "两只手来回搓，搓完会觉得暖和。",
    prompt: "手为什么也会变暖？和刚才的面包，有没有一样的地方？",
    focus: "变暖这个结果可能一样，但能量进来的方式不一定一样。",
  },
  {
    id: "electric-kettle",
    title: "电热水壶",
    situation: "电热水壶给水加热，水的温度升高。",
    prompt: "这件事和微波炉加热面包，有什么一样的地方？",
    focus: "先找相同的关系，不要只看表面故事。",
  },
] as const;

export const REQUIRED_TRANSFER_SCENARIO_IDS = TRANSFER_SCENARIOS.map(
  (scenario) => scenario.id,
);
