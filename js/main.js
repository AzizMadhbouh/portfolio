/* =========================================================
   Portfolio — interactions
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- Local time (Tunisia) ---------- */
  const clock = $("#clock");
  const timeFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Tunis",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const tick = () => {
    if (!clock) return;
    clock.textContent = "TUNIS " + timeFormat.format(new Date());
  };
  tick();
  window.setInterval(tick, 30000);

  /* ---------- Scroll progress + top bar ---------- */
  const bar = $("#progressBar");
  const topbar = $("#topbar");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    if (bar) bar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
    if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 10);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Index overlay ---------- */
  const overlay = $("#indexOverlay");
  const openBtn = $("#openIndex");
  const closeBtn = $("#closeIndex");

  if (overlay && openBtn && closeBtn) {
    const openIndex = () => {
      overlay.classList.add("open");
      overlay.removeAttribute("inert");
      overlay.setAttribute("aria-hidden", "false");
      openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };

    const closeIndex = () => {
      overlay.classList.remove("open");
      overlay.setAttribute("inert", "");
      overlay.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      openBtn.focus();
    };

    openBtn.addEventListener("click", openIndex);
    closeBtn.addEventListener("click", closeIndex);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeIndex();
    });

    $$("a", overlay).forEach((link) => link.addEventListener("click", closeIndex));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("open")) closeIndex();
    });
  }
})();
