(() => {
  "use strict";

  const categories = window.sinadiaJewelryCategories;
  const grid = document.querySelector("[data-category-grid]");
  if (!grid || !Array.isArray(categories)) return;

  const template = document.querySelector("#jewelry-category-template");
  if (!template) return;

  // One reusable native-link component; the complete arch is the hit target.
  function createCategoryCard(category) {
    const link = template.content.firstElementChild.cloneNode(true);
    link.href = `shop.html?category=${encodeURIComponent(category.id)}#collection`;
    link.setAttribute("aria-label", `مشاهدهٔ مجموعهٔ ${category.name}`);
    link.dataset.category = category.id;

    const image = link.querySelector("[data-category-image]");
    image.src = category.image;
    image.alt = category.alt;
    image.width = category.width;
    image.height = category.height;
    image.decoding = "async";
    image.style.objectPosition = category.position;
    link.querySelector("[data-category-name]").textContent = category.name;
    return link;
  }

  // RTL reading order matches the approved composition (earrings at the right).
  const fragment = document.createDocumentFragment();
  categories.slice().reverse().forEach((category) => fragment.append(createCategoryCard(category)));
  grid.replaceChildren(fragment);

  const selectedId = new URLSearchParams(window.location.search).get("category");
  const selected = categories.find((category) => category.id === selectedId);
  const collection = document.querySelector("#collection");
  if (!selected || !collection) return;

  document.title = `${selected.title} | گالری سینادیا`;
  document.querySelector("#collection-title").textContent = selected.title;
  const image = document.querySelector("[data-collection-image]");
  image.src = selected.image;
  image.alt = selected.alt;
  image.width = selected.width;
  image.height = selected.height;
  image.style.objectPosition = selected.position;
  grid.querySelector(`[data-category="${selected.id}"]`).setAttribute("aria-current", "page");
  collection.hidden = false;

  // Explicitly locate the newly revealed section for fresh links and browser history.
  if (window.location.hash === "#collection") {
    requestAnimationFrame(() => {
      collection.scrollIntoView({ behavior: "instant", block: "start" });
      document.querySelector("#collection-title").focus({ preventScroll: true });
    });
  }
})();
