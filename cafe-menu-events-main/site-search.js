(() => {
  const trigger = document.querySelector('[data-site-search]');
  if (!trigger) return;
  const header = trigger.closest('header');
  const search = document.createElement('div');
  search.className = 'header-search';
  trigger.before(search);
  search.append(trigger);
  const field = document.createElement('div');
  field.className = 'header-search-field';
  field.inert = true;
  field.innerHTML = '<label class="sr-only" for="site-search-input">جست‌وجو در سینادیا</label><input id="site-search-input" type="search" autocomplete="off" placeholder="نوشیدنی یا رویداد…"><button type="button" class="header-search-close" aria-label="بستن جست‌وجو"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button>';
  search.append(field);
  const results = document.createElement('section');
  results.id = 'site-search-results';
  results.className = 'header-search-results';
  results.setAttribute('aria-label', 'نتیجه‌های جست‌وجو');
  results.innerHTML = '<p role="status" aria-live="polite"></p><ul></ul>';
  results.hidden = true;
  header.append(results);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', results.id);
  const input = field.querySelector('input');
  const status = results.querySelector('[role="status"]');
  const list = results.querySelector('ul');
  function closeSearch(restoreFocus = true) {
    header.classList.remove('search-open');
    trigger.setAttribute('aria-expanded', 'false');
    field.inert = true;
    results.hidden = true;
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }
  const normalize = text => text.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u064b-\u065f]/g, '').toLowerCase().trim();
  let entries;
  let loading;
  const indexCards = root => {
    const cards = [...root.querySelectorAll('[data-menu-item]')];
    cards.forEach((card, index) => { card.id = 'drink-' + index; });
    return cards;
  };
  indexCards(document);
  const revealDrink = () => {
    if (!location.hash.startsWith('#drink-')) return;
    const card = document.getElementById(location.hash.slice(1));
    if (card) {
      document.querySelectorAll('[data-filter]').forEach(button => {
        if (button.dataset.filter === 'all') button.click();
      });
      card.scrollIntoView({ block: 'center' });
      card.setAttribute('tabindex', '-1');
      card.focus({ preventScroll: true });
    }
  };
  window.addEventListener('load', revealDrink);
  window.addEventListener('hashchange', revealDrink);
  async function loadEntries() {
    const results = await Promise.all(['menu.html', 'events.html'].map(async page => {
      const response = await fetch(page);
      if (!response.ok) throw new Error('Search unavailable');
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (page === 'menu.html') return indexCards(doc).map(card => ({
        title: card.dataset.name,
        text: card.textContent,
        type: 'منوی کافه',
        href: page + '#' + card.id
      }));
      return [...doc.querySelectorAll('.program')].map(program => ({
        title: program.querySelector('h2').textContent,
        text: program.textContent,
        type: 'رویدادها',
        href: page + '#' + program.id
      })).map((entry, index) => {
        const program = doc.querySelectorAll('.program')[index];
        entry.href = page + '#' + program.closest('[role="tabpanel"]').id;
        return entry;
      });
    }));
    return results.flat();
  }
  function render() {
    list.replaceChildren();
    if (!entries) return;
    const query = normalize(input.value);
    if (!query) { status.textContent = 'در منوی کافه و رویدادها جست‌وجو کنید.'; return; }
    const matches = entries.filter(entry => normalize(entry.text).includes(query));
    status.textContent = matches.length ? matches.length.toLocaleString('fa-IR') + ' نتیجه' : 'نتیجه‌ای پیدا نشد. عبارت دیگری امتحان کنید.';
    matches.forEach(entry => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = entry.href;
      link.textContent = entry.title + ' — ' + entry.type;
      link.addEventListener('click', () => closeSearch(false));
      item.append(link);
      list.append(item);
    });
  }
  trigger.addEventListener('click', async () => {
    if (header.classList.contains('search-open')) { closeSearch(); return; }
    header.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    header.querySelector('.main-nav')?.classList.remove('open');
    header.classList.add('search-open');
    trigger.setAttribute('aria-expanded', 'true');
    field.inert = false;
    results.hidden = false;
    input.focus({ preventScroll: true });
    status.textContent = 'در حال آماده‌سازی جست‌وجو…';
    try {
      loading ||= loadEntries().catch(error => { loading = null; throw error; });
      entries = await loading;
      render();
    } catch {
      status.textContent = 'جست‌وجو بارگذاری نشد. ببندید و دوباره امتحان کنید.';
    }
  });
  input.addEventListener('input', render);
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSearch();
    }
  });
  field.querySelector('button').addEventListener('click', () => closeSearch());
  header.querySelector('.menu-toggle')?.addEventListener('click', () => closeSearch(false));
  document.addEventListener('click', event => {
    if (!search.contains(event.target) && !results.contains(event.target)) closeSearch(false);
  });
  header.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!header.contains(document.activeElement)) closeSearch(false);
    });
  });
})();
