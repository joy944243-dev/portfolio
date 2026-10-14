/* ============================================================
   Afnan — AI Web Developer · interactions
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  /* Contact form endpoint. Wired to FormSubmit (https://formsubmit.co)
     which needs no account — the first submission emails a confirmation
     link to CONTACT_EMAIL. Leave "" to fall back to the visitor's
     email client via mailto instead. */
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/hello@afnan.dev";
  const CONTACT_EMAIL = "hello@afnan.dev";

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Image fallback ---------- */
  $$("img[data-img]").forEach((img, i) => {
    const fallback = () => {
      img.style.opacity = "0";
      const parent = img.parentElement;
      if (parent) {
        parent.style.background =
          `linear-gradient(${135 + i * 18}deg, hsl(${150 + (i * 12) % 60} 45% 16%), hsl(${190 + (i * 9) % 40} 55% 10%))`;
      }
    };
    img.addEventListener("error", fallback);
    if (img.complete && img.naturalWidth === 0) fallback();
  });

  /* ---------- Case study renderer ---------- */
  function initCaseStudy() {
    const root = $("#caseStudy");
    if (!root || !window.PROJECTS || !window.PROJECTS.length) return;

    const list = window.PROJECTS;
    const slug = new URLSearchParams(location.search).get("p");
    let idx = list.findIndex((p) => p.slug === slug);
    if (idx < 0) idx = 0;
    const p = list[idx];

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ""; };
    const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val || ""; };

    document.title = p.title + " — Afnan";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", p.tagline || p.title);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", p.title + " — Afnan");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", p.tagline || p.title);
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && p.cover) ogImg.setAttribute("content", p.cover);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://afnan.dev/case-study.html?p=" + p.slug);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://afnan.dev/case-study.html?p=" + p.slug);

    set("csCat", p.catLabel);
    set("csTitle", p.title);
    set("csTagline", p.tagline);
    set("csIntro", p.intro);
    set("csChallenge", p.challenge);
    set("csProcess", p.process);
    set("csSolution", p.solution);

    const hero = $("#csHero");
    if (hero) { hero.src = p.cover; hero.alt = p.title; hero.style.opacity = "1"; }
    const heroFig = root.querySelector(".case__hero");
    if (heroFig) heroFig.style.height = "auto";

    const meta = $("#csMeta");
    if (meta) {
      const rows = [
        ["Year", p.year],
        ["Client", p.client],
        ["Role", p.role],
        ["Services", (p.services || []).join(", ")]
      ].filter((r) => r[1]);
      meta.innerHTML =
        '<span class="eyebrow">Project</span>' +
        rows.map((r) => `<div class="case__meta-row"><span>${r[0]}</span><strong>${r[1]}</strong></div>`).join("") +
        '<a href="contact.html" class="btn btn--ghost btn--sm case__meta-cta">Start a project</a>';
    }

    const impact = $("#csImpact");
    if (impact && p.impact) {
      impact.innerHTML = p.impact
        .map((m) => `<div class="impact__item"><strong>${m.v}</strong><span>${m.k}</span></div>`)
        .join("");
    }

    const gallery = $("#csGallery");
    if (gallery && p.gallery) {
      gallery.innerHTML = p.gallery
        .map((src, i) =>
          `<button class="gal" type="button" data-lightbox data-src="${src}" data-alt="${p.title} — frame ${i + 1}" aria-label="Open image ${i + 1}">
             <img src="${src}" alt="${p.title} — frame ${i + 1}" loading="lazy" />
           </button>`
        )
        .join("");
    }

    const prev = list[(idx - 1 + list.length) % list.length];
    const next = list[(idx + 1) % list.length];
    const prevEl = $("#csPrev"), nextEl = $("#csNext");
    if (prevEl) { prevEl.href = "case-study.html?p=" + prev.slug; prevEl.querySelector("strong").textContent = prev.title; }
    if (nextEl) { nextEl.href = "case-study.html?p=" + next.slug; nextEl.querySelector("strong").textContent = next.title; }
  }
  initCaseStudy();

  /* ---------- Note / article renderer ---------- */
  function initPost() {
    const root = $("#postStudy");
    if (!root || !window.POSTS || !window.POSTS.length) return;

    const list = window.POSTS;
    const slug = new URLSearchParams(location.search).get("p");
    let idx = list.findIndex((p) => p.slug === slug);
    if (idx < 0) idx = 0;
    const p = list[idx];

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ""; };
    set("postTag", p.tag);
    set("postTitle", p.title);
    set("postDate", p.date);
    set("postRead", p.read ? p.read + " min read" : "");

    const body = document.getElementById("postBody");
    if (body) body.innerHTML = p.body || "";
    const cover = document.getElementById("postCover");
    if (cover) { cover.src = p.cover; cover.alt = p.title; cover.style.opacity = "1"; }
    const coverFig = root.querySelector(".case__hero");
    if (coverFig) coverFig.style.height = "auto";

    /* Metadata */
    document.title = p.title + " — Afnan";
    const setMeta = (sel, attr, val) => { const el = document.querySelector(sel); if (el && val) el.setAttribute(attr, val); };
    setMeta('meta[name="description"]', "content", p.excerpt);
    setMeta('meta[property="og:type"]', "content", "article");
    setMeta('meta[property="og:title"]', "content", p.title + " — Afnan");
    setMeta('meta[property="og:description"]', "content", p.excerpt);
    setMeta('meta[property="og:image"]', "content", p.cover);
    setMeta('meta[property="og:url"]', "content", "https://afnan.dev/post.html?p=" + p.slug);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://afnan.dev/post.html?p=" + p.slug);
    setMeta('meta[name="twitter:title"]', "content", p.title + " — Afnan");
    setMeta('meta[name="twitter:description"]', "content", p.excerpt);
    setMeta('meta[name="twitter:image"]', "content", p.cover);

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.iso,
      image: p.cover,
      url: "https://afnan.dev/post.html?p=" + p.slug,
      author: { "@type": "Person", "name": "Afnan Rahman", "url": "https://afnan.dev/" },
      publisher: { "@type": "Person", "name": "Afnan Rahman", "url": "https://afnan.dev/" },
      mainEntityOfPage: { "@type": "WebPage", "@id": "https://afnan.dev/post.html?p=" + p.slug }
    });
    document.head.appendChild(ld);

    const prev = list[(idx - 1 + list.length) % list.length];
    const next = list[(idx + 1) % list.length];
    const prevEl = $("#postPrev"), nextEl = $("#postNext");
    if (prevEl) { prevEl.href = "post.html?p=" + prev.slug; prevEl.querySelector("strong").textContent = prev.title; }
    if (nextEl) { nextEl.href = "post.html?p=" + next.slug; nextEl.querySelector("strong").textContent = next.title; }
  }
  initPost();

  /* ---------- Reusable lightbox ---------- */
  function initLightbox() {
    const triggers = $$("[data-lightbox]");
    if (!triggers.length) return;

    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close">×</button>' +
      '<button class="lightbox__nav lightbox__prev" type="button" aria-label="Previous">‹</button>' +
      '<button class="lightbox__nav lightbox__next" type="button" aria-label="Next">›</button>' +
      '<div class="lightbox__stage"></div>' +
      '<div class="lightbox__caption"></div>';
    document.body.appendChild(box);

    const stage = box.querySelector(".lightbox__stage");
    const caption = box.querySelector(".lightbox__caption");
    let i = 0;

    function render(n) {
      i = (n + triggers.length) % triggers.length;
      const t = triggers[i];
      stage.innerHTML = '<img src="' + t.dataset.src + '" alt="' + (t.dataset.alt || "") + '" />';
      caption.textContent = (t.dataset.alt || "") + "  (" + (i + 1) + "/" + triggers.length + ")";
    }
    function open(n) { render(n); box.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { box.classList.remove("open"); document.body.style.overflow = ""; stage.innerHTML = ""; }

    triggers.forEach((t, n) => t.addEventListener("click", () => open(n)));
    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__prev").addEventListener("click", () => render(i - 1));
    box.querySelector(".lightbox__next").addEventListener("click", () => render(i + 1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") render(i - 1);
      else if (e.key === "ArrowRight") render(i + 1);
    });
  }
  initLightbox();

  /* ---------- Scroll progress + nav + to-top ---------- */
  const nav = $("#nav");
  const progress = $("#progress");
  const toTop = $("#toTop");
  function onScroll() {
    const st = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (st / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    if (nav) nav.classList.toggle("scrolled", st > 40);
    if (toTop) { toTop.classList.toggle("show", st > 600); toTop.style.setProperty("--p", pct.toFixed(1)); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  if (toTop) toTop.addEventListener("click", scrollTop);
  $$('a[href="#top"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); scrollTop(); }));

  /* ---------- Active nav link ---------- */
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav__link").forEach((a) => {
    const href = ((a.getAttribute("href") || "").split("#")[0] || "index.html").toLowerCase();
    const active = href === page || (page === "" && href === "index.html");
    a.classList.toggle("active", active);
    if (active) a.setAttribute("aria-current", "page");
  });
  if (page === "case-study.html") {
    const work = $('.nav__link[data-page="work"]');
    if (work) { work.classList.add("active"); work.setAttribute("aria-current", "page"); }
  }
  if (page === "post.html") {
    const notes = $('.nav__link[data-page="notes"]');
    if (notes) { notes.classList.add("active"); notes.setAttribute("aria-current", "page"); }
  }

  /* ---------- Mobile menu ---------- */
  const burger = $("#burger");
  const navLinks = $("#navLinks");
  if (burger && navLinks) {
    const closeMenu = () => {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav__link, .nav__cta").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.07 + "s";
    io.observe(el);
  });

  /* ---------- Custom cursor glow ---------- */
  const glow = $("#cursorGlow");
  if (glow && fine && !reduced) {
    let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY; glow.classList.add("on");
    });
    (function loop() {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Typing headline ---------- */
  const typedEl = $("#typed");
  if (typedEl) {
    const words = ["realistic AI media.", "reliable web development.", "playable games.", "immersive 3D."];
    let wi = 0, ci = 0, deleting = false;
    (function type() {
      const word = words[wi];
      typedEl.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) { ci++; setTimeout(type, 80); }
      else if (!deleting && ci === word.length) { deleting = true; setTimeout(type, 1600); }
      else if (deleting && ci > 0) { ci--; setTimeout(type, 42); }
      else { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 320); }
    })();
  }

  /* ---------- Counters ---------- */
  const counters = $$("[data-count]");
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        let n = 0;
        const step = Math.max(1, Math.round(target / 45));
        const tick = () => {
          n = Math.min(target, n + step);
          el.textContent = n + (target >= 100 ? "+" : "");
          if (n < target) requestAnimationFrame(tick);
        };
        tick();
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Tilt ---------- */
  if (fine && !reduced) {
    $$("[data-tilt]").forEach((el) => {
      const strength = 6;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateY(-6px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Project filter (work page) ---------- */
  const filterBtns = $$(".filter");
  const cards = $$(".card");
  if (filterBtns.length && cards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        const f = btn.dataset.filter;
        cards.forEach((c) => c.classList.toggle("is-hidden", !(f === "all" || c.dataset.cat === f)));
      });
    });
  }

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  if (form) {
    const note = $("#formNote");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = $("#name").value.trim();
      const email = $("#email").value.trim();
      const message = $("#message").value.trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !validEmail || !message) {
        note.className = "form-note error";
        note.textContent = "Please fill in all fields with a valid email.";
        return;
      }

      if (FORM_ENDPOINT) {
        note.className = "form-note";
        note.textContent = "Sending…";
        try {
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              name,
              email,
              message,
              _subject: `New project enquiry — ${name}`,
              _template: "table",
              _captcha: "false",
            }),
          });
          if (!res.ok) throw new Error("Request failed");
          note.className = "form-note ok";
          note.textContent = `Thanks ${name}! Your message is on its way. ✦`;
          form.reset();
        } catch (err) {
          note.className = "form-note error";
          note.textContent = "Something went wrong. Please email " + CONTACT_EMAIL + " directly.";
        }
        return;
      }

      const subject = encodeURIComponent(`New project enquiry — ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      note.className = "form-note ok";
      note.textContent = "Opening your email app… If nothing happens, email " + CONTACT_EMAIL + ".";
      form.reset();
    });
  }

  /* ---------- Page transitions ---------- */
  function initPageTransitions() {
    if (reduced) return;
    document.addEventListener("click", (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || a.target === "_blank" || a.hasAttribute("download")) return;
      if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(href)) return;
      if (!/\.html(\?|#|$)/i.test(href)) return;
      e.preventDefault();
      document.documentElement.classList.add("leaving");
      setTimeout(() => { window.location.href = href; }, 250);
    });
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) document.documentElement.classList.remove("leaving");
    });
  }
  initPageTransitions();

  /* ---------- Magnetic primary buttons ---------- */
  function initMagnetic() {
    if (reduced || !fine) return;
    $$(".btn--primary").forEach((el) => {
      el.classList.add("btn--magnetic");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.28;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.45;
        el.style.transition = "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
      });
    });
  }
  initMagnetic();

  /* ---------- Generative hero canvas ---------- */
  function initHeroCanvas() {
    const host = document.querySelector(".hero__bg");
    if (!host || reduced) return;
    const canvas = document.createElement("canvas");
    canvas.className = "hero__canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = ["200, 247, 81", "110, 231, 255"];
    let W = 0, H = 0, parts = [], raf = 0, running = false, onScreen = true;
    const pointer = { x: -1e4, y: -1e4, active: false };

    function seed() {
      const n = Math.min(760, Math.max(90, Math.round((W * H) / 15000)));
      parts = new Array(n);
      for (let i = 0; i < n; i++) {
        parts[i] = {
          x: Math.random() * W, y: Math.random() * H,
          vx: 0, vy: 0,
          c: COLORS[i % COLORS.length],
          r: Math.random() * 1.3 + 0.4
        };
      }
    }
    function size() {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0a0a0c"; ctx.fillRect(0, 0, W, H);
      seed();
    }
    function field(x, y, t) {
      const s = 0.0016;
      return (Math.sin(x * s + t * 0.6) + Math.cos(y * s * 1.3 - t * 0.5)) * 1.4 +
             Math.sin((x + y) * s * 0.6 + t * 0.3);
    }
    function frame(tms) {
      const t = tms * 0.001;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(10, 10, 12, 0.14)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const a = field(p.x, p.y, t);
        p.vx += Math.cos(a) * 0.06;
        p.vy += Math.sin(a) * 0.06;
        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 20000) {
            const f = (1 - d2 / 20000) * 0.4;
            const d = Math.sqrt(d2) + 1;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        p.vx *= 0.94; p.vy *= 0.94;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + p.c + ", 0.55)";
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!running && onScreen) { running = true; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    size();
    window.addEventListener("resize", () => { stop(); size(); start(); }, { passive: true });
    window.addEventListener("pointermove", (e) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
      pointer.active = pointer.x >= 0 && pointer.x <= W && pointer.y >= 0 && pointer.y <= H;
    }, { passive: true });
    window.addEventListener("pointerleave", () => { pointer.active = false; });
    document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? start() : stop(); }, { threshold: 0.02 }).observe(host);
    }
    start();
  }
  initHeroCanvas();

  /* ---------- Command palette (⌘K / Ctrl K) ---------- */
  function initCommandPalette() {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
    const modifier = isMac ? "⌘" : "Ctrl";
    const PAGE_ITEMS = [
      { title: "Home", hint: "Page", icon: "◆", url: "index.html", keys: "home start" },
      { title: "About", hint: "Page", icon: "◇", url: "about.html", keys: "about bio me story" },
      { title: "Services", hint: "Page", icon: "✳", url: "services.html", keys: "services offerings work with" },
      { title: "Work", hint: "Page", icon: "▦", url: "work.html", keys: "work portfolio projects case studies" },
      { title: "Notes", hint: "Page", icon: "✎", url: "notes.html", keys: "notes writing blog articles" },
      { title: "Playground", hint: "Page", icon: "✦", url: "playground.html", keys: "playground games generative interactive demo" },
      { title: "Contact", hint: "Page", icon: "✉", url: "contact.html", keys: "contact email hire start" },
      { title: "Résumé / CV", hint: "Page", icon: "▤", url: "resume.html", keys: "resume cv download pdf" }
    ];
    const PROJECT_ITEMS = (window.PROJECTS || []).map((p) => ({
      title: p.title,
      hint: p.catLabel || "Project",
      icon: "↗",
      url: "case-study.html?p=" + p.slug,
      keys: (p.cat || "") + " " + (p.client || "") + " " + (p.role || "")
    }));
    const ELSEWHERE = [
      { title: "Email Afnan", hint: "hello@afnan.dev", icon: "✉", url: "mailto:hello@afnan.dev", keys: "email mail reach" },
      { title: "GitHub", hint: "Open profile", icon: "⌥", url: "https://github.com/afnanrahman", ext: true, keys: "github code" },
      { title: "LinkedIn", hint: "Open profile", icon: "in", url: "https://www.linkedin.com/in/afnanrahman", ext: true, keys: "linkedin network" },
      { title: "X / Twitter", hint: "Open profile", icon: "𝕏", url: "https://x.com/afnanbuilds", ext: true, keys: "x twitter social" }
    ];
    const GROUPS = [
      { group: "Go to", items: PAGE_ITEMS },
      { group: "Projects", items: PROJECT_ITEMS },
      { group: "Elsewhere", items: ELSEWHERE }
    ].filter((g) => g.items.length);

    const go = (url, ext) => {
      if (ext) { window.open(url, "_blank", "noopener"); return; }
      if (/^(https?:|mailto:|tel:)/i.test(url)) { window.location.href = url; return; }
      if (reduced) { window.location.href = url; return; }
      document.documentElement.classList.add("leaving");
      setTimeout(() => { window.location.href = url; }, 150);
    };

    const box = document.createElement("div");
    box.className = "cmd";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Quick navigation");
    box.innerHTML =
      '<div class="cmd__panel">' +
        '<div class="cmd__field">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
          '<input class="cmd__input" type="text" placeholder="Search pages, projects, links…" aria-label="Search" autocomplete="off" spellcheck="false" />' +
          '<kbd class="cmd__kbd">esc</kbd>' +
        '</div>' +
        '<ul class="cmd__list" role="listbox" aria-label="Results"></ul>' +
        '<div class="cmd__foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>' + modifier + ' K</kbd> toggle</span></div>' +
      '</div>';
    document.body.appendChild(box);

    const list = box.querySelector(".cmd__list");
    const input = box.querySelector(".cmd__input");
    let visible = [], active = -1, lastFocus = null;

    function paint() {
      $$(".cmd__item", list).forEach((el) => el.classList.toggle("active", +el.dataset.index === active));
      const cur = list.querySelector(".cmd__item.active");
      if (cur) cur.scrollIntoView({ block: "nearest" });
    }
    function render(q) {
      const query = (q || "").trim().toLowerCase();
      list.innerHTML = "";
      visible = [];
      GROUPS.forEach((g) => {
        const matched = g.items.filter((it) =>
          !query || (it.title + " " + it.hint + " " + (it.keys || "")).toLowerCase().includes(query)
        );
        if (!matched.length) return;
        const head = document.createElement("li");
        head.className = "cmd__group";
        head.setAttribute("aria-hidden", "true");
        head.textContent = g.group;
        list.appendChild(head);
        matched.forEach((it) => {
          const idx = visible.length;
          visible.push(it);
          const li = document.createElement("li");
          li.className = "cmd__item";
          li.setAttribute("role", "option");
          li.dataset.index = idx;
          li.innerHTML = '<span class="cmd__ico" aria-hidden="true"></span><span class="cmd__txt"><strong></strong><small></small></span><span class="cmd__go" aria-hidden="true">↗</span>';
          li.querySelector(".cmd__ico").textContent = it.icon;
          li.querySelector("strong").textContent = it.title;
          li.querySelector("small").textContent = it.hint || "";
          li.addEventListener("click", () => go(it.url, it.ext));
          list.appendChild(li);
        });
      });
      if (!visible.length) {
        const empty = document.createElement("li");
        empty.className = "cmd__empty";
        empty.textContent = "No matches for “" + q + "”";
        list.appendChild(empty);
      }
      active = visible.length ? 0 : -1;
      paint();
    }
    function open() {
      lastFocus = document.activeElement;
      box.classList.add("open");
      document.body.style.overflow = "hidden";
      input.value = "";
      render("");
      setTimeout(() => input.focus(), 30);
    }
    function close() {
      box.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    const isOpen = () => box.classList.contains("open");

    /* nav trigger */
    const navEnd = document.querySelector(".nav__end");
    if (navEnd) {
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "nav__search";
      trigger.setAttribute("aria-label", "Open quick search");
      trigger.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span>Search</span><kbd>' + (isMac ? "⌘K" : "Ctrl K") + '</kbd>';
      trigger.addEventListener("click", open);
      navEnd.insertBefore(trigger, navEnd.firstChild);
    }

    input.addEventListener("input", () => render(input.value));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });

    document.addEventListener("keydown", (e) => {
      const key = (e.key || "").toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        isOpen() ? close() : open();
        return;
      }
      if (!isOpen()) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (visible.length) { active = (active + 1) % visible.length; paint(); } }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (visible.length) { active = (active - 1 + visible.length) % visible.length; paint(); } }
      else if (e.key === "Enter") { e.preventDefault(); const it = visible[active]; if (it) go(it.url, it.ext); }
    });
  }
  initCommandPalette();
})();
