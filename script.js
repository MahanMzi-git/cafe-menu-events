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

(() => {
  const hero = document.querySelector('.cinematic-hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const visual = hero.querySelector('.hero-visual');
  const copy = hero.querySelector('.hero-copy');
  const hint = hero.querySelector('.hero-scroll-hint');
  if (!visual || !copy) return;
  let ticking = false;
  const update = () => {
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(1, Math.max(0, -rect.top / travel));
    const scale = 1 + progress * .34;
    const radius = Math.max(0, 2 - progress * 2);
    visual.style.transform = `scale(${scale})`;
    visual.style.borderRadius = `${radius}px`;
    visual.style.filter = `saturate(${1 + progress * .12}) contrast(${1 + progress * .04})`;
    copy.style.opacity = Math.min(1, Math.max(0, (progress - .18) * 2.2));
    copy.style.transform = `translateY(${(1 - Math.min(1, progress * 1.8)) * 3}rem)`;
    if (hint) hint.style.opacity = String(Math.max(0, 1 - progress * 5));
    ticking = false;
  };
  const onScroll = () => { if (!ticking) { window.requestAnimationFrame(update); ticking = true; } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
