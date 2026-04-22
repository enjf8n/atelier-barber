/* ════════════════════════════════════════
   ATELIER BARBER — landing JS
   Header scroll, mobile nav, Lenis smooth
   scroll, GSAP reveals, reviews carousel,
   phone mask, booking form → Telegram.
   ════════════════════════════════════════ */
(function () {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── CONFIG — swap these to wire up your Telegram bot ── */
  const CONFIG = {
    // Get a bot token from @BotFather and your chat ID from @userinfobot
    TELEGRAM_BOT_TOKEN: "",           // e.g. "123456:AAEabc..."
    TELEGRAM_CHAT_ID: "",             // e.g. "123456789"
    FALLBACK_ENDPOINT: "",            // or your own POST endpoint, e.g. Formspree / n8n webhook
    // If both empty, the form simulates success locally (for demo / portfolio).
  };

  /* ══ HEADER SCROLL ══ */
  function initHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    const check = () => header.classList.toggle("is-scrolled", scrollY > 40);
    addEventListener("scroll", check, { passive: true });
    check();
  }

  /* ══ MOBILE NAV ══ */
  function initMobileNav() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;

    const sync = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", () => sync(!nav.classList.contains("is-open")));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => sync(false)));

    /* Close on Esc */
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) sync(false);
    });
  }

  /* ══ ACTIVE NAV LINK BY SECTION ══ */
  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll(".nav a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) map.set(el, a);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.remove("active"));
          map.get(e.target)?.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach((_, el) => io.observe(el));
  }

  /* ══ LENIS SMOOTH SCROLL ══ */
  function initLenis() {
    if (reduced || typeof Lenis === "undefined") return null;
    try {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.4,
      });
      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
      }
      /* Anchor-link smooth scroll via Lenis */
      document.addEventListener("click", (e) => {
        const a = e.target.closest("a[href^='#']");
        if (!a) return;
        const id = a.getAttribute("href").slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70, duration: 1.1 });
      });
      return lenis;
    } catch (_) { return null; }
  }

  /* ══ GSAP REVEALS ══ */
  function initReveals() {
    const els = document.querySelectorAll("[data-aos]");
    if (!els.length) return;

    if (reduced || typeof gsap === "undefined") {
      els.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
      return;
    }

    const hasST = typeof ScrollTrigger !== "undefined";
    if (hasST) gsap.registerPlugin(ScrollTrigger);

    els.forEach((el) => {
      const inHero = el.closest(".hero");
      if (inHero) {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
        );
      } else if (hasST) {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      } else {
        gsap.set(el, { opacity: 1, y: 0 });
      }
    });
  }

  /* ══ REVIEWS CAROUSEL ══ */
  function initReviews() {
    const root = document.getElementById("reviewsCarousel");
    const dotsRoot = document.querySelector(".reviews-dots");
    if (!root || !dotsRoot) return;
    const slides = Array.from(root.querySelectorAll(".review"));
    if (slides.length <= 1) return;

    /* Build dots */
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Отзыв " + (i + 1));
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.addEventListener("click", () => go(i, true));
      dotsRoot.appendChild(b);
    });
    const dots = Array.from(dotsRoot.querySelectorAll("button"));

    let idx = 0;
    let timer = null;
    const interval = parseInt(root.dataset.autoplay || "6000", 10);

    function go(next, manual) {
      slides[idx].classList.remove("is-active");
      dots[idx].setAttribute("aria-selected", "false");
      idx = (next + slides.length) % slides.length;
      slides[idx].classList.add("is-active");
      dots[idx].setAttribute("aria-selected", "true");
      if (manual) restart();
    }
    function tick() { go(idx + 1); }
    function start() { if (!reduced) timer = setInterval(tick, interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    start();
  }

  /* ══ PHONE MASK ══ */
  function initPhoneMask() {
    const input = document.getElementById("bf-phone");
    if (!input) return;
    input.addEventListener("input", () => {
      let v = input.value.replace(/\D/g, "");
      if (v.startsWith("8")) v = "7" + v.slice(1);
      if (v.startsWith("9") && v.length <= 10) v = "7" + v;
      v = v.slice(0, 11);
      let out = "+7";
      if (v.length > 1) out += " (" + v.slice(1, 4);
      if (v.length >= 5) out += ") " + v.slice(4, 7);
      if (v.length >= 8) out += "‑" + v.slice(7, 9);
      if (v.length >= 10) out += "‑" + v.slice(9, 11);
      input.value = out;
    });
  }

  /* ══ DATE MIN ══ */
  function initDateMin() {
    const date = document.getElementById("bf-date");
    if (!date) return;
    const today = new Date().toISOString().split("T")[0];
    date.min = today;
    if (!date.value) date.value = today;
  }

  /* ══ BOOKING FORM SUBMIT ══ */
  function initBookingForm() {
    const form = document.getElementById("bookingForm");
    const status = document.getElementById("formStatus");
    const submit = form?.querySelector(".btn-submit");
    if (!form || !status || !submit) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        service: form.service.value,
        master: form.master.value || "Любой",
        date: form.date.value,
        time: form.time.value,
      };

      submit.classList.add("is-loading");
      submit.disabled = true;

      try {
        await sendLead(data);
        status.textContent = "Заявка принята. Перезвоним в течение 10 минут.";
        status.classList.add("is-success");
        form.reset();
        initDateMin();
      } catch (err) {
        console.warn("Lead send failed:", err);
        status.textContent = "Не удалось отправить. Позвоните: +7 (999) 000‑00‑00";
        status.classList.add("is-error");
      } finally {
        submit.classList.remove("is-loading");
        submit.disabled = false;
      }
    });
  }

  async function sendLead(data) {
    const text =
      "🪒 <b>Новая запись в ATELIER BARBER</b>\n\n" +
      "👤 <b>Имя:</b> " + escapeHtml(data.name) + "\n" +
      "📞 <b>Телефон:</b> " + escapeHtml(data.phone) + "\n" +
      "✂️ <b>Услуга:</b> " + escapeHtml(data.service) + "\n" +
      "💈 <b>Мастер:</b> " + escapeHtml(data.master) + "\n" +
      "📅 <b>Дата:</b> " + escapeHtml(data.date) + " " + escapeHtml(data.time);

    if (CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_CHAT_ID) {
      const url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage";
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
      });
      if (!r.ok) throw new Error("Telegram HTTP " + r.status);
      return;
    }
    if (CONFIG.FALLBACK_ENDPOINT) {
      const r = await fetch(CONFIG.FALLBACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error("Endpoint HTTP " + r.status);
      return;
    }
    /* Portfolio/demo mode — pretend success after short delay */
    await new Promise((r) => setTimeout(r, 700));
    console.info("[demo] lead payload:", data);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ══ BOOT ══ */
  function boot() {
    initHeader();
    initMobileNav();
    initScrollSpy();
    initLenis();
    initReveals();
    initReviews();
    initPhoneMask();
    initDateMin();
    initBookingForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
