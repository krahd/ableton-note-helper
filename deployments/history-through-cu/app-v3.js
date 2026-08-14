(() => {
  const DATA = window.HTCU_DATA;
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));

  const timelineScroll = $('#timelineScroll');
  const timelineCanvas = $('#timelineCanvas');
  const portalLayer = $('#portalLayer');
  const yearLayer = $('#yearLayer');
  const scrubberTrack = $('#scrubberTrack');
  const scrubberProgress = $('#scrubberProgress');
  const scrubberThumb = $('#scrubberThumb');
  const scrubberAnchors = $('#scrubberAnchors');
  const scrubberYear = $('#scrubberYear');
  const topYear = $('#topYear');
  const topScale = $('#topScale');
  const zoomLabel = $('#zoomLabel');
  const orientationNote = $('#orientationNote');
  const troveView = $('#troveView');
  const troveScroll = $('#troveScroll');
  const troveContent = $('#troveContent');
  const troveProgress = $('#troveProgress');
  const troveIndex = $('#troveIndex');
  const closeTroveButton = $('#closeTrove');

  const scales = [
    { name:'Wide', pxPerYear:118, yearStep:5 },
    { name:'Medium', pxPerYear:260, yearStep:1 },
    { name:'Close', pxPerYear:520, yearStep:1 }
  ];

  let scaleIndex = 1;
  let currentYear = DATA.range.initialYear;
  let lastPortal = null;
  let scrubPointer = null;
  let noteDismissed = false;
  let activeMoment = null;
  let troveRaf = 0;
  const renderedPortals = new Map();

  timelineScroll.style.scrollBehavior = 'auto';
  timelineScroll.style.overflowAnchor = 'none';

  const fractionFromYear = year => clamp((year-DATA.range.start)/(DATA.range.end-DATA.range.start),0,1);
  const canvasYForYear = year => 420 + (year-DATA.range.start)*scales[scaleIndex].pxPerYear;
  const yearForCanvasY = y => DATA.range.start + (y-420)/scales[scaleIndex].pxPerYear;
  const media = key => DATA.media[key];

  function mediaCredit(key){
    const m = media(key);
    if(!m) return '';
    return `<a class="media-credit" href="${m.sourcePage}" target="_blank" rel="noopener"><span>${m.credit}</span><small>${m.rights}</small></a>`;
  }

  function imageMarkup(key, className='', alt=''){
    const m = media(key);
    return `<figure class="media-image ${className}"><img src="${m.src}" alt="${alt}" loading="eager" decoding="async">${mediaCredit(key)}</figure>`;
  }

  function videoMarkup(key, className='', controls=false){
    const m = media(key);
    return `<figure class="media-video ${className}"><video src="${m.src}" ${m.poster ? `poster="${m.poster}"` : ''} muted loop playsinline preload="metadata" ${controls?'controls':''}></video>${mediaCredit(key)}</figure>`;
  }

  function portalMarkup(moment){
    if(moment.portal === 'ride'){
      return `<div class="portal-world portal-ride-world">
          ${imageMarkup('freedomMae','portal-photo','Freedom Rider Mae Frances Moultrie Howard beside the burned bus in 1961')}
          <div class="route-type" aria-hidden="true"><span>WASHINGTON</span><span>ANNISTON</span><span>JACKSON</span></div>
          <div class="portal-year-giant">1961</div>
        </div>
        <div class="portal-cu portal-ride-cu">
          <span class="portal-side-label">AT CU</span>
          <p class="portal-line">CHARLES BIGGERS</p>
          <p class="portal-line portal-line-shift">RETURNS TO BOULDER</p>
          <p class="portal-line portal-line-small">NORLIN LIBRARY · JULY 3</p>
          <span class="portal-relation">DIRECT PARTICIPATION</span>
        </div>`;
    }
    if(moment.portal === 'simultaneity'){
      return `<div class="portal-world portal-1969-world">
          ${imageMarkup('stonewall1969','stonewall-window','The Stonewall Inn in 1969')}
          ${videoMarkup('apollo11','apollo-window')}
          <div class="portal-year-giant">1969</div>
          <span class="stonewall-word">STONEWALL</span><span class="apollo-word">APOLLO 11</span>
        </div>
        <div class="portal-cu portal-1969-cu">
          <span class="portal-side-label">AT CU</span>
          <div class="campus-stack"><span>MACKY</span><span>UMAS</span><span>BLACK STUDIES</span></div>
          <p>Several histories occupy the same months.</p>
        </div>`;
    }
    if(moment.portal === 'network'){
      return `<div class="portal-network-field" aria-hidden="true">
          <span style="--x:5%;--y:18%;--s:1.7">BOULDER</span>
          <span style="--x:48%;--y:8%;--s:.9">NOVEMBER 1970</span>
          <span style="--x:18%;--y:50%;--s:2.5">GAY LIBERATION</span>
          <span style="--x:63%;--y:42%;--s:1.15">PRIVATE HOMES</span>
          <span style="--x:67%;--y:68%;--s:1.5">PUBLICATIONS</span>
          <span style="--x:12%;--y:78%;--s:1">COFFEEHOUSE · DANCES · UMC</span>
        </div>
        <div class="portal-network-copy">
          <span class="portal-side-label">AT CU / BOULDER</span>
          <h3>A movement becomes a place to meet.</h3>
          <span class="portal-relation">LOCAL SOCIAL FORM</span>
        </div>`;
    }
    return `<div class="portal-world portal-1974-world">
        ${imageMarkup('nixonFarewell','nixon-window','Richard Nixon bids staff farewell in August 1974')}
        <span class="nixon-word">AUGUST</span>
        <div class="portal-year-giant">1974</div>
      </div>
      <div class="portal-cu portal-1974-cu">
        <span class="portal-side-label">AT CU / BOULDER · MAY</span>
        <div class="six-names"><span>NEVA ROMERO</span><span>UNA JAAKOLA</span><span>REYES MARTÍNEZ</span><span>FLORENCIO GRANADO</span><span>HERIBERTO TERÁN</span><span>FRANCISCO DOUGHERTY</span></div>
        <span class="portal-relation">SAME YEAR · NO CAUSAL CLAIM</span>
      </div>`;
  }

  function renderPortals(){
    portalLayer.innerHTML = '';
    renderedPortals.clear();
    DATA.moments.forEach((moment, index) => {
      const portal = document.createElement('section');
      portal.className = `moment-portal portal-${moment.portal}`;
      portal.dataset.id = moment.id;
      portal.dataset.year = moment.year;
      portal.style.top = `${canvasYForYear(moment.year)}px`;
      portal.innerHTML = `${portalMarkup(moment)}
        <button class="portal-open" type="button" aria-label="Open ${moment.label}: ${moment.shortTitle}">
          <span class="portal-open-label"><small>${moment.sourceLabel}</small><strong>${moment.shortTitle}</strong></span>
          <span class="portal-arrow" aria-hidden="true">↘</span>
        </button>`;
      $('.portal-open',portal).addEventListener('click',()=>openTrove(moment,portal));
      portalLayer.appendChild(portal);
      renderedPortals.set(moment.id,portal);
      const v = $('video',portal); if(v){ v.muted=true; v.playsInline=true; }
      portal.style.setProperty('--portal-order',index);
    });
  }

  function renderYears(){
    yearLayer.innerHTML='';
    const step=scales[scaleIndex].yearStep;
    for(let y=Math.ceil(DATA.range.start/step)*step;y<=DATA.range.end;y+=step){
      const tick=document.createElement('div');
      tick.className='year-tick';
      if(DATA.moments.some(m=>Math.round(m.year)===y)) tick.classList.add('hero-year');
      else if(y%5===0) tick.classList.add('major');
      tick.textContent=y;
      tick.style.top=`${canvasYForYear(y)}px`;
      yearLayer.appendChild(tick);
    }
  }

  function renderScrubberAnchors(){
    scrubberAnchors.innerHTML='';
    DATA.moments.forEach(moment=>{
      const button=document.createElement('button');
      button.type='button'; button.className='scrubber-anchor';
      button.style.top=`${fractionFromYear(moment.year)*100}%`;
      button.setAttribute('aria-label',`Go to ${moment.label}: ${moment.shortTitle}`);
      button.innerHTML=`<span>${moment.label}</span>`;
      button.addEventListener('click',e=>{e.stopPropagation();scrollToYear(moment.year)});
      scrubberAnchors.appendChild(button);
    });
  }

  function setCanvasHeight(){ timelineCanvas.style.height=`${840+(DATA.range.end-DATA.range.start)*scales[scaleIndex].pxPerYear}px`; }
  function scrollTopForYear(year){ return canvasYForYear(year)-timelineScroll.clientHeight/2; }
  function scrollToYear(year,behavior='smooth'){
    currentYear=clamp(year,DATA.range.start,DATA.range.end);
    const top=scrollTopForYear(currentYear);
    if(behavior==='auto') timelineScroll.scrollTop=top;
    else timelineScroll.scrollTo({top,behavior});
  }

  function updateTimeline(){
    const yInCanvas=timelineScroll.scrollTop+timelineScroll.clientHeight/2;
    currentYear=clamp(yearForCanvasY(yInCanvas),DATA.range.start,DATA.range.end);
    const rounded=Math.round(currentYear);
    topYear.textContent=rounded; scrubberYear.textContent=rounded; scrubberTrack.setAttribute('aria-valuenow',String(rounded));
    const pct=fractionFromYear(currentYear);
    scrubberProgress.style.height=`${pct*100}%`; scrubberThumb.style.top=`${pct*100}%`;
    renderedPortals.forEach(portal=>{
      const portalY=parseFloat(portal.style.top);
      const viewportY=portalY-timelineScroll.scrollTop;
      const center=timelineScroll.clientHeight/2;
      const signed=(viewportY-center)/(timelineScroll.clientHeight*.72);
      const focus=clamp(1-Math.abs(signed),0,1);
      portal.style.setProperty('--focus',focus.toFixed(3));
      portal.style.setProperty('--signed',signed.toFixed(3));
      portal.classList.toggle('is-focused',focus>.62);
      const v=$('video',portal);
      if(v){ if(focus>.3) v.play().catch(()=>{}); else v.pause(); }
    });
    if(!noteDismissed && Math.abs(currentYear-DATA.range.initialYear)>.3){noteDismissed=true;orientationNote.classList.add('is-dismissed')}
  }

  function setScale(next){
    const target=clamp(next,0,scales.length-1); if(target===scaleIndex)return;
    const preserved=currentYear; scaleIndex=target;
    document.body.classList.add('scale-changing');
    setCanvasHeight(); renderYears(); renderPortals();
    requestAnimationFrame(()=>{
      scrollToYear(preserved,'auto'); updateTimeline();
      topScale.textContent=zoomLabel.textContent=scales[scaleIndex].name;
      document.body.classList.remove('scale-changing');
    });
  }

  function fragmentField(chapter, extra=''){
    return `<div class="fragment-field ${extra}" aria-hidden="true">${(chapter.fragments||[]).map((f,i)=>`<span style="--i:${i}">${f}</span>`).join('')}</div>`;
  }

  function sourceMarkup(chapter){
    if(!chapter.sourceUrl)return'';
    return `<a class="chapter-source" href="${chapter.sourceUrl}" target="_blank" rel="noopener"><span>Source</span><strong>${chapter.sourceName||'Open source'}</strong><b aria-hidden="true">↗</b></a>`;
  }

  function chapterCopy(chapter){
    return `<div class="chapter-copy"><p class="chapter-kicker">${chapter.kicker||''}</p><h2>${chapter.title}</h2>${(chapter.body||[]).map(p=>`<p>${p}</p>`).join('')}${sourceMarkup(chapter)}</div>`;
  }

  function chapterMarkup(chapter, moment, index){
    const base=`trove-chapter kind-${chapter.kind}`;
    if(chapter.kind==='image') return `<section class="${base}" data-chapter="${index}">${imageMarkup(chapter.media,'chapter-full-image','Historical archival image')}${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='image-crop') return `<section class="${base}" data-chapter="${index}">${imageMarkup(chapter.media,'chapter-full-image crop-deep','Historical archival image')}<div class="chapter-accent">${chapter.accent||''}</div>${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='video') return `<section class="${base}" data-chapter="${index}">${videoMarkup(chapter.media,'chapter-full-video',false)}${chapterCopy(chapter)}<button class="video-sound" type="button" data-video-sound>Sound off</button></section>`;
    if(chapter.kind==='split-media') return `<section class="${base}" data-chapter="${index}"><div class="split-media-a">${imageMarkup(chapter.media,'','Stonewall Inn in 1969')}</div><div class="split-media-b">${videoMarkup(chapter.media2,'',false)}</div><div class="split-date-a">JUNE 28</div><div class="split-date-b">JULY 20</div>${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='text-field') return `<section class="${base}" data-chapter="${index}">${fragmentField(chapter)}${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='return') return `<section class="${base}" data-chapter="${index}">${fragmentField(chapter,'return-field')}<div class="return-line" aria-hidden="true"></div>${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='network') return `<section class="${base}" data-chapter="${index}">${fragmentField(chapter,'network-fragments')}<div class="network-lines" aria-hidden="true"></div>${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='publication-field') return `<section class="${base}" data-chapter="${index}">${fragmentField(chapter,'publication-fragments')}${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='present-image') return `<section class="${base}" data-chapter="${index}">${imageMarkup(chapter.media,'chapter-full-image contemporary-image','Contemporary view of Old Main at CU Boulder')}${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='names') return `<section class="${base}" data-chapter="${index}"><div class="names-field">${chapter.names.map((n,i)=>`<span style="--i:${i}">${n}</span>`).join('')}</div>${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='absence') return `<section class="${base}" data-chapter="${index}">${fragmentField(chapter,'absence-fragments')}<div class="absence-void" aria-hidden="true"></div>${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='archive-field') return `<section class="${base}" data-chapter="${index}">${fragmentField(chapter,'archive-fragments')}${chapterCopy(chapter)}</section>`;
    if(chapter.kind==='audio-image'){
      const a=media(chapter.audio);
      return `<section class="${base}" data-chapter="${index}">${imageMarkup(chapter.media,'chapter-full-image nixon-image','Richard Nixon bids White House staff farewell')}<audio src="${a.src}" preload="metadata" data-trove-audio></audio><button class="audio-trigger" type="button" data-audio-trigger><span class="audio-icon" aria-hidden="true">▶</span><span>Play resignation audio</span></button>${chapterCopy(chapter)}${mediaCredit(chapter.audio)}</section>`;
    }
    return `<section class="${base}" data-chapter="${index}"><div class="source-horizon" aria-hidden="true">${moment.label}</div>${chapterCopy(chapter)}</section>`;
  }

  function troveMarkup(moment){
    return `<header class="trove-intro theme-${moment.portal}">
      <p>${moment.sourceLabel} · ${moment.label}</p>
      <h1>${moment.title}</h1>
      <p class="trove-dek">${moment.dek}</p>
      <span class="trove-scroll-cue">Scroll to enter <b>↓</b></span>
    </header>
    ${moment.chapters.map((chapter,index)=>chapterMarkup(chapter,moment,index)).join('')}
    <footer class="trove-end theme-${moment.portal}">
      <span>${moment.label}</span>
      <h2>${moment.shortTitle}</h2>
      <div class="trove-end-actions"><button type="button" data-back-timeline>Return to timeline</button>${relatedMomentMarkup(moment)}</div>
    </footer>`;
  }

  function relatedMomentMarkup(moment){
    const index=DATA.moments.findIndex(m=>m.id===moment.id);
    const next=DATA.moments[index+1]||DATA.moments[index-1];
    return next?`<button type="button" data-open-related="${next.id}">Continue to ${next.label}<span aria-hidden="true">→</span></button>`:'';
  }

  function setupTroveMedia(){
    $$('video',troveContent).forEach(v=>{v.muted=true;v.playsInline=true;});
    $$('[data-video-sound]',troveContent).forEach(btn=>btn.addEventListener('click',()=>{
      const v=btn.closest('.trove-chapter').querySelector('video');
      v.muted=!v.muted; btn.textContent=v.muted?'Sound off':'Sound on';
      if(v.paused)v.play().catch(()=>{});
    }));
    $$('[data-audio-trigger]',troveContent).forEach(btn=>btn.addEventListener('click',()=>{
      const audio=btn.closest('.trove-chapter').querySelector('[data-trove-audio]');
      if(audio.paused){audio.play();btn.classList.add('is-playing');btn.querySelector('span:last-child').textContent='Pause resignation audio';btn.querySelector('.audio-icon').textContent='❚❚';}
      else{audio.pause();btn.classList.remove('is-playing');btn.querySelector('span:last-child').textContent='Play resignation audio';btn.querySelector('.audio-icon').textContent='▶';}
    }));
    $('[data-back-timeline]',troveContent)?.addEventListener('click',closeTrove);
    $$('[data-open-related]',troveContent).forEach(btn=>btn.addEventListener('click',()=>{
      const related=DATA.moments.find(m=>m.id===btn.dataset.openRelated); if(related)swapTrove(related);
    }));
  }

  function openTrove(moment,origin){
    activeMoment=moment; lastPortal=origin;
    const rect=origin.getBoundingClientRect();
    troveView.style.setProperty('--origin-x',`${rect.left+rect.width/2}px`);
    troveView.style.setProperty('--origin-y',`${rect.top+rect.height/2}px`);
    troveContent.innerHTML=troveMarkup(moment);
    troveScroll.scrollTop=0;
    troveView.className=`trove-view is-open theme-${moment.portal}`;
    troveView.setAttribute('aria-hidden','false');
    timelineScroll.setAttribute('inert','');
    setupTroveMedia();
    history.replaceState(null,'',`#${moment.id}`);
    requestAnimationFrame(()=>{troveView.classList.add('animate-in');closeTroveButton.focus({preventScroll:true});updateTrove();});
  }

  function swapTrove(moment){
    activeMoment=moment;
    troveView.classList.add('is-swapping');
    setTimeout(()=>{
      troveContent.innerHTML=troveMarkup(moment);troveScroll.scrollTop=0;setupTroveMedia();
      troveView.className=`trove-view is-open animate-in theme-${moment.portal}`;
      history.replaceState(null,'',`#${moment.id}`);updateTrove();
    },180);
  }

  function closeTrove(){
    if(!troveView.classList.contains('is-open'))return;
    $$('video,audio',troveContent).forEach(m=>m.pause?.());
    troveView.classList.remove('animate-in');
    setTimeout(()=>{
      troveView.className='trove-view';troveView.setAttribute('aria-hidden','true');timelineScroll.removeAttribute('inert');
      troveContent.innerHTML='';activeMoment=null;troveProgress.style.width='0%';
      if(location.hash)history.replaceState(null,'',location.pathname+location.search);
      lastPortal?.querySelector('.portal-open')?.focus({preventScroll:true});
    },320);
  }

  function updateTrove(){
    if(!troveView.classList.contains('is-open'))return;
    const max=Math.max(1,troveScroll.scrollHeight-troveScroll.clientHeight);
    const p=clamp(troveScroll.scrollTop/max,0,1);troveProgress.style.width=`${p*100}%`;
    const chapters=$$('.trove-chapter',troveContent);
    let closest=null,dist=Infinity;
    chapters.forEach((ch,i)=>{
      const r=ch.getBoundingClientRect();const d=Math.abs(r.top-window.innerHeight*.22);
      if(d<dist){dist=d;closest={ch,i}};
      const local=clamp(1-Math.abs((r.top+r.height/2-window.innerHeight/2)/(window.innerHeight*.9)),0,1);
      ch.style.setProperty('--chapter-focus',local.toFixed(3));
      $$('video',ch).forEach(v=>{if(local>.25)v.play().catch(()=>{});else v.pause();});
    });
    if(closest){troveIndex.textContent=`${String(closest.i+1).padStart(2,'0')} / ${String(chapters.length).padStart(2,'0')}`;chapters.forEach((ch,i)=>ch.classList.toggle('is-current',i===closest.i));}
  }

  function yearFromPointer(clientY){const rect=scrubberTrack.getBoundingClientRect();const pct=clamp((clientY-rect.top)/rect.height,0,1);return DATA.range.start+pct*(DATA.range.end-DATA.range.start)}
  function scrubToPointer(clientY){scrollToYear(yearFromPointer(clientY),'auto');updateTimeline()}

  $('#zoomOut').addEventListener('click',()=>setScale(scaleIndex-1));
  $('#zoomIn').addEventListener('click',()=>setScale(scaleIndex+1));
  closeTroveButton.addEventListener('click',closeTrove);

  scrubberTrack.addEventListener('pointerdown',e=>{scrubPointer=e.pointerId;scrubberTrack.setPointerCapture(e.pointerId);scrubberTrack.classList.add('is-scrubbing');scrubToPointer(e.clientY)});
  scrubberTrack.addEventListener('pointermove',e=>{if(scrubPointer===e.pointerId)scrubToPointer(e.clientY)});
  const endScrub=e=>{if(scrubPointer!==e.pointerId)return;scrubPointer=null;scrubberTrack.classList.remove('is-scrubbing')};
  scrubberTrack.addEventListener('pointerup',endScrub);scrubberTrack.addEventListener('pointercancel',endScrub);
  scrubberTrack.addEventListener('click',e=>{if(!e.target.closest('.scrubber-anchor'))scrubToPointer(e.clientY)});
  scrubberTrack.addEventListener('keydown',e=>{const step=e.shiftKey?5:1;if(['ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();scrollToYear(currentYear-step)}if(['ArrowDown','ArrowRight'].includes(e.key)){e.preventDefault();scrollToYear(currentYear+step)}if(e.key==='Home'){e.preventDefault();scrollToYear(DATA.range.start)}if(e.key==='End'){e.preventDefault();scrollToYear(DATA.range.end)}});

  $('#aboutButton').addEventListener('click',()=>$('#aboutDialog').showModal());
  $('#sourcesButton').addEventListener('click',()=>$('#sourcesDialog').showModal());
  $$('[data-close-dialog]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.closeDialog).close()));
  $$('.sheet-dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));

  document.addEventListener('keydown',e=>{
    if(troveView.classList.contains('is-open')){if(e.key==='Escape'){e.preventDefault();closeTrove()}return}
    if($('#aboutDialog').open||$('#sourcesDialog').open)return;
    if(e.key==='+'||e.key==='=')setScale(scaleIndex+1);if(e.key==='-')setScale(scaleIndex-1);
  });

  let raf=0;
  timelineScroll.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{updateTimeline();raf=0})},{passive:true});
  troveScroll.addEventListener('scroll',()=>{if(!troveRaf)troveRaf=requestAnimationFrame(()=>{updateTrove();troveRaf=0})},{passive:true});
  window.addEventListener('resize',()=>{updateTimeline();updateTrove()});

  function buildSourceList(){
    const sources=[];
    Object.values(DATA.media).forEach(m=>sources.push({name:m.credit,url:m.sourcePage,note:m.rights}));
    DATA.moments.forEach(moment=>moment.chapters.forEach(ch=>{if(ch.sourceUrl)sources.push({name:ch.sourceName,url:ch.sourceUrl,note:`${moment.label} · ${ch.title}`})}));
    const seen=new Set();
    $('#sourceList').innerHTML=sources.filter(s=>!seen.has(s.url)&&seen.add(s.url)).map(s=>`<a class="source-entry" href="${s.url}" target="_blank" rel="noopener"><span>${s.name}</span><small>${s.note}</small><b aria-hidden="true">↗</b></a>`).join('');
  }

  setCanvasHeight();renderYears();renderPortals();renderScrubberAnchors();buildSourceList();
  topScale.textContent=zoomLabel.textContent=scales[scaleIndex].name;
  requestAnimationFrame(()=>{scrollToYear(DATA.range.initialYear,'auto');updateTimeline()});

  if(location.hash){
    const moment=DATA.moments.find(m=>m.id===location.hash.slice(1));
    if(moment)requestAnimationFrame(()=>openTrove(moment,renderedPortals.get(moment.id)));
  }
})();
