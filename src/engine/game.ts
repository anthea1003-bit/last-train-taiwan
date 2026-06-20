import {
  GameState,
  Choice,
  Challenge,
  Ending,
  SaveEnvelope,
  ChoiceRewardSummary
} from './types';
import { REGIONS, REGION_SEQUENCE } from '../content/regions';

// 遊戲當前支援的存檔版本
export const CURRENT_SAVE_VERSION = 1;

type ApplyChoiceOptions = {
  advanceRegion?: boolean;
};

export type ScenarioModifier =
  | 'time-pressure'
  | 'fare-pressure'
  | 'memory-resonance'
  | 'compassion';

const SCENARIO_MODIFIERS: ScenarioModifier[] = [
  'time-pressure',
  'fare-pressure',
  'memory-resonance',
  'compassion'
];

/**
 * 簡單的字串雜湊，將字串轉為 32 位元整數，用作 PRNG 種子
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Mulberry32 確定性偽隨機數生成器
 */
export function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 初始化遊戲狀態
 */
export function initGame(seed: string): GameState {
  const firstRegionId = REGION_SEQUENCE[0]; // 'north'
  const state: GameState = {
    time: 15,
    fare: 1500,
    memoryFragments: 0,
    ticketStamps: [],
    helpedPassengers: [],
    secretTicket: false,
    currentRegionId: firstRegionId,
    currentEventId: null,
    history: [],
    clues: [],
    isCompleted: false,
    selectedEnding: null,
    seed,
    stepIndex: 0
  };
  
  // 確定性地為初始區域選擇事件
  state.currentEventId = selectEventForRegion(firstRegionId, seed, state.stepIndex);
  return state;
}

/**
 * 根據種子與步驟索引為區域選擇隨機事件
 */
export function selectEventForRegion(regionId: string, seed: string, stepIndex: number): string {
  const region = REGIONS.find(r => r.id === regionId);
  if (!region || region.events.length === 0) {
    throw new Error(`Region ${regionId} not found or has no events.`);
  }
  const seedNum = hashString(seed) + stepIndex;
  const prng = mulberry32(seedNum);
  const randomIndex = Math.floor(prng() * region.events.length);
  return region.events[randomIndex].id;
}

export function getScenarioModifier(
  state: GameState,
  challenge: Challenge
): ScenarioModifier {
  const modifierIndex = hashString(
    `${state.seed}:${state.stepIndex}:${challenge.id}:modifier`
  ) % SCENARIO_MODIFIERS.length;
  return SCENARIO_MODIFIERS[modifierIndex];
}

export function getOrderedChoices(
  challenge: Challenge,
  state: GameState
): Choice[] {
  if (challenge.choices.length < 2) {
    return [...challenge.choices];
  }

  const offset = hashString(
    `${state.seed}:${state.stepIndex}:${challenge.id}:order`
  ) % challenge.choices.length;

  return [
    ...challenge.choices.slice(offset),
    ...challenge.choices.slice(0, offset)
  ];
}

function selectHighestScoringChoice(
  choices: Choice[],
  scoreChoice: (choice: Choice) => number,
  seed: string
): Choice {
  const scored = choices.map((choice) => ({
    choice,
    score: scoreChoice(choice)
  }));
  const highestScore = Math.max(...scored.map(({ score }) => score));
  const finalists = scored
    .filter(({ score }) => score === highestScore)
    .map(({ choice }) => choice);
  const index = hashString(seed) % finalists.length;
  return finalists[index];
}

export function getPreferredChoiceId(
  state: GameState,
  challenge: Challenge
): string {
  if (challenge.correctChoiceId) {
    return challenge.correctChoiceId;
  }

  const modifier = getScenarioModifier(state, challenge);
  const seed = `${state.seed}:${state.stepIndex}:${challenge.id}:${modifier}`;
  const selected = selectHighestScoringChoice(
    challenge.choices,
    (choice) => {
      switch (modifier) {
        case 'time-pressure':
          return choice.cost.time ?? 0;
        case 'fare-pressure':
          return choice.cost.fare ?? 0;
        case 'memory-resonance':
          return Number(Boolean(choice.givesMemory))
            + Number(Boolean(choice.givesSecretTicket)) * 2;
        case 'compassion':
          return Number(Boolean(choice.helpsPassenger)) * 2
            + Number(Boolean(choice.givesMemory));
      }
    },
    seed
  );

  return selected.id;
}

export function isChoiceAccepted(
  challenge: Challenge,
  choiceId: string
): boolean {
  return challenge.correctChoiceId === undefined
    || challenge.correctChoiceId === choiceId;
}

/**
 * 檢查是否符合澎湖（第七站）的解鎖資格
 */
export function checkTrueEndingEligibility(state: GameState): boolean {
  // 澎湖資格：需要 6 個正常區域的印章 + 6 個記憶碎片 + 擁有秘密車票
  const hasSixStamps = REGION_SEQUENCE.every(id => state.ticketStamps.includes(id));
  return hasSixStamps && state.memoryFragments === 6 && state.secretTicket;
}

export function reconcilePenghuRoute(state: GameState): GameState {
  const hasAlreadyReachedPenghu = state.currentRegionId === 'penghu'
    || state.history.includes('penghu');

  if (!checkTrueEndingEligibility(state) || hasAlreadyReachedPenghu) {
    return state;
  }

  return {
    ...state,
    currentRegionId: 'penghu',
    currentEventId: selectEventForRegion('penghu', state.seed, state.stepIndex),
    isCompleted: false,
    selectedEnding: null
  };
}

export function getChoiceRewardSummary(
  previousState: GameState,
  choice: Choice,
  nextState: GameState
): ChoiceRewardSummary {
  const completedRegionId = previousState.currentRegionId;

  return {
    memory: Boolean(
      choice.givesMemory
      && nextState.memoryFragments > previousState.memoryFragments
    ),
    secretTicket: Boolean(
      choice.givesSecretTicket
      && !previousState.secretTicket
      && nextState.secretTicket
    ),
    stamp: !previousState.ticketStamps.includes(completedRegionId)
      && nextState.ticketStamps.includes(completedRegionId),
    completedRegionId,
    penghuUnlocked: completedRegionId !== 'penghu'
      && nextState.currentRegionId === 'penghu'
  };
}

/**
 * 套用選擇並執行資源 Clamping、收集線索、獲得記憶與車票等遊戲邏輯
 */
export function applyChoice(
  state: GameState,
  choice: Choice,
  options: ApplyChoiceOptions = {}
): GameState {
  // 複製一份新的 State 以維持純函式特性
  const nextState = { ...state };
  
  // 1. 資源扣除與 Clamping
  // time 初始 15，扣除後最小限制在 0。
  nextState.time = Math.max(0, nextState.time + (choice.cost.time || 0));
  
  // fare 初始 1500，扣除後最小限制在 0。
  // 若 fare 已經是 0，此時 conductor 會提供基本路線（即費用變動不再往下扣，維持在 0）
  if (state.fare === 0 && (choice.cost.fare || 0) < 0) {
    // 免費基本路線：不扣除費用
    nextState.fare = 0;
  } else {
    nextState.fare = Math.max(0, nextState.fare + (choice.cost.fare || 0));
  }

  if (options.advanceRegion === false) {
    return nextState;
  }
  
  // 2. Clues 收集 (Low time <= 3 removes optional clues)
  if (choice.givesClueId) {
    if (nextState.time > 3) {
      if (!nextState.clues.includes(choice.givesClueId)) {
        nextState.clues = [...nextState.clues, choice.givesClueId];
      }
    } else {
      // 由於時間過低 (Low time)，無法取得此可選線索
      console.warn(`Time is low (${nextState.time} <= 3). Optional clue ${choice.givesClueId} is missed.`);
    }
  }

  // 3. 獲得記憶碎片 (最多 6 個)
  if (choice.givesMemory) {
    nextState.memoryFragments = Math.min(6, nextState.memoryFragments + 1);
  }

  // 4. 記錄幫助乘客
  if (choice.helpsPassenger) {
    if (!nextState.helpedPassengers.includes(choice.id)) {
      nextState.helpedPassengers = [...nextState.helpedPassengers, choice.id];
    }
  }

  // 5. 獲得秘密車票
  if (choice.givesSecretTicket) {
    nextState.secretTicket = true;
  }

  // 6. 標記當前區域已完成，給予 Stamp，並安排下一個區域
  if (!nextState.ticketStamps.includes(nextState.currentRegionId)) {
    // 只有在完成前六個正常區域時才記錄 stamp
    if (REGION_SEQUENCE.includes(nextState.currentRegionId)) {
      nextState.ticketStamps = [...nextState.ticketStamps, nextState.currentRegionId];
    }
  }

  if (!nextState.history.includes(nextState.currentRegionId)) {
    nextState.history = [...nextState.history, nextState.currentRegionId];
  }

  // 增加步驟索引，以便下個隨機事件的種子產生變化
  nextState.stepIndex += 1;

  // 尋找下一個目的地
  const nextRegionIndex = REGION_SEQUENCE.indexOf(nextState.currentRegionId) + 1;
  
  if (nextState.currentRegionId === 'penghu') {
    // 澎湖是最終隱藏站，完成後即進入結局選擇階段
    nextState.currentEventId = null;
    nextState.isCompleted = true;
  } else if (nextRegionIndex < REGION_SEQUENCE.length) {
    // 前往六個正常區域的下一個
    const nextRegionId = REGION_SEQUENCE[nextRegionIndex];
    nextState.currentRegionId = nextRegionId;
    nextState.currentEventId = selectEventForRegion(nextRegionId, nextState.seed, nextState.stepIndex);
  } else {
    // 六個正常區域均已完成
    // 檢查是否符合解鎖澎湖（第七站）的資格
    if (checkTrueEndingEligibility(nextState)) {
      nextState.currentRegionId = 'penghu';
      nextState.currentEventId = selectEventForRegion('penghu', nextState.seed, nextState.stepIndex);
    } else {
      // 不符資格，進入正常結局選擇
      nextState.currentEventId = null;
      nextState.isCompleted = true;
    }
  }

  return nextState;
}

/**
 * 決定當前可用的結局列表
 */
export function determineAvailableEndings(state: GameState): Ending[] {
  // 如果尚未走完六個地區，無法選擇結局
  const hasSixStamps = REGION_SEQUENCE.every(id => state.ticketStamps.includes(id));
  if (!hasSixStamps) {
    return [];
  }

  // 檢查是否符合澎湖結局的資格（需要澎湖區域也完成）
  if (state.history.includes('penghu')) {
    return [
      {
        id: 'penghu-true',
        titleId: 'ending_penghu_true_title',
        descriptionId: 'ending_penghu_true_desc'
      }
    ];
  }

  // 正常結局三選一
  return [
    {
      id: 'return-home',
      titleId: 'ending_return_home_title',
      descriptionId: 'ending_return_home_desc'
    },
    {
      id: 'keep-traveling',
      titleId: 'ending_keep_traveling_title',
      descriptionId: 'ending_keep_traveling_desc'
    },
    {
      id: 'train-guardian',
      titleId: 'ending_train_guardian_title',
      descriptionId: 'ending_train_guardian_desc'
    }
  ];
}

/**
 * 將遊戲狀態序列化為包含版本號的 JSON 字串
 */
export function serializeSave(state: GameState): string {
  const envelope: SaveEnvelope = {
    version: CURRENT_SAVE_VERSION,
    updatedAt: new Date().toISOString(),
    state
  };
  return JSON.stringify(envelope);
}

/**
 * 遷移舊版或毀損存檔
 * 若版本比目前程式碼更新、或是格式無效，回傳 null（由 UI 提示使用者進行 fresh start，不自動破壞舊資料）
 */
export function migrateSave(serialized: string): GameState | null {
  try {
    const envelope = JSON.parse(serialized) as SaveEnvelope;
    
    if (typeof envelope !== 'object' || envelope === null) {
      return null;
    }
    
    // 若無 version 或 version 格式不正確，視為極早期版本 (v0) 並進行遷移
    const version = envelope.version !== undefined ? envelope.version : 0;
    
    if (version > CURRENT_SAVE_VERSION) {
      // 未來版本，無法安全遷移
      return null;
    }
    
    if (version === 0) {
      // 假設舊版格式 state 缺少一些新欄位，進行 v0 -> v1 的遷移
      const oldState = (envelope.state || envelope) as any;
      const migratedState: GameState = {
        time: typeof oldState.time === 'number' ? oldState.time : 15,
        fare: typeof oldState.fare === 'number' ? oldState.fare : 1500,
        memoryFragments: typeof oldState.memoryFragments === 'number' ? oldState.memoryFragments : 0,
        ticketStamps: Array.isArray(oldState.ticketStamps) ? oldState.ticketStamps : [],
        helpedPassengers: Array.isArray(oldState.helpedPassengers) ? oldState.helpedPassengers : [],
        secretTicket: !!oldState.secretTicket,
        currentRegionId: oldState.currentRegionId || 'north',
        currentEventId: oldState.currentEventId || null,
        history: Array.isArray(oldState.history) ? oldState.history : [],
        clues: Array.isArray(oldState.clues) ? oldState.clues : [],
        isCompleted: !!oldState.isCompleted,
        selectedEnding: oldState.selectedEnding || null,
        seed: oldState.seed || 'default-seed',
        stepIndex: typeof oldState.stepIndex === 'number' ? oldState.stepIndex : 0
      };
      return reconcilePenghuRoute(migratedState);
    }
    
    if (version === CURRENT_SAVE_VERSION) {
      return reconcilePenghuRoute(envelope.state);
    }
    
    return null;
  } catch (e) {
    // JSON 解析失敗或資料異常
    return null;
  }
}
