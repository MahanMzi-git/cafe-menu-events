(() => {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-menu-item]')];
  const input = document.querySelector('#menu-search');
  const status = document.querySelector('.menu-results');
  const empty = document.querySelector('.menu-empty');
  if (!input) return;
  const search = document.querySelector('.menu-search');
  const searchToggle = search.querySelector('.menu-search-toggle');
  const searchField = search.querySelector('.menu-search-field');
  function setSearchOpen(open) {
    search.classList.toggle('is-open', open);
    searchToggle.setAttribute('aria-expanded', String(open));
    searchToggle.setAttribute('aria-label', open ? 'بستن جست‌وجو' : 'باز کردن جست‌وجو');
    searchField.inert = !open;
    if (open && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(() => input.focus({ preventScroll: true }));
    }
    if (!open) { input.value = ''; update(); }
  }
  searchToggle.addEventListener('click', () => setSearchOpen(!search.classList.contains('is-open')));
  search.addEventListener('transitionend', event => {
    if (event.target === searchField && event.propertyName === 'width' && search.classList.contains('is-open')) {
      input.focus({ preventScroll: true });
    }
  });
  search.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setSearchOpen(false);
      searchToggle.focus({ preventScroll: true });
    }
  });
  document.addEventListener('click', event => {
    if (!search.contains(event.target) && !input.value && search.classList.contains('is-open')) setSearchOpen(false);
  });
  let category = 'all';
  const normalize = value => value.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u064b-\u065f]/g, '').trim().toLowerCase();
  function update() {
    const query = normalize(input.value);
    let count = 0;
    cards.forEach(card => {
      const matches = (category === 'all' || card.dataset.category === category) && normalize(card.textContent).includes(query);
      card.hidden = !matches;
      count += Number(matches);
    });
    document.querySelectorAll('[data-collection]').forEach(section => {
      section.hidden = !section.querySelector('[data-menu-item]:not([hidden])');
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    empty.hidden = count > 0;
    status.textContent = `${count.toLocaleString('fa-IR')} نوشیدنی در منو`;
  }
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; update(); }));
  input.addEventListener('input', update);
  document.querySelector('[data-reset]').addEventListener('click', () => { category = 'all'; input.value = ''; update(); setSearchOpen(true); });
  update();
  if (new URLSearchParams(location.search).has('search')) {
    setSearchOpen(true);
    input.focus({ preventScroll: true });
  }
})();
