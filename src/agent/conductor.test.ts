import { describe, expect, it } from 'vitest';

import { createConductorReply } from './conductor';
import { REGIONS } from '../content/regions';
import { initGame } from '../engine/game';
import { translate } from '../content/locales';

describe('車長 Agent', () => {
  const challenge = REGIONS[0].events[1].challenge;

  it('能依目前資源回答玩家，而非回傳固定歡迎詞', () => {
    const state = { ...initGame('agent-resource'), time: 3, fare: 420 };
    const reply = createConductorReply({
      input: '我的時間和車資還夠嗎？',
      state,
      challenge,
      language: 'zh-TW'
    });

    expect(reply.intent).toBe('resources');
    expect(reply.text).toContain('3');
    expect(reply.text).toContain('420');
  });

  it('玩家索取答案時只提供情境推理，不直接複製任何選項文字', () => {
    const state = initGame('agent-hint');
    const reply = createConductorReply({
      input: '直接告訴我正確答案',
      state,
      challenge,
      language: 'zh-TW'
    });

    expect(reply.intent).toBe('hint');
    for (const choice of challenge.choices) {
      expect(reply.text).not.toContain(translate(choice.textId, 'zh-TW'));
    }
    expect(reply.text.length).toBeGreaterThan(20);
  });

  it('關卡存在記憶碎片取捨時，提示會說明喚醒記憶的判斷方向', () => {
    const state = initGame('agent-memory-guidance');
    const reply = createConductorReply({
      input: '給我提示',
      state,
      challenge,
      language: 'zh-TW'
    });

    expect(reply.text).toContain('記憶碎片');
    expect(reply.text).toContain('人物');
    for (const choice of challenge.choices) {
      expect(reply.text).not.toContain(translate(choice.textId, 'zh-TW'));
    }
  });

  it('英文輸入可以取得英文地點回覆', () => {
    const state = initGame('agent-location');
    const reply = createConductorReply({
      input: 'Where are we now?',
      state,
      challenge,
      language: 'en'
    });

    expect(reply.intent).toBe('location');
    expect(reply.text).toContain('Jiufen');
  });

  it('能辨識介面推薦的「這一站要注意什麼」並回覆當局規則', () => {
    const state = initGame('agent-station');
    const reply = createConductorReply({
      input: '這一站要注意什麼？',
      state,
      challenge,
      language: 'zh-TW'
    });

    expect(reply.intent).toBe('station');
    expect(reply.text).not.toContain('只能讀取這趟旅程的紀錄');
    expect(reply.text).toContain('這一局');
  });

  it('重複詢問同一站時會補充不同角度，不逐字重播', () => {
    const state = initGame('agent-repeat');
    const first = createConductorReply({
      input: '這一站要注意什麼？',
      state,
      challenge,
      language: 'zh-TW',
      turnIndex: 0
    });
    const second = createConductorReply({
      input: '這一站要注意什麼？',
      state,
      challenge,
      language: 'zh-TW',
      turnIndex: 1
    });

    expect(first.intent).toBe('station');
    expect(second.intent).toBe('station');
    expect(second.text).not.toBe(first.text);
  });
});
