# TarihCheck — GitHub Pages + Cloudflare Workers AI

## A. ЖАҢА Cloudflare Worker (басқа жобалардың Worker-ін қолданбаңыз)
1. Cloudflare Dashboard → Workers & Pages → Create Worker → атауы `tarihcheck-ai-new` (егер бос болмаса басқа ЖАҢА атау).
2. `worker.js` мазмұнын жаңа Worker редакторына салыңыз және Deploy жасаңыз.
3. Settings → Bindings → Add binding → **Workers AI** → Variable name **AI** → Save/Deploy.
   Балама: `wrangler.jsonc` ішіндегі `"ai":{"binding":"AI"}` және `npx wrangler deploy`.
4. ЖАҢА Worker-дің нақты `https://...workers.dev` URL-ін Cloudflare-ден көшіріңіз.
5. `ai-client.js` файлының **3-жолындағы** `const AI_API_URL = "ЖАҢА_CLOUDFLARE_WORKER_URL";` мәнін жаңа Worker-дің нақты URL-іне ауыстырыңыз. Тек осы жерде өзгерту керек.
6. GitHub репозиторийінің түбіріне сайт файлдарын түгел салыңыз; **worker.js** және **wrangler.jsonc** файлдарын GitHub Pages сайтында орналастыру міндетті емес. Pages Settings → Deploy from branch → main / root.
7. `assistant.html` бетінен сұрақ қойып тексеріңіз. `check.html`, `compare.html`, `lab.html` беттерінде де AI талдауы бар.

## Шектеулер мен қауіпсіздік
- API кілті талап етілмейді: Cloudflare Workers AI binding пайдаланылады.
- Cloudflare Workers AI тегін күндік квотасы бар, бірақ шексіз тегін емес.
- `Access-Control-Allow-Origin` GitHub Pages доменіне байланған. **CORS авторизация емес**; ашық Worker-ді басқа клиенттер де шақыруы мүмкін. Көпшілікке жариялаудан бұрын Cloudflare rate limiting, WAF және abuse protection баптаңыз.
- AI тарихи фактілерді тәуелсіз тексермейді, тірі веб іздеуі жоқ.
- Үш тілге ауыстыру интерфейстің негізгі бөлігінде бар, барлық контент толық аударылмаған.
- Worker URL әлі нақты белгісіз, сондықтан дайын архивте placeholder тұр. URL енгізілгеннен кейін пайдаланушылар ешқандай баптау жасамайды.
