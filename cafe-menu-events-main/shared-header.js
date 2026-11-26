/* One responsive navigation controller for every public entry. */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  const mobileNavigation = window.matchMedia("(max-width: 699px)");
  const navigationHeader = menuToggle.closest("header");
  const syncInert = () => {
    const isOpen = mobileNavigation.matches
      ? mainNav.classList.contains("open")
      : !navigationHeader.classList.contains("nav-row-hidden") &&
        !navigationHeader.classList.contains("search-open");
    mainNav.inert = !isOpen;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "بستن فهرست" : "باز کردن فهرست");
  };
  const positionMenu = () => {
    mainNav.classList.remove("opens-up");
    mainNav.style.maxHeight = "";
    const headerBounds = navigationHeader.getBoundingClientRect();
    const above = Math.max(0, headerBounds.top - 20);
    const below = Math.max(0, window.innerHeight - headerBounds.bottom - 20);
    const openAbove = below < mainNav.getBoundingClientRect().height && above > below;
    mainNav.classList.toggle("opens-up", openAbove);
    mainNav.style.maxHeight = Math.max(44, openAbove ? above : below) + "px";
  };
  const closeNav = () => {
    mainNav.classList.remove("open", "opens-up");
    mainNav.style.maxHeight = "";
    syncInert();
  };
  let previousNavScroll = Math.max(0, window.scrollY);
  let navDirection = 0;
  let navDistance = 0;
  let navScrollFrame = 0;
  const revealNavRow = (visible) => {
    // Keep a keyboard user's active link in place while they navigate.
    if (!visible && mainNav.contains(document.activeElement) &&
        document.activeElement.matches(":focus-visible")) return;
    navigationHeader.classList.toggle("nav-row-hidden", !visible);
    syncInert();
  };
  const updateNavOnScroll = () => {
    navScrollFrame = 0;
    if (mobileNavigation.matches) return;
    const currentScroll = Math.max(0, window.scrollY);
    const delta = currentScroll - previousNavScroll;
    previousNavScroll = currentScroll;
    if (currentScroll <= 16) {
      navDistance = 0;
      revealNavRow(true);
      return;
    }
    if (Math.abs(delta) < 1) return;
    const direction = Math.sign(delta);
    if (direction !== navDirection) navDistance = 0;
    navDirection = direction;
    navDistance += Math.abs(delta);
    if (navDistance >= 12) {
      revealNavRow(direction < 0);
      navDistance = 0;
    }
  };
  window.addEventListener("scroll", () => {
    if (mobileNavigation.matches && mainNav.classList.contains("open")) positionMenu();
    if (!mobileNavigation.matches && !navScrollFrame) {
      navScrollFrame = requestAnimationFrame(updateNavOnScroll);
    }
  }, { passive: true });
  navigationHeader.addEventListener("focusin", (event) => {
    if (!menuToggle.contains(event.target)) revealNavRow(true);
  });
  menuToggle.addEventListener("click", () => {
    if (!mobileNavigation.matches) {
      const shouldOpen = navigationHeader.classList.contains("nav-row-hidden") ||
        navigationHeader.classList.contains("search-open");
      if (shouldOpen) navigationHeader.dispatchEvent(new Event("site-nav-open"));
      revealNavRow(shouldOpen);
      previousNavScroll = Math.max(0, window.scrollY);
      navDistance = 0;
      return;
    }
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mainNav.classList.toggle("open", !isOpen);
    syncInert();
    if (!isOpen) {
      navigationHeader.dispatchEvent(new Event("site-nav-open"));
      positionMenu();
    } else {
      closeNav();
    }
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });
  navigationHeader.addEventListener("site-nav-close", closeNav);
  window.addEventListener("resize", () => {
    if (mobileNavigation.matches && mainNav.classList.contains("open")) positionMenu();
  });
  mobileNavigation.addEventListener("change", () => {
    revealNavRow(true);
    previousNavScroll = Math.max(0, window.scrollY);
    navDirection = 0;
    navDistance = 0;
    if (mobileNavigation.matches && mainNav.contains(document.activeElement)) {
      menuToggle.focus({ preventScroll: true });
    }
    closeNav();
  });
  document.addEventListener("click", (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeNav();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !event.defaultPrevented &&
        menuToggle.getAttribute("aria-expanded") === "true") {
      menuToggle.focus({ preventScroll: true });
      if (mobileNavigation.matches) closeNav();
      else revealNavRow(false);
    }
  });
  navigationHeader.addEventListener("focusout", () => requestAnimationFrame(() => {
    if (!navigationHeader.contains(document.activeElement)) closeNav();
  }));
  // Search temporarily hides the tray; keep the button state and focusability accurate.
  new MutationObserver(syncInert).observe(navigationHeader, {
    attributes: true,
    attributeFilter: ["class"],
  });
  syncInert();
}

})();
