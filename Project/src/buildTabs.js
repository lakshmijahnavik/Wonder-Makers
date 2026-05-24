// buildTabs.js - Interactive build category tabs that control slideshow
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.build-tab');
  const cards = document.querySelectorAll('#build-slideshow .build-card');

  if (!tabs.length || !cards.length) return;

  let autoTimer = null;
  let currentIdx = 0;

  function setActive(idx) {
    currentIdx = idx;

    tabs.forEach((tab, i) => tab.classList.toggle('is-active', i === idx));
    cards.forEach((card, i) => card.classList.toggle('is-active', i === idx));
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      setActive((currentIdx + 1) % tabs.length);
    }, 3000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Tab click
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      setActive(i);
      stopAuto();
      startAuto();
    });

    tab.addEventListener('mouseenter', () => stopAuto());
    tab.addEventListener('mouseleave', () => startAuto());
  });

  // Initialize
  setActive(0);
  startAuto();
});
