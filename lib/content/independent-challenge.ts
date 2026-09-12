export const INDEPENDENT_EXPLANATION_ID = "metal-spoon";

export const INDEPENDENT_EXPLANATION = {
  id: INDEPENDENT_EXPLANATION_ID,
  situation: "一把金属勺放进热水里。过一会儿，勺子的温度升高了。",
  prompt: "为什么会这样？",
} as const;

export const INDEPENDENT_EXAM_QUESTION = {
  id: "independent-q1",
  text: "一枚铁钉在两种情况下都会变热：放进热水里，以及被反复敲打。下面哪一句最准确？",
  options: [
    "这两种情况一定是同一种热传递。",
    "两种情况都能让温度升高，但能量进入铁钉的方式可以不同。",
    "只有热水才能改变铁钉的内能。",
    "敲打不会改变温度，因为没有加入热量。",
  ],
  correctAnswer:
    "两种情况都能让温度升高，但能量进入铁钉的方式可以不同。",
} as const;
