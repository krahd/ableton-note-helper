(() => {
  const DATA = window.HTCU_DATA;
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const canvas = $('#timelineCanvas');
  const itemLayer = $('#itemLayer');
  const yearLayer = $('#yearLayer');
  const currentYearEl = $('#currentYear');
  const currentSpanEl = $('#currentSpan');
  const zoomLabelEl = $('#zoomLabel');
  const detailDialog = $('#detailDialog');
  const detailContent = $('#detailContent');
  const template = $('#timelineItemTemplate');
  const minimapTrack = $('#minimapTrack');
  const minimapWindow = $('#minimapWindow');
  const scales = [
    { name:'Wide', pxPerYear:115, span:'± 8 years', importance:3, yearStep:5 },
    { name:'Medium', pxPerYear:340, span:'± 2 years', importance:2, yearStep:2 },
    { name:'Close', pxPerYear:650, span:'± 10 months', importance:1, yearStep:1 }
  ];
  let scaleIndex = 1;
  let currentYear = DATA.range.initialYear;
  const renderedItems = new Map();
  const fractionFromYear = year => (year - DATA.range.start) / (DATA.range.end - DATA.range.start);
  const canvasYForYear = year => 260 + (year - DATA.range.start) * scales[scaleIndex].pxPerYear;
  const yearForCanvasY = y => DATA.range.start + (y - 260) / scales[scaleIndex].pxPerYear;

  function dateLabel(dateStr){
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  }
  function objectMarkup(item){
    return `<span class="item-kicker">${item.kicker}</span><span class="item-title">${item.title}</span><span class="item-summary">${item.summary}</span><span class="item-action">Open</span>`;
  }
  function renderItems(){
    itemLayer.innerHTML='';
    renderedItems.clear();
    const minImportance = scales[scaleIndex].importance;
    DATA.items.forEach((item, idx) => {
      if(item.importance < minImportance) return;
      const node = template.content.firstElementChild.cloneNode(true);
      node.classList.add(item.side, `archetype-${item.archetype}`);
      node.dataset.id = item.id;
      node.dataset.importance = item.importance;
      node.setAttribute('aria-label', `${item.title}. ${item.kicker}. Open details.`);
      const object = $('.object', node);
      object.innerHTML = objectMarkup(item);
      if(['newspaper','poster','pamphlet'].includes(item.archetype)) object.style.setProperty('--tilt', `${((idx % 3)-1)*0.7}deg`);
      node.style.top = `${canvasYForYear(item.year) + (item.visualOffset || 0)}px`;
      node.dataset.anchorY = String(canvasYForYear(item.year));
      node.addEventListener('click',()=>openDetail(item));
      itemLayer.appendChild(node);
      renderedItems.set(item.id,node);
    });
  }
  function renderYears(){
    yearLayer.innerHTML='';
    const step = scales[scaleIndex].yearStep;
    for(let y=Math.ceil(DATA.range.start/step)*step; y<=DATA.range.end; y+=step){
      const tick=document.createElement('div');
      tick.className='year-tick';
      if(y%10===0 || y===DATA.range.initialYear) tick.classList.add('major');
      tick.textContent=y;
      tick.style.top=`${canvasYForYear(y)}px`;
      yearLayer.appendChild(tick);
    }
  }
  function renderMinimap(){
    minimapTrack.innerHTML='';
    DATA.moments.forEach(moment=>{
      const dot=document.createElement('button');
      dot.className='minimap-dot'; dot.type='button'; dot.dataset.year=moment.year;
      dot.style.top=`${fractionFromYear(moment.year)*100}%`;
      dot.setAttribute('aria-label',`Go to ${moment.year}: ${moment.title}`);
      dot.addEventListener('click',()=>scrollToYear(moment.year));
      minimapTrack.appendChild(dot);
    });
  }
  function setCanvasHeight(){
    const h = 520 + (DATA.range.end - DATA.range.start) * scales[scaleIndex].pxPerYear;
    canvas.style.height=`${h}px`;
  }
  function scrollTopForYear(year){
    const canvasRect=canvas.getBoundingClientRect();
    const docCanvasTop=window.scrollY+canvasRect.top;
    return docCanvasTop + canvasYForYear(year) - window.innerHeight/2;
  }
  function scrollToYear(year, behavior='smooth'){
    currentYear=year;
    window.scrollTo({top:scrollTopForYear(year),behavior});
  }
  function setScale(next){
    const clamped=Math.max(0,Math.min(scales.length-1,next));
    if(clamped===scaleIndex) return;
    const preserved=currentYear;
    scaleIndex=clamped;
    zoomLabelEl.textContent=scales[scaleIndex].name;
    currentSpanEl.textContent=scales[scaleIndex].span;
    setCanvasHeight(); renderYears(); renderItems();
    requestAnimationFrame(()=>scrollToYear(preserved,'auto'));
  }
  function updateScroll(){
    const center=window.innerHeight/2;
    const canvasRect=canvas.getBoundingClientRect();
    const yInCanvas=center-canvasRect.top;
    const shellRect=$('#timelineSection').getBoundingClientRect();
    const timelineActive=shellRect.top < window.innerHeight*.65 && shellRect.bottom > window.innerHeight*.35;
    document.body.classList.toggle('timeline-active', timelineActive);
    currentYear=Math.max(DATA.range.start,Math.min(DATA.range.end,yearForCanvasY(yInCanvas)));
    currentYearEl.textContent=Math.round(currentYear);
    renderedItems.forEach(node=>{
      const rect=node.getBoundingClientRect();
      const itemCenter=rect.top+Math.min(rect.height,170)/2;
      const dist=Math.abs(itemCenter-center);
      const reveal=Math.max(0,Math.min(1,1-dist/(window.innerHeight*.58)));
      node.style.setProperty('--reveal',reveal.toFixed(3));
      node.style.zIndex=String(10+Math.round(reveal*10));
    });
    const pct=fractionFromYear(currentYear);
    minimapWindow.style.top=`calc(${pct*100}% - 18px)`;
    const visibleYears=window.innerHeight/scales[scaleIndex].pxPerYear;
    minimapWindow.style.height=`${Math.max(22,(visibleYears/(DATA.range.end-DATA.range.start))*minimapTrack.clientHeight)}px`;
  }
  function openDetail(item){
    const tags=item.tags.map(t=>`<span class="tag">${t}</span>`).join('');
    detailContent.innerHTML=`<div class="detail-grid"><div><p class="eyebrow">${item.side==='cu'?'At CU':'History'} · ${dateLabel(item.date)}</p><h2 class="detail-title">${item.title}</h2><p class="detail-summary">${item.summary}</p><div class="detail-body"><p>${item.detail}</p></div></div><aside class="detail-meta"><div class="meta-row"><span class="meta-label">Historical relation</span>${item.relation}</div><div class="meta-row"><span class="meta-label">Prototype object type</span>${item.archetype}</div><div class="meta-row"><span class="meta-label">Date represented</span>${dateLabel(item.date)}</div><div class="tag-list">${tags}</div><a class="detail-source" href="${item.sourceUrl}" target="_blank" rel="noopener">Open verified source ↗</a><div class="meta-row" style="margin-top:24px"><span class="meta-label">Source</span>${item.sourceName}</div></aside></div>`;
    history.replaceState(null,'',`#${item.id}`);
    detailDialog.showModal();
  }
  function closeDetail(){
    detailDialog.close();
    if(location.hash) history.replaceState(null,'',location.pathname+location.search);
  }
  function buildSourceList(){
    const seen=new Map();
    DATA.items.forEach(item=>{
      if(!seen.has(item.sourceUrl)) seen.set(item.sourceUrl,{name:item.sourceName,url:item.sourceUrl,year:Math.floor(item.year),items:[]});
      seen.get(item.sourceUrl).items.push(item.title);
    });
    $('#sourceList').innerHTML=[...seen.values()].map(s=>`<div class="source-entry"><div class="source-year">${s.year}</div><div><h3>${s.name}</h3><p>${s.items.join(' · ')}</p></div><a href="${s.url}" target="_blank" rel="noopener">Source ↗</a></div>`).join('');
  }
  $('#zoomOut').addEventListener('click',()=>setScale(scaleIndex-1));
  $('#zoomIn').addEventListener('click',()=>setScale(scaleIndex+1));
  $('#jump1969').addEventListener('click',()=>scrollToYear(1969));
  $('#enterTimeline').addEventListener('click',()=>scrollToYear(DATA.range.initialYear));
  $('#closeDetail').addEventListener('click',closeDetail);
  detailDialog.addEventListener('cancel',e=>{e.preventDefault();closeDetail()});
  detailDialog.addEventListener('click',e=>{if(e.target===detailDialog) closeDetail()});
  $('#aboutButton').addEventListener('click',()=>$('#aboutDialog').showModal());
  $('#sourcesButton').addEventListener('click',()=>$('#sourcesDialog').showModal());
  $$('[data-close-dialog]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.closeDialog).close()));
  $$('.info-dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
  document.addEventListener('keydown',e=>{
    if(detailDialog.open || $('#aboutDialog').open || $('#sourcesDialog').open) return;
    if(e.key==='+' || e.key==='=') setScale(scaleIndex+1);
    if(e.key==='-') setScale(scaleIndex-1);
    if(e.key==='ArrowUp' && e.altKey) scrollToYear(currentYear-1);
    if(e.key==='ArrowDown' && e.altKey) scrollToYear(currentYear+1);
  });
  let raf=0;
  window.addEventListener('scroll',()=>{if(!raf) raf=requestAnimationFrame(()=>{updateScroll();raf=0})},{passive:true});
  window.addEventListener('resize',()=>updateScroll());
  setCanvasHeight(); renderYears(); renderItems(); renderMinimap(); buildSourceList();
  zoomLabelEl.textContent=scales[scaleIndex].name; currentSpanEl.textContent=scales[scaleIndex].span; updateScroll();
  if(location.hash){ const id=location.hash.slice(1); const item=DATA.items.find(i=>i.id===id); if(item) setTimeout(()=>openDetail(item),100); }
})();
