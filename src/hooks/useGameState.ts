import { useState, useEffect } from 'react';
import {
  GameState,
  Choice,
  Language,
  ChoiceRewardSummary
} from '../engine/types';
import {
  initGame,
  applyChoice,
  serializeSave,
  migrateSave,
  getChoiceRewardSummary
} from '../engine/game';
import { REGIONS } from '../content/regions';

const SAVE_KEY = 'last-impossible-train-save';
const LANG_KEY = 'last-impossible-train-lang';
const MOTION_KEY = 'last-impossible-train-motion';

export type GamePhase = 'title' | 'playing' | 'interlude' | 'ending' | 'corrupted';

export function useGameState() {
  const [state, setState] = useState<GameState | null>(null);
  const [phase, setPhase] = useState<GamePhase>('title');
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isSaveCorrupted, setIsSaveCorrupted] = useState<boolean>(false);
  
  // 答錯時的狀態暫存
  const [wrongConsequence, setWrongConsequence] = useState<{
    consequenceTextId: string;
    hintTextId: string;
  } | null>(null);

  // 當前答對或決策後的 Consequence (進入 interlude 時展示)
  const [successConsequence, setSuccessConsequence] = useState<string | null>(null);
  const [successReward, setSuccessReward] = useState<ChoiceRewardSummary | null>(null);

  // 初始化載入語系、Reduced Motion 設定與檢查存檔狀態
  useEffect(() => {
    // 1. 語系
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang === 'en' || savedLang === 'zh-TW') {
      setLanguage(savedLang);
    }

    // 2. Reduced Motion
    const savedMotion = localStorage.getItem(MOTION_KEY);
    if (savedMotion !== null) {
      setReducedMotion(savedMotion === 'true');
    } else {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setReducedMotion(prefersReduced);
    }

    // 3. 檢查存檔是否毀損
    const rawSave = localStorage.getItem(SAVE_KEY);
    if (rawSave) {
      const migrated = migrateSave(rawSave);
      if (migrated === null) {
        setIsSaveCorrupted(true);
        setPhase('corrupted');
      }
    }
  }, []);

  // 監聽並將 reducedMotion 寫入 localStorage
  const changeReducedMotion = (val: boolean) => {
    setReducedMotion(val);
    localStorage.setItem(MOTION_KEY, String(val));
  };

  // 監聽並將 language 寫入 localStorage
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(LANG_KEY, lang);
  };

  // 開始新遊戲
  const startNewGame = (seed?: string) => {
    const gameSeed = seed || Math.random().toString(36).substring(2, 9);
    const newState = initGame(gameSeed);
    setState(newState);
    setPhase('playing');
    setWrongConsequence(null);
    setSuccessConsequence(null);
    setSuccessReward(null);
    setIsSaveCorrupted(false);
    localStorage.setItem(SAVE_KEY, serializeSave(newState));
  };

  // 載入繼續遊戲
  const resumeGame = (): boolean => {
    const rawSave = localStorage.getItem(SAVE_KEY);
    if (!rawSave) return false;
    const restored = migrateSave(rawSave);
    if (restored) {
      setState(restored);
      setWrongConsequence(null);
      setSuccessConsequence(null);
      setSuccessReward(null);
      // migrateSave 也會校正三項條件齊全、卻誤停在普通結局的舊狀態。
      localStorage.setItem(SAVE_KEY, serializeSave(restored));
      if (restored.isCompleted) {
        setPhase('ending');
      } else {
        setPhase('playing');
      }
      return true;
    } else {
      setIsSaveCorrupted(true);
      setPhase('corrupted');
      return false;
    }
  };

  // 判斷是否有存檔
  const hasSave = (): boolean => {
    const rawSave = localStorage.getItem(SAVE_KEY);
    if (!rawSave) return false;
    // 如果是毀損的存檔，不算是有用的存檔，但我們依然會依據 isSaveCorrupted 顯示 Corrupted Panel
    return !isSaveCorrupted;
  };

  // 處理玩家選擇
  const handleChoice = (choice: Choice, isCorrect: boolean) => {
    if (!state) return;

    if (!isCorrect) {
      // 答錯了，調用 applyChoice，進度不推進
      const nextState = applyChoice(state, choice, { advanceRegion: false });
      setState(nextState);
      setWrongConsequence({
        consequenceTextId: choice.consequenceTextId,
        hintTextId: state.currentEventId 
          ? getActiveChallengeHint(state.currentRegionId, state.currentEventId) 
          : 'north_chall_1_hint'
      });
      // 儲存狀態
      localStorage.setItem(SAVE_KEY, serializeSave(nextState));
    } else {
      // 答對或決策型選項，套用並進入車廂間奏
      const nextState = applyChoice(state, choice, { advanceRegion: true });
      // 我們不直接變更畫面為 nextState，而是先把 state 更新，但把畫面切入 interlude 階段
      // 在 interlude 階段，我們展示此 choice 的 consequenceTextId
      setSuccessConsequence(choice.consequenceTextId);
      setSuccessReward(getChoiceRewardSummary(state, choice, nextState));
      setState(nextState);
      setWrongConsequence(null);
      setPhase('interlude');
      // 儲存新狀態
      localStorage.setItem(SAVE_KEY, serializeSave(nextState));
    }
  };

  // 離開間奏，進入下一個區域
  const dismissInterlude = () => {
    if (!state) return;
    setSuccessConsequence(null);
    setSuccessReward(null);
    if (state.isCompleted) {
      setPhase('ending');
    } else {
      setPhase('playing');
    }
  };

  // 選擇結局
  const selectEnding = (endingId: string) => {
    if (!state) return;
    const nextState = { ...state, selectedEnding: endingId };
    setState(nextState);
    localStorage.setItem(SAVE_KEY, serializeSave(nextState));
  };

  // 重新開始遊戲（回到主選單或重設）
  const restartGame = () => {
    setState(null);
    setPhase('title');
    setWrongConsequence(null);
    setSuccessConsequence(null);
    setSuccessReward(null);
  };

  // 毀損存檔的 Fresh Start
  const freshStart = () => {
    localStorage.removeItem(SAVE_KEY);
    setIsSaveCorrupted(false);
    startNewGame();
  };

  // 輔助函式：取得目前挑戰的提示
  const getActiveChallengeHint = (regionId: string, eventId: string): string => {
    const region = REGIONS.find((r) => r.id === regionId);
    const event = region?.events.find((e) => e.id === eventId);
    return event?.challenge.hintTextId || 'north_chall_1_hint';
  };

  return {
    state,
    phase,
    language,
    reducedMotion,
    isSaveCorrupted,
    wrongConsequence,
    successConsequence,
    successReward,
    setLanguage: changeLanguage,
    setReducedMotion: changeReducedMotion,
    startNewGame,
    resumeGame,
    hasSave,
    handleChoice,
    dismissInterlude,
    selectEnding,
    restartGame,
    freshStart,
    clearWrongConsequence: () => setWrongConsequence(null)
  };
}
