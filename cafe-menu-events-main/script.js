document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
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
  const closeNav = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
  };
  document.addEventListener("click", (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeNav();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav.classList.contains("open")) {
      closeNav();
      menuToggle.focus();
    }
  });
}

const reserveForm = document.querySelector(".reserve-form");
const formStatus = document.querySelector(".form-status");
const eventInput = reserveForm?.querySelector('[name="event"]');
const dateInput = reserveForm?.querySelector('[name="date"]');

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
if (dateInput) dateInput.min = localDate;
const syncEventDate = () => {
  if (!eventInput || !dateInput) return;
  const display = reserveForm.querySelector('.event-date-display');
  const selected = eventInput.selectedOptions[0];
  const isEvent = Boolean(eventInput.value);
  dateInput.hidden = isEvent;
  dateInput.disabled = isEvent;
  dateInput.required = !isEvent;
  display.hidden = !isEvent;
  display.value = selected?.dataset.date || '';
  const timeInput = reserveForm.querySelector('[name="time"]');
  const timeDisplay = reserveForm.querySelector('.event-time-display');
  if (timeInput && timeDisplay) {
    timeInput.hidden = isEvent;
    timeInput.disabled = isEvent;
    timeInput.required = !isEvent;
    timeInput.value = isEvent ? selected?.dataset.time || '' : '';
    timeDisplay.hidden = !isEvent;
    timeDisplay.disabled = !isEvent;
    timeDisplay.value = selected?.dataset.timeLabel || '';
  }
};
const requestedEvent = new URLSearchParams(window.location.search).get('event');
if (eventInput && [...eventInput.options].some(option => option.value === requestedEvent)) {
  eventInput.value = requestedEvent;
}
eventInput?.addEventListener('change', syncEventDate);
syncEventDate();

document.querySelectorAll(".event-action").forEach((button) => {
  if (!reserveForm || !eventInput) return;
  button.addEventListener("click", () => {
    eventInput.value = button.dataset.event;
    syncEventDate();
    reserveForm.querySelector('[name="name"]').focus();
    document.querySelector("#reserve").scrollIntoView({ behavior: "smooth" });
    formStatus.textContent = `رزرو برای «${button.dataset.event}» انتخاب شد.`;
  });
});

reserveForm?.addEventListener("submit", (event) => {
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
  syncEventDate();
  if (dateInput) dateInput.min = localDate;
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
  const enters = document.querySelectorAll("[data-intro-enter]");
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
    // Fit both messages inside the actual media frame throughout expansion.
    const mediaBounds = visual.getBoundingClientRect();
    const textWidth = Math.max(0, Math.min(scene.clientWidth - 40, mediaBounds.width - 32));
    copy.style.width = textWidth + "px";
    copy.style.height = Math.max(0, mediaBounds.height - 24) + "px";
    copy.querySelector("h1").style.fontSize = Math.min(72, textWidth / 7.5, mediaBounds.height / 4) + "px";
    if (opening) {
      opening.style.width = textWidth + "px";
      opening.style.height = Math.max(0, mediaBounds.height - 24) + "px";
      opening.style.fontSize = Math.min(40, textWidth / 10.5, mediaBounds.height / 7) + "px";
    }
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

  const dismissIntro = (targetSelector = "") => {
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
      const destination = document.querySelector(targetSelector || ".brand");
      destination?.scrollIntoView({ behavior: "smooth", block: "start" });
      destination?.focus({ preventScroll: true });
    };
    if (reducedMotion.matches) finish();
    else window.setTimeout(finish, 650);
  };
  pageShell.forEach((element) => { element.inert = true; });
  enters.forEach((enter) => {
    enter.addEventListener("click", () => dismissIntro(enter.dataset.introTarget));
  });
  document.querySelector("[data-intro-store]")?.addEventListener("click", () => {
    document.querySelector("[data-intro-store-status]").hidden = false;
  });
  document.addEventListener("keydown", (event) => {
    if (dismissed) return;
    if (event.key === "Escape") {
      dismissIntro();
      return;
    }
    if (event.key !== "Tab") return;
    const buttons = [...intro.querySelectorAll("a[href], button:not([hidden]):not([disabled])")];
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
  if (requestedEvent && eventInput?.value) dismissIntro("#reserve");
  else intro.querySelector(".intro-enter")?.focus({ preventScroll: true });

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

// Compact, keyboard-accessible categories; all prices remain available without JS.
(() => {
  const tabs = [...document.querySelectorAll('.popular-tabs [role="tab"]')];
  if (!tabs.length) return;
  const activate = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowLeft') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowRight') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(next, true);
    });
  });
  activate(0);
})();

// Event categories reveal a single panel and retain shareable category links.
(() => {
 const tabs=[...document.querySelectorAll('.program-categories [role="tab"]')];
 if(!tabs.length) return;
 const activate=(index,focus=false)=>{
  tabs.forEach((tab,i)=>{
   const active=i===index;
   tab.setAttribute('aria-selected',String(active));
   tab.tabIndex=active?0:-1;
   document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;
  });
  if(focus) tabs[index].focus();
 };
 const fromHash=()=>{
  const index=tabs.findIndex(tab=>tab.hash===location.hash);
  activate(index<0?0:index);
 };
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',event=>{
   event.preventDefault();
   history.replaceState(null,'',tab.hash);
   activate(index);
  });
  tab.addEventListener('keydown',event=>{
   let next=index;
   if(event.key==='ArrowLeft') next=(index+1)%tabs.length;
   else if(event.key==='ArrowRight') next=(index+tabs.length-1)%tabs.length;
   else if(event.key==='Home') next=0;
   else if(event.key==='End') next=tabs.length-1;
   else return;
   event.preventDefault();
   history.replaceState(null,'',tabs[next].hash);
   activate(next,true);
  });
 });
 window.addEventListener('hashchange',fromHash);
 fromHash();
})();
const storyVideo = document.querySelector('.story-video');
if (storyVideo) {
 const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
 const respectMotion = () => {
  storyVideo.autoplay = !motionPreference.matches;
  if (motionPreference.matches) storyVideo.pause();
 };
 respectMotion();
 motionPreference.addEventListener('change', respectMotion);
}
