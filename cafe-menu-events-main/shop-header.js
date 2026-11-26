/* Gallery search cooperates with the site's shared navigation controller. */
(() => {
  "use strict";
  const header = document.querySelector(".store-header");
  if (!header) return;
  const trigger = header.querySelector("[data-shop-search-trigger]");
  const panel = header.querySelector("#shop-header-search");
  const input = header.querySelector("#shop-header-query");
  const list = header.querySelector("[data-shop-search-results]");
  const status = header.querySelector("[data-shop-search-status]");
  const normalize = value => value.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\u200c\u064b-\u065f]/g, "").trim();

  function closeSearch(restoreFocus = false) {
    panel.hidden = true;
    header.classList.remove("search-open");
    trigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) trigger.focus({preventScroll:true});
  }
  function renderResults() {
    const audience = new URLSearchParams(location.search).get("audience") === "men" ? "men" : "women";
    const categories = window.sinadiaJewelryAudiences?.[audience] || window.sinadiaJewelryCategories || [];
    const query = normalize(input.value);
    const matches = categories.filter(category => normalize(category.name).includes(query));
    list.replaceChildren();
    status.textContent = matches.length ? (query ? `${matches.length.toLocaleString("fa-IR")} دسته‌بندی` : "دسته‌بندی موردنظر را پیدا کنید.") : "نتیجه‌ای پیدا نشد. عبارت دیگری امتحان کنید.";
    matches.forEach(category => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "shop:block shop:min-h-11 shop:border-b shop:border-house-line shop:py-2 shop:text-lg shop:hover:underline shop:outline-0 shop:outline-solid shop:focus-visible:outline-2 shop:focus-visible:outline-house-ink";
      link.href = `shop.html?audience=${audience}&category=${encodeURIComponent(category.id)}#collection`;
      link.textContent = category.name;
      item.append(link);
      list.append(item);
    });
  }
  trigger.addEventListener("click", () => {
    if (!panel.hidden) { closeSearch(true); return; }
    header.dispatchEvent(new Event("site-nav-close"));
    panel.hidden = false;
    header.classList.add("search-open");
    trigger.setAttribute("aria-expanded", "true");
    renderResults();
    input.focus({preventScroll:true});
  });
  input.addEventListener("input", renderResults);
  header.querySelector("[data-shop-search-close]").addEventListener("click", () => closeSearch(true));
  header.querySelector("[data-shop-search-form]").addEventListener("submit", event => {
    event.preventDefault();
    list.querySelector("a")?.click();
  });
  header.addEventListener("site-nav-open", () => closeSearch());
  header.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (!panel.hidden) { event.preventDefault(); closeSearch(true); }
  });
  document.addEventListener("click", event => {
    if (!header.contains(event.target)) closeSearch();
  });
  header.addEventListener("focusout", () => requestAnimationFrame(() => {
    if (!header.contains(document.activeElement)) closeSearch();
  }));
})();
