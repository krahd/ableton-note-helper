'use strict';

const SHARP_NAMES=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const FLAT_NAMES=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
const NATURAL_PCS=new Set([0,2,4,5,7,9,11]);
const ROW_OFFSETS=[20,15,10,5,0];

const PATTERNS=[
  {id:'major',family:'Scale',name:'Major (Ionian)',formula:'1 2 3 4 5 6 7',intervals:[0,2,4,5,7,9,11]},
  {id:'dorian',family:'Mode',name:'Dorian',formula:'1 2 ♭3 4 5 6 ♭7',intervals:[0,2,3,5,7,9,10]},
  {id:'phrygian',family:'Mode',name:'Phrygian',formula:'1 ♭2 ♭3 4 5 ♭6 ♭7',intervals:[0,1,3,5,7,8,10]},
  {id:'lydian',family:'Mode',name:'Lydian',formula:'1 2 3 ♯4 5 6 7',intervals:[0,2,4,6,7,9,11]},
  {id:'mixolydian',family:'Mode',name:'Mixolydian',formula:'1 2 3 4 5 6 ♭7',intervals:[0,2,4,5,7,9,10]},
  {id:'minor',family:'Scale',name:'Natural minor (Aeolian)',formula:'1 2 ♭3 4 5 ♭6 ♭7',intervals:[0,2,3,5,7,8,10]},
  {id:'locrian',family:'Mode',name:'Locrian',formula:'1 ♭2 ♭3 4 ♭5 ♭6 ♭7',intervals:[0,1,3,5,6,8,10]},
  {id:'harmonic-minor',family:'Scale',name:'Harmonic minor',formula:'1 2 ♭3 4 5 ♭6 7',intervals:[0,2,3,5,7,8,11]},
  {id:'melodic-minor',family:'Scale',name:'Melodic minor',formula:'1 2 ♭3 4 5 6 7',intervals:[0,2,3,5,7,9,11]},
  {id:'major-pentatonic',family:'Scale',name:'Major pentatonic',formula:'1 2 3 5 6',intervals:[0,2,4,7,9]},
  {id:'minor-pentatonic',family:'Scale',name:'Minor pentatonic',formula:'1 ♭3 4 5 ♭7',intervals:[0,3,5,7,10]},
  {id:'blues',family:'Scale',name:'Blues',formula:'1 ♭3 4 ♭5 5 ♭7',intervals:[0,3,5,6,7,10]},
  {id:'whole-tone',family:'Scale',name:'Whole tone',formula:'1 2 3 ♯4 ♯5 ♭7',intervals:[0,2,4,6,8,10]},
  {id:'diminished-wh',family:'Scale',name:'Diminished (whole–half)',formula:'1 2 ♭3 4 ♭5 ♭6 6 7',intervals:[0,2,3,5,6,8,9,11]},
  {id:'major-triad',family:'Chord',name:'Major triad',formula:'1 3 5',intervals:[0,4,7]},
  {id:'minor-triad',family:'Chord',name:'Minor triad',formula:'1 ♭3 5',intervals:[0,3,7]},
  {id:'diminished-triad',family:'Chord',name:'Diminished triad',formula:'1 ♭3 ♭5',intervals:[0,3,6]},
  {id:'augmented-triad',family:'Chord',name:'Augmented triad',formula:'1 3 ♯5',intervals:[0,4,8]},
  {id:'sus2',family:'Chord',name:'Suspended 2',formula:'1 2 5',intervals:[0,2,7]},
  {id:'sus4',family:'Chord',name:'Suspended 4',formula:'1 4 5',intervals:[0,5,7]},
  {id:'maj7',family:'Arpeggio',name:'Major 7',formula:'1 3 5 7',intervals:[0,4,7,11]},
  {id:'dom7',family:'Arpeggio',name:'Dominant 7',formula:'1 3 5 ♭7',intervals:[0,4,7,10]},
  {id:'min7',family:'Arpeggio',name:'Minor 7',formula:'1 ♭3 5 ♭7',intervals:[0,3,7,10]},
  {id:'m7b5',family:'Arpeggio',name:'Half-diminished 7',formula:'1 ♭3 ♭5 ♭7',intervals:[0,3,6,10]},
  {id:'dim7',family:'Arpeggio',name:'Diminished 7',formula:'1 ♭3 ♭5 𝄫7',intervals:[0,3,6,9]},
  {id:'maj9',family:'Chord',name:'Major 9',formula:'1 3 5 7 9',intervals:[0,2,4,7,11]},
  {id:'dom9',family:'Chord',name:'Dominant 9',formula:'1 3 5 ♭7 9',intervals:[0,2,4,7,10]},
  {id:'min9',family:'Chord',name:'Minor 9',formula:'1 ♭3 5 ♭7 9',intervals:[0,2,3,7,10]},
  {id:'maj7-drop2',family:'Voicing',name:'Maj7 drop-2 (1–5–7–3)',formula:'1 5 7 3',intervals:[0,7,11,16],voicing:true},
  {id:'dom7-drop2',family:'Voicing',name:'7 drop-2 (1–5–♭7–3)',formula:'1 5 ♭7 3',intervals:[0,7,10,16],voicing:true},
  {id:'min7-drop2',family:'Voicing',name:'m7 drop-2 (1–5–♭7–♭3)',formula:'1 5 ♭7 ♭3',intervals:[0,7,10,15],voicing:true},
  {id:'shell-137',family:'Voicing',name:'Major shell (1–3–7)',formula:'1 3 7',intervals:[0,4,11],voicing:true},
  {id:'shell-1b3b7',family:'Voicing',name:'Minor shell (1–♭3–♭7)',formula:'1 ♭3 ♭7',intervals:[0,3,10],voicing:true},
  {id:'shell-13b7',family:'Voicing',name:'Dominant shell (1–3–♭7)',formula:'1 3 ♭7',intervals:[0,4,10],voicing:true},
  {id:'quartal',family:'Voicing',name:'Quartal (1–4–♭7)',formula:'1 4 ♭7',intervals:[0,5,10],voicing:true}
];

const RECOGNITION=[
  [[0,4,7],'major'],[[0,3,7],'minor'],[[0,3,6],'diminished'],[[0,4,8],'augmented'],[[0,2,7],'sus2'],[[0,5,7],'sus4'],
  [[0,4,7,11],'maj7'],[[0,4,7,10],'7'],[[0,3,7,10],'m7'],[[0,3,6,10],'m7♭5'],[[0,3,6,9],'dim7'],[[0,4,8,10],'7♯5'],
  [[0,2,4,7,11],'maj9'],[[0,2,4,7,10],'9'],[[0,2,3,7,10],'m9'],[[0,4,7,9],'6'],[[0,3,7,9],'m6'],[[0,5,7,10],'7sus4']
];

const state={charts:[],tapped:new Set(),spelling:'sharp',linkRoots:true,globalRoot:0,nextId:1};
const chartsEl=document.querySelector('#charts');
const template=document.querySelector('#chart-template');
const rootOptions=()=>Array.from({length:12},(_,i)=>`<option value="${i}">${noteName(i)}</option>`).join('');
function noteName(pc){return (state.spelling==='flat'?FLAT_NAMES:SHARP_NAMES)[((pc%12)+12)%12]}
function patternById(id){return PATTERNS.find(p=>p.id===id)}
function isAccidental(pc){return !NATURAL_PCS.has(((pc%12)+12)%12)}

function addChart(pattern='major',root=state.globalRoot){state.charts.push({id:state.nextId++,pattern,root:Number(root)});renderCharts()}
function removeChart(id){state.charts=state.charts.filter(c=>c.id!==id);renderCharts()}

function renderCharts(){
  chartsEl.innerHTML='';
  state.charts.forEach(chart=>{
    const p=patternById(chart.pattern);const node=template.content.cloneNode(true);const card=node.querySelector('.chart-card');card.dataset.id=chart.id;
    node.querySelector('.chart-family').textContent=p.family;node.querySelector('.chart-title').textContent=`${noteName(chart.root)} ${p.name}`;node.querySelector('.chart-formula').textContent=p.formula;
    const rs=node.querySelector('.chart-root');rs.innerHTML=rootOptions();rs.value=chart.root;
    const ps=node.querySelector('.chart-pattern');ps.innerHTML=PATTERNS.map(x=>`<option value="${x.id}">${x.family} · ${x.name}</option>`).join('');ps.value=chart.pattern;
    rs.addEventListener('change',e=>{chart.root=Number(e.target.value);if(state.linkRoots){state.globalRoot=chart.root;document.querySelector('#global-root').value=chart.root;state.charts.forEach(c=>c.root=chart.root)}renderCharts()});
    ps.addEventListener('change',e=>{chart.pattern=e.target.value;renderCharts()});node.querySelector('.remove-chart').addEventListener('click',()=>removeChart(chart.id));
    drawGrid(node.querySelector('.pad-grid'),chart,p);chartsEl.appendChild(node);
  });
}

function drawGrid(grid,chart,p){
  const allowedAbs=new Set();
  if(p.voicing){p.intervals.forEach(i=>allowedAbs.add(48+chart.root+i));}
  for(let row=0;row<5;row++){
    for(let col=0;col<13;col++){
      const midi=48+ROW_OFFSETS[row]+col;const pc=midi%12;const rel=(pc-chart.root+12)%12;
      const member=p.voicing?allowedAbs.has(midi):p.intervals.some(i=>i%12===rel);const root=pc===chart.root && member;
      const b=document.createElement('button');b.type='button';b.className=`pad ${isAccidental(pc)?'accidental':'natural'}${member?' member':''}${root?' root':''}${state.tapped.has(pc)?' tapped':''}`;
      b.setAttribute('role','gridcell');b.setAttribute('aria-label',`${noteName(pc)}${member?', in pattern':''}`);b.innerHTML=`<span>${noteName(pc)}</span><span class="octave">${Math.floor(midi/12)-1}</span>`;
      b.addEventListener('click',()=>{state.tapped.has(pc)?state.tapped.delete(pc):state.tapped.add(pc);renderCharts();renderRecognition()});grid.appendChild(b);
    }
  }
}

function recognise(){
  const pcs=[...state.tapped].sort((a,b)=>a-b);if(!pcs.length)return null;
  const matches=[];
  for(const root of pcs){const norm=pcs.map(pc=>(pc-root+12)%12).sort((a,b)=>a-b);for(const [ints,label] of RECOGNITION){if(ints.length===norm.length&&ints.every((v,i)=>v===norm[i]))matches.push(`${noteName(root)}${label}`)}}
  return {matches,pcs};
}
function renderRecognition(){const result=recognise();const title=document.querySelector('#recognised-name');const detail=document.querySelector('#recognised-detail');const chips=document.querySelector('#tapped-notes');chips.innerHTML='';if(!result){title.textContent='Tap pads in any grid';detail.textContent='Tapped pitch classes are shared across all charts.';return}result.pcs.forEach(pc=>{const s=document.createElement('span');s.className='note-chip';s.textContent=noteName(pc);chips.appendChild(s)});if(result.matches.length){title.textContent=result.matches.join(' · ');detail.textContent=result.matches.length>1?'Equivalent chord interpretations':'Recognised chord'}else{title.textContent='No exact chord match';detail.textContent=`Pitch-class set: ${result.pcs.map(noteName).join('–')}`}}

function fillGlobalRoot(){const s=document.querySelector('#global-root');s.innerHTML=rootOptions();s.value=state.globalRoot}
function reset(){state.charts=[];state.tapped.clear();state.globalRoot=0;state.nextId=1;[['major',0],['minor',0],['dorian',0],['maj7',0]].forEach(([p,r])=>addChart(p,r));renderRecognition()}

document.querySelector('#add-chart').addEventListener('click',()=>addChart('major'));
document.querySelector('#reset').addEventListener('click',reset);
document.querySelector('#clear-taps').addEventListener('click',()=>{state.tapped.clear();renderCharts();renderRecognition()});
document.querySelector('#global-root').addEventListener('change',e=>{state.globalRoot=Number(e.target.value);if(state.linkRoots)state.charts.forEach(c=>c.root=state.globalRoot);renderCharts()});
document.querySelector('#spelling').addEventListener('change',e=>{state.spelling=e.target.value;fillGlobalRoot();renderCharts();renderRecognition()});
document.querySelector('#link-roots').addEventListener('change',e=>{state.linkRoots=e.target.checked});
fillGlobalRoot();reset();

window.AbletonNoteHelper={PATTERNS,ROW_OFFSETS,recognisePitchClasses(pcs,spelling='sharp'){state.spelling=spelling;state.tapped=new Set(pcs);return recognise()}};
