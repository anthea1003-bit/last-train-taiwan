# Last Train Taiwan - Gemini API Cloudflare Worker Proxy

這個目錄包含了一個輕量型的 **Cloudflare Worker**，用來當作前端與 Google Gemini API 之間的安全代理人（API Proxy）。它能將 API 金鑰安全地儲存在 Cloudflare 後端，並在轉發請求時進行金鑰隨機輪替，同時防止金鑰在前端 JavaScript 中曝光。

## 🚀 部署步驟

### 1. 準備工具
請確保您已安裝 Node.js。在終端機中，切換到本目錄並安裝 `wrangler` 工具：
```bash
npm install -g wrangler
```

### 2. 登入 Cloudflare
執行以下指令，它會打開瀏覽器讓您登入您的 Cloudflare 帳號（若無帳號可免費註冊，每天享有 10 萬次免費請求額度）：
```bash
wrangler login
```

### 3. 部署 Worker
在終端機中執行部署命令：
```bash
wrangler deploy
```
部署成功後，終端機會輸出您的 Worker 網址，例如：
`https://last-train-gemini-proxy.<您的子網域>.workers.dev`

### 4. 設定 API 金鑰 Secrets
為了讓 Worker 能成功代理，您需要將三組 Gemini API 金鑰上傳到 Cloudflare Secrets（安全環境變數）中。

在終端機中執行以下指令（系統會提示您輸入金鑰內容）：
```bash
wrangler secret put GEMINI_API_KEY
wrangler secret put GEMINI_API_KEY_2
wrangler secret put GEMINI_API_KEY_3
```
*提示：您可以配置一至三組金鑰。沒設定的環境變數會自動被過濾。*

---

## 🛠️ 前端專案設定

當您部署好 Worker 並取得網址後，請在您的前端專案中配置它：

### 1. 本地開發環境
在前端專案根目錄的 `.env.local` 檔案中加入：
```env
VITE_WORKER_URL=https://last-train-gemini-proxy.<您的子網域>.workers.dev
```

### 2. 生產環境 (GitHub Pages)
請在 GitHub 儲存庫的 **Settings > Secrets and variables > Actions** 中：
* 新增一個 Secret：名稱為 `VITE_WORKER_URL`，值為您的 Worker 網址。
* 此時您可以安全地移除舊有的 `VITE_GEMINI_API_KEY*` Secrets，達成前端金鑰「零暴露」！
