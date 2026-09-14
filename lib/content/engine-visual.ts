import type { EngineStroke, MechanicalOutput, WorkTransfer } from "@/lib/physics/engine";

export const ENGINE_PART_LABELS = {
  engine: "四冲程发动机",
  cylinder: "气缸",
  piston: "活塞",
  intakeValve: "进气门",
  exhaustValve: "排气门",
  crankshaft: "曲轴",
  connectingRod: "连杆",
  combustion: "燃烧",
  open: "打开",
  closed: "关闭",
} as const;

export const ENGINE_STROKE_LABELS: Record<EngineStroke, string> = {
  intake: "吸气",
  compression: "压缩",
  power: "做功",
  exhaust: "排气",
};

export const ENGINE_OUTPUT_LABELS: Record<MechanicalOutput, string> = {
  none: "无",
  "input-required": "需要输入",
  "main-output": "主要输出",
  blocked: "受阻",
};

export const ENGINE_WORK_LABELS: Record<WorkTransfer, string> = {
  none: "无",
  "mechanical-to-gas": "机械 → 气体",
  "gas-to-mechanical": "气体 → 机械",
  blocked: "受阻",
};

export const ENGINE_GAS_LABELS = {
  "fresh-mixture": "新鲜混合气进入",
  compressed: "气体被压缩",
  "compressed-unburned": "气体被压缩，未燃烧",
  "combusted-hot": "燃烧后的气体",
  expanding: "气体膨胀",
  exhaust: "废气排出",
} as const;

export const ENGINE_DEMO_COPY = {
  title: "四冲程发动机",
  banner: "开发演示：用来检查可视化。这不是学生学习页面。",
  play: "播放",
  pause: "暂停",
  next: "下一冲程",
  reset: "重置",
  chooseStroke: "选择冲程",
  combustionEnabled: "燃烧开启",
  pistonCanMove: "活塞可动",
  developerConditions: "开发条件",
  motionStatus: "运动状态",
  outputStatus: "动力输出状态",
  workStatus: "做功传递",
  crankMoving: "曲轴在动",
  crankStill: "曲轴静止",
  debugTitle: "开发状态",
} as const;
