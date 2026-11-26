(() => {
  "use strict";

  const audiences = window.sinadiaJewelryAudiences;
  const grid = document.querySelector("[data-category-grid]");
  if (!grid || !audiences) return;

  const template = document.querySelector("#jewelry-category-template");
  if (!template) return;

  const tabs = [...document.querySelectorAll("[data-audience]")];
  const panel = document.querySelector("#audience-panel");
  const collection = document.querySelector("#collection");
  const collectionImage = document.querySelector("[data-collection-image]");
  const title = document.querySelector("#collection-title");
  let audience;
  let transition;

  // One reusable native-link component; the complete arch is the hit target.
  function createCategoryCard(category) {
    const link = template.content.firstElementChild.cloneNode(true);
    link.href = `shop.html?audience=${audience}&category=${encodeURIComponent(category.id)}#collection`;
    link.setAttribute("aria-label", `مشاهدهٔ مجموعهٔ ${category.name} ${audience === "men" ? "مردانه" : "زنانه"}`);
    link.dataset.category = category.id;

    const image = link.querySelector("[data-category-image]");
    if (category.image) {
      image.src = category.image;
      image.alt = category.alt;
      image.width = category.width;
      image.height = category.height;
      image.decoding = "async";
      image.loading = "lazy";
      image.style.objectPosition = category.position;
    } else {
      // Use typography until dedicated men's category photos are provided.
      const copy = document.createElement("span");
      copy.className = "shop:flex shop:size-full shop:flex-col shop:items-center shop:justify-center shop:gap-1 shop:px-3 shop:pt-7 shop:text-center shop:text-navy";
      const name = document.createElement("span");
      name.className = "shop:text-[clamp(26px,5vw,38px)] shop:leading-tight";
      name.textContent = category.name;
      const label = document.createElement("span");
      label.className = "shop:text-lg shop:text-store-muted";
      label.textContent = "مجموعهٔ مردانه";
      copy.append(name, label);
      image.replaceWith(copy);
    }
    link.querySelector("[data-category-name]").textContent = category.name;
    return link;
  }

  function render({ animate = false, locate = false } = {}) {
    const params = new URLSearchParams(location.search);
    audience = params.get("audience") === "men" ? "men" : "women";
    const categories = audiences[audience];
    tabs.forEach(tab => {
      const selected = tab.dataset.audience === audience;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `audience-${audience}`);
    grid.dataset.audience = audience;
    const fragment = document.createDocumentFragment();
    categories.slice().reverse().forEach(category => fragment.append(createCategoryCard(category)));
    grid.replaceChildren(fragment);
    transition?.cancel();
    if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      transition = grid.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
    }

    const selected = categories.find(category => category.id === params.get("category"));
    collection.hidden = !selected;
    document.title = selected ? `${selected.title} | گالری سینادیا` : "گالری زیورآلات | سینادیا";
    document.querySelector(".collection-back").href = `shop.html?audience=${audience}#categories`;
    title.textContent = selected?.title || "";
    if (!selected) return;
    collectionImage.hidden = !selected.image;
    collection.querySelector(".collection-content").classList.toggle("shop:phone:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]", Boolean(selected.image));
    if (selected.image) {
      collectionImage.src = selected.image;
      collectionImage.alt = selected.alt;
      collectionImage.width = selected.width;
      collectionImage.height = selected.height;
      collectionImage.style.objectPosition = selected.position;
    } else {
      collectionImage.removeAttribute("src");
      collectionImage.alt = "";
    }
    grid.querySelector(`[data-category="${selected.id}"]`).setAttribute("aria-current", "page");
    if (locate && location.hash === "#collection") {
      requestAnimationFrame(() => {
        collection.scrollIntoView({ behavior: "instant", block: "start" });
        title.focus({ preventScroll: true });
      });
    }
  }

  function selectAudience(next) {
    if (next === audience) return;
    const url = new URL(location.href);
    url.searchParams.set("audience", next);
    url.searchParams.delete("category");
    if (url.hash === "#collection") url.hash = "categories";
    history.pushState(null, "", url);
    render({ animate: true });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectAudience(tab.dataset.audience));
    tab.addEventListener("keydown", event => {
      let next;
      if (event.key === "ArrowLeft") next = (index + 1) % tabs.length;
      if (event.key === "ArrowRight") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      selectAudience(tabs[next].dataset.audience);
    });
  });
  document.querySelector("[data-audience-tabs]").hidden = false;
  addEventListener("popstate", () => render({ locate: true }));
  render({ locate: true });
})();
