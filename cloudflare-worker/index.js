export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");
    let allowedOrigin = "";

    // CORS Origin 驗證安全機制 (限制只能由 GitHub Pages 及本地開發環境呼叫)
    if (origin) {
      if (
        origin === "https://anthea1003-bit.github.io" ||
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
      ) {
        allowedOrigin = origin;
      }
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin || "https://anthea1003-bit.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    };

    // 處理 CORS Preflight 預檢請求
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders
      });
    }

    // 取得 Worker 環境變數中配置 Graves API 金鑰
    const keys = [
      env.GEMINI_API_KEY,
      env.GEMINI_API_KEY_2,
      env.GEMINI_API_KEY_3
    ].filter(Boolean);

    if (keys.length === 0) {
      return new Response(
        JSON.stringify({ error: "No API keys configured on Worker" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // 隨機輪替金鑰，平均分配 Quota 負載
    const apiKey = keys[Math.floor(Math.random() * keys.length)];

    // 透明轉發至 Google Gemini 2.5 Flash API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
      const requestBody = await request.text();

      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: requestBody
      });

      const responseBody = await geminiResponse.text();

      // 返回代理響應，並附帶 CORS 標頭
      return new Response(responseBody, {
        status: geminiResponse.status,
        statusText: geminiResponse.statusText,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: `Worker Proxy Error: ${err.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  }
};
