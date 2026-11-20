const $ = s => document.querySelector(s);
let broken = load(), active = null;
function load(){ try { return JSON.parse(localStorage.getItem("brokenLifts") || "{}"); } catch(e){ return {}; } }
function save(){ try { localStorage.setItem("brokenLifts", JSON.stringify(broken)); } catch(e){} }
const isStepFree = e => !["steps","stairs"].includes(e.t);
const secs = e => e.d/1.2 + (e.t === "lift" ? 30 : 0);
const floorName = id => NODES[id].f ? "first floor" : "ground floor";

// Dijkstra. sf=true skips stairs/steps. Broken lifts are skipped in both modes.
function route(from, to, sf){
  const dist = {[from]:0}, prev = {}, done = new Set();
  while (true) {
    let u = null;
    for (const k in dist) if (!done.has(k) && (u === null || dist[k] < dist[u])) u = k;
    if (u === null) return null;
    if (u === to) break;
    done.add(u);
    for (const e of EDGES) {
      if ((e.id && broken[e.id]) || (sf && !isStepFree(e))) continue;
      const v = e.a === u ? e.b : e.b === u ? e.a : null;
      if (!v || done.has(v)) continue;
      const nd = dist[u] + secs(e);
      if (dist[v] === undefined || nd < dist[v]) { dist[v] = nd; prev[v] = {u, e}; }
    }
  }
  const steps = [];
  for (let v = to; v !== from; v = prev[v].u) steps.unshift({e: prev[v].e, from: prev[v].u, to: v});
  return steps;
}

function say({e, from, to}){
  const up = e.t === "steps" ? (from === e.a) === !!e.up : NODES[to].f > NODES[from].f;
  switch (e.t) {
    case "lift": return `Take the lift ${up ? "up" : "down"} to the ${floorName(to)}. ${e.lm}.`;
    case "stairs": return `Take the stairs ${up ? "up" : "down"} to the ${floorName(to)}. ${e.lm}.`;
    case "steps": return `Go ${up ? "up" : "down"} ${e.n} steps. ${e.lm}.`;
    case "door": return `Go through the door into ${NODES[to].n}. ${e.lm}.`;
    case "ramp": return `Follow the ramp toward ${NODES[to].n}, about ${e.d} metres. ${e.lm}.`;
    default: return `Walk about ${Math.round(e.d/0.7)} steps (${e.d} metres) toward ${NODES[to].n}. ${e.lm}.`;
  }
}
const mins = r => Math.max(1, Math.round(r.reduce((s,x) => s + secs(x.e), 0) / 60));
const metres = r => r.reduce((s,x) => s + x.e.d, 0);

function show(prefix = ""){
  if (!active) return;
  const {from, to, sf} = active;
  const r = route(from, to, sf), alt = route(from, to, !sf);
  const list = $("#directions");
  list.innerHTML = "";
  if (!r) {
    $("#summary").textContent = sf ? "No step-free route is available right now." : "No route is available right now.";
    $("#compare").textContent = "Check the lift status below or ask campus security for help.";
    $("#status").textContent = prefix + $("#summary").textContent;
    return;
  }
  r.forEach(s => { const li = document.createElement("li"); li.textContent = say(s); list.appendChild(li); });
  const label = sf ? "Step-free" : "Fastest";
  $("#summary").textContent = `${label} route: about ${mins(r)} min, ${metres(r)} m, ${r.length} steps.`;
  const o = sf ? "Fastest" : "Step-free";
  $("#compare").textContent = alt ? `${o} route for comparison: about ${mins(alt)} min, ${metres(alt)} m.` : `No ${o.toLowerCase()} route available.`;
  $("#status").textContent = prefix + $("#summary").textContent;
}

function renderLifts(){
  const ul = $("#lifts"); ul.innerHTML = "";
  for (const id in LIFTS) {
    const bad = !!broken[id], li = document.createElement("li");
    li.innerHTML = `<span>${LIFTS[id]}: <strong>${bad ? "Out of service" : "Working"}</strong></span>`;
    const b = document.createElement("button");
    b.textContent = bad ? "Mark as fixed" : "Report as broken";
    b.setAttribute("aria-label", `${b.textContent}: ${LIFTS[id]}`);
    b.onclick = () => {
      if (bad) delete broken[id]; else broken[id] = Date.now();
      save(); renderLifts();
      show(`${LIFTS[id]} marked ${bad ? "working" : "out of service"}. Route updated. `);
      if (!active) $("#status").textContent = `${LIFTS[id]} marked ${bad ? "working" : "out of service"}.`;
    };
    li.appendChild(b); ul.appendChild(li);
  }
}

for (const id in NODES) for (const s of ["#from","#to"]) {
  const o = document.createElement("option"); o.value = id; o.textContent = NODES[id].n; $(s).appendChild(o);
}
$("#from").value = "gate"; $("#to").value = "lib_1";
$("#go").onclick = () => {
  const from = $("#from").value, to = $("#to").value;
  if (from === to) { $("#status").textContent = "Start and destination are the same. Choose a different destination."; return; }
  active = {from, to, sf: document.querySelector('input[name="mode"]:checked').value === "stepfree"};
  show(); $("#summary").focus();
};
$("#speak").onclick = () => {
  if (!("speechSynthesis" in window)) { $("#status").textContent = "Read aloud is not supported in this browser."; return; }
  speechSynthesis.cancel();
  const text = [...document.querySelectorAll("#directions li")].map((li,i) => `Step ${i+1}. ${li.textContent}`).join(" ");
  if (text) speechSynthesis.speak(new SpeechSynthesisUtterance($("#summary").textContent + " " + text));
};
renderLifts();
