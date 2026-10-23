// Set this ONCE after deploying the NEW dedicated Cloudflare Worker.
// Example value must be your real URL, never a made-up address.
const AI_API_URL = "https://tarihcheck-ai-new.vp5vy7g7db.workers.dev";
async function askTarihAI(question, options = {}) {
  if (!AI_API_URL.startsWith("https://")) throw new Error("AI серверінің URL-і сайт иесі тарапынан әлі орнатылмаған.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(AI_API_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: String(question).slice(0, 1800),
        context: String(options.context || "").slice(0, 2400),
        lang: localStorage.getItem("tc_lang") || "kk", mode: options.mode || "chat" }),
      signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    return data.answer;
  } finally { clearTimeout(timeout); }
}
