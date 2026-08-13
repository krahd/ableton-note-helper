(() => {
  const DATA = window.HTCU_DATA;
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  const scroll = $('#timelineScroll');
  const canvas = $('#timelineCanvas');
  const itemLayer = $('#itemLayer');
  const yearLayer = $('#yearLayer');
  const template = $('#timelineItemTemplate');
  const storyView = $('#storyView');
  const storyContent = $('#storyContent');
  const closeStoryButton = $('#closeStory');
  const scrubberTrack = $('#scrubberTrack');
  const scrubberProgress = $('#scrubberProgress');
  const scrubberThumb = $('#scrubberThumb');
  const scrubberAnchors = $('#scrubberAnchors');
  const scrubberYear = $('#scrubberYear');
  const topYear = $('#topYear');
  const topScale = $('#topScale');
  const zoomLabel = $('#zoomLabel');
  const orientationNote = $('#orientationNote');

  scroll.style.scrollBehavior = 'auto';
  scroll.style.overflowAnchor = 'none';
  const webkitEngine = /AppleWebKit/.test(navigator.userAgent) && !/(Chrome|Chromium|Edg)/.test(navigator.userAgent);

  const scales = [
    { name:'Wide', pxPerYear:95, minImportance:3, yearStep:5 },
    { name:'Medium', pxPerYear:230, minImportance:2, yearStep:1 },
    { name:'Close', pxPerYear:500, minImportance:1, yearStep:1 }
  ];

  let scaleIndex = 1;
  let currentYear = DATA.range.initialYear;
  let lastFocusedItem = null;
  let scrubPointer = null;
  let noteDismissed = false;
  const renderedItems = new Map();

  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const fractionFromYear = year => clamp((year-DATA.range.start)/(DATA.range.end-DATA.range.start),0,1);
  const canvasYForYear = year => 360 + (year-DATA.range.start)*scales[scaleIndex].pxPerYear;
  const yearForCanvasY = y => DATA.range.start + (y-360)/scales[scaleIndex].pxPerYear;

  function dateLabel(dateStr){
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  }

  function busMarkup(extraClass=''){
    return `<span class="bus-scene ${extraClass}" aria-hidden="true">
      <span class="bus-shadow"></span>
      <span class="bus-model">
        <span class="bus-roof"></span>
        <span class="bus-side">
          <span class="bus-window w1"></span><span class="bus-window w2"></span><span class="bus-window w3"></span><span class="bus-window w4"></span>
          <span class="bus-door"></span><span class="bus-stripe"></span>
        </span>
        <span class="bus-front"><span class="bus-windshield"></span><span class="bus-headlight h1"></span><span class="bus-headlight h2"></span></span>
        <span class="bus-wheel wheel-a"></span><span class="bus-wheel wheel-b"></span>
      </span>
    </span>`;
  }

  function objectMarkup(item){
    switch(item.archetype){
      case 'bus3d': return `<span class="object-date">1961</span>${busMarkup()}<span class="object-caption"><strong>Freedom Rides</strong><span>May 1961</span></span>`;
      case 'newspaper': return `<span class="paper-fragment"><span class="paper-mast">Colorado Daily</span><strong>BIGGERS RETURNS</strong><span class="paper-rule"></span><span>Norlin Library · July 1961</span></span>`;
      case 'poster': return `<span class="poster-fragment"><small>MACKY</small><strong>HAYAKAWA</strong><span>03 · 03 · 69</span></span>`;
      case 'signal': return `<span class="signal-object"><span class="signal-ring"></span><strong>STONEWALL</strong><span>28 JUN 1969</span></span>`;
      case 'moon': return `<span class="moon-object"><span class="moon-sphere"></span><span class="moon-orbit"></span><strong>APOLLO 11</strong></span>`;
      case 'cluster': return `<span class="cluster-object"><span>UMAS</span><span>education</span><span>organising</span><strong>1968–69</strong></span>`;
      case 'catalogue': return `<span class="catalogue-object"><small>CURRICULUM</small><strong>BLACK<br>STUDIES</strong><span>late 1960s</span></span>`;
      case 'pamphlet': return `<span class="pamphlet-object"><small>BOULDER</small><strong>GAY<br>LIBERATION</strong><span>1970–71</span></span>`;
      case 'memorial': return `<span class="memorial-object"><span class="six-dots">${'<i></i>'.repeat(6)}</span><strong>LOS SEIS</strong><span>MAY 1974</span></span>`;
      case 'document': return `<span class="document-object"><small>THE WHITE HOUSE</small><strong>RESIGNATION</strong><span>AUG 9 · 1974</span></span>`;
      default: return `<span class="annotation-object"><strong>${item.title}</strong><span>${item.kicker}</span></span>`;
    }
  }

  function renderItems(){
    itemLayer.innerHTML = '';
    renderedItems.clear();
    const minImportance = scales[scaleIndex].minImportance;
    DATA.items.forEach((item, idx) => {
      if(item.importance < minImportance) return;
      const node = template.content.firstElementChild.cloneNode(true);
      node.classList.add(item.side, `archetype-${item.archetype}`);
      node.dataset.id = item.id;
      node.dataset.year = item.year;
      node.setAttribute('aria-label', `${item.title}. ${item.kicker}. Open interpretive scene.`);
      $('.object', node).innerHTML = objectMarkup(item);
      node.style.top = `${canvasYForYear(item.year)}px`;
      node.style.setProperty('--stagger', `${(idx%4)*18}ms`);
      node.addEventListener('click', () => openStory(item,node));
      itemLayer.appendChild(node);
      renderedItems.set(item.id,node);
    });
  }

  function renderYears(){
    yearLayer.innerHTML = '';
    const step = scales[scaleIndex].yearStep;
    for(let y=Math.ceil(DATA.range.start/step)*step; y<=DATA.range.end; y+=step){
      const tick = document.createElement('div');
      tick.className = 'year-tick';
      if(y===1961 || y===1969 || y===1974) tick.classList.add('hero-year');
      else if(y%5===0) tick.classList.add('major');
      tick.textContent = y;
      tick.style.top = `${canvasYForYear(y)}px`;
      yearLayer.appendChild(tick);
    }
  }

  function renderScrubberAnchors(){
    scrubberAnchors.innerHTML = '';
    DATA.moments.forEach(moment => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'scrubber-anchor';
      button.style.top = `${fractionFromYear(moment.year)*100}%`;
      button.setAttribute('aria-label', `Go to ${Math.round(moment.year)}: ${moment.title}`);
      button.innerHTML = `<span>${Math.round(moment.year)}</span>`;
      button.addEventListener('click', e => { e.stopPropagation(); scrollToYear(moment.year); });
      scrubberAnchors.appendChild(button);
    });
  }

  function setCanvasHeight(){ canvas.style.height = `${720 + (DATA.range.end-DATA.range.start)*scales[scaleIndex].pxPerYear}px`; }
  function scrollTopForYear(year){ return canvasYForYear(year) - scroll.clientHeight/2; }
  function scrollToYear(year, behavior='smooth'){
    const y = clamp(year,DATA.range.start,DATA.range.end);
    currentYear = y;
    const top = scrollTopForYear(y);
    if(behavior === 'auto') scroll.scrollTop = top;
    else scroll.scrollTo({top,behavior});
  }

  function setScale(next){
    const target = clamp(next,0,scales.length-1);
    if(target===scaleIndex) return;
    const preserved = currentYear;
    document.body.classList.add('scale-changing');
    scaleIndex = target;
    setCanvasHeight(); renderYears(); renderItems();
    void canvas.offsetHeight;
    const restoreAnchor = () => {
      const maxTop = Math.max(0,scroll.scrollHeight-scroll.clientHeight);
      scroll.scrollTop = clamp(scrollTopForYear(preserved),0,maxTop);
      currentYear = preserved;
      updateScroll();
    };
    restoreAnchor();
    requestAnimationFrame(() => {
      restoreAnchor();
      requestAnimationFrame(() => {
        restoreAnchor();
        topScale.textContent = scales[scaleIndex].name;
        zoomLabel.textContent = scales[scaleIndex].name;
        document.body.classList.remove('scale-changing');
      });
    });
  }

  function updateScroll(){
    const yInCanvas = scroll.scrollTop + scroll.clientHeight/2;
    currentYear = clamp(yearForCanvasY(yInCanvas),DATA.range.start,DATA.range.end);
    const rounded = Math.round(currentYear);
    topYear.textContent = rounded;
    scrubberYear.textContent = rounded;
    scrubberTrack.setAttribute('aria-valuenow', String(rounded));
    const pct = fractionFromYear(currentYear);
    scrubberProgress.style.height = `${pct*100}%`;
    scrubberThumb.style.top = `${pct*100}%`;
    renderedItems.forEach(node => {
      const itemY = parseFloat(node.style.top);
      const itemViewportY = itemY - scroll.scrollTop;
      const center = scroll.clientHeight/2;
      const signed = (itemViewportY-center)/(scroll.clientHeight*.62);
      const reveal = clamp(1-Math.abs(signed),0,1);
      const presence = clamp(1-Math.abs(signed)*.62,0,1);
      node.style.setProperty('--reveal', reveal.toFixed(3));
      node.style.setProperty('--presence', presence.toFixed(3));
      node.style.setProperty('--signed', signed.toFixed(3));
      node.style.zIndex = String(10+Math.round(reveal*30));
    });
    if(!noteDismissed && Math.abs(currentYear-DATA.range.initialYear)>.35){
      noteDismissed = true;
      orientationNote.classList.add('is-dismissed');
    }
  }

  function visualForStory(item){
    if(item.archetype==='bus3d') return `<div class="story-visual story-bus">${busMarkup('large')}</div>`;
    if(item.archetype==='memorial') return `<div class="story-visual story-memorial"><div class="memorial-field">${'<span></span>'.repeat(6)}</div><div class="memorial-word">LOS SEIS</div></div>`;
    if(item.archetype==='signal') return `<div class="story-visual story-signal"><div class="signal-halo"></div><strong>STONEWALL</strong><span>JUNE 28 · 1969</span></div>`;
    if(item.archetype==='moon') return `<div class="story-visual story-moon"><div class="large-moon"></div><div class="orbit-line"></div><span>APOLLO 11</span></div>`;
    if(item.archetype==='newspaper') return `<div class="story-visual story-paper"><div class="paper-large"><small>COLORADO DAILY</small><strong>CHARLES BIGGERS<br>RETURNS TO CU</strong><span>JULY 3 · 1961</span></div></div>`;
    if(item.archetype==='poster') return `<div class="story-visual story-poster"><span>MACKY</span><strong>HAYAKAWA</strong><small>MARCH 3 · 1969</small></div>`;
    if(item.archetype==='pamphlet') return `<div class="story-visual story-pamphlet"><small>BOULDER</small><strong>GAY<br>LIBERATION</strong><span>1970—71</span></div>`;
    if(item.archetype==='document') return `<div class="story-visual story-document"><small>THE WHITE HOUSE</small><strong>RESIGNATION</strong><span>AUGUST 9 · 1974</span></div>`;
    if(item.archetype==='cluster') return `<div class="story-visual story-cluster"><span>organising</span><span>education</span><strong>UMAS</strong><span>retention</span><span>change</span></div>`;
    if(item.archetype==='catalogue') return `<div class="story-visual story-catalogue"><small>CURRICULUM</small><strong>BLACK<br>STUDIES</strong><span>institutional form</span></div>`;
    return `<div class="story-visual story-generic"><strong>${item.title}</strong></div>`;
  }

  function storyMarkup(item){
    return `<article class="story-article side-${item.side}">
      <div class="story-hero" data-story-hero>${visualForStory(item)}</div>
      <div class="story-copy">
        <p class="story-context">${item.side==='cu'?'At CU / Boulder':'Wider history'} · ${item.displayDate || dateLabel(item.date)}</p>
        <h1>${item.title}</h1>
        <p class="story-deck">${item.summary}</p>
        <div class="story-narrative"><p>${item.detail}</p></div>
        <aside class="relation-note"><span>Why it is here</span><p>${item.relationNote}</p></aside>
        <div class="story-actions">
          ${item.relatedId ? `<button class="related-button" type="button" data-related="${item.relatedId}">${item.relatedLabel}<span aria-hidden="true">→</span></button>` : ''}
          <a class="source-button" href="${item.sourceUrl}" target="_blank" rel="noopener">Source: ${item.sourceName}<span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </article>`;
  }

  function applyStoryContent(item){
    storyContent.innerHTML = storyMarkup(item);
    $('[data-related]',storyContent)?.addEventListener('click', e => {
      const related = DATA.items.find(x => x.id===e.currentTarget.dataset.related);
      if(related) transitionBetweenStories(related);
    });
  }

  function withViewTransition(perform, after){
    let performed = false;
    let finished = false;
    const guardedPerform = () => {
      if(performed) return;
      performed = true;
      perform();
    };
    const guardedFinish = () => {
      if(finished) return;
      finished = true;
      after?.();
    };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reliableNativeTransition = typeof document.startViewTransition === 'function' && !webkitEngine;
    if(!reliableNativeTransition || reduced){
      guardedPerform();
      guardedFinish();
      return;
    }
    try {
      const transition = document.startViewTransition(guardedPerform);
      requestAnimationFrame(() => { if(!performed) guardedPerform(); });
      if(transition?.finished?.then) transition.finished.then(guardedFinish,guardedFinish);
      else requestAnimationFrame(guardedFinish);
      setTimeout(guardedFinish,800);
    } catch(error){
      guardedPerform();
      guardedFinish();
    }
  }

  function openStory(item, originNode){
    lastFocusedItem = originNode;
    const rect = originNode.getBoundingClientRect();
    storyView.style.setProperty('--origin-x', `${rect.left + rect.width/2}px`);
    storyView.style.setProperty('--origin-y', `${rect.top + rect.height/2}px`);
    originNode.style.viewTransitionName = 'history-object';
    const perform = () => {
      originNode.style.viewTransitionName = '';
      applyStoryContent(item);
      const hero = $('[data-story-hero]',storyContent);
      if(hero) hero.style.viewTransitionName = 'history-object';
      storyView.setAttribute('aria-hidden','false');
      storyView.classList.add('is-open');
      scroll.setAttribute('inert','');
      history.replaceState(null,'',`#${item.id}`);
      requestAnimationFrame(() => closeStoryButton.focus({preventScroll:true}));
    };
    withViewTransition(perform, () => { originNode.style.viewTransitionName=''; });
    requestAnimationFrame(() => {
      if(storyView.classList.contains('is-open')) storyView.classList.add('animate-in');
    });
  }

  function transitionBetweenStories(item){
    const perform = () => {
      storyView.classList.remove('story-swapped');
      applyStoryContent(item);
      history.replaceState(null,'',`#${item.id}`);
      requestAnimationFrame(() => storyView.classList.add('story-swapped'));
    };
    withViewTransition(perform);
  }

  function closeStory(){
    if(!storyView.classList.contains('is-open')) return;
    const origin = lastFocusedItem;
    const hero = $('[data-story-hero]',storyContent);
    if(hero) hero.style.viewTransitionName='history-object';
    const perform = () => {
      if(hero) hero.style.viewTransitionName='';
      if(origin) origin.style.viewTransitionName='history-object';
      storyView.classList.remove('is-open','animate-in','story-swapped');
      storyView.setAttribute('aria-hidden','true');
      scroll.removeAttribute('inert');
      if(location.hash) history.replaceState(null,'',location.pathname+location.search);
    };
    const finishClose = () => {
      if(origin) origin.style.viewTransitionName='';
      origin?.focus({preventScroll:true});
    };
    if(origin) withViewTransition(perform,finishClose);
    else { perform(); finishClose(); }
  }

  function yearFromPointer(clientY){
    const rect = scrubberTrack.getBoundingClientRect();
    const pct = clamp((clientY-rect.top)/rect.height,0,1);
    return DATA.range.start + pct*(DATA.range.end-DATA.range.start);
  }
  function scrubToPointer(clientY){ scrollToYear(yearFromPointer(clientY),'auto'); updateScroll(); }

  function buildSourceList(){
    const seen = new Map();
    DATA.items.forEach(item => {
      if(!seen.has(item.sourceUrl)) seen.set(item.sourceUrl,{name:item.sourceName,url:item.sourceUrl,items:[]});
      seen.get(item.sourceUrl).items.push(item.title);
    });
    $('#sourceList').innerHTML = [...seen.values()].map(s => `<a class="source-entry" href="${s.url}" target="_blank" rel="noopener"><span>${s.name}</span><small>${s.items.join(' · ')}</small><b aria-hidden="true">↗</b></a>`).join('');
  }

  $('#zoomOut').addEventListener('click',()=>setScale(scaleIndex-1));
  $('#zoomIn').addEventListener('click',()=>setScale(scaleIndex+1));
  closeStoryButton.addEventListener('click',closeStory);

  scrubberTrack.addEventListener('pointerdown', e => {
    scrubPointer = e.pointerId;
    scrubberTrack.setPointerCapture(e.pointerId);
    scrubberTrack.classList.add('is-scrubbing');
    scrubToPointer(e.clientY);
  });
  scrubberTrack.addEventListener('pointermove', e => { if(scrubPointer===e.pointerId) scrubToPointer(e.clientY); });
  const endScrub = e => {
    if(scrubPointer!==e.pointerId) return;
    scrubPointer = null;
    scrubberTrack.classList.remove('is-scrubbing');
  };
  scrubberTrack.addEventListener('pointerup',endScrub);
  scrubberTrack.addEventListener('pointercancel',endScrub);
  scrubberTrack.addEventListener('click', e => {
    if(e.target.closest('.scrubber-anchor')) return;
    scrubToPointer(e.clientY);
  });
  scrubberTrack.addEventListener('keydown', e => {
    const step = e.shiftKey ? 5 : 1;
    if(e.key==='ArrowUp' || e.key==='ArrowLeft') { e.preventDefault(); scrollToYear(currentYear-step); }
    if(e.key==='ArrowDown' || e.key==='ArrowRight') { e.preventDefault(); scrollToYear(currentYear+step); }
    if(e.key==='Home') { e.preventDefault(); scrollToYear(DATA.range.start); }
    if(e.key==='End') { e.preventDefault(); scrollToYear(DATA.range.end); }
  });

  $('#aboutButton').addEventListener('click',()=>$('#aboutDialog').showModal());
  $('#sourcesButton').addEventListener('click',()=>$('#sourcesDialog').showModal());
  $$('[data-close-dialog]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.closeDialog).close()));
  $$('.sheet-dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));

  document.addEventListener('keydown',e=>{
    if(storyView.classList.contains('is-open')){
      if(e.key==='Escape'){e.preventDefault();closeStory();}
      return;
    }
    if($('#aboutDialog').open || $('#sourcesDialog').open) return;
    if(e.key==='+' || e.key==='=') setScale(scaleIndex+1);
    if(e.key==='-') setScale(scaleIndex-1);
  });

  let raf = 0;
  scroll.addEventListener('scroll',()=>{ if(!raf) raf=requestAnimationFrame(()=>{updateScroll();raf=0;}); },{passive:true});
  window.addEventListener('resize',updateScroll);

  setCanvasHeight(); renderYears(); renderItems(); renderScrubberAnchors(); buildSourceList();
  topScale.textContent = zoomLabel.textContent = scales[scaleIndex].name;
  requestAnimationFrame(()=>{ scrollToYear(DATA.range.initialYear,'auto'); updateScroll(); });

  if(location.hash){
    const id = location.hash.slice(1);
    const item = DATA.items.find(i=>i.id===id);
    if(item){
      requestAnimationFrame(()=>{
        const node = renderedItems.get(id);
        if(node) openStory(item,node);
      });
    }
  }
})();
