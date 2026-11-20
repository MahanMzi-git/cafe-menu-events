(() => {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-menu-item]')];
  const status = document.querySelector('.menu-results');
  const empty = document.querySelector('.menu-empty');
  if (!buttons.length || !status || !empty) return;

  let category = 'all';
  function update() {
    let count = 0;
    cards.forEach(card => {
      const matches = category === 'all' || card.dataset.category === category;
      card.hidden = !matches;
      count += Number(matches);
    });
    document.querySelectorAll('[data-collection]').forEach(section => {
      section.hidden = !section.querySelector('[data-menu-item]:not([hidden])');
    });
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    });
    empty.hidden = count > 0;
    status.textContent = count.toLocaleString('fa-IR') + ' نوشیدنی در منو';
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    update();
  }));
  document.querySelector('[data-reset]')?.addEventListener('click', () => {
    category = 'all';
    update();
  });
  update();
})();
