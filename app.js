
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){alert('Браузерде сақтау қолжетімсіз');return false}};
const load=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
document.querySelectorAll('.nav a').forEach(a=>{if(a.getAttribute('href')===location.pathname.split('/').pop()||(location.pathname.endsWith('/')&&a.getAttribute('href')==='index.html'))a.classList.add('active')});
function badge(x){return `<span class="status ${x==='Расталмады'||x==='Ғылыми пікірталас бар'?'orange':x==='Қате'?'red':''}">${esc(x)}</span>`}
function drawArchive(){if(!$('archiveList'))return;const q=($('search')?.value||'').toLowerCase();const filtered=RECORDS.filter(r=>r.join(' ').toLowerCase().includes(q));$('archiveList').innerHTML=filtered.map(r=>`<article class="card"><span class="tag">ТАРИХИ КАРТОЧКА</span><h3>${esc(r[0])}</h3>${badge(r[2])}<p>${esc(r[1])}</p><small class="muted">Дерек: ${esc(r[3])}</small></article>`).join('')||'<p>Сәйкес карточка табылмады.</p>'}
drawArchive();
function checkClaim(){const s=$('claim').value.trim();if(!s){$('checkResult').innerHTML='<p>Тұжырым енгізіңіз.</p>';return}
const t=s.toLowerCase(), scored=RECORDS.map((r,i)=>{let score=0;const text=(r[0]+' '+r[1]).toLowerCase();for(const w of t.split(/[^\p{L}\p{N}]+/u).filter(x=>x.length>3)){if(text.includes(w))score++}return {r,i,score}}).sort((a,b)=>b.score-a.score);
const matches=scored.filter(x=>x.score>0).slice(0,3);
$('checkResult').innerHTML=matches.length?'<p class="muted">Ұқсас тақырыптар табылды. Бұл сәйкестік автоматты растау емес.</p>'+matches.map(({r})=>`<div class="record"><h3>${esc(r[0])}</h3>${badge(r[2])}<p>${esc(r[1])}</p><small>Дерек: ${esc(r[3])}</small></div>`).join(''):'<p>Деректер қорынан тікелей ұқсастық табылмады. Дереккөзді өзің тексер және STOP-факт зертханасын қолдан.</p>';
}
function compareDemo(){$('answerA').value='Қазақ хандығы 1465–1466 жылдары құрылды. Оның негізін Керей мен Жәнібек қалады.';$('answerB').value='Қазақ хандығы 1465 жылы 15 мамырда құрылды. Керей мен Жәнібек Моғолстанға көшті.'}
function compareAnswers(){const a=$('answerA').value.trim(),b=$('answerB').value.trim();if(!a||!b){alert('Екі жауапты да енгіз.');return}
const split=s=>s.split(/(?<=[.!?])\s+/u).map(x=>x.trim()).filter(Boolean),aa=split(a),bb=split(b);
const el=$('compareResult');el.classList.remove('hidden');el.innerHTML=`<h2>Тұжырымдарды жеке тексер</h2><p>ЖИ-1: ${aa.length} сөйлем · ЖИ-2: ${bb.length} сөйлем</p><div class="grid two"><div>${aa.map(x=>`<div class="record">${esc(x)}</div>`).join('')}</div><div>${bb.map(x=>`<div class="record">${esc(x)}</div>`).join('')}</div></div><div class="notice">Сөйлемдердің бөлінуі ғана автоматтандырылған. Мағыналық ұқсастық пен тарихи дәлдік қолмен тексеріледі.</div>`}
function saveComparison(){const note=$('comparisonNote').value.trim();if(!note){alert('Алдымен қорытынды жаз.');return}store('tc_comparison',{a:$('answerA').value,b:$('answerB').value,note});$('comparisonSaved').textContent='✓ Қорытынды осы браузерде сақталды.'}
if($('comparisonNote')){const x=load('tc_comparison',{});if(x.note){$('answerA').value=x.a;$('answerB').value=x.b;$('comparisonNote').value=x.note}}
function saveLab(){const fields=['labClaim','labSource','labTime','labOther','labPosition','labStatus','labReason'];const obj=Object.fromEntries(fields.map(id=>[id,$(id).value.trim()]));if(!obj.labClaim||!obj.labReason){alert('Тұжырым мен дәлелді қорытындыны толтыр.');return}obj.date=new Date().toLocaleString('kk-KZ');const d=load('tc_lab');d.unshift(obj);if(store('tc_lab',d))drawLab()}
function drawLab(){if(!$('labHistory'))return;const d=load('tc_lab');$('labHistory').innerHTML=d.length?d.map(x=>`<div class="record"><span class="tag">${esc(x.date)}</span><h3>${esc(x.labClaim)}</h3>${badge(x.labStatus)}<p>${esc(x.labReason)}</p><small class="muted">S: ${esc(x.labSource)} · T: ${esc(x.labTime)} · O: ${esc(x.labOther)} · P: ${esc(x.labPosition)}</small></div>`).join(''):'<p class="muted">Әзірге зерттеу жазбасы жоқ.</p>'}
drawLab();
function exportLab(){const d=load('tc_lab');if(!d.length){alert('Алдымен зерттеу сақта.');return}const text=d.map((x,i)=>`${i+1}. ${x.labClaim}\nS: ${x.labSource}\nT: ${x.labTime}\nO: ${x.labOther}\nP: ${x.labPosition}\nМәртебе: ${x.labStatus}\nҚорытынды: ${x.labReason}\nКүні: ${x.date}`).join('\n\n');const url=URL.createObjectURL(new Blob(['TARIHCHECK — ЗЕРТТЕУ ЖУРНАЛЫ\n\n'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='TarihCheck_zertteu.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
const questions=[
['Тарихи дереккөзді тексерудегі бірінші сұрақ қандай?',['Ол қаншалықты ұзын?','Авторы кім және қайдан алынған?','Ол интернетте танымал ма?'],1,'Алдымен деректің авторы мен шығу тегін анықта.'],
['STOP-факт әдісіндегі T нені білдіреді?',['Уақытты тексеру','Тек тақырыпты оқу','Тест тапсыру'],0,'T — Time, уақыт пен кезеңді салыстыру.'],
['Қазақ хандығының негізін қалағандар кімдер?',['Керей мен Жәнібек','Абылай мен Кенесары','Тәуке мен Қасым'],0,'Жобада Керей мен Жәнібек көрсетіледі.'],
['«Қазақ хандығы 15 мамырда құрылды» деген нақты күнге дәлел табылмаса?',['Міндетті түрде қате','Расталмады деп белгілеу','Бірден растау'],1,'Дәлел табылмауы автоматты түрде қатені білдірмейді.'],
['O — Other source нені сұрайды?',['Басқа тәуелсіз дерек растай ма?','Оқушының жасы қанша?','Оқиға әдемі ме?'],0,'Екінші тәуелсіз дерек маңызды.'],
['ЖИ дереккөз ретінде кітап атауын берсе, не істейміз?',['Бірден сенеміз','Кітап пен айтылған мәліметті тексереміз','Жауапты көшіріп аламыз'],1,'Дереккөздің өзі де ойдан құрастырылуы мүмкін.'],
['Тарихшының түсіндіруі әртүрлі болса, қандай мәртебе орынды?',['Ғылыми пікірталас бар','Әрқашан қате','Әрқашан расталды'],0,'Тарихи интерпретациялар бір-бірінен ерекшеленуі мүмкін.'],
['ЖИ жауабында екі бөлек тұжырым болса?',['Екеуін бірден растаймыз','Әр тұжырымды жеке тексереміз','Тек бірінші сөйлемді оқимыз'],1,'Бір сөйлемнің ішінде бірнеше жеке тексерілетін тұжырым болуы мүмкін.']
];let qi=0,points=0,answered=false;
function drawQuiz(){if(!$('quizQuestion'))return;if(qi>=questions.length){$('quizCount').textContent='ТЕСТ АЯҚТАЛДЫ';$('quizQuestion').textContent=`Нәтиже: ${points} / ${questions.length}`;$('quizChoices').innerHTML='<p>Тарихи деректі тексеруді жалғастыр!</p>';$('quizNext').textContent='Қайта бастау ↻';$('quizNext').classList.remove('hidden');$('quizProgress').style.width='100%';store('tc_quiz',{points,total:questions.length});return}
const q=questions[qi];answered=false;$('quizCount').textContent=`${qi+1} / ${questions.length} СҰРАҚ`;$('quizQuestion').textContent=q[0];$('quizChoices').innerHTML=q[1].map((x,i)=>`<button class="choice" onclick="answerQuiz(${i})">${esc(x)}</button>`).join('');$('quizFeedback').textContent='';$('quizNext').classList.add('hidden');$('quizNext').textContent='Келесі сұрақ →';$('quizProgress').style.width=(qi/questions.length*100)+'%'}
function answerQuiz(i){if(answered)return;answered=true;const q=questions[qi];if(i===q[2])points++;document.querySelectorAll('.choice').forEach((b,j)=>{b.disabled=true;if(j===q[2])b.classList.add('selected')});$('quizFeedback').textContent=(i===q[2]?'✓ Дұрыс! ':'Дұрыс жауап белгіленді. ')+q[3];$('quizNext').classList.remove('hidden')}
function nextQuiz(){if(qi>=questions.length){qi=0;points=0}else qi++;drawQuiz()}drawQuiz();
function makePrompt(){const q=$('aiQuestion').value.trim();if(!q){alert('Тарихи сұрақ енгіз.');return}$('aiOutput').value=`Сен тарихи деректерді сыни бағалауға көмектесетін зерттеу ассистентісің. Сұрақ: «${q}».\n\n1. Жауаптағы әрбір тарихи тұжырымды жеке нөмірле.\n2. Әр тұжырым үшін нақты тексеруге болатын бастапқы дереккөздерді көрсет; ойдан сілтеме жасама.\n3. STOP-факт бойынша талда: S — дереккөз, T — уақыт, O — тәуелсіз екінші дерек, P — факт/ғылыми пікір.\n4. Нақты дәлел жеткіліксіз болса, «расталмады» деп ашық жаз.\n5. Тарихшылардың көзқарасы әртүрлі болса, «ғылыми пікірталас бар» деп белгіле.\n6. Дереккөзді өз бетімше қалай тексеруге болатынын түсіндір.\n7. Соңында қысқа кесте бер: тұжырым | дерек | мәртебе | қосымша тексеру.\n\nЕскерту: дереккөздеріңді өзім тәуелсіз тексеремін.`}
async function copyPrompt(){const t=$('aiOutput').value;if(!t){alert('Алдымен промпт жаса.');return}try{await navigator.clipboard.writeText(t);$('copyMsg').textContent='✓ Көшірілді'}catch(e){$('aiOutput').select();$('copyMsg').textContent='Мәтін белгіленді — қолмен көшір.'}}
function drawCharts(){[['chart1',[16,4,3,1]],['chart2',[15,4,3,2]]].forEach(([id,v])=>{if(!$(id))return;const labels=['Расталды','Пікірталас','Расталмады','Қате'];$(id).innerHTML=v.map((n,i)=>`<div class="barcol"><strong>${n}</strong><div class="fill" style="height:${n/24*170}px"></div><span>${labels[i]}</span></div>`).join('')})}drawCharts();


async function askLiveAI(){
 const input=document.getElementById('liveQuestion'), state=document.getElementById('liveState');
 const conversation=document.getElementById('liveConversation');
 const q=input.value.trim();if(!q)return;
 const button=document.getElementById('liveButton');button.disabled=true;state.textContent='ЖИ жауап дайындауда...';
 const user=document.createElement('div');user.className='record';
 const heading=document.createElement('strong');heading.textContent='Сіз';
 const para=document.createElement('p');para.textContent=q;user.append(heading,para);conversation.append(user);
 try {const answer=await askTarihAI(q,{mode:'chat'});const bot=document.createElement('div');bot.className='record';const title=document.createElement('strong');title.textContent='✧ TarihCheck AI';const text=document.createElement('p');text.style.whiteSpace='pre-wrap';text.textContent=answer;bot.append(title,text);conversation.append(bot);state.textContent='✓ Жауап алынды. Деректерді тексеріңіз.';input.value='';}
 catch(e){state.textContent='AI қатесі: '+e.message;}finally{button.disabled=false;}
}
async function analyzeWithAI(mode){
 const fields={check:['claim'],compare:['answerA','answerB'],lab:['labClaim','labSource','labTime','labOther','labPosition','labStatus','labReason']}[mode]||[];
 const context=fields.map(id=>{const el=document.getElementById(id);return el?`${id}: ${el.value}`:''}).filter(Boolean).join('\n');
 const output=document.getElementById('aiAnalysis');output.style.display='block';
 if(!context.trim()){output.textContent='Алдымен зерттеу мәтінін енгіз.';return;}
 output.textContent='✧ ЖИ талдауда...';
 const questions={check:'Осы тарихи тұжырымды STOP-факт әдісімен талда. Қандай дереккөздерді тексеру қажет?',compare:'Екі жауапты салыстыр. Қай мәлімет күмәнді және оны қалай тексереміз?',lab:'STOP-факт паспортындағы дәлелдер мен қорытындыны сыни бағала. Қандай олқылықтар бар?'};
 try{output.textContent=await askTarihAI(questions[mode],{mode,context})}catch(e){output.textContent='AI қатесі: '+e.message}
}
