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
  const title = copy?.querySelector("h1");
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
  let heroTop = 0;
  let visualWidth = 1;
  let visualHeight = 1;
  let sceneWidth = 1;
  let titleSize = 1;
  let openingSize = 1;
  let lastProgress = -1;

  video.muted = true;
  video.defaultMuted = true;
  video.loop = false;
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
    if (!scene || !visual || !copy || !title) return;
    const progress = reducedMotion.matches ? 1 :
      Math.min(1, Math.max(0, (window.scrollY - heroTop) / scrollTravel));
    if (progress === lastProgress) return;
    lastProgress = progress;
    // Finish expansion before the sticky scene ends, leaving a full-bleed hold.
    const expansion = Math.min(1, progress / 0.72);
    const eased = expansion * (2 - expansion);
    const reveal = Math.min(1, Math.max(0, (progress - 0.28) / 0.4));
    const openingFade = 1 - Math.min(1, Math.max(0, progress / 0.28));
    const detailReveal = Math.min(1, Math.max(0, (progress - 0.38) / 0.34));
    const scale = reducedMotion.matches ? 1 : 1 + (maxScale - 1) * eased;
    const mediaWidth = visualWidth * scale;
    const mediaHeight = visualHeight * scale;
    const textWidth = Math.max(0, Math.min(sceneWidth - 40, mediaWidth - 32));
    const titleScale = Math.min(72, textWidth / 7.5, mediaHeight / 4) / titleSize;
    const poemScale = Math.min(40, textWidth / 10.5, mediaHeight / 7) / openingSize;
    // Resize measurements are cached. Scrolling only writes composite transforms
    // and opacity, with no getBoundingClientRect/read-after-write layout flush.
    visual.style.transform = reducedMotion.matches ? "" : "scale(" + scale + ")";
    visual.style.borderRadius = reducedMotion.matches ? "" : (14 * (1 - eased)) + "px";
    copy.style.opacity = reducedMotion.matches ? "" : String(reveal);
    copy.style.transform = reducedMotion.matches ? "" : "scale(" + titleScale + ")";
    if (opening) {
      opening.style.transform = reducedMotion.matches ? "" : "scale(" + poemScale + ")";
    }
    if (opening) opening.style.opacity = reducedMotion.matches ? "" : String(openingFade);
    // The sentence itself stays at the viewport center; only its opacity changes.
    if (details) {
      details.style.opacity = reducedMotion.matches ? "" : String(detailReveal);
      details.inert = !reducedMotion.matches && detailReveal < 0.25;
    }
  };
  const requestHeroFrame = () => {
    if (!frame) frame = window.requestAnimationFrame(renderHero);
  };
  const measureHero = () => {
    if (!scene || !visual || !copy || !title) return;
    const size = window.getComputedStyle(visual);
    // Batch layout reads before any writes. Only viewport/scene resize enters
    // this path; font loading and video handoff never create a scroll loop.
    visualWidth = parseFloat(size.width);
    visualHeight = parseFloat(size.height);
    sceneWidth = scene.clientWidth;
    const sceneHeight = scene.clientHeight;
    heroTop = hero.getBoundingClientRect().top + window.scrollY;
    scrollTravel = Math.max(1, hero.offsetHeight - scene.offsetHeight);
    // Fractional frame sizes plus a one-pixel overscan prevent edge seams.
    maxScale = Math.max((sceneWidth + 1) / visualWidth, (sceneHeight + 1) / visualHeight);
    const textWidth = Math.max(1, sceneWidth - 40);
    titleSize = Math.max(1, Math.min(72, textWidth / 7.5, sceneHeight / 4));
    openingSize = Math.max(1, Math.min(40, textWidth / 10.5, sceneHeight / 7));
    copy.style.width = textWidth + "px";
    copy.style.height = Math.max(0, sceneHeight - 24) + "px";
    title.style.fontSize = titleSize + "px";
    if (opening) {
      opening.style.width = textWidth + "px";
      opening.style.height = Math.max(0, sceneHeight - 24) + "px";
      opening.style.fontSize = openingSize + "px";
    }
    lastProgress = -1;
    requestHeroFrame();
  };
  window.addEventListener("scroll", requestHeroFrame, { passive: true });
  window.addEventListener("resize", measureHero, { passive: true });
  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(measureHero);
    resizeObserver.observe(scene);
    resizeObserver.observe(visual);
  }
  measureHero();

  const dismissIntro = (targetSelector = "", focusHeader = true, instant = false) => {
    if (dismissed) return;
    dismissed = true;
    intro.classList.add("is-dismissed");
    const finish = () => {
      videoSlot.prepend(video);
      video.loop = true;
      (heroControls || videoSlot).append(toggle);
      updateToggle();
      intro.hidden = true;
      document.body.classList.remove("intro-open");
      pageShell.forEach((element) => {
        element.inert = false;
        element.removeAttribute("aria-hidden");
      });
      const destination = targetSelector && document.querySelector(targetSelector);
      if (destination && !header?.contains(destination)) {
        destination.scrollIntoView({ behavior: "instant", block: "start" });
      }
      renderHero();
      measureHero();
      if (focusHeader) (destination || header?.querySelector(".brand"))?.focus({ preventScroll: true });
    };
    if (instant || reducedMotion.matches) finish();
    else window.setTimeout(finish, 650);
  };
  video.addEventListener("ended", () => dismissIntro());
  pageShell.forEach((element) => { element.inert = true; });
  enters.forEach((enter) => {
    enter.addEventListener("click", () => dismissIntro(enter.dataset.introTarget));
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
  const directSection = ["#menu", "#events", "#story", "#reserve"].includes(location.hash);
  const homeSection = new URLSearchParams(location.search).get("homeSection");
  const returnSection = ["menu", "events"].includes(homeSection) &&
    document.getElementById(homeSection);
  if (requestedEvent && eventInput?.value) dismissIntro("#reserve", false, true);
  else if (returnSection) {
    dismissIntro("", false, true);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.fonts.ready.then(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          returnSection.scrollIntoView({
            behavior: reducedMotion.matches ? "instant" : "smooth",
            block: "start",
          });
          const destination = new URL(location.href);
          destination.searchParams.delete("homeSection");
          destination.hash = homeSection;
          history.replaceState(null, "", destination);
        });
      });
    });
  }
  else if (directSection) dismissIntro(location.hash, false, true);
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
 const prepareImages=panel=>{
  panel.querySelectorAll('img[data-event-src]').forEach(image=>{
   if(image.dataset.eventSrcset) image.srcset=image.dataset.eventSrcset;
   image.src=image.dataset.eventSrc;
   image.removeAttribute('data-event-src');
   image.removeAttribute('data-event-srcset');
   image.hidden=false;
  });
 };
 const activate=(index,focus=false)=>{
  tabs.forEach((tab,i)=>{
   const active=i===index;
   tab.setAttribute('aria-selected',String(active));
   tab.tabIndex=active?0:-1;
   const panel=document.getElementById(tab.getAttribute('aria-controls'));
   panel.hidden=!active;
   if(active) prepareImages(panel);
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
 storyVideo.controls = motionPreference.matches;
 let storyIsNear = false;
 let storyFailed = false;
 const prepareStory = () => {
  const source = storyVideo.dataset.src;
  if (!source || storyVideo.hasAttribute('src')) return;
  storyVideo.setAttribute('src', source);
  storyVideo.removeAttribute('data-src');
  storyVideo.load();
 };
 const playStory = () => {
  if (!storyIsNear || motionPreference.matches || document.hidden || storyFailed) return;
  prepareStory();
  storyVideo.play().catch(() => { storyVideo.controls = true; });
 };
 storyVideo.addEventListener('error', () => {
  storyFailed = true;
  storyVideo.controls = true;
 });
 storyVideo.addEventListener('play', prepareStory);
 const storyObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(([entry]) => {
    storyIsNear = entry.isIntersecting;
    if (storyIsNear) {
     prepareStory();
     playStory();
    } else storyVideo.pause();
   }, { rootMargin: '160px 0px', threshold: 0 })
  : null;
 if (storyObserver) storyObserver.observe(storyVideo);
 else {
  storyIsNear = true;
  prepareStory();
  playStory();
 }
 motionPreference.addEventListener('change', () => {
  storyVideo.controls = motionPreference.matches || storyFailed;
  if (motionPreference.matches) storyVideo.pause();
  else playStory();
 });
 document.addEventListener('visibilitychange', () => {
  if (document.hidden) storyVideo.pause();
  else playStory();
 });
}

