export type Language = 'zh-TW' | 'en';

export interface ResourceDelta {
  time?: number; // 負值扣除，正值增加
  fare?: number; // 負值扣除，正值增加
}

export interface Choice {
  id: string;
  textId: string; // 用於本地化
  consequenceTextId: string; // 選擇後的說明本地化 ID
  cost: ResourceDelta;
  requiresClueId?: string; // 可選：需要特定線索才能選擇
  givesClueId?: string; // 可選：選擇後給予的線索
  givesMemory?: boolean; // 是否給予記憶碎片
  helpsPassenger?: boolean; // 是否幫助了乘客
  givesSecretTicket?: boolean; // 是否獲得秘密車票
}

export interface Challenge {
  id: string;
  type: 'anomaly' | 'dialogue' | 'decision';
  textId: string;
  hintTextId: string;
  choices: Choice[];
  correctChoiceId?: string; // 對於 puzzle/anomaly 類型，答對的 Choice ID
}

export interface RegionEvent {
  id: string;
  textId: string;
  challenge: Challenge;
}

export interface Region {
  id: string;
  nameId: string;
  events: RegionEvent[]; // 包含 2 到 3 個隨機事件變體
}

export interface Clue {
  id: string;
  textId: string;
}

export interface GameState {
  time: number; // 初始 15
  fare: number; // 初始 1500
  memoryFragments: number; // 0 到 6
  ticketStamps: string[]; // 已獲得印章的地區 ID 列表
  helpedPassengers: string[]; // 已幫助乘客的 ID 列表
  secretTicket: boolean; // 是否擁有秘密車票
  currentRegionId: string; // 當前所在區域 ID
  currentEventId: string | null; // 當前遭遇的隨機事件 ID
  history: string[]; // 已完成區域 ID 列表
  clues: string[]; // 已獲得的線索 ID 列表
  isCompleted: boolean;
  selectedEnding: string | null;
  seed: string; // 遊戲隨機數種子
  stepIndex: number; // 用於事件確定的步驟索引
}

export interface SaveEnvelope {
  version: number;
  updatedAt: string;
  state: GameState;
}

export interface Ending {
  id: 'return-home' | 'keep-traveling' | 'train-guardian' | 'penghu-true';
  titleId: string;
  descriptionId: string;
}
