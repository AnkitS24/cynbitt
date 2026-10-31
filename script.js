const DATA={
types:{web:["Website / web platform","Marketing sites, portals, e-commerce",1.5,5,"Software engineering"],
app:["Mobile app","Android / iOS",4,10,"Software engineering"],
ai:["AI automation & agents","LLM agents, workflow automation",3,6,"AI automation"],
saas:["SaaS product / dashboard","Multi-user platform, admin panels",6,12,"Software engineering + Product Suite playbooks"],
seo:["Technical SEO & growth","Audit, speed, search visibility",.6,4,"Digital marketing & SEO"],
cloud:["Cloud setup / migration","AWS or Azure, CI/CD, security",2,5,"Cloud infrastructure"]},
scale:{mvp:["MVP / pilot","Prove the idea fast",1,1],growth:["Growth-ready","Real users, integrations",1.8,1.4],ent:["Enterprise-grade","Scale, security, compliance",3.2,1.9]},
feats:{chat:["AI chat / assistant",1.2,2],integ:["Third-party integrations",.8,1],dash:["Analytics dashboard",1,2],pay:["Payments & billing",.6,1],auth:["Roles & secure login",.5,1],lang:["Hindi + English",.4,1]},
speed:{std:["Standard","Balanced pace and cost",1,1],fast:["Fast-track","Priority squad (+25% cost)",1.25,.75]},
phases:[["Discovery",8,"#6366f1"],["Blueprint",10,"#8b5cf6"],["Design",14,"#d946ef"],["Build",40,"#0d9488"],["QA & security",16,"#f59e0b"],["Launch & evolve",12,"#ef4444"]]};
const S={types:new Set(),scale:null,feats:new Set(),speed:null,step:0};
const $=id=>document.getElementById(id),v=$("view");
const STEPS=[
{k:"types",q:"What are you building?",s:"Pick one or more.",o:DATA.types,m:1},
{k:"scale",q:"How big is the ambition?",s:"Choose the closest fit.",o:DATA.scale},
{k:"feats",q:"Any must-have capabilities?",s:"Optional — select what applies.",o:DATA.feats,m:1,opt:1},
{k:"speed",q:"How quickly do you need it?",s:"Sets team size and sequencing.",o:DATA.speed}];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function calc(){
 const T=[...S.types].map(k=>DATA.types[k]),F=[...S.feats].map(k=>DATA.feats[k]);
 const sc=DATA.scale[S.scale],sp=DATA.speed[S.speed];
 const base=T.reduce((a,t)=>a+t[2],0)+F.reduce((a,f)=>a+f[1],0);
 const cost=base*sc[2]*sp[2];
 const ws=T.map(t=>t[3]).sort((a,b)=>b-a);
 const wk=(ws[0]+ws.slice(1).reduce((a,b)=>a+b*.5,0)+F.reduce((a,f)=>a+f[2]*.5,0))*sc[3]*sp[3];
 return{lo:cost*.85,hi:cost*1.2,wk:Math.max(2,Math.round(wk)),T,F};
}
const inr=x=>x>=100?"₹"+(x/100).toFixed(1)+" Cr":"₹"+(x<10?x.toFixed(1):Math.round(x))+" L";
function render(){
 if(S.step>=STEPS.length)return result();
 const d=STEPS[S.step];
 $("pb").style.width=(S.step/STEPS.length*100)+"%";
 $("st").textContent=`Step ${S.step+1} of ${STEPS.length}`;
 const sel=d.m?S[d.k]:null;
 v.innerHTML=`<h2>${d.q}</h2><p class="sub">${d.s}</p><div class="grid">${Object.entries(d.o).map(([k,o])=>{
  const on=d.m?S[d.k].has(k):S[d.k]===k;
  return `<button class="opt" data-k="${k}" aria-pressed="${on}"><b>${esc(o[0])}</b>${typeof o[1]==="string"?`<span>${esc(o[1])}</span>`:""}</button>`}).join("")}</div>
 <div class="nav"><button class="s" id="bk" ${S.step?"":"disabled"}>Back</button><button class="p" id="nx"></button></div>`;
 const ok=()=>d.opt||(d.m?S[d.k].size:S[d.k]);
 const upd=()=>{$("nx").disabled=!ok();$("nx").textContent=S.step===STEPS.length-1?"See my blueprint":"Continue"};upd();
 v.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const k=b.dataset.k;
  if(d.m){S[d.k].has(k)?S[d.k].delete(k):S[d.k].add(k);b.setAttribute("aria-pressed",S[d.k].has(k))}
  else{S[d.k]=k;v.querySelectorAll(".opt").forEach(x=>x.setAttribute("aria-pressed",x===b))}upd()});
 $("bk").onclick=()=>{S.step--;render()};$("nx").onclick=()=>{S.step++;render()};
}
function brief(c,name,co,notes){
 return `Hi Cynbit team,\n\nProject brief (via Blueprint Builder)\n`+
 `• Building: ${c.T.map(t=>t[0]).join(", ")}\n• Scale: ${DATA.scale[S.scale][0]}\n`+
 `• Capabilities: ${c.F.length?c.F.map(f=>f[0]).join(", "):"None specified"}\n• Pace: ${DATA.speed[S.speed][0]}\n`+
 `• Indicative budget: ${inr(c.lo)} – ${inr(c.hi)}\n• Indicative timeline: ~${c.wk} weeks\n`+(notes?`\nNotes: ${notes}\n`:"")+`\nRegards,\n${name||"—"}${co?"\n"+co:""}`;
}
function result(){
 const c=calc();$("pb").style.width="100%";$("st").textContent="Your indicative blueprint";
 let acc=0;const ph=DATA.phases.map(p=>{const w=Math.max(1,Math.round(c.wk*p[1]/100*10)/10);return[p[0],p[1],p[2]]});
 const services=[...new Set(c.T.map(t=>t[4]))];
 v.innerHTML=`<h2>Your blueprint</h2><p class="sub">Based on ${c.T.length} workstream${c.T.length>1?"s":""} at ${esc(DATA.scale[S.scale][0])} scale.</p>
 <div class="kpis"><div class="kpi"><small>Indicative budget</small><div>${inr(c.lo)} – ${inr(c.hi)}</div></div><div class="kpi"><small>Estimated timeline</small><div>~${c.wk} weeks</div></div></div>
 <b>Delivery across Cynbit’s 6-step lifecycle</b>
 <div class="ph" role="img" aria-label="Phase breakdown">${ph.map(p=>`<div style="width:${p[1]}%;background:${p[2]}" title="${p[0]} ≈ ${Math.max(.5,Math.round(c.wk*p[1]/10)/10)} wks">${p[1]>=12?Math.round(c.wk*p[1]/100*10)/10+"w":""}</div>`).join("")}</div>
 <div class="leg">${ph.map(p=>`<span><i style="background:${p[2]}"></i>${p[0]} · ${Math.max(.5,Math.round(c.wk*p[1]/10)/10)} wks</span>`).join("")}</div>
 <b>Recommended Cynbit expertise</b><ul class="rec">${services.map(s=>`<li>${esc(s)}</li>`).join("")}${S.feats.has("chat")||S.types.has("ai")?"<li>Autonomous AI agents &amp; LLM integration</li>":""}</ul>
 <b>Send this brief to the team</b>
 <div class="row"><div style="flex:1;min-width:180px"><label for="nm">Your name</label><input id="nm" autocomplete="name"></div><div style="flex:1;min-width:180px"><label for="co">Company (optional)</label><input id="co" autocomplete="organization"></div></div>
 <label for="no">Anything else we should know?</label><textarea id="no" placeholder="Links, deadlines, existing systems…"></textarea>
 <label for="pv">Preview</label><textarea id="pv" readonly></textarea>
 <div class="row"><a class="p" id="ml" href="#">Email to Cynbit</a><button class="s" id="cp">Copy brief</button><button class="s" id="rs">Start over</button></div>
 <p class="note" id="msg" role="status"></p>`;
 const up=()=>{const b=brief(c,$("nm").value,$("co").value,$("no").value);$("pv").value=b;
  $("ml").href="mailto:opportunities@cynbit.in?subject="+encodeURIComponent("Project inquiry – "+c.T.map(t=>t[0]).join(" + "))+"&body="+encodeURIComponent(b)};
 ["nm","co","no"].forEach(i=>$(i).oninput=up);up();
 $("cp").onclick=async()=>{try{await navigator.clipboard.writeText($("pv").value);$("msg").textContent="Copied to clipboard."}catch(e){$("pv").select();$("msg").textContent="Press Ctrl/Cmd+C to copy."}};
 $("rs").onclick=()=>{S.types.clear();S.feats.clear();S.scale=S.speed=null;S.step=0;render()};
}
render();
