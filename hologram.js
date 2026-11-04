/* Decorative enhancements only: no archive data or application state is changed. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let paused = reducedMotion.matches;
  try { paused = reducedMotion.matches || localStorage.getItem('archive-motion') === 'paused'; } catch (_) {}
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'motion-toggle';
  const syncMotion = () => {
    root.dataset.motion = paused ? 'paused' : 'active';
    toggle.textContent = paused ? '▷' : 'Ⅱ';
    toggle.disabled = reducedMotion.matches;
    toggle.setAttribute('aria-label', reducedMotion.matches ? '기기의 동작 줄이기 설정으로 애니메이션이 꺼져 있습니다' : paused ? '장식 애니메이션 재생' : '장식 애니메이션 일시 정지');
    toggle.title = toggle.getAttribute('aria-label');
  };
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('archive-motion', paused ? 'paused' : 'active'); } catch (_) {}
    syncMotion();
  });
  reducedMotion.addEventListener('change', e => { paused = e.matches; syncMotion(); });
  document.querySelector('.header-actions, .header-inner')?.append(toggle);
  syncMotion();

  // Observe new cards too, so filters, search and reshuffling keep their entrance effect.
  const selector = '.document-card, .db-card, .work-card';
  const seen = new WeakSet();
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('holo-enter');
      observer.unobserve(entry.target);
    }
  }, {threshold:.06}) : null;
  const prepare = scope => {
    const cards = [...(scope.matches?.(selector) ? [scope] : []), ...scope.querySelectorAll(selector)];
    cards.forEach(card => {
      if (seen.has(card)) return;
      seen.add(card);
      const position = [...card.parentElement.children].indexOf(card);
      card.style.setProperty('--reveal-delay', `${Math.min(position % 4, 3) * 65}ms`);
      observer?.observe(card);
      card.addEventListener('animationend', event => {
        if (event.animationName === 'holo-arrive') card.classList.remove('holo-enter');
      });
    });
  };
  prepare(document);
  const mutations = new MutationObserver(records => {
    for (const record of records) for (const node of record.addedNodes) if (node.nodeType === 1) prepare(node);
  });
  for (const id of ['daily-grid', 'random-grid', 'list-grid', 'dbList', 'work-grid']) {
    const grid = document.getElementById(id);
    if (grid) mutations.observe(grid, {childList:true});
  }

  let frame = 0;
  document.addEventListener('pointermove', event => {
    if (paused || reducedMotion.matches || !finePointer.matches || frame) return;
    const card = event.target.closest('.document-card, .db-card, .hero-art');
    if (!card) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      card.style.setProperty('--pointer-x', `${x}px`);
      card.style.setProperty('--pointer-y', `${y}px`);
      if (card.classList.contains('hero-art')) {
        card.style.setProperty('--scene-x', `${(0.5 - y / bounds.height) * 8}deg`);
        card.style.setProperty('--scene-y', `${(x / bounds.width - 0.5) * 10}deg`);
      }
    });
  }, {passive:true});
  document.querySelector('.hero-art')?.addEventListener('pointerleave', event => {
    event.currentTarget.style.setProperty('--scene-x', '0deg');
    event.currentTarget.style.setProperty('--scene-y', '0deg');
  });
})();
