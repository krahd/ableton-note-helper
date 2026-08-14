(() => {
  const content = document.getElementById('troveContent');
  if (!content) return;

  const media = key => window.HTCU_DATA?.media?.[key];
  const mediaLink = key => {
    const item = media(key);
    if (!item) return '';
    return `<a class="intro-media-credit" href="${item.sourcePage}" target="_blank" rel="noopener"><span>${item.credit}</span><small>${item.rights}</small></a>`;
  };

  const image = (key, cls, alt) => {
    const item = media(key);
    if (!item) return '';
    return `<figure class="${cls}"><img src="${item.src}" alt="${alt}" decoding="async">${mediaLink(key)}</figure>`;
  };

  const video = (key, cls) => {
    const item = media(key);
    if (!item) return '';
    return `<figure class="${cls}"><video src="${item.src}" ${item.poster ? `poster="${item.poster}"` : ''} muted loop playsinline preload="metadata"></video>${mediaLink(key)}</figure>`;
  };

  function authoredLayer(intro){
    if (intro.dataset.authored === 'true') return;
    intro.dataset.authored = 'true';

    if (intro.classList.contains('theme-ride')) {
      intro.insertAdjacentHTML('afterbegin', `
        <div class="authored-intro authored-intro-ride" aria-hidden="true">
          ${image('freedomMae','ride-intro-photo','')}
          <div class="ride-intro-places"><span>WASHINGTON</span><span>ANNISTON</span><span>JACKSON</span><span>BOULDER</span></div>
          <div class="ride-intro-year">1961</div>
        </div>`);
    } else if (intro.classList.contains('theme-simultaneity')) {
      intro.insertAdjacentHTML('afterbegin', `
        <div class="authored-intro authored-intro-simultaneity" aria-hidden="true">
          <div class="simultaneity-half simultaneity-stonewall">${image('stonewall1969','intro-stonewall','')}</div>
          <div class="simultaneity-half simultaneity-apollo">${video('apollo11','intro-apollo')}</div>
          <span class="simultaneity-date date-a">JUNE 28</span>
          <span class="simultaneity-date date-b">JULY 20</span>
          <div class="simultaneity-year">1969</div>
        </div>`);
    } else if (intro.classList.contains('theme-network')) {
      intro.insertAdjacentHTML('afterbegin', `
        <div class="authored-intro authored-intro-network" aria-hidden="true">
          <span class="network-intro-word n1">NOVEMBER 1970</span>
          <span class="network-intro-word n2">BOULDER</span>
          <span class="network-intro-word n3">GAY LIBERATION</span>
          <span class="network-intro-word n4">PRIVATE HOMES</span>
          <span class="network-intro-word n5">COFFEEHOUSE</span>
          <span class="network-intro-word n6">PUBLICATIONS</span>
          <span class="network-intro-word n7">UMC</span>
          <span class="network-intro-word n8">DANCES</span>
          <span class="network-intro-word n9">COUNSELLING</span>
        </div>`);
    } else if (intro.classList.contains('theme-counterpoint')) {
      const names = window.HTCU_DATA?.moments?.find(m => m.id === 'm1974')?.chapters?.find(c => c.kind === 'names')?.names || [];
      intro.insertAdjacentHTML('afterbegin', `
        <div class="authored-intro authored-intro-counterpoint" aria-hidden="true">
          <div class="counterpoint-federal">${image('nixonFarewell','counterpoint-nixon','')}</div>
          <div class="counterpoint-names">${names.map((name,i)=>`<span style="--i:${i}">${name}</span>`).join('')}</div>
          <span class="counterpoint-month month-a">MAY</span>
          <span class="counterpoint-month month-b">AUGUST</span>
          <div class="counterpoint-year">1974</div>
        </div>`);
    }

    intro.querySelectorAll('video').forEach(v => {
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    });
  }

  const observer = new MutationObserver(() => {
    content.querySelectorAll('.trove-intro').forEach(authoredLayer);
  });
  observer.observe(content,{childList:true,subtree:true});
})();
