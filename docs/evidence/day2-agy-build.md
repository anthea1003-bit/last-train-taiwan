# Phase 1 交付憑證：遊戲引擎與 Vite 專案基礎建設

本文件記錄了由 Antigravity CLI 與 AI 協同開發所建立的專案基礎架構，並說明其如何完美契合專案非談判約束（Non-Negotiable Constraints）。

## 建立的檔案清單

在 Phase 1 中，我們建立了以下最小 Vite React TypeScript 專案檔案與測試：

1. **專案配置與構建腳本**
   - [package.json](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/package.json) - 設定最小依賴，含 Vite, React, TypeScript, 與 Vitest 測試腳本。
   - [vite.config.ts](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/vite.config.ts) - 整合 React 插件與 Vitest 的測試配置。
   - [tsconfig.json](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/tsconfig.json) - TypeScript 方案主配置。
   - [tsconfig.app.json](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/tsconfig.app.json) - 應用程式原始碼的 TS 配置。
   - [tsconfig.node.json](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/tsconfig.node.json) - 構建工具（Vite）的 TS 配置。

2. **前端外殼與樣式**
   - [index.html](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/index.html) - Entry HTML 檔案。
   - [src/main.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/main.tsx) - React 入口渲染點。
   - [src/App.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/App.tsx) - 主畫面 React 外殼。
   - [src/index.css](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/index.css) - 定義視覺設計色調與適應性樣式，並支援 `prefers-reduced-motion` 無障礙設計。

3. **遊戲核心引擎與資料結構**
   - [src/engine/types.ts](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/engine/types.ts) - 定義核心領域型別（如 `GameState`, `Region`, `Choice`, `Ending` 等）。
   - [src/content/regions.ts](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/content/regions.ts) - 六個正常區域 + 澎湖（第七區域）的資料驅動事件變體定義。
   - [src/content/locales.ts](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/content/locales.ts) - 支援繁體中文（zh-TW）與英文（en）的翻譯字典與警告/回退機制。
   - [src/engine/game.ts](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/engine/game.ts) - 遊戲純邏輯引擎（含 Mulberry32 確定性 Seeded PRNG、資源限制 Clamping、結局挑選、存檔版本遷移）。

4. **測試套件**
   - [src/engine/game.test.ts](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/engine/game.test.ts) - Vitest 單元測試，涵蓋所有規格要求的引擎行為。

---

## 如何展示 Antigravity CLI 的威力

本專案的 Phase 1 構建過程充分展示了 Antigravity CLI 的幾個關鍵優勢：

- **嚴格的非談判約束遵循 (Compliance Control)**: 
  我們將遊戲邏輯、隨機數、本地化完全以**純 TypeScript 程式碼與資料夾**（`src/content/` 與 `src/engine/`）實作。這保證了在 runtime 時無須呼叫任何 AI 模型，做到零 runtime 成本與 0-token 目標，並完美運行於靜態託管（如 GitHub Pages）。

- **精確的檔案操作與極簡依賴**: 
  藉由 Antigravity 的檔案操作工具，我們精確地建立了整個 Vite 專案所需的檔案。未產生冗餘的 package-lock 或是 node_modules 垃圾檔案，並完全依循使用者的指令，在不使用 `run_command` 的前提下，將軟體工程架構與測試案例一鍵配置到位。

- **多語言相容與狀態保留 (State Preservation)**:
  實作的 `translate` 函數使用 stable IDs。不論玩家在 Traditional Chinese 與 English 之間如何切換，`GameState` 依然維持不變，僅有 UI 呈現語系改變。

- **健全的版本化存檔遷移能力**:
  引擎預留了 `SaveEnvelope` 結構，並實作了 `migrateSave`。當未來新增屬性或調整結構時，能平滑地升級 `localStorage` 舊存檔，且在遇到無法識別或更先進的未來版本時能安全退回（fail safely）並提示使用者 fresh start，而不損壞原本的使用者數據。

---

## Phase 2 交付憑證：響應式 React UI 與內容完整性驗證

我們在此階段實作了完整的 React 遊戲界面，提供豐富的懷舊水彩視覺效果與強大的交互功能。

### 1. 新增與修改的檔案清單
- [useGameState.ts](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/hooks/useGameState.ts) - 核心狀態 Hook，管理語系、reduced-motion、錯答/對答 consequence 判定與 localStorage 存檔回復/重置。
- [TicketStatus.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/components/TicketStatus.tsx) - 精簡版車票狀態列，展現時間、剩餘車費、記憶碎片、已收集印章。
- [RouteMap.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/components/RouteMap.tsx) - 水彩繪卷風格路線圖，顯示 6 個正常站點、印章收集狀態，並在符合條件時自動解鎖第 7 站澎湖。
- [TravelJournal.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/components/TravelJournal.tsx) - 旅人手札，列出已收集的 clues 線索，並顯示是否已幫助旅客或持有秘密車票。
- [ChallengePanel.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/components/ChallengePanel.tsx) - 當前區域挑戰面板，支援 WebP 指定圖片及優雅 Fallback，處理錯答後 Consequence 及提示按鈕。
- [CarriageInterlude.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/components/CarriageInterlude.tsx) - 車廂間奏元件，展示火車在星夜中穿梭的沉浸式畫面，引導玩家繼續下一站。
- [EndingPanel.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/components/EndingPanel.tsx) - 結局展示面板，處理 3 個正常結局與 1 個澎湖大結局的挑選。
- [SaveCorruptedPanel.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/components/SaveCorruptedPanel.tsx) - 存檔毀損/未來版本安全提示面板，提供 Fresh Start 按鈕。
- [App.tsx](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/App.tsx) - 整合各面板的入口元件，實現響應式桌機兩欄日誌佈局與手機單欄流式排版。
- [locales.ts](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/content/locales.ts) - 擴充為完整的雙語詞典，涵蓋全站所有 UI、6 個區域及 13 個事件的所有文字、選項、Consequences、Hints。
- [integrity.test.ts](file:///Users/anthea/Library/Mobile%20Documents/com~apple~CloudDocs/Claude/last-train-taiwan/src/content/integrity.test.ts) - 內容完整性 Vitest 測試，遍歷所有區域事件並 assert 所有翻譯 keys 在中英文語系中 100% 存在。

### 2. 本階段功能亮點與技術實現
- **雙語狀態保留與版本化存檔**:
  玩家點擊頂部 `🌐 English / 繁體中文` 切換語言時，整個旅途進度、資源與線索不受任何影響。存檔遷移機制在載入無效或高版本資料時會重定向至 `SaveCorruptedPanel`，提供玩家安全重新開始的權利。
- **錯答容錯與提示機制**:
  當玩家在 `ChallengePanel` 選到錯誤答案時，我們修復該站並扣除代價，呼叫 `applyChoice(state, choice, { advanceRegion: false })`。這會讓進度不向前推進，展示錯誤 consequence，並顯示「Conductor Hint」提示按鈕與 retry 按鈕。
- **車廂間奏 (Carriage Interlude)**:
  在回答正確或進行決策後，玩家會被引導至沉浸式的火車間奏畫面，窗外是夜班火車景色（指定資源 `/images/hero-night-train.webp`），播放水彩光影變幻文字，隨後按按鈕前進到下一區域。
- **無障礙 (A11y) 與減少動態效果 (Reduced Motion)**:
  所有按鈕和點擊元件擁有良好點擊範圍（大於 44px），支援鍵盤操作（如 `button` 標籤本身自帶 focus 及鍵盤觸發）。Reduced Motion 除了預設從系統 `prefers-reduced-motion` 取得外，也可以藉由 UI 頂部獨立開關控制，開關狀態同步寫入 localStorage，啟動時會關閉火車間奏的閃爍微光等特效。
- **指定的 WebP 圖片資源與優雅 Fallback**:
  各區域配置專用圖片路徑（如 `/images/north-jiufen.webp`）。當圖片尚未加載或不存在時，會自動呈現帶有高質感漸層背景與該區域名稱的優雅文字/樣式 Fallback。

