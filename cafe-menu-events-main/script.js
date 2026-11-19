document.documentElement.classList.add("js");

const menuTabs = document.querySelectorAll(".menu-tab");
const menuItems = document.querySelectorAll(".menu-item");

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    menuTabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    const filter = tab.dataset.filter;

    menuItems.forEach((item) => {
      item.classList.toggle(
        "hidden",
        filter !== "all" && item.dataset.category !== filter
      );
    });
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
  });
});

const reserveForm = document.querySelector(".reserve-form");
const formStatus = document.querySelector(".form-status");
const eventInput = reserveForm.querySelector('[name="event"]');
const dateInput = reserveForm.querySelector('[name="date"]');

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
dateInput.min = localDate;

document.querySelectorAll(".event-action").forEach((button) => {
  button.addEventListener("click", () => {
    eventInput.value = button.dataset.event;
    reserveForm.querySelector('[name="name"]').focus();
    document.querySelector("#reserve").scrollIntoView({ behavior: "smooth" });
    formStatus.textContent = `رزرو برای «${button.dataset.event}» انتخاب شد.`;
  });
});

reserveForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(reserveForm);
  const name = data.get("name").trim();
  const selectedEvent = data.get("event");
  const guests = data.get("guests");

  formStatus.textContent = selectedEvent
    ? `${name} عزیز، درخواست شما برای «${selectedEvent}» به‌علاوه ${guests} نفر در نسخه نمایشی بررسی شد؛ رزرو واقعی ثبت نشده است.`
    : `${name} عزیز، درخواست رزرو میز برای ${guests} نفر در نسخه نمایشی بررسی شد؛ رزرو واقعی ثبت نشده است.`;

  reserveForm.reset();
  eventInput.value = "";
  dateInput.min = localDate;
});

// One media element is handed from the intro to the hero; its source is never reset.
(() => {
  const intro = document.querySelector("#cinematic-intro");
  const video = document.querySelector("#cinadia-video");
  const hero = document.querySelector(".cinematic-hero");
  const videoSlot = document.querySelector("[data-hero-video-slot]");
  const heroControls = document.querySelector("[data-hero-media-controls]");
  const toggle = document.querySelector("[data-video-toggle]");
  if (!intro || !video || !hero || !videoSlot || !toggle) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const enter = document.querySelector("[data-intro-enter]");
  const skip = document.querySelector("[data-intro-skip]");
  const statuses = [
    document.querySelector("[data-video-status]"),
    document.querySelector("[data-hero-video-status]"),
  ].filter(Boolean);
  const pageShell = [
    document.querySelector(".site-header"),
    document.querySelector("main"),
    document.querySelector(".site-footer"),
  ].filter(Boolean);
  const scene = hero.querySelector(".hero-scene");
  const visual = hero.querySelector(".hero-visual");
  const copy = hero.querySelector(".hero-copy");
  const opening = hero.querySelector(".hero-opening");
  const details = hero.querySelector(".hero-details");
  const header = document.querySelector(".site-header");
  let dismissed = false;
  let failed = false;
  let wantsPlayback = !reducedMotion.matches;
  let videoInView = true;
  let frame = 0;
  let maxScale = 1;
  let scrollTravel = 1;

  video.muted = true;
  video.defaultMuted = true;
  const showStatus = (message = "") => {
    statuses.forEach((status) => {
      status.textContent = message;
      status.hidden = !message;
    });
  };
  const updateToggle = () => {
    toggle.textContent = video.paused ? "پخش ویدیو" : "توقف ویدیو";
    toggle.hidden = failed || (dismissed && !video.paused);
  };
  const markReady = () => {
    video.classList.add("is-ready");
    updateToggle();
  };
  const markFailed = () => {
    failed = true;
    video.classList.add("is-failed");
    wantsPlayback = false;
    video.pause();
    showStatus("ویدیو بارگذاری نشد؛ می‌توانید بدون انتظار وارد خانه شوید.");
    updateToggle();
  };

  const playVideo = () => {
    if (!wantsPlayback || failed || document.hidden || !videoInView) return;
    video.muted = true;
    const request = video.play();
    if (request) request.catch((error) => {
      // Reparenting may interrupt a pending play request; the handoff retries it.
      if (error.name === "AbortError" || failed || !wantsPlayback) return;
      showStatus("پخش خودکار انجام نشد؛ از دکمهٔ «پخش ویدیو» استفاده کنید.");
      updateToggle();
    });
  };

  video.addEventListener("loadeddata", markReady);
  video.addEventListener("error", markFailed);
  video.addEventListener("playing", () => {
    if (!wantsPlayback) {
      video.pause();
      return;
    }
    markReady();
    showStatus();
  });
  video.addEventListener("pause", updateToggle);
  // A warm cache can complete media loading before this script is evaluated.
  if (video.readyState >= 2) markReady();
  if (video.error) markFailed();
  if (reducedMotion.matches) {
    video.autoplay = false;
    video.pause();
    showStatus("حرکت ویدیو متوقف است؛ در صورت تمایل «پخش ویدیو» را انتخاب کنید.");
  } else {
    playVideo();
  }
  updateToggle();

  toggle.addEventListener("click", () => {
    wantsPlayback = video.paused;
    if (wantsPlayback) playVideo();
    else video.pause();
    updateToggle();
  });

  const renderHero = () => {
    frame = 0;
    if (!scene || !visual || !copy) return;
    const bounds = hero.getBoundingClientRect();
    const progress = reducedMotion.matches ? 1 :
      Math.min(1, Math.max(0, -bounds.top / scrollTravel));
    // Finish expansion before the sticky scene ends, leaving a full-bleed hold.
    const expansion = Math.min(1, progress / 0.72);
    const eased = expansion * (2 - expansion);
    const reveal = Math.min(1, Math.max(0, (progress - 0.28) / 0.4));
    const openingFade = 1 - Math.min(1, Math.max(0, progress / 0.28));
    const detailReveal = Math.min(1, Math.max(0, (progress - 0.38) / 0.34));
    visual.style.transform = reducedMotion.matches ? "" : "scale(" + (1 + (maxScale - 1) * eased) + ")";
    visual.style.borderRadius = reducedMotion.matches ? "" : (14 * (1 - eased)) + "px";
    copy.style.opacity = reducedMotion.matches ? "" : String(reveal);
    if (opening) opening.style.opacity = reducedMotion.matches ? "" : String(openingFade);
    // The sentence itself stays at the viewport center; only its opacity changes.
    if (details) {
      details.style.opacity = reducedMotion.matches ? "" : String(detailReveal);
      details.inert = !reducedMotion.matches && detailReveal < 0.25;
    }
    // Follow the sticky scene out of view instead of pinning navigation over later sections.
    if (header) header.style.transform = "translateY(" + Math.min(0, bounds.bottom - scene.offsetHeight) + "px)";
  };
  const requestHeroFrame = () => {
    if (!frame) frame = window.requestAnimationFrame(renderHero);
  };
  const measureHero = () => {
    if (!scene || !visual) return;
    const size = window.getComputedStyle(visual);
    // Fractional frame sizes plus a one-pixel overscan prevent edge seams.
    maxScale = Math.max((scene.clientWidth + 1) / parseFloat(size.width), (scene.clientHeight + 1) / parseFloat(size.height));
    scrollTravel = Math.max(1, hero.offsetHeight - scene.offsetHeight);
    requestHeroFrame();
  };
  window.addEventListener("scroll", requestHeroFrame, { passive: true });
  window.addEventListener("resize", measureHero, { passive: true });
  measureHero();

  const dismissIntro = () => {
    if (dismissed) return;
    dismissed = true;
    // Try inside the user gesture as well as after the DOM handoff.
    playVideo();
    intro.classList.add("is-dismissed");
    const finish = () => {
      videoSlot.prepend(video);
      (heroControls || videoSlot).append(toggle);
      updateToggle();
      intro.hidden = true;
      document.body.classList.remove("intro-open");
      pageShell.forEach((element) => {
        element.inert = false;
        element.removeAttribute("aria-hidden");
      });
      measureHero();
      playVideo();
      document.querySelector(".brand")?.focus({ preventScroll: true });
    };
    if (reducedMotion.matches) finish();
    else window.setTimeout(finish, 650);
  };
  pageShell.forEach((element) => { element.inert = true; });
  enter?.addEventListener("click", dismissIntro);
  skip?.addEventListener("click", dismissIntro);
  document.addEventListener("keydown", (event) => {
    if (dismissed) return;
    if (event.key === "Escape") {
      dismissIntro();
      return;
    }
    if (event.key !== "Tab") return;
    const buttons = [...intro.querySelectorAll("button:not([hidden]):not([disabled])")];
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  enter?.focus({ preventScroll: true });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      wantsPlayback = false;
      video.autoplay = false;
      video.pause();
    }
    measureHero();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else playVideo();
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      videoInView = entry.isIntersecting;
      if (!videoInView) video.pause();
      else playVideo();
    }, { threshold: 0 });
    observer.observe(video);
  }
})();
