"use strict";
const dbs=Array.isArray(window.QUIZ_DB)?window.QUIZ_DB:[];
// 문제집 제목 기준 정렬
dbs.sort((a, b) =>
  String(a?.title || a?.file || "").localeCompare(
    String(b?.title || b?.file || ""),
    "ko",
    {
      numeric: true,
      sensitivity: "base"
    }
  )
);
let disposeCurrent=null, loadingDb=false, loadedScript=null;
// categories 배열을 우선 사용하며, 기존 category 문자열/배열도 지원합니다.
function getCategories(db){
  const source=db.categories ?? db.category;
  const values=(Array.isArray(source)?source:[source])
    .filter(value=>typeof value==="string").map(value=>value.trim()).filter(Boolean);
  return values.length?[...new Set(values)]:["미분류"];
}
function getStorageKey(db){
  const key=typeof db.storageKey==="string"?db.storageKey.trim():"";
  return "quiz_db_v3:"+encodeURIComponent(key||db.file);
}
function resultFilename(db){
  // title을 파일명으로 사용하되 OS에서 허용하지 않는 문자만 치환합니다.
  const title=(typeof db.title==="string"?db.title.trim():"")||db.file.replace(/\.js$/i,"")||"학습 결과";
  const safe=title.replace(/[<>:"/\\\\|?*\u0000-\u001f\u007f]/g,"_").replace(/[. ]+$/g,"")||"학습 결과";
  const name=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(safe)?"_"+safe:safe;
  return name+".txt";
}
const el=id=>document.getElementById(id);
function showSelection(){
  if(loadingDb)return;
  if(disposeCurrent){disposeCurrent();disposeCurrent=null;}
  el("quizView").hidden=true;
  el("dbPicker").hidden=false;
  el("quizTitle").textContent="문제집 선택";
  el("quizEyebrow").textContent="QUESTION DB / SELECT";
  el("quizSubtitle").textContent="풀고 싶은 문제 DB를 선택하세요. 풀이 상태는 문제집별로 따로 저장됩니다.";
  el("quizChips").replaceChildren();
  document.title="문제집 선택";
  drawDbs();
  window.scrollTo({top:0,behavior:"instant"});
  el("dbHeading").focus({preventScroll:true});
}
function initCategories(){
  const select=el("categoryFilter");
  select.replaceChildren();
  const allOption=document.createElement("option");
  allOption.value="";allOption.textContent="전체 카테고리";
  select.appendChild(allOption);
  const categories=[...new Set(dbs
    .filter(db=>db&&typeof db.file==="string")
    .flatMap(getCategories))];
  categories.sort((a, b) =>
    a.localeCompare(b, "ko", {
    numeric: true,
    sensitivity: "base"
    })
  );
  categories.forEach(category=>{
    const option=document.createElement("option");
    option.value=category;option.textContent=category;
    select.appendChild(option);
  });
  select.onchange=()=>{if(!loadingDb)drawDbs();};
}
function drawDbs(){
  const selectedCategory=el("categoryFilter").value;
  el("dbList").replaceChildren();
  el("dbStatus").textContent="";
  let total=0;
  dbs.forEach((db,index)=>{
    if(!db||typeof db.file!=="string")return;
    total++;
    const categories=getCategories(db);
    if(selectedCategory&&!categories.includes(selectedCategory))return;
    const card=document.createElement("article");card.className="db-card";
    const badges=document.createElement("div");badges.className="db-categories";
    categories.forEach(category=>{
      const badge=document.createElement("span");badge.className="chip";badge.textContent=category;
      badges.appendChild(badge);
    });
    const title=document.createElement("h3");title.textContent=db.title||db.file;
    const desc=document.createElement("p");desc.className="small";desc.textContent=db.description||"선택하면 저장된 풀이 상태를 이어서 엽니다.";
    const button=document.createElement("button");button.type="button";button.className="btn primary";
    button.textContent="선택 · 문제 풀기";button.dataset.db=String(index);
    button.onclick=()=>loadDb(db,button);
    card.append(badges,title,desc,button);el("dbList").appendChild(card);
  });
  const count=el("dbList").children.length;
  el("dbCount").textContent=selectedCategory?`${selectedCategory} · ${count}개 문제집`:`전체 ${count}개 문제집`;
  if(!count)el("dbStatus").textContent=total
    ?"선택한 분류에 해당하는 문제집이 없습니다."
    :"등록된 문제집이 없습니다. quiz-db.js에 문제집을 추가하세요.";
}
async function loadDb(db,button){
  if(loadingDb)return;
  loadingDb=true;
  el("categoryFilter").disabled=true;
  el("dbList").querySelectorAll("button").forEach(b=>b.disabled=true);
  el("dbStatus").textContent=db.file+" 불러오는 중…";
  const originalLabel=button.textContent;button.textContent="불러오는 중…";
  try{
    if(loadedScript){loadedScript.remove();loadedScript=null;}
    delete window.QUIZ_DATA;
    await new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src="./db/"+db.file.replace(/^\.\//,"");
      script.onload=resolve;
      script.onerror=()=>reject(new Error("파일을 읽을 수 없습니다."));
      loadedScript=script;document.body.appendChild(script);
    });
    const data=window.QUIZ_DATA;
    if(!data||!Array.isArray(data.questions)||!data.questions.length)
      throw new Error("window.QUIZ_DATA에 유효한 문제 데이터가 없습니다.");
    el("saveStatus").innerHTML="이 브라우저에 문제집별로 자동 저장합니다.<br>키보드 1~4: 답 선택 · ← →: 문항 이동<br>시간은 창이 보이는 동안만 누적됩니다.";
    disposeCurrent=initQuiz(data,db);
    el("dbPicker").hidden=true;el("quizView").hidden=false;
    window.scrollTo({top:0,behavior:"instant"});
    el("backToDbs").focus({preventScroll:true});
  }catch(error){
    el("dbStatus").textContent=db.file+"을(를) 불러오지 못했습니다. db 폴더에 해당 파일이 있는지, window.QUIZ_DATA 형식인지 확인하세요. ("+error.message+")";
    el("quizView").hidden=true;el("dbPicker").hidden=false;
    el("quizTitle").textContent="문제집 선택";document.title="문제집 선택";
  }finally{
    loadingDb=false;el("categoryFilter").disabled=false;button.textContent=originalLabel;
    el("dbList").querySelectorAll("button").forEach(b=>b.disabled=false);
  }
}
el("backToDbs").onclick=showSelection;
initCategories();
showSelection();


// 사람이 읽는 기존 결과 형식은 유지하고, 새 파일 끝에 복원용 JSON을 추가합니다.
const RESULT_START="--- QUIZ_RESULT_DATA_V1 START ---";
const RESULT_END="--- QUIZ_RESULT_DATA_V1 END ---";
function resultTime(seconds){
 const n=Math.floor(seconds);
 return `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;
}
function resultLines(questions,meta,state){
 const map=new Map(questions.map(q=>[q.id,q]));
 const has=id=>Number.isInteger(state.answers[id]);
 const correct=id=>state.answers[id]===map.get(id).answer;
 const count=state.scope.filter(correct).length;
 return [`${meta.title || "문제 풀이"} · 학습 결과`,
 `문항 수: ${state.scope.length} / 정답: ${count} / 점수: ${Math.round(count/state.scope.length*1000)/10}점`,
 `풀이 시간: ${resultTime(state.seconds)}`,"",
 ...state.scope.flatMap(id=>{
  const q=map.get(id);
  return [`[${id}번] ${q.topic} · ${correct(id)?"정답":has(id)?"오답":"미응답"}`,
   q.stem,...(q.box?[q.box]:[]),...q.options.map((v,i)=>`${i+1}. ${v}`),
   `내 답: ${has(id)?state.answers[id]+1:"미응답"} / 정답: ${q.answer+1}`,
   `해설: ${q.explain}`,`근거 범위: PDF p.${q.pages.join(", ")}`,""];
 })];
}
function parseResultText(text,questions,meta,db){
 const normalize=s=>s.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n");
 text=normalize(text);
 const map=new Map(questions.map(q=>[q.id,q]));
 const fail=message=>{throw new Error(message);};
 const marker="\n"+RESULT_START+"\n";
 const markerIndex=text.lastIndexOf(marker);
 if(markerIndex>=0){
  const tail=text.slice(markerIndex+marker.length);
  if(!tail.endsWith("\n"+RESULT_END)&&!tail.endsWith("\n"+RESULT_END+"\n"))
   fail("복원 데이터의 끝부분이 손상되었습니다.");
  const endIndex=tail.lastIndexOf("\n"+RESULT_END);
  let payload;
  try{payload=JSON.parse(tail.slice(0,endIndex));}
  catch(e){fail("복원 데이터를 읽을 수 없습니다. 원본 TXT 파일을 선택하세요.");}
  if(!payload||payload.format!=="quiz-result"||payload.version!==1)
   fail("지원하지 않는 결과 파일 형식입니다.");
  if(payload.dbFile!==db.file)fail("다른 문제집의 결과입니다. 해당 문제집을 먼저 선택하세요.");
  if(payload.dataSignature!==JSON.stringify(questions))
   fail("문제 내용 또는 정답이 저장 당시와 달라 복원할 수 없습니다.");
  const s=payload.state;
  if(!s||s.submitted!==true||!Array.isArray(s.scope)||!s.scope.length||
     s.scope.length>questions.length||new Set(s.scope).size!==s.scope.length||
     !s.scope.every(id=>Number.isInteger(id)&&map.has(id))||
     !s.answers||typeof s.answers!=="object"||Array.isArray(s.answers)||
     !s.flags||typeof s.flags!=="object"||Array.isArray(s.flags)||
     !Number.isFinite(s.seconds)||s.seconds<0||
     !Number.isSafeInteger(s.attempt)||s.attempt<1)
   fail("저장된 풀이 상태가 올바르지 않습니다.");
  const validKey=key=>String(Number(key))===key&&s.scope.includes(Number(key));
  if(!Object.keys(s.answers).every(key=>validKey(key)&&Number.isInteger(s.answers[key])&&s.answers[key]>=0&&s.answers[key]<=3)||
     !Object.keys(s.flags).every(key=>validKey(key)&&typeof s.flags[key]==="boolean"))
   fail("저장된 답안 또는 확인 표시가 올바르지 않습니다.");
  const state={answers:{...s.answers},flags:{...s.flags},submitted:true,
   current:s.scope.includes(s.current)?s.current:s.scope[0],scope:[...s.scope],
   filter:["all","wrong","correct","flagged"].includes(s.filter)?s.filter:"all",
   seconds:s.seconds,attempt:s.attempt};
  const human=text.slice(0,markerIndex).trimEnd();
  if(normalize(resultLines(questions,meta,state).join("\n")).trimEnd()!==human)
   fail("결과 본문과 복원 데이터가 일치하지 않습니다. 수정하지 않은 원본 TXT를 사용하세요.");
  return {state,legacy:false};
 }
 if(text.includes(RESULT_START)||text.includes(RESULT_END))
  fail("복원 데이터가 손상되었습니다. 수정하지 않은 원본 TXT를 사용하세요.");
 // 이전 버전의 TXT도 문항·보기·정답·해설 전체가 일치할 때만 복원합니다.
 const lines=text.split("\n");
 if(lines[0]!==`${meta.title || "문제 풀이"} · 학습 결과`)
  fail("현재 문제집의 결과 파일이 아닙니다. 결과에 해당하는 문제집을 먼저 선택하세요.");
 const summary=/^문항 수: (\d+) \/ 정답: (\d+) \/ 점수: (\d+(?:\.\d+)?)점$/.exec(lines[1]||"");
 const clock=/^풀이 시간: (\d+):([0-5]\d)$/.exec(lines[2]||"");
 if(!summary||!clock)fail("학습 결과 형식이 올바르지 않습니다.");
 const scope=[],answers={};
 const blockPattern=/^\[(\d+)번\] [^\n]* · (?:정답|오답|미응답)\n/gm;
 const blocks=[...text.matchAll(blockPattern)];
 for(let i=0;i<blocks.length;i++){
  const match=blocks[i],id=Number(match[1]);
  if(!map.has(id)||scope.includes(id))fail("존재하지 않거나 중복된 문항이 있습니다.");
  const block=text.slice(match.index,i+1<blocks.length?blocks[i+1].index:text.length);
  const answerMatches=[...block.matchAll(/^내 답: ([1-4]|미응답) \/ 정답: ([1-4])$/gm)];
  if(answerMatches.length!==1)fail("문항별 답안을 확인할 수 없습니다.");
  const answer=answerMatches[0];
  if(Number(answer[2])-1!==map.get(id).answer)fail("저장된 정답이 현재 문제집과 다릅니다.");
  scope.push(id);
  if(answer[1]!=="미응답")answers[id]=Number(answer[1])-1;
 }
 if(!scope.length||scope.length!==Number(summary[1]))fail("문항 수가 일치하지 않습니다.");
 const seconds=Number(clock[1])*60+Number(clock[2]);
 if(!Number.isSafeInteger(seconds))fail("풀이 시간이 올바르지 않습니다.");
 const state={answers,flags:{},submitted:true,current:scope[0],scope,filter:"all",seconds,attempt:1};
 if(normalize(resultLines(questions,meta,state).join("\n")).trimEnd()!==text.trimEnd())
  fail("문항 내용이나 채점 결과가 현재 문제집과 일치하지 않습니다. 원본 TXT를 확인하세요.");
 return {state,legacy:true};
}

function initQuiz(data,db){

const questions = data.questions;
const meta = data.meta || {};
const ids = new Set();
for (const q of questions) {
  if (!Number.isInteger(q.id) || q.id < 1 || ids.has(q.id) ||
      !Array.isArray(q.options) || q.options.length !== 4 ||
      !q.options.every(v => typeof v === "string") ||
      !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3 ||
      !["topic", "kind", "stem", "explain"].every(k => typeof q[k] === "string") ||
      !Array.isArray(q.pages) || !(q.box == null || typeof q.box === "string")) {
    document.getElementById("question").textContent = "문제 데이터 형식에 오류가 있습니다. db 폴더의 해당 문제 파일을 확인하세요.";
    throw new Error("잘못된 문항 또는 중복 id: " + q.id);
  }
  ids.add(q.id);
}
const questionMap = new Map(questions.map(q => [q.id, q]));
const fillCount = value => String(value || "").replaceAll("{count}", questions.length);
document.title = fillCount(meta.documentTitle || meta.title || "문제 풀이");
document.getElementById("quizTitle").textContent = meta.title || "문제 풀이";
document.getElementById("quizEyebrow").textContent = meta.eyebrow || "";
document.getElementById("quizSubtitle").textContent = meta.subtitle || "";
document.getElementById("quizChips").replaceChildren();
for (const text of meta.chips || []) {
  const chip = document.createElement("span");
  chip.className = "chip"; chip.textContent = fillCount(text);
  document.getElementById("quizChips").appendChild(chip);
}
const distribution = [0, 1, 2, 3].map(i => `${["①","②","③","④"][i]} ${questions.filter(q => q.answer === i).length}개`).join(" · ");
document.getElementById("quizNotes").innerHTML = fillCount(meta.notesHTML || "").replaceAll("{answerDistribution}", "정답 분포: " + distribution + ".");
document.getElementById("quizNotice").textContent = fillCount(meta.notice || "");
// 데이터가 바뀌면 이전 정답·채점 상태를 잘못 복원하지 않습니다.
const dataSignature = JSON.stringify(questions);

const KEY=getStorageKey(db);
const $=id=>document.getElementById(id);
const all=questions.map(q=>q.id);
const fresh=()=>({answers:{},flags:{},submitted:false,current:all[0],scope:[...all],filter:"all",seconds:0,attempt:1});
let state=fresh(), canSave=true, disposed=false, importReading=false;
function importStatus(message,status=""){
 $("importStatus").textContent=message;
 $("importStatus").dataset.status=status;
}
importStatus("");
$("importFile").value="";
$("importBtn").disabled=false;
// 새 키가 없을 때만 과거 키를 읽습니다. 원본 키는 삭제하지 않습니다.
const legacyKeys=["quiz_db_v2:","quiz_bank_v2:"].map(prefix=>
 prefix+encodeURIComponent(db.file)+":"+(meta.storageKey||"quiz_default_v1"));
let stored=null;
try{
 const raw=localStorage.getItem(KEY);
 if(raw!==null){
  try{stored=JSON.parse(raw);}catch(e){/* 손상된 기록은 새 풀이로 시작합니다. */}
 }else{
  for(const key of legacyKeys){
   try{
    const candidate=JSON.parse(localStorage.getItem(key)||"null");
    if(candidate&&candidate.version===1&&candidate.state&&
       (!candidate.dataSignature||candidate.dataSignature===dataSignature)){
     stored=candidate;break;
    }
   }catch(e){/* 다른 이전 키를 계속 확인합니다. */}
  }
 }
}catch(e){canSave=false;}
if(stored&&stored.version===1&&stored.state&&(!stored.dataSignature||stored.dataSignature===dataSignature)){
 const s=stored.state;
 if(Array.isArray(s.scope)&&s.scope.length&&s.scope.every(id=>all.includes(id))&&
    s.answers&&typeof s.answers==="object"&&!Array.isArray(s.answers)&&
    s.flags&&typeof s.flags==="object"&&!Array.isArray(s.flags)){
  state={...fresh(),...s,answers:{...s.answers},flags:{...s.flags}};
  state.scope=[...new Set(s.scope)];
  if(!state.scope.includes(state.current))state.current=state.scope[0];
  if(!["all","unanswered","flagged","wrong","correct"].includes(state.filter))state.filter="all";
  for(const id of Object.keys(state.answers))
   if(!state.scope.includes(Number(id))||![0,1,2,3].includes(state.answers[id]))delete state.answers[id];
  for(const id of Object.keys(state.flags))
   if(!state.scope.includes(Number(id))||typeof state.flags[id]!=="boolean")delete state.flags[id];
  state.submitted=state.submitted===true;
  state.attempt=Number.isSafeInteger(state.attempt)&&state.attempt>0?state.attempt:1;
  state.seconds=Number.isFinite(state.seconds)?Math.max(0,state.seconds):0;
 }
}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({version:1,dataSignature,state}));}catch(e){canSave=false;$("saveStatus").textContent="이 환경에서는 자동 저장이 제한됩니다. 결과 저장을 이용하세요.";}}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
const getQ=id=>questionMap.get(id);
const hasAnswer=id=>Number.isInteger(state.answers[id]);
const isCorrect=id=>state.answers[id]===getQ(id).answer;
function visibleIDs(){return state.scope.filter(id=>{
 if(state.filter==="unanswered")return !hasAnswer(id);
 if(state.filter==="flagged")return !!state.flags[id];
 if(state.filter==="wrong")return !isCorrect(id);
 if(state.filter==="correct")return isCorrect(id);
 return true;
});}
function toast(message){$("toast").textContent=message;$("toast").hidden=false;setTimeout(()=>$("toast").hidden=true,2500);}
function showModal(title,body,action,label="확인"){
 $("modal").oncancel=null;
 $("modalCancel").onclick=()=>$("modal").close();
 $("modalTitle").textContent=title;$("modalBody").textContent=body;$("modalOk").textContent=label;
 $("modalOk").onclick=()=>{$("modal").close();action();};
 $("modal").showModal();
}
function renderQuestionMath() {
  const target = document.getElementById("question");

  if (!target || typeof window.renderMathInElement !== "function") {
    return;
  }

  window.renderMathInElement(target, {
    delimiters: [
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false }
    ],
    throwOnError: false,
    trust: false
  });
}

function render(){
 const ids=visibleIDs();
 if(ids.length&&!ids.includes(state.current))state.current=ids[0];
 const done=state.scope.filter(hasAnswer).length;
 $("progressText").textContent=state.submitted?`${state.scope.length}문항 채점 완료`:`${done} / ${state.scope.length} 응답`;
 $("progress").max=state.scope.length;$("progress").value=state.submitted?state.scope.length:done;
 $("clock").textContent=resultTime(state.seconds);
 $("sideTitle").textContent=state.submitted?"채점 · 문항 탐색":(state.attempt>1?`재도전 ${state.attempt-1}회차`:"풀이 현황");
 $("nav").innerHTML=state.scope.map(id=>{
 const status=state.submitted?(isCorrect(id)?"correct":"wrong"):(hasAnswer(id)?"answered":"");
 const hidden=!ids.includes(id);
 return `<button class="navq ${status} ${id===state.current&&!hidden?"current":""} ${state.flags[id]?"flagged":""}" data-goto="${id}" aria-label="${id}번 ${state.submitted?(isCorrect(id)?"정답":"오답"):hasAnswer(id)?"응답 완료":"미응답"}${state.flags[id]?", 다시 확인":""}" ${id===state.current?'aria-current="true"':""}>${id}</button>`;
 }).join("");
 const filters=state.submitted?[["all","전체"],["wrong","오답 · 미응답"],["correct","정답"],["flagged","다시 확인"]]:[["all","전체"],["unanswered","미응답"],["flagged","다시 확인"]];
 if(!filters.some(f=>f[0]===state.filter)){state.filter="all";return render();}
 $("filters").innerHTML=filters.map(([v,label])=>`<button class="filter ${state.filter===v?"active":""}" aria-pressed="${state.filter===v}" data-filter="${v}">${label}</button>`).join("");
 $("submitBtn").hidden=state.submitted;
 $("summary").hidden=!state.submitted;
 if(state.submitted)renderSummary();
 if(!ids.length){
 $("question").innerHTML='<div class="card empty">이 조건에 해당하는 문항이 없습니다.<br>다른 필터를 선택하세요.</div>';persist();return;
 }
 const q=getQ(state.current), selected=state.answers[q.id], correct=q.answer;
 $("question").innerHTML=`<article class="card">
 <div class="cardhead"><div><div class="qnum">QUESTION ${String(q.id).padStart(2,"0")} <span class="small">/ ${questions.length}</span></div><div class="tag">${escapeHTML(q.topic)} <span class="small">· ${escapeHTML(q.kind)}</span></div></div><button class="flag ${state.flags[q.id]?"on":""}" id="flagBtn" aria-pressed="${!!state.flags[q.id]}">${state.flags[q.id]?"★ 확인 표시됨":"☆ 다시 확인"}</button></div>
 <div class="qbody"><h2 class="qtitle" id="stem">${escapeHTML(q.stem)}</h2>
 ${q.box?`<div class="box">${escapeHTML(q.box)}</div>`:""}
 <div class="options" role="group" aria-labelledby="stem">${q.options.map((o,i)=>{
 let cls=selected===i?"selected":"";
 if(state.submitted){if(i===correct)cls+=" right";else if(selected===i)cls+=" incorrect";}
 return `<button class="option ${cls}" data-answer="${i}" aria-pressed="${selected===i}" ${state.submitted?"disabled":""}><span class="opnum">${i+1}</span><span class="optext">${escapeHTML(o)}${state.submitted&&i===correct?'<span class="oplabel">정답</span>':""}${state.submitted&&selected===i&&i!==correct?'<span class="oplabel">내 선택</span>':""}</span></button>`;
 }).join("")}</div>
 ${state.submitted?`<section class="explanation ${isCorrect(q.id)?"":"bad"}"><div class="exphead">${isCorrect(q.id)?"정답입니다":"미응답"===(!hasAnswer(q.id)?"미응답":"")?"미응답 · 오답 처리":"다시 짚어보세요"} · 정답 ${correct+1}번${hasAnswer(q.id)?` / 내 답 ${selected+1}번`:""}</div><p>${escapeHTML(q.explain)}</p><div class="ref">근거 범위 · 제공 PDF p.${q.pages.join(", ")}${q.kind==="계산"||q.kind==="숫자 빈칸"?" · 수치는 연습용 재구성":""}</div></section>`:""}
 </div>
 <div class="qfoot"><span class="small">${ids.indexOf(q.id)+1} / ${ids.length} 문항${state.filter!=="all"?" · 필터 적용":""}</span><div class="row">${!state.submitted?'<button class="btn subtle" id="clearBtn">선택 해제</button>':""}<button class="btn" id="prevBtn" ${ids.indexOf(q.id)===0?"disabled":""}>이전</button><button class="btn primary" id="nextBtn" ${ids.indexOf(q.id)===ids.length-1?"disabled":""}>다음 →</button></div></div>
 </article>`;
 $("flagBtn").onclick=()=>{state.flags[q.id]=!state.flags[q.id];render();};
 if($("clearBtn"))$("clearBtn").onclick=()=>{delete state.answers[q.id];render();};
 $("prevBtn").onclick=()=>move(-1);$("nextBtn").onclick=()=>move(1);
 renderQuestionMath();
 persist();
}
function renderSummary(){
 const n=state.scope.length,c=state.scope.filter(isCorrect).length,u=state.scope.filter(id=>!hasAnswer(id)).length;
 const topics=[...new Set(state.scope.map(id=>getQ(id).topic))];
 $("summary").innerHTML=`<div class="result"><div class="eyebrow">YOUR PERFORMANCE · ${state.attempt===1?"FIRST RUN":"RETRY "+(state.attempt-1)}</div><div class="resulttop"><div><h2>풀이를 마쳤습니다.</h2><div class="small">${state.attempt===1?(n===questions.length?`전 범위 ${questions.length}문항`:`선택 범위 ${n}문항`):"재도전 "+n+"문항"} · 소요 ${resultTime(state.seconds)}</div></div><div class="score">${Math.round(c/n*1000)/10}<small> / 100</small></div></div>
 <div class="stats"><div class="stat"><span>정답</span><strong style="color:var(--green)">${c}</strong></div><div class="stat"><span>오답 · 미응답</span><strong style="color:var(--red)">${n-c}</strong></div><div class="stat"><span>미응답</span><strong>${u}</strong></div><div class="stat"><span>전체 문항</span><strong>${n}</strong></div></div>
 <div class="topicresults">${topics.map(t=>{const a=state.scope.filter(id=>getQ(id).topic===t);return `<span>${escapeHTML(t)} ${a.filter(isCorrect).length}/${a.length}</span>`;}).join("")}</div>
 <div class="row"><button class="btn primary" id="retryBtn" ${c===n?"disabled":""}>오답만 다시 풀기 (${n-c})</button><button class="btn" id="allRetryBtn">전체 ${questions.length}문항 새로 풀기</button></div></div>`;
 $("retryBtn").onclick=()=>{
 const wrong=state.scope.filter(id=>!isCorrect(id));
 if(!wrong.length)return;
 showModal("오답 재도전",`${wrong.length}문항의 응답을 지우고 다시 풉니다. 현재 채점 결과를 보관하려면 먼저 ‘결과 저장’을 이용하세요.`,()=>start(wrong),"다시 풀기");
 };
 $("allRetryBtn").onclick=()=>resetConfirm();
}
function start(scope){const attempt=state.attempt+1;state={...fresh(),scope:[...scope],current:scope[0],attempt};render();window.scrollTo({top:0,behavior:"smooth"});}
function resetConfirm(){showModal("전체 풀이 초기화",`현재 답안·확인 표시·시간을 지우고 전체 ${questions.length}문항을 새로 풉니다. 저장한 결과 파일에는 영향이 없습니다.`,()=>{state=fresh();render();window.scrollTo({top:0,behavior:"smooth"});},"초기화");}
function move(dir){const ids=visibleIDs(),idx=ids.indexOf(state.current),next=ids[idx+dir];if(next){state.current=next;render();}}
$("nav").onclick=e=>{const b=e.target.closest("[data-goto]");if(!b)return;const id=Number(b.dataset.goto);if(!visibleIDs().includes(id))state.filter="all";state.current=id;render();};
$("filters").onclick=e=>{const b=e.target.closest("[data-filter]");if(b){state.filter=b.dataset.filter;render();}};
$("question").onclick=e=>{const b=e.target.closest("[data-answer]");if(!b||state.submitted)return;state.answers[state.current]=Number(b.dataset.answer);render();};
$("submitBtn").onclick=()=>{
 const u=state.scope.filter(id=>!hasAnswer(id)).length;
 showModal("답안을 제출할까요?",u?`아직 ${u}문항에 응답하지 않았습니다. 미응답은 오답으로 채점되며, 제출 후 모든 해설이 공개됩니다.`:"제출하면 답안이 확정되고 정답과 해설이 공개됩니다.",()=>{state.submitted=true;state.filter="all";render();window.scrollTo({top:0,behavior:"smooth"});},"제출 · 채점");
};
$("resetBtn").onclick=resetConfirm;
$("exportBtn").onclick=()=>{
 if(!state.submitted){toast("제출 · 채점 후 결과를 저장할 수 있습니다.");return;}
 const lines=resultLines(questions,meta,state);
 const payload={format:"quiz-result",version:1,dbFile:db.file,dataSignature,state};
 lines.push(RESULT_START,JSON.stringify(payload),RESULT_END);
 const blob=new Blob(["\ufeff"+lines.join("\n")],{type:"text/plain;charset=utf-8"});
 const a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download=resultFilename(db);document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
};

$("importBtn").onclick=()=>{if(!importReading)$("importFile").click();};
$("importFile").onchange=async event=>{
 const file=event.target.files[0];
 event.target.value="";
 if(!file||importReading)return;
 importReading=true;
 $("importBtn").disabled=true;
 importStatus("TXT 결과를 확인하는 중…","loading");
 $("importBtn").setAttribute("aria-busy","true");
 try{
  if(!/\.txt$/i.test(file.name))throw new Error("TXT 파일을 선택하세요.");
  if(file.size>20*1024*1024)throw new Error("20MB 이하의 TXT 파일만 불러올 수 있습니다.");
  const text=await file.text();
  if(disposed)return;
  const imported=parseResultText(text,questions,meta,db);
  if($("modal").open)throw new Error("열린 확인 창을 닫은 뒤 다시 불러오세요.");
  const note=imported.legacy
   ?"이전 형식의 TXT입니다. 답안과 시간은 복원되지만, 확인 표시와 재도전 회차는 원본에 없어 복원되지 않습니다."
   :"답안, 풀이 시간, 확인 표시와 재도전 회차를 복원합니다.";
  importStatus("파일 확인 완료 · 불러오기 확인을 기다립니다.","loading");
  showModal("TXT 결과를 불러올까요?",
   `${file.name}\n${imported.state.scope.length}문항의 채점 결과를 불러옵니다.\n${note}\n현재 문제집의 답안과 자동 저장 기록을 덮어씁니다. 필요하면 먼저 현재 결과를 저장하세요.`,
   ()=>{
    if(disposed)return;
    state=imported.state;
    render();
    importStatus(canSave
     ?`불러오기 완료: ${file.name}${imported.legacy?" · 이전 형식(확인 표시·회차 제외)":""}`
     :"불러오기 완료. 이 환경에서는 자동 저장이 제한되므로 결과 파일을 보관하세요.","success");
    toast("저장한 채점 결과를 불러왔습니다.");
    window.scrollTo({top:0,behavior:"smooth"});
   },"결과 불러오기");
  $("modalCancel").onclick=()=>{
   $("modal").close();
   importStatus("불러오기를 취소했습니다. 기존 기록은 유지됩니다.");
  };
  $("modal").oncancel=()=>importStatus("불러오기를 취소했습니다. 기존 기록은 유지됩니다.");
 }catch(error){
  if(!disposed)importStatus("불러오기 실패: "+error.message,"error");
 }finally{
  importReading=false;
  if(!disposed){$("importBtn").disabled=false;$("importBtn").removeAttribute("aria-busy");}
 }
};
const onQuizKeydown=e=>{
 if($("modal").open||e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
 if(["1","2","3","4"].includes(e.key)&&!state.submitted&&visibleIDs().length){state.answers[state.current]=Number(e.key)-1;render();e.preventDefault();}
 if(e.key==="ArrowLeft"){move(-1);e.preventDefault();}
 if(e.key==="ArrowRight"){move(1);e.preventDefault();}
};
document.addEventListener("keydown",onQuizKeydown);
const clockTimer=setInterval(()=>{if(!state.submitted&&!document.hidden){state.seconds++;$("clock").textContent=resultTime(state.seconds);if(state.seconds%5===0)persist();}},1000);
window.addEventListener("pagehide",persist);
render();
if(!canSave)$("saveStatus").textContent="이 환경에서는 자동 저장이 제한될 수 있습니다.";
return function disposeQuiz(){
  disposed=true;
  $("importFile").onchange=null;
  $("importBtn").onclick=null;
  persist();
  clearInterval(clockTimer);
  document.removeEventListener("keydown",onQuizKeydown);
  window.removeEventListener("pagehide",persist);
  if($("modal").open)$("modal").close();
  $("modalOk").onclick=null;
  $("modal").oncancel=null;
};


}