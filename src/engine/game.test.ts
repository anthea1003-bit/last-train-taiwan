import { describe, it, expect } from 'vitest';
import {
  initGame,
  applyChoice,
  determineAvailableEndings,
  checkTrueEndingEligibility,
  serializeSave,
  migrateSave,
  selectEventForRegion,
  getOrderedChoices,
  getPreferredChoiceId,
  getScenarioModifier,
  isChoiceAccepted,
  reconcilePenghuRoute
} from './game';
import { Choice } from './types';
import { REGIONS, REGION_SEQUENCE } from '../content/regions';
import { translate } from '../content/locales';

describe('遊戲引擎測試 - 最後一班不存在的環島列車', () => {
  
  it('應正確初始化遊戲狀態 (Initial state)', () => {
    const state = initGame('test-seed-123');
    
    expect(state.time).toBe(15);
    expect(state.fare).toBe(1500);
    expect(state.memoryFragments).toBe(0);
    expect(state.ticketStamps.length).toBe(0);
    expect(state.currentRegionId).toBe('north');
    expect(state.currentEventId).not.toBeNull();
    expect(state.isCompleted).toBe(false);
    expect(state.seed).toBe('test-seed-123');
    expect(state.stepIndex).toBe(0);
  });

  it('應正確套用資源扣除與 Clamping，且不引發 Game Over', () => {
    let state = initGame('test-seed-123');
    
    // 定義一個會扣除大量時間與金錢的選擇
    const heavyChoice: Choice = {
      id: 'heavy_c',
      textId: 'heavy_desc',
      consequenceTextId: 'heavy_cons',
      cost: { time: -20, fare: -2000 } // 超過初始值 (15, 1500)
    };

    state = applyChoice(state, heavyChoice);
    
    // 資源應被限制 (clamped) 在 0，且遊戲並未結束 (isCompleted 依然為 false 除非走完區域)
    expect(state.time).toBe(0);
    expect(state.fare).toBe(0);
    expect(state.isCompleted).toBe(false);

    // 當 fare 已經為 0 時，Conductor 提供基本路線，再次扣除 fare 將不會再往下扣 (維持在 0)
    const anotherChoice: Choice = {
      id: 'another_c',
      textId: 'another_desc',
      consequenceTextId: 'another_cons',
      cost: { time: -1, fare: -500 }
    };
    
    state = applyChoice(state, anotherChoice);
    expect(state.fare).toBe(0); // 依舊是 0
    expect(state.time).toBe(0); // 依舊是 0
  });

  it('答錯時應套用代價但留在原站，讓玩家取得提示後重試', () => {
    const state = initGame('retry-seed');
    const wrongChoice: Choice = {
      id: 'wrong',
      textId: 'wrong_text',
      consequenceTextId: 'wrong_cons',
      cost: { time: -2, fare: -50 }
    };

    const nextState = applyChoice(state, wrongChoice, { advanceRegion: false });

    expect(nextState.time).toBe(13);
    expect(nextState.fare).toBe(1450);
    expect(nextState.currentRegionId).toBe('north');
    expect(nextState.currentEventId).toBe(state.currentEventId);
    expect(nextState.ticketStamps).toEqual([]);
    expect(nextState.history).toEqual([]);
    expect(nextState.stepIndex).toBe(0);
  });

  it('應該實現確定性 (Seeded) 的事件選擇', () => {
    const seedA = 'golden-train';
    const seedB = 'silver-rails';
    
    // 在同一個 seed 和同一個 step 下，選擇的隨機事件變體必須是相同的
    const eventA1 = selectEventForRegion('north', seedA, 0);
    const eventA2 = selectEventForRegion('north', seedA, 0);
    expect(eventA1).toBe(eventA2);

    const eventB1 = selectEventForRegion('north', seedB, 0);
    // 不同的 seed 可能 (也通常會) 得到不同的事件變體
    // 由於事件數量少 (2個)，我們僅驗證在相同 Seed 下的完全確定性
    expect(eventA1).toBeDefined();
    expect(eventB1).toBeDefined();
  });

  it('同一種子會產生相同選項順序，不同種子可改變順序', () => {
    const challenge = REGIONS[0].events[1].challenge;
    const stateA = initGame('choice-order-a');
    const stateB = { ...stateA, seed: 'choice-order-b' };

    const firstOrder = getOrderedChoices(challenge, stateA).map((choice) => choice.id);
    const repeatedOrder = getOrderedChoices(challenge, stateA).map((choice) => choice.id);
    const secondOrder = getOrderedChoices(challenge, stateB).map((choice) => choice.id);

    expect(repeatedOrder).toEqual(firstOrder);
    expect(new Set([firstOrder.join(','), secondOrder.join(',')]).size).toBeGreaterThan(1);
  });

  it('旅行決策的最佳策略會依旅程種子改變，而非永遠固定同一答案', () => {
    const challenge = REGIONS[0].events[1].challenge;
    const preferredChoices = new Set<string>();
    const modifiers = new Set<string>();

    for (let index = 0; index < 20; index += 1) {
      const state = initGame(`dynamic-choice-${index}`);
      preferredChoices.add(getPreferredChoiceId(state, challenge));
      modifiers.add(getScenarioModifier(state, challenge));
    }

    expect(preferredChoices.size).toBeGreaterThan(1);
    expect(modifiers.size).toBeGreaterThan(1);
  });

  it('故事決策的每條路都可前進，懷錶路線應確實發放秘密車票', () => {
    const challenge = REGIONS[0].events[1].challenge;
    const ticketChoice = challenge.choices.find(
      (choice) => choice.id === 'north_c2_option_a'
    );

    if (!ticketChoice) {
      throw new Error('找不到北部懷錶選項');
    }

    const state = {
      ...initGame('story-choice-regression'),
      currentEventId: 'north_event_2'
    };

    expect(challenge.correctChoiceId).toBeUndefined();
    expect(isChoiceAccepted(challenge, ticketChoice.id)).toBe(true);

    const nextState = applyChoice(state, ticketChoice);

    expect(nextState.secretTicket).toBe(true);
    expect(nextState.memoryFragments).toBe(1);
    expect(nextState.ticketStamps).toContain('north');
    expect(nextState.currentRegionId).toBe('hsinchu_miaoli');
  });

  it('有標準答案的異常題仍只接受正確選項', () => {
    const challenge = REGIONS[0].events[0].challenge;
    const wrongChoice = challenge.choices.find(
      (choice) => choice.id !== challenge.correctChoiceId
    );

    if (!wrongChoice || !challenge.correctChoiceId) {
      throw new Error('北部異常題缺少測試選項');
    }

    expect(isChoiceAccepted(challenge, wrongChoice.id)).toBe(false);
    expect(isChoiceAccepted(challenge, challenge.correctChoiceId)).toBe(true);
  });

  it('應正確記錄六個印章 (Six stamps)', () => {
    let state = initGame('test-seed');
    
    // 模擬走完前 6 個正常區域
    // 我們每次對當前的 event 做一個無影響的 choice
    const dummyChoice: Choice = {
      id: 'dummy',
      textId: 'dummy_text',
      consequenceTextId: 'dummy_cons',
      cost: { time: 0, fare: 0 }
    };

    for (let i = 0; i < 6; i++) {
      expect(state.currentRegionId).toBe(REGION_SEQUENCE[i]);
      state = applyChoice(state, dummyChoice);
    }

    // 完成六個正常地區後，應收集到 6 個印章
    expect(state.ticketStamps.length).toBe(6);
    expect(REGION_SEQUENCE.every(id => state.ticketStamps.includes(id))).toBe(true);
  });

  it('無澎湖資格時，應在第六站完成後提供 3 個正常結局選擇', () => {
    let state = initGame('normal-run');
    const dummyChoice: Choice = {
      id: 'dummy',
      textId: 'dummy_text',
      consequenceTextId: 'dummy_cons',
      cost: { time: 0, fare: 0 }
    };

    for (let i = 0; i < 6; i++) {
      state = applyChoice(state, dummyChoice);
    }

    // 檢查不符澎湖資格 (此時 memoryFragments = 0, secretTicket = false)
    expect(checkTrueEndingEligibility(state)).toBe(false);
    expect(state.currentRegionId).not.toBe('penghu');
    expect(state.isCompleted).toBe(true);

    const endings = determineAvailableEndings(state);
    expect(endings.length).toBe(3);
    expect(endings.map(e => e.id)).toContain('return-home');
    expect(endings.map(e => e.id)).toContain('keep-traveling');
    expect(endings.map(e => e.id)).toContain('train-guardian');
  });

  it('符合澎湖資格時，第六站完成後解鎖澎湖，且能進入隱藏的 True Ending', () => {
    let state = initGame('true-ending-run');
    
    // 模擬符合澎湖資格：6 memories + 1 secret ticket + 6 stamps
    // 我們在旅途中，藉由 Choice 來收集這些資源
    for (let i = 0; i < 6; i++) {
      const rewardChoice: Choice = {
        id: `reward_${i}`,
        textId: 'reward_text',
        consequenceTextId: 'reward_cons',
        cost: { time: 0, fare: 0 },
        givesMemory: true, // 每次給予 1 個記憶碎片
        givesSecretTicket: i === 0 ? true : false // 在第一個區域給予秘密車票
      };
      state = applyChoice(state, rewardChoice);
    }

    // 檢查資源是否符合
    expect(state.memoryFragments).toBe(6);
    expect(state.secretTicket).toBe(true);
    expect(state.ticketStamps.length).toBe(6);

    // 第六個區域（east）完成後，因為符合澎湖資格，下一個區域應該自動切換到澎湖
    expect(state.currentRegionId).toBe('penghu');
    expect(state.isCompleted).toBe(false); // 還沒有完成澎湖

    // 在澎湖做最後一個 Choice
    const penghuChoice: Choice = {
      id: 'penghu_finish',
      textId: 'penghu_text',
      consequenceTextId: 'penghu_cons',
      cost: { time: 0, fare: 0 }
    };
    state = applyChoice(state, penghuChoice);

    // 完成澎湖後，遊戲結束，且結局只有一個隱藏 True Ending
    expect(state.isCompleted).toBe(true);
    
    const endings = determineAvailableEndings(state);
    expect(endings.length).toBe(1);
    expect(endings[0].id).toBe('penghu-true');
  });

  it('真實六站內容中，秘密車票、六枚印章與六片記憶會導向澎湖', () => {
    let state = initGame('train7');

    expect(state.currentEventId).toBe('north_event_2');

    for (let index = 0; index < REGION_SEQUENCE.length; index += 1) {
      const region = REGIONS.find(({ id }) => id === state.currentRegionId);
      const event = region?.events.find(({ id }) => id === state.currentEventId);
      const choice = index === 0
        ? event?.challenge.choices.find(({ id }) => id === 'north_c2_option_a')
        : event?.challenge.choices.find(({ givesMemory }) => givesMemory);

      if (!event || !choice) {
        throw new Error(`第 ${index + 1} 站缺少可取得記憶的真實選項`);
      }

      expect(isChoiceAccepted(event.challenge, choice.id)).toBe(true);
      state = applyChoice(state, choice);
    }

    expect(state.secretTicket).toBe(true);
    expect(state.memoryFragments).toBe(6);
    expect(state.ticketStamps).toEqual(REGION_SEQUENCE);
    expect(state.currentRegionId).toBe('penghu');
    expect(state.currentEventId).toBe('penghu_event_1');
    expect(state.isCompleted).toBe(false);
  });

  it('六枚印章與六片記憶若缺少秘密車票，仍停在普通結局', () => {
    let state = initGame('no-secret-ticket');

    for (let index = 0; index < REGION_SEQUENCE.length; index += 1) {
      state = applyChoice(state, {
        id: `memory_without_ticket_${index}`,
        textId: 'memory_without_ticket_text',
        consequenceTextId: 'memory_without_ticket_cons',
        cost: { time: 0, fare: 0 },
        givesMemory: true
      });
    }

    expect(state.secretTicket).toBe(false);
    expect(state.memoryFragments).toBe(6);
    expect(state.ticketStamps).toEqual(REGION_SEQUENCE);
    expect(state.currentRegionId).not.toBe('penghu');
    expect(state.isCompleted).toBe(true);
  });

  it('三項條件齊全卻被標記為普通結局的存檔，應自動校正到澎湖', () => {
    const inconsistentState = {
      ...initGame('repair-complete-route'),
      memoryFragments: 6,
      ticketStamps: [...REGION_SEQUENCE],
      secretTicket: true,
      currentRegionId: 'east',
      currentEventId: null,
      history: [...REGION_SEQUENCE],
      isCompleted: true,
      selectedEnding: null,
      stepIndex: 6
    };

    const repaired = reconcilePenghuRoute(inconsistentState);

    expect(repaired.currentRegionId).toBe('penghu');
    expect(repaired.currentEventId).toBe('penghu_event_1');
    expect(repaired.isCompleted).toBe(false);
    expect(repaired.selectedEnding).toBeNull();
  });

  it('缺少秘密車票的普通結局存檔不應被誤送往澎湖', () => {
    const normalEndingState = {
      ...initGame('keep-normal-ending'),
      memoryFragments: 6,
      ticketStamps: [...REGION_SEQUENCE],
      secretTicket: false,
      currentRegionId: 'east',
      currentEventId: null,
      history: [...REGION_SEQUENCE],
      isCompleted: true,
      selectedEnding: null,
      stepIndex: 6
    };

    expect(reconcilePenghuRoute(normalEndingState)).toBe(normalEndingState);
  });

  it('應支援版本化存檔的序列化與遷移 (Save serialization & migration)', () => {
    const state = initGame('serialize-test');
    const serialized = serializeSave(state);
    
    // 1. 驗證序列化內容包含 version 資訊
    const parsed = JSON.parse(serialized);
    expect(parsed.version).toBe(1);
    expect(parsed.state).toBeDefined();

    // 2. 遷移相同版本的存檔
    const restored = migrateSave(serialized);
    expect(restored).not.toBeNull();
    expect(restored?.seed).toBe('serialize-test');

    // 3. 遷移舊版 (v0) 存檔 (無 version 欄位，模擬舊版格式)
    const oldV0Save = JSON.stringify({
      time: 12,
      fare: 800,
      memoryFragments: 3,
      ticketStamps: ['north', 'hsinchu_miaoli'],
      currentRegionId: 'central'
    });
    const migratedState = migrateSave(oldV0Save);
    expect(migratedState).not.toBeNull();
    expect(migratedState?.time).toBe(12);
    expect(migratedState?.fare).toBe(800);
    expect(migratedState?.memoryFragments).toBe(3);
    // 應補上預設的種子與步驟索引
    expect(migratedState?.seed).toBe('default-seed');
    expect(migratedState?.stepIndex).toBe(0);

    // 4. 遷移未來版本 (v2) 應 fail safely 回傳 null 且不崩潰
    const futureSave = JSON.stringify({
      version: 2,
      updatedAt: '2027-01-01',
      state: { ...state, time: 99 }
    });
    const futureRestored = migrateSave(futureSave);
    expect(futureRestored).toBeNull();

    // 5. 毀損格式應 fail safely 回傳 null
    const corruptedRestored = migrateSave('invalid-json-format');
    expect(corruptedRestored).toBeNull();
  });

  it('應能切換語言而不影響遊戲狀態 (Language switching preserving state)', () => {
    const state = initGame('lang-test');
    
    // 獲取北部第一事件的文字 ID
    const descId = 'north_event_1_desc';

    // 繁體中文翻譯
    const textZh = translate(descId, 'zh-TW');
    expect(textZh).toContain('天燈');

    // 英文翻譯
    const textEn = translate(descId, 'en');
    expect(textEn.toLowerCase()).toContain('sky lanterns');

    // 狀態保持不變
    expect(state.time).toBe(15);
    expect(state.fare).toBe(1500);
  });
});
