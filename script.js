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
  return "quiz_db_v3:"+encodeURIComponent(db.storageKey.trim());
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
    el("saveStatus").dataset.status="";
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


// 현재 TXT 저장·복원 형식만 지원합니다.
const RESULT_START="--- QUIZ_DATA_V2 START ---";
const RESULT_END="--- QUIZ_DATA_V2 END ---";
const FILTERS=["all","unanswered","flagged","wrong","correct"];
const isRecord=value=>!!value&&typeof value==="object"&&!Array.isArray(value);

// Web Crypto 사용 가능 여부나 file:// 실행 여부와 무관하게 같은 SHA-256을 계산합니다.
function sha256(text){
 const bytes=new TextEncoder().encode(text);
 const size=Math.ceil((bytes.length+9)/64)*64;
 const data=new Uint8Array(size);data.set(bytes);data[bytes.length]=128;
 const view=new DataView(data.buffer),bits=bytes.length*8;
 view.setUint32(size-8,Math.floor(bits/4294967296));view.setUint32(size-4,bits>>>0);
 const k=[
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
 const w=new Uint32Array(64),rotr=(x,n)=>(x>>>n)|(x<<(32-n));
 for(let offset=0;offset<size;offset+=64){
  for(let i=0;i<16;i++)w[i]=view.getUint32(offset+i*4);
  for(let i=16;i<64;i++){
   const x=w[i-15],y=w[i-2];
   w[i]=(w[i-16]+(rotr(x,7)^rotr(x,18)^(x>>>3))+w[i-7]+(rotr(y,17)^rotr(y,19)^(y>>>10)))>>>0;
  }
  let [a,b,c,d,e,f,g,z]=h;
  for(let i=0;i<64;i++){
   const t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+k[i]+w[i])>>>0;
   const t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
   z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
  }
  [a,b,c,d,e,f,g,z].forEach((v,i)=>h[i]=(h[i]+v)>>>0);
 }
 return h.map(v=>v.toString(16).padStart(8,"0")).join("");
}
function canonical(value){
 if(Array.isArray(value))return value.map(canonical);
 if(isRecord(value))return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
 return value;
}
const hashValue=value=>sha256(JSON.stringify(canonical(value)));
function contentInfo(questions,db){
 const ordered=[...questions].sort((a,b)=>a.id-b.id);
 const grading=ordered.map(q=>({id:q.id,stem:q.stem,box:q.box??"",options:q.options,answer:q.answer}));
 const normalized=ordered.map((q,i)=>({...grading[i],topic:q.topic,kind:q.kind,explain:q.explain,pages:q.pages}));
 return {dbId:db.storageKey.trim(),contentRevision:db.contentRevision??1,
  contentHash:hashValue(normalized),gradingHash:hashValue(grading)};
}
function validateState(s,questions){
 const map=new Map(questions.map(q=>[q.id,q]));
 if(!isRecord(s)||typeof s.submitted!=="boolean"||
  !Array.isArray(s.scope)||!s.scope.length||s.scope.length>questions.length||
  new Set(s.scope).size!==s.scope.length||!s.scope.every(id=>Number.isSafeInteger(id)&&map.has(id))||
  !isRecord(s.answers)||!isRecord(s.flags)||!s.scope.includes(s.current)||
  !FILTERS.includes(s.filter)||(!s.submitted&&["wrong","correct"].includes(s.filter))||
  (s.submitted&&s.filter==="unanswered")||
  !Number.isFinite(s.seconds)||s.seconds<0||s.seconds>Number.MAX_SAFE_INTEGER/1000||
  !Number.isSafeInteger(s.attempt)||s.attempt<1)
  throw new Error("저장된 풀이 상태가 올바르지 않습니다.");
 const validKey=key=>String(Number(key))===key&&s.scope.includes(Number(key));
 if(!Object.keys(s.answers).every(key=>validKey(key)&&Number.isInteger(s.answers[key])&&s.answers[key]>=0&&s.answers[key]<map.get(Number(key)).options.length)||
  !Object.keys(s.flags).every(key=>validKey(key)&&typeof s.flags[key]==="boolean"))
  throw new Error("저장된 답안 또는 확인 표시가 올바르지 않습니다.");
 const elapsedMs=s.elapsedMs;
 if(!Number.isFinite(elapsedMs)||elapsedMs<0||elapsedMs>Number.MAX_SAFE_INTEGER||
    Math.abs(elapsedMs/1000-s.seconds)>0.001)
  throw new Error("저장된 풀이 시간이 올바르지 않습니다.");
 return {answers:{...s.answers},flags:{...s.flags},submitted:s.submitted,current:s.current,
  scope:[...s.scope],filter:s.filter,seconds:elapsedMs/1000,elapsedMs,attempt:s.attempt};
}
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
   `해설: ${q.explain}`,...(q.pages.length?[`근거 범위: PDF p.${q.pages.join(", ")}`]:[]),""];
 })];
}
function backupLines(meta,state){
 return [`${meta.title||"문제 풀이"} · 풀이 백업`,
  `상태: ${state.submitted?"제출 완료":"풀이 중"}`,
  `범위: ${state.scope.join(", ")}`,`풀이 시간: ${resultTime(state.seconds)}`,"",
  ...state.scope.map(id=>`${id}번 · 답: ${Number.isInteger(state.answers[id])?state.answers[id]+1:"미응답"} · 확인: ${state.flags[id]?"예":"아니오"}`)];
}
function downloadText(text,filename){
 const blob=new Blob(["\ufeff"+text],{type:"text/plain;charset=utf-8"});
 const a=document.createElement("a"),url=URL.createObjectURL(blob);
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function encodeResultText(format,questions,meta,db,info,state){
 const body=(format==="quiz-result"?resultLines(questions,meta,state):backupLines(meta,state)).join("\n").trimEnd();
 const payload={format,version:2,...info,dbFile:db.file,title:meta.title||db.title||"",
  state:JSON.parse(JSON.stringify(state)),humanHash:sha256(body)};
 payload.integrityHash=hashValue(payload);
 return body+"\n"+RESULT_START+"\n"+JSON.stringify(payload)+"\n"+RESULT_END;
}
function parseResultText(text,questions,meta,db){
 text=text.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n");
 const marker="\n"+RESULT_START+"\n",index=text.lastIndexOf(marker);
 if(index<0)throw new Error("지원하지 않는 TXT입니다. 새 버전의 ‘풀이 백업’ 또는 ‘결과 저장’ 파일을 선택하세요.");
 const tail=text.slice(index+marker.length),end="\n"+RESULT_END;
 if(!tail.endsWith(end)&&!tail.endsWith(end+"\n"))throw new Error("복원 데이터의 끝부분이 손상되었습니다.");
 let payload;
 try{payload=JSON.parse(tail.slice(0,tail.lastIndexOf(end)));}
 catch{throw new Error("복원 JSON이 손상되었습니다.");}
 if(!isRecord(payload)||!["quiz-result","quiz-backup"].includes(payload.format)||payload.version!==2)
  throw new Error("지원하지 않는 TXT 형식입니다.");
 const {integrityHash,...unsigned}=payload;
 if(integrityHash!==hashValue(unsigned))throw new Error("복원 데이터가 변경되었거나 손상되었습니다.");
 // 1. 식별: 파일명과 제목은 표시용입니다.
 const info=contentInfo(questions,db);
 if(payload.dbId!==info.dbId)throw new Error("다른 문제집의 파일입니다. 해당 문제집을 먼저 선택하세요.");
 // 2. 호환성: 해설/출처 변경은 허용하되 문제/보기/정답/ID 변경은 거부합니다.
 if(payload.gradingHash!==info.gradingHash)
  throw new Error("문제·보기·정답 또는 문항 ID가 달라 현재 문제집에 복원할 수 없습니다. 원본 TXT는 유지됩니다.");
 // 3. 본문 검증: 현재 제목이나 현재 해설로 다시 생성하지 않습니다.
 if(payload.humanHash!==sha256(text.slice(0,index).trimEnd()))
  throw new Error("TXT 본문이 변경되었거나 손상되었습니다.");
 const state=validateState(payload.state,questions);
 if(payload.format==="quiz-result"&&!state.submitted)throw new Error("결과 파일에는 제출 완료 상태가 필요합니다.");
 if(payload.contentHash===info.contentHash){
  const originalMeta={...meta,title:payload.title};
  const expected=(payload.format==="quiz-result"?resultLines(questions,originalMeta,state):backupLines(originalMeta,state)).join("\n").trimEnd();
  if(expected!==text.slice(0,index).trimEnd())throw new Error("결과 본문과 저장된 답안이 일치하지 않습니다.");
 }
 return {state,format:payload.format,contentChanged:payload.contentHash!==info.contentHash};
}

function initQuiz(data,db){

if(typeof db.storageKey!=="string"||!db.storageKey.trim())
 throw new Error("문제집에 고정 storageKey를 지정해야 합니다.");
if(dbs.filter(item=>item&&typeof item.storageKey==="string"&&item.storageKey.trim()===db.storageKey.trim()).length!==1)
 throw new Error("문제집 storageKey가 중복되었습니다.");
const questions = data.questions;
const meta = data.meta || {};
const ids = new Set();
for (const q of questions) {
  if (!isRecord(q)) throw new Error("문항은 객체 형식이어야 합니다.");
  if (!Number.isSafeInteger(q.id) || q.id < 1 || ids.has(q.id) ||
      !Array.isArray(q.options) || q.options.length !== 4 ||
      !q.options.every(v => typeof v === "string") ||
      !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3 ||
      !["topic", "kind", "stem", "explain"].every(k => typeof q[k] === "string") ||
      !Array.isArray(q.pages) || !q.pages.every(page=>Number.isSafeInteger(page)&&page>0) || !(q.box == null || typeof q.box === "string")) {
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
// 표시용 메타데이터와 채점에 영향을 주는 데이터를 분리합니다.
const info=contentInfo(questions,db);
if(!Number.isSafeInteger(info.contentRevision)||info.contentRevision<1)
 throw new Error("contentRevision은 1 이상의 안전한 정수여야 합니다.");
const KEY=getStorageKey(db);
const $=id=>document.getElementById(id);
const all=questions.map(q=>q.id);
const fresh=()=>({answers:{},flags:{},submitted:false,current:all[0],scope:[...all],filter:"all",seconds:0,elapsedMs:0,attempt:1});
let state=fresh(), canSave=true, disposed=false, importReading=false;
let lastTick=null, lastSavedAt=performance.now();
function saveError(message){
 canSave=false;
 $("saveStatus").dataset.status="error";
 $("saveStatus").textContent=message+" 풀이 백업으로 현재 답안을 보관하세요.";
}
function importStatus(message,status=""){
 $("importStatus").textContent=message;
 $("importStatus").dataset.status=status;
}
importStatus("");
$("restoreStatus").textContent="";
$("importFile").value="";
$("importBtn").disabled=false;
function readStored(raw){
 const stored=JSON.parse(raw);
 if(!isRecord(stored)||stored.version!==2||!isRecord(stored.state))
  throw new Error("현재 저장 형식의 기록이 아닙니다.");
 if(stored.dbId!==info.dbId)throw new Error("저장된 문제집 ID가 다릅니다.");
 if(stored.gradingHash!==info.gradingHash)
  throw new Error("문제·보기·정답 또는 문항 ID가 변경되었습니다.");
 return {state:validateState(stored.state,questions),changed:stored.contentHash!==info.contentHash};
}
let raw=null;
try{
 raw=localStorage.getItem(KEY);
}catch{saveError("이 환경에서는 자동 저장소에 접근할 수 없습니다.");}
if(raw!==null){
 try{
  const restored=readStored(raw);
  state=restored.state;
  if(restored.changed)
   $("restoreStatus").textContent="해설·출처 등 비채점 정보가 변경되었습니다. 기존 풀이를 유지했습니다.";
 }catch(error){
  $("restoreStatus").textContent=error.message+" 저장된 기록을 불러오지 않고 새 풀이를 시작합니다.";
 }
}
function settleClock(){
 const now=performance.now();
 if(lastTick!==null&&!state.submitted){
  state.elapsedMs+=Math.max(0,now-lastTick);
  state.seconds=state.elapsedMs/1000;
 }
 lastTick=!state.submitted&&!document.hidden?now:null;
}
function persist(){
 settleClock();
 if(!canSave)return false; // 저장소 오류 이후에는 자동 저장을 중단합니다.
 try{
  localStorage.setItem(KEY,JSON.stringify({version:2,...info,state}));
  lastSavedAt=performance.now();
  return true;
 }catch{
  saveError("자동 저장에 실패했습니다.");
  return false;
 }
}
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

let renderedQuestionKey="", renderedSummaryKey="", renderedFilterMode=null;
function updateProgress(ids){
 const done=state.scope.filter(hasAnswer).length;
 $("progressText").textContent=state.submitted?`${state.scope.length}문항 채점 완료`:`${done} / ${state.scope.length} 응답`;
 $("progress").max=state.scope.length;$("progress").value=state.submitted?state.scope.length:done;
 $("clock").textContent=resultTime(state.seconds);
 $("sideTitle").textContent=state.submitted?"채점 · 문항 탐색":(state.attempt>1?`재도전 ${state.attempt-1}회차`:"풀이 현황");
 const nav=$("nav");
 const scopeKey=state.scope.join(",");
 if(nav.dataset.scope!==scopeKey){
  nav.replaceChildren(...state.scope.map(id=>{
   const button=document.createElement("button");
   button.type="button";button.dataset.goto=id;button.textContent=id;
   return button;
  }));
  nav.dataset.scope=scopeKey;
 }
 const visible=new Set(ids);
 for(const button of nav.children){
  const id=Number(button.dataset.goto),current=id===state.current&&visible.has(id);
  const status=state.submitted?(isCorrect(id)?"correct":"wrong"):(hasAnswer(id)?"answered":"");
  button.className=`navq ${status} ${current?"current":""} ${state.flags[id]?"flagged":""}`;
  button.setAttribute("aria-label",`${id}번 ${state.submitted?(isCorrect(id)?"정답":"오답"):hasAnswer(id)?"응답 완료":"미응답"}${state.flags[id]?", 다시 확인":""}`);
  if(current)button.setAttribute("aria-current","true");else button.removeAttribute("aria-current");
 }
 if(renderedFilterMode!==state.submitted){
  const filters=state.submitted?[["all","전체"],["wrong","오답 · 미응답"],["correct","정답"],["flagged","다시 확인"]]:[["all","전체"],["unanswered","미응답"],["flagged","다시 확인"]];
  $("filters").innerHTML=filters.map(([v,label])=>`<button class="filter" data-filter="${v}">${label}</button>`).join("");
  renderedFilterMode=state.submitted;
 }
 for(const button of $("filters").children){
  const active=button.dataset.filter===state.filter;
  button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));
 }
}
function updateAnswerUI(){
 const selected=state.answers[state.current];
 $("question").querySelectorAll("[data-answer]").forEach(button=>{
  const active=Number(button.dataset.answer)===selected;
  button.classList.toggle("selected",active);
  button.setAttribute("aria-pressed",String(active));
 });
 const flag=$("flagBtn");
 if(flag){
  flag.classList.toggle("on",!!state.flags[state.current]);
  flag.setAttribute("aria-pressed",String(!!state.flags[state.current]));
  flag.textContent=state.flags[state.current]?"★ 확인 표시됨":"☆ 다시 확인";
 }
}
function focusQuestion(){
 const target=$("stem")||$("emptyQuestion");
 if(target)target.focus({preventScroll:true});
}
function commit({focus=false}={}){
 const previous=renderedQuestionKey;
 render();
 persist(); // 화면 렌더링 자체에서는 저장하지 않습니다.
 if(focus||previous!==renderedQuestionKey)focusQuestion();
}
function render(){
 if(!state.submitted&&["wrong","correct"].includes(state.filter))state.filter="all";
 const ids=visibleIDs();
 if(ids.length&&!ids.includes(state.current))state.current=ids[0];
 updateProgress(ids);
 $("submitBtn").hidden=state.submitted;
 $("summary").hidden=!state.submitted;
 const summaryKey=state.submitted?JSON.stringify([state.scope,state.answers,state.attempt,state.seconds]):"";
 if(state.submitted&&renderedSummaryKey!==summaryKey)renderSummary();
 renderedSummaryKey=summaryKey;
 renderQuestion(ids);
}
function renderQuestion(ids){
 const key=JSON.stringify([ids,state.current,state.submitted,state.attempt,state.submitted?state.answers[state.current]:null]);
 if(key===renderedQuestionKey){updateAnswerUI();return;}
 renderedQuestionKey=key;
 if(!ids.length){
 $("question").innerHTML='<div class="card empty" id="emptyQuestion" tabindex="-1">이 조건에 해당하는 문항이 없습니다.<br>다른 필터를 선택하세요.</div>';return;
 }
 const q=getQ(state.current), selected=state.answers[q.id], correct=q.answer;
 const sourceHTML=q.pages.length?`<div class="ref">근거 범위 · 제공 PDF p.${escapeHTML(q.pages.join(", "))}${q.kind==="계산"||q.kind==="숫자 빈칸"?" · 수치는 연습용 재구성":""}</div>`:"";
 $("question").innerHTML=`<article class="card">
 <div class="cardhead"><div><div class="qnum">QUESTION ${String(q.id).padStart(2,"0")} <span class="small">/ ${questions.length}</span></div><div class="tag">${escapeHTML(q.topic)} <span class="small">· ${escapeHTML(q.kind)}</span></div></div><button class="flag ${state.flags[q.id]?"on":""}" id="flagBtn" aria-pressed="${!!state.flags[q.id]}">${state.flags[q.id]?"★ 확인 표시됨":"☆ 다시 확인"}</button></div>
 <div class="qbody"><h2 class="qtitle" id="stem" tabindex="-1">${escapeHTML(q.stem)}</h2>
 ${q.box?`<div class="box">${escapeHTML(q.box)}</div>`:""}
 <div class="options" role="group" aria-labelledby="stem">${q.options.map((o,i)=>{
 let cls=selected===i?"selected":"";
 if(state.submitted){if(i===correct)cls+=" right";else if(selected===i)cls+=" incorrect";}
 return `<button class="option ${cls}" data-answer="${i}" aria-pressed="${selected===i}" ${state.submitted?"disabled":""}><span class="opnum">${i+1}</span><span class="optext">${escapeHTML(o)}${state.submitted&&i===correct?'<span class="oplabel">정답</span>':""}${state.submitted&&selected===i&&i!==correct?'<span class="oplabel">내 선택</span>':""}</span></button>`;
 }).join("")}</div>
 ${state.submitted?`<section class="explanation ${isCorrect(q.id)?"":"bad"}"><div class="exphead">${isCorrect(q.id)?"정답입니다":"미응답"===(!hasAnswer(q.id)?"미응답":"")?"미응답 · 오답 처리":"다시 짚어보세요"} · 정답 ${correct+1}번${hasAnswer(q.id)?` / 내 답 ${selected+1}번`:""}</div><p>${escapeHTML(q.explain)}</p>${sourceHTML}</section>`:""}
 </div>
 <div class="qfoot"><span class="small">${ids.indexOf(q.id)+1} / ${ids.length} 문항${state.filter!=="all"?" · 필터 적용":""}</span><div class="row">${!state.submitted?'<button class="btn subtle" id="clearBtn">선택 해제</button>':""}<button class="btn" id="prevBtn" ${ids.indexOf(q.id)===0?"disabled":""}>이전</button><button class="btn primary" id="nextBtn" ${ids.indexOf(q.id)===ids.length-1?"disabled":""}>다음 →</button></div></div>
 </article>`;
 $("flagBtn").onclick=()=>{state.flags[q.id]=!state.flags[q.id];commit();$("quizStatus").textContent=`${q.id}번 확인 표시 ${state.flags[q.id]?"설정":"해제"}`;};
 if($("clearBtn"))$("clearBtn").onclick=()=>{delete state.answers[q.id];commit();$("quizStatus").textContent=`${q.id}번 선택 해제`;};
 $("prevBtn").onclick=()=>move(-1);$("nextBtn").onclick=()=>move(1);
 renderQuestionMath();
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
function start(scope){settleClock();const attempt=state.attempt+1;state={...fresh(),scope:[...scope],current:scope[0],attempt};lastTick=null;settleClock();commit({focus:true});window.scrollTo({top:0,behavior:"smooth"});}
function resetConfirm(){showModal("전체 풀이 초기화",`현재 답안·확인 표시·시간을 지우고 전체 ${questions.length}문항을 새로 풉니다. 저장한 결과 파일에는 영향이 없습니다.`,()=>{settleClock();state=fresh();lastTick=null;settleClock();commit({focus:true});window.scrollTo({top:0,behavior:"smooth"});},"초기화");}
function move(dir){const ids=visibleIDs(),idx=ids.indexOf(state.current),next=ids[idx+dir];if(next){state.current=next;commit({focus:true});}}
$("nav").onclick=e=>{const b=e.target.closest("[data-goto]");if(!b)return;const id=Number(b.dataset.goto);if(!visibleIDs().includes(id))state.filter="all";state.current=id;commit({focus:true});};
$("filters").onclick=e=>{const b=e.target.closest("[data-filter]");if(b){state.filter=b.dataset.filter;commit({focus:true});}};
$("question").onclick=e=>{const b=e.target.closest("[data-answer]");if(!b||state.submitted)return;state.answers[state.current]=Number(b.dataset.answer);commit();$("quizStatus").textContent=`${b.dataset.answer*1+1}번 보기 선택`;};
$("submitBtn").onclick=()=>{
 const u=state.scope.filter(id=>!hasAnswer(id)).length;
 showModal("답안을 제출할까요?",u?`아직 ${u}문항에 응답하지 않았습니다. 미응답은 오답으로 채점되며, 제출 후 모든 해설이 공개됩니다.`:"제출하면 답안이 확정되고 정답과 해설이 공개됩니다.",()=>{settleClock();state.submitted=true;lastTick=null;state.filter="all";commit({focus:true});$("quizStatus").textContent="채점이 완료되었습니다.";window.scrollTo({top:0,behavior:"smooth"});},"제출 · 채점");
};
$("resetBtn").onclick=resetConfirm;
$("backupBtn").onclick=()=>{
 settleClock();persist();
 downloadText(encodeResultText("quiz-backup",questions,meta,db,info,state),
  resultFilename(db).replace(/\.txt$/,"_풀이백업.txt"));
 toast("현재 풀이를 백업 파일로 저장했습니다.");
};
$("exportBtn").onclick=()=>{
 if(!state.submitted){toast("결과 저장은 제출 후 가능합니다. 제출 전에는 ‘풀이 백업’을 이용하세요.");return;}
 settleClock();
 downloadText(encodeResultText("quiz-result",questions,meta,db,info,state),resultFilename(db));
};

$("importBtn").onclick=()=>{if(!importReading)$("importFile").click();};
$("importFile").onchange=async event=>{
 const file=event.target.files[0];
 event.target.value="";
 if(!file||importReading)return;
 importReading=true;
 $("importBtn").disabled=true;
 importStatus("TXT 백업·결과를 확인하는 중…","loading");
 $("importBtn").setAttribute("aria-busy","true");
 try{
  if(!/\.txt$/i.test(file.name))throw new Error("TXT 파일을 선택하세요.");
  if(file.size>20*1024*1024)throw new Error("20MB 이하의 TXT 파일만 불러올 수 있습니다.");
  const text=await file.text();
  if(disposed)return;
  const imported=parseResultText(text,questions,meta,db);
  if($("modal").open)throw new Error("열린 확인 창을 닫은 뒤 다시 불러오세요.");
  const note="답안, 풀이 시간, 확인 표시와 재도전 회차를 복원합니다."+
   (imported.contentChanged?" 해설·출처 변경은 호환성을 확인했습니다.":"");
  importStatus("파일 확인 완료 · 불러오기 확인을 기다립니다.","loading");
  showModal("TXT를 불러올까요?",
   `${file.name}\n${imported.state.scope.length}문항의 ${imported.state.submitted?"채점 결과":"제출 전 풀이"}를 불러옵니다.\n${note}\n현재 브라우저 기록은 불러온 풀이로 대체됩니다. 보관하려면 먼저 ‘풀이 백업’을 이용하세요.`,
   ()=>{
    if(disposed)return;
    settleClock();
    state=imported.state;lastTick=null;settleClock();
    commit({focus:true});
    importStatus(canSave
     ?`불러오기 완료: ${file.name}`
     :"불러오기 완료. 자동 저장은 중단되어 있으므로 풀이 백업 파일을 보관하세요.","success");
    toast(imported.state.submitted?"저장한 채점 결과를 불러왔습니다.":"제출 전 풀이를 불러왔습니다.");
    window.scrollTo({top:0,behavior:"smooth"});
   },"불러오기");
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
 if(["1","2","3","4"].includes(e.key)&&!state.submitted&&visibleIDs().length){state.answers[state.current]=Number(e.key)-1;commit();$("quizStatus").textContent=`${e.key}번 보기 선택`;e.preventDefault();}
 if(e.key==="ArrowLeft"){move(-1);e.preventDefault();}
 if(e.key==="ArrowRight"){move(1);e.preventDefault();}
};
document.addEventListener("keydown",onQuizKeydown);
settleClock();
const clockTimer=setInterval(()=>{
 settleClock();
 $("clock").textContent=resultTime(state.seconds);
 if(!state.submitted&&performance.now()-lastSavedAt>=5000)persist();
},1000);
const onVisibility=()=>{
 // 숨김 이벤트에서도 직전까지 보인 구간은 먼저 정산합니다.
 settleClock();
 persist();
};
const onPageHide=()=>{settleClock();lastTick=null;persist();lastTick=null;};
const onPageShow=()=>{lastTick=null;settleClock();};
document.addEventListener("visibilitychange",onVisibility);
window.addEventListener("pagehide",onPageHide);
window.addEventListener("pageshow",onPageShow);
render(); // 읽기 전용 렌더: 초기 진입만으로 기존 저장 기록을 덮어쓰지 않습니다.
return function disposeQuiz(){
  settleClock();
  persist();
  lastTick=null;
  disposed=true;
  $("importFile").onchange=null;
  $("importBtn").onclick=null;
  clearInterval(clockTimer);
  document.removeEventListener("keydown",onQuizKeydown);
  document.removeEventListener("visibilitychange",onVisibility);
  window.removeEventListener("pagehide",onPageHide);
  window.removeEventListener("pageshow",onPageShow);
  if($("modal").open)$("modal").close();
  $("modalOk").onclick=null;
  $("modal").oncancel=null;
};
}
