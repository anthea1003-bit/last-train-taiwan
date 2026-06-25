import { translate } from '../content/locales';
import { getScenarioModifier } from '../engine/game';
import { Challenge, GameState, Language } from '../engine/types';

export type ConductorIntent =
  | 'greeting'
  | 'hint'
  | 'station'
  | 'resources'
  | 'location'
  | 'ticket'
  | 'progress'
  | 'unknown';

export interface ConductorReply {
  intent: ConductorIntent;
  text: string;
}

interface ConductorReplyInput {
  input: string;
  state: GameState;
  challenge: Challenge;
  language: Language;
  turnIndex?: number;
}

const includesAny = (input: string, words: string[]): boolean =>
  words.some((word) => input.includes(word));

function detectIntent(input: string): ConductorIntent {
  const normalized = input.trim().toLowerCase();

  if (includesAny(normalized, ['答案', '提示', '怎麼選', 'help', 'hint', 'answer'])) {
    return 'hint';
  }
  if (includesAny(normalized, ['這一站', '這站', '注意', '異常', '局面', 'station', 'watch out', 'anomaly'])) {
    return 'station';
  }
  if (includesAny(normalized, ['時間', '車資', '錢', '資源', 'time', 'fare', 'money', 'resource'])) {
    return 'resources';
  }
  if (includesAny(normalized, ['哪裡', '地點', '現在在哪', 'where', 'location'])) {
    return 'location';
  }
  if (includesAny(normalized, ['秘密車票', '車票', '澎湖', 'ticket', 'penghu'])) {
    return 'ticket';
  }
  if (includesAny(normalized, ['進度', '印章', '記憶', 'progress', 'stamp', 'memory'])) {
    return 'progress';
  }
  if (includesAny(normalized, ['你好', '嗨', '哈囉', 'hello', 'hi'])) {
    return 'greeting';
  }
  return 'unknown';
}

function createHint(
  state: GameState,
  challenge: Challenge,
  language: Language,
  turnIndex: number
): string {
  const hasMemoryTradeoff = challenge.choices.some((choice) => choice.givesMemory)
    && challenge.choices.some((choice) => !choice.givesMemory);
  const memoryGuidance = hasMemoryTradeoff
    ? language === 'zh-TW'
      ? ' 若你同時在找記憶碎片，留意哪個行動真正碰觸了人物的失物、約定或地方記憶；單純節省資源不一定會喚醒它。'
      : ' If you are also seeking a memory fragment, notice which action truly touches a person’s lost object, promise, or local memory; saving resources alone may not awaken it.'
    : '';

  if (challenge.correctChoiceId) {
    const variants = language === 'zh-TW'
      ? [
        `我不會替你作答，但異常不會憑空發生。先問：哪個行動能修復眼前規則，而不是只處理表面？車長紀錄補充：${translate(challenge.hintTextId, language)}`,
        `換個角度看：兩個方案都要付代價，但只有一個是在理解異常後下手。先排除只會讓現場更混亂的行動。補充線索：${translate(challenge.hintTextId, language)}`
      ]
      : [
        `I will not name the answer. Ask which action repairs the broken rule instead of treating its surface. The conductor's log adds: ${translate(challenge.hintTextId, language)}`,
        `Try another angle: both plans have a cost, but only one responds after understanding the anomaly. Eliminate the action that merely creates more disorder. Additional clue: ${translate(challenge.hintTextId, language)}`
      ];
    return `${variants[turnIndex % variants.length]}${memoryGuidance}`;
  }

  const modifier = getScenarioModifier(state, challenge);
  const hints = {
    'time-pressure': language === 'zh-TW'
      ? '這一站的時刻表正在縮短。比較每個方案實際會耗掉多少時間，最快的不一定最勇敢，卻可能最符合這一局。'
      : 'This station is losing time. Compare the actual time cost of each plan; the fastest route may be the right strategy for this run.',
    'fare-pressure': language === 'zh-TW'
      ? '售票鉗留下了「保留車資」的暗記。先找出能讓後續旅程保有最多餘裕的方案。'
      : 'The ticket punch marks this as a fare-conservation run. Preserve enough money for the stations ahead.',
    'memory-resonance': language === 'zh-TW'
      ? '你的舊車票正在發熱。這一站要追的不是效率，而是哪個選擇最可能喚回被遺忘的約定。'
      : 'Your old ticket is warm. Efficiency is not the key here; choose the path most likely to awaken a forgotten promise.',
    compassion: language === 'zh-TW'
      ? '車廂裡多出了一個沒有座號的名字。這一站會記得你是否看見了別人的困境。'
      : 'A nameless passenger has appeared in the carriage log. This station will remember whether you noticed someone else in need.'
  };

  if (turnIndex % 2 === 0) {
    return `${hints[modifier]}${memoryGuidance}`;
  }
  const resourceHint = language === 'zh-TW'
    ? `${hints[modifier]} 你目前有 ${state.time} 小時與 NT$ ${state.fare}，把這兩個數字一起放進判斷，不要只看故事表面。`
    : `${hints[modifier]} You have ${state.time} hours and NT$ ${state.fare}; include both numbers in your reasoning instead of reading only the story surface.`;
  return `${resourceHint}${memoryGuidance}`;
}

export function createConductorReply({
  input,
  state,
  challenge,
  language,
  turnIndex = 0
}: ConductorReplyInput): ConductorReply {
  const intent = detectIntent(input);
  const regionName = translate(`region_${state.currentRegionId}_name`, language);

  switch (intent) {
    case 'hint':
      return { intent, text: createHint(state, challenge, language, turnIndex) };
    case 'station': {
      const modifier = getScenarioModifier(state, challenge);
      const ruleName = translate(
        `scenario_${modifier.replace('-', '_')}`,
        language
      );
      const challengeType = language === 'zh-TW'
        ? {
          anomaly: '文化與時空異常',
          dialogue: '證詞與對話',
          decision: '資源與價值抉擇'
        }[challenge.type]
        : {
          anomaly: 'cultural and temporal anomaly',
          dialogue: 'testimony and dialogue',
          decision: 'resource and value decision'
        }[challenge.type];
      const variants = language === 'zh-TW'
        ? [
          `先看這一局的隱藏條件「${ruleName}」。這不是固定答案題；你要找的是最符合本局條件的行動，再檢查它會付出多少時間與車資。`,
          `這一站屬於「${challengeType}」。不要只判斷哪個選項看起來最善良，先比較它是否真的能處理眼前異常，以及是否符合「${ruleName}」。`,
          `你現在有 ${state.time} 小時、NT$ ${state.fare}。這一局的關鍵是「${ruleName}」；先從兩個方案各自保住了什麼、犧牲了什麼開始推理。`
        ]
        : [
          `Start with this run's hidden rule: “${ruleName}.” This is not a fixed-answer quiz. Find the action that fits the rule, then check its time and fare cost.`,
          `This station is a ${challengeType} challenge. Do not pick whichever choice merely sounds kinder; test whether it actually resolves the anomaly and fits “${ruleName}.”`,
          `You have ${state.time} hours and NT$ ${state.fare}. The key is “${ruleName}.” Compare what each plan protects and what it sacrifices.`
        ];
      return { intent, text: variants[turnIndex % variants.length] };
    }
    case 'resources':
      return {
        intent,
        text: language === 'zh-TW'
          ? `目前還有 ${state.time} 小時、NT$ ${state.fare}。時間低於 4 會錯過部分線索；車資歸零仍能搭基本路線，所以先看這一站真正要求你保住哪種資源。`
          : `You have ${state.time} hours and NT$ ${state.fare}. Below 4 hours, optional clues may disappear. Zero fare still unlocks a basic route, so protect the resource this station is testing.`
      };
    case 'location':
      return {
        intent,
        text: language === 'zh-TW'
          ? `現在停靠「${regionName}」。這裡的景色是真實地標，但異常與人物屬於列車創造的平行旅程。`
          : `We are at ${regionName}. The landmark is real; the anomaly and travelers belong to the train's parallel journey.`
      };
    case 'ticket':
      return {
        intent,
        text: language === 'zh-TW'
          ? state.secretTicket
            ? '秘密車票正在你身上。集滿六枚印章與六段記憶後，它會顯示一條地圖上不存在的海上支線。'
            : '秘密車票不會在固定位置出現。留意與「失物、約定、舊時刻表」有關的選擇；它通常藏在看似不划算的故事裡。'
          : state.secretTicket
            ? 'You carry the secret ticket. Six stamps and six memories will reveal a sea route absent from every map.'
            : 'The secret ticket has no fixed location. Watch choices involving lost objects, promises, and old timetables; it often hides inside an inefficient-looking story.'
      };
    case 'progress':
      return {
        intent,
        text: language === 'zh-TW'
          ? `你已收集 ${state.ticketStamps.length}/6 枚印章、${state.memoryFragments}/6 段記憶，也幫助了 ${state.helpedPassengers.length} 位旅客。`
          : `You have ${state.ticketStamps.length}/6 stamps, ${state.memoryFragments}/6 memories, and have helped ${state.helpedPassengers.length} travelers.`
      };
    case 'greeting':
      return {
        intent,
        text: language === 'zh-TW'
          ? `晚上好，旅人。我是這班列車的車長。你可以問我目前地點、資源、旅程進度，或請我分析這一站的線索。`
          : 'Good evening, traveler. I am the conductor. Ask about this location, your resources, progress, or the logic behind the current clue.'
      };
    case 'unknown':
      return {
        intent,
        text: language === 'zh-TW'
          ? '我聽見你的問題了，但車長室只能讀取這趟旅程的紀錄。試著問「這一站要注意什麼」、「我的資源夠嗎」或「秘密車票是什麼」。'
          : 'I heard you, but the conductor can only read this journey log. Try asking what matters at this station, whether your resources are enough, or what the secret ticket does.'
      };
  }
}

export type AgentMode = 'local' | 'nano' | 'cloud';

const GEMINI_MODEL = 'gemini-2.5-flash';
const FALLBACK_KEYS = [
  (import.meta as any).env?.VITE_GEMINI_API_KEY || '',
  (import.meta as any).env?.VITE_GEMINI_API_KEY_2 || '',
  (import.meta as any).env?.VITE_GEMINI_API_KEY_3 || ''
].filter(Boolean);

const CONDUCTOR_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'check_resources',
        description: "Retrieve the passenger's remaining resources (time in hours, and fare in NTD)."
      },
      {
        name: 'get_travel_progress',
        description: "Retrieve the passenger's current travel achievements, including collected stamp count, memory fragments count, and helped passengers count."
      }
    ]
  }
];

export async function detectAgentMode(userApiKey?: string | null): Promise<AgentMode> {
  if (typeof window !== 'undefined') {
    const aiObj = (window as any).ai || (window as any).chrome?.ai;
    if (aiObj && aiObj.languageModel) {
      try {
        const capabilities = await aiObj.languageModel.capabilities();
        if (capabilities.available !== 'no') {
          return 'nano';
        }
      } catch (e) {
        // ignore
      }
    }
  }

  if (userApiKey || FALLBACK_KEYS.length > 0) {
    return 'cloud';
  }

  return 'local';
}

export async function createConductorReplyAsync({
  input,
  state,
  challenge,
  language,
  turnIndex = 0,
  userApiKey
}: ConductorReplyInput & { userApiKey?: string | null }): Promise<ConductorReply> {
  const mode = await detectAgentMode(userApiKey);

  if (mode === 'local') {
    return createConductorReply({ input, state, challenge, language, turnIndex });
  }

  const regionName = translate(`region_${state.currentRegionId}_name`, language);
  const modifier = getScenarioModifier(state, challenge);
  const ruleName = translate(`scenario_${modifier.replace('-', '_')}`, language);
  const choiceTexts = challenge.choices.map((c) => translate(c.textId, language));

  const systemPrompt = language === 'zh-TW'
    ? `你是一輛台灣環島神秘列車上溫柔、親切且帶著一絲神祕感的「車長」。
請依據以下當前旅程狀態與這一站的異常，引導玩家思考。

【當前旅程狀態】
- 目前停靠站：${regionName}
- 剩餘時間：${state.time} 小時
- 剩餘車資：NT$ ${state.fare}
- 已收集印章：${state.ticketStamps.length}/6
- 已找回記憶：${state.memoryFragments}/6
- 秘密車票：${state.secretTicket ? '有，玩家已持有' : '無'}
- 當局隱藏條件：${ruleName}（指引玩家根據此條件做出時間/車資/記憶的取捨）

【當前車站異常與事件】
- 異常事件：${translate(challenge.hintTextId, language)}
- 玩家正面臨的抉擇選項包含：${choiceTexts.join('、')}

【車長守則】
1. 必須以「繁體中文」回覆。
2. 保持回答溫暖、簡短（最多 2 至 3 句話，總字數不超過 80 字），帶有列車長的沉穩語氣。每次回覆必須是完整的句子，絕不能中途截斷。
3. ★★ 絕對不能直接說出正確選項或答案文字，也不能複製選項中的文字。你只能提供推理引導。
4. 當玩家詢問提示、答案或要注意什麼時，請引導他思考「當局隱藏條件 (${ruleName})」與選項背後的代價。
5. 你可以使用提供的 Tool 來獲得即時最新的玩家時間、車資或旅程進度資訊。`
    : `You are the mysterious, gentle, and warm Conductor of a special round-island train in Taiwan.
Please guide the player using the current journey state and the anomaly at this station.

[Current Journey State]
- Current Station: ${regionName}
- Remaining Time: ${state.time} hours
- Remaining Fare: NT$ ${state.fare}
- Stamps collected: ${state.ticketStamps.length}/6
- Memories retrieved: ${state.memoryFragments}/6
- Secret Ticket: ${state.secretTicket ? 'Yes, the player carries it' : 'No'}
- Current Run Rule: ${ruleName} (guide player to prioritize resources/memories accordingly)

[Anomaly Details]
- Anomaly description: ${translate(challenge.hintTextId, language)}
- Player's choices text: ${choiceTexts.join(' OR ')}

[Conductor Rules]
1. You MUST reply in English.
2. Keep your replies concise and warm (max 2-3 sentences, under 80 words), using a calm conductor tone. Every reply must end with a complete sentence — never cut off mid-thought.
3. ★★ NEVER tell the correct option or answer directly. NEVER copy the text of any choices. You only provide reasoning guidance.
4. When asked for hints, help, or what to notice, guide the player to think about the run's rule ("${ruleName}") and the trade-offs of their resources.
5. You can call the provided Tools to fetch real-time passenger statistics, time, fare, or stamps.`

  try {
    let replyText = '';
    if (mode === 'nano') {
      replyText = await callLocalGeminiNano(systemPrompt, input);
    } else {
      let apiKey = userApiKey;
      if (!apiKey && FALLBACK_KEYS.length > 0) {
        apiKey = FALLBACK_KEYS[Math.floor(Math.random() * FALLBACK_KEYS.length)];
      }
      if (!apiKey) {
        throw new Error('No API Key available');
      }
      replyText = await callCloudGeminiAPI(systemPrompt, input, apiKey, state);
    }

    const intent = detectIntent(input);
    return { intent, text: replyText.trim() };
  } catch (error) {
    console.error('[Conductor Agent Error]:', error);
    return createConductorReply({ input, state, challenge, language, turnIndex });
  }
}

async function callLocalGeminiNano(systemPrompt: string, userPrompt: string): Promise<string> {
  const aiObj = (window as any).ai || (window as any).chrome?.ai;
  const session = await aiObj.languageModel.create({
    systemPrompt: systemPrompt
  });
  try {
    const result = await session.prompt(userPrompt);
    return result;
  } finally {
    session.destroy();
  }
}

async function callCloudGeminiAPI(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  state: GameState
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: userPrompt }]
    }
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      tools: CONDUCTOR_TOOLS,
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini Cloud API failed with status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const part = data.candidates?.[0]?.content?.parts?.[0];
  if (!part) {
    throw new Error('Empty response from Gemini Cloud API');
  }

  if (part.functionCall) {
    const { name: callName } = part.functionCall;

    let responseObj = {};
    if (callName === 'check_resources') {
      responseObj = { time: state.time, fare: state.fare };
    } else if (callName === 'get_travel_progress') {
      responseObj = {
        stamps: state.ticketStamps.length,
        memories: state.memoryFragments,
        helpedPassengers: state.helpedPassengers.length
      };
    }

    const secondContents = [
      ...contents,
      {
        role: 'model',
        parts: [part]
      },
      {
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: callName,
              response: responseObj
            }
          }
        ]
      }
    ];

    const secondResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: secondContents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        tools: CONDUCTOR_TOOLS,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });

    if (!secondResponse.ok) {
      const errText = await secondResponse.text();
      throw new Error(`Gemini API Tool-followup failed with status ${secondResponse.status}: ${errText}`);
    }

    const secondData = await secondResponse.json();
    const finalReply = secondData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!finalReply) {
      throw new Error('Empty final response after tool execution');
    }
    return finalReply;
  }

  if (part.text) {
    return part.text;
  }

  throw new Error('No text or functionCall returned from Gemini Cloud API');
}

