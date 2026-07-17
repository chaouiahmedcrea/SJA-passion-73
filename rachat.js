/* =========================================================================
   SJA Passion 73 — Rachat cash (script autonome, sans dépendance au catalogue)
   ========================================================================= */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  /* ---- INTRO (vidéo, SANS son sur cette page) -------------------------- */
  (function intro() {
    const el = $("#sjaIntro");
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { el.remove(); return; }
    const video = $("#introVideo");
    let timers = [];
    function reveal() {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      timers.push(setTimeout(finish, 1700));
    }
    function finish() {
      el.classList.add("done");
      document.body.style.overflow = "";
      if (video) { try { video.pause(); } catch (e) {} }
      if (!cameFromNav) {
        // Arrivée directe sur le site (pas une navigation interne) -> intro complète puis on atterrit sur "Vente France & UE"
        window.location.href = "index.html";
        return;
      }
      timers.push(setTimeout(() => { el.style.display = "none"; el.classList.remove("run", "reveal", "done"); }, 850));
    }
    function play(fromNav) {
      timers.forEach(clearTimeout); timers = [];
      el.style.display = "";
      el.classList.remove("run", "reveal", "done");
      void el.offsetWidth;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => el.classList.add("run"));
      if (!video) { timers.push(setTimeout(reveal, 5000)); return; }
      // transition (arrivée depuis la page vente) -> vidéo de transition ; sinon intro
      const wanted = fromNav ? "assets/transition.mp4" : "assets/intro-video.mp4";
      if ((video.getAttribute("src") || "") !== wanted) { video.setAttribute("src", wanted); try { video.load(); } catch (e) {} }
      try { video.pause(); video.currentTime = 0; } catch (e) {}
      video.muted = true; // jamais de son sur la page rachat cash
      video.onended = fromNav ? null : reveal;
      // transition inter-pages : lecture limitée à 1 seconde, quelle que soit la durée du fichier
      const guard = () => {
        if (fromNav) { timers.push(setTimeout(reveal, 125)); return; }
        const d = video.duration && isFinite(video.duration) ? video.duration : 6;
        timers.push(setTimeout(reveal, (d + 0.5) * 1000));
      };
      if (video.readyState >= 1) guard();
      else video.addEventListener("loadedmetadata", guard, { once: true });
      const pr = video.play();
      if (pr && pr.catch) pr.catch(() => { timers.push(setTimeout(reveal, 5500)); });
    }
    const skip = $("#introSkip");
    if (skip) skip.addEventListener("click", finish);
    var cameFromNav = false, destLabel = "";
    try {
      cameFromNav = sessionStorage.getItem("sja-xnav") === "1";
      destLabel = sessionStorage.getItem("sja-xnav-label") || "";
      sessionStorage.removeItem("sja-xnav"); sessionStorage.removeItem("sja-xnav-label");
    } catch (e) {}
    const destEl = $("#introDest");
    if (destEl) { destEl.textContent = destLabel; destEl.classList.toggle("show", !!destLabel); }
    play(cameFromNav); // toujours silencieux sur la page rachat cash
  })();

  /* ---- Transition inter-pages : marque le passage (anim sans son) ------ */
  document.addEventListener("click", function (e) {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (/(^|\/)index\.html/i.test(href)) {
      try {
        sessionStorage.setItem("sja-xnav", "1");
        sessionStorage.setItem("sja-xnav-label", "Normes France et UE");
      } catch (e2) {}
    } else if (/Rachat\s*Cash\.html/i.test(href)) {
      try {
        sessionStorage.setItem("sja-xnav", "1");
        sessionStorage.setItem("sja-xnav-label", "Rachat cash");
      } catch (e2) {}
    } else if (/Export\s*Hors\s*UE\.html/i.test(href)) {
      try {
        sessionStorage.setItem("sja-xnav", "1");
        sessionStorage.setItem("sja-xnav-label", "Export normes hors UE");
      } catch (e2) {}
    } else if (/Super\s*Promo\s*Intra\s*UE\.html/i.test(href)) {
      try {
        sessionStorage.setItem("sja-xnav", "1");
        sessionStorage.setItem("sja-xnav-label", "Super Promo");
      } catch (e2) {}
    } else if (/Super\s*Promo\s*Extra\s*UE\.html/i.test(href)) {
      try {
        sessionStorage.setItem("sja-xnav", "1");
        sessionStorage.setItem("sja-xnav-label", "Super Promo");
      } catch (e2) {}
    }
  }, true);

  /* ---- Icônes (sous-ensemble identique au site principal) -------------- */
  const I = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"/>',
    sound: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/>',
    muted: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/>',
    camera: '<path d="M3 8a2 2 0 012-2h2l1.5-2h5L20 6h2a0 0 0 010 0 2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" transform="translate(-1 0)"/><circle cx="12" cy="13" r="3.4"/>',
    whatsapp: '<path fill="currentColor" stroke="none" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01ZM12.04 20.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43l-.48-.01c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/>',
    pin: '<path d="M12 22s7-7.6 7-13a7 7 0 10-14 0c0 5.4 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/>',
    phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8 9.6a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield: '<path d="M12 2l8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H15a3.5 3.5 0 000-7H9a3.5 3.5 0 010-7h6.5"/>',
    car: '<path d="M5 11l1.6-4.3A2 2 0 018.5 5.4h7a2 2 0 011.9 1.3L19 11M4 11h16a1 1 0 011 1v4h-2.2M4 16H2v-4a1 1 0 011-1M4 16v1.5M20 16v1.5M6.5 16h11"/><circle cx="7.5" cy="16.5" r="1.6"/><circle cx="16.5" cy="16.5" r="1.6"/>',
    tag: '<path d="M20 12l-8.5 8.5a2 2 0 01-2.8 0L3 14.8a2 2 0 010-2.8L11.2 4H20v8z"/><circle cx="16" cy="8" r="1.3" fill="currentColor" stroke="none"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    fb: '<path d="M14 9V7c0-1 .5-1.5 1.5-1.5H17V2h-2.5C12 2 10.5 3.7 10.5 6v3H8v3.5h2.5V22H14v-9.5h2.5L17 9h-3z" fill="currentColor" stroke="none"/>',
    yt: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none"/>',
    tk: '<path d="M16 4c.5 2.3 2 3.8 4 4v3c-1.6 0-3-.5-4-1.3V15a5.5 5.5 0 11-5.5-5.5c.4 0 .7 0 1 .1v3.1a2.5 2.5 0 101.5 2.3V4H16z" fill="currentColor" stroke="none"/>',
  };
  function icon(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (I[n] || "") + "</svg>";
  }
  $$("[data-icon]").forEach((e) => (e.innerHTML = icon(e.dataset.icon)));

  /* ---- Thème (clair / sombre) — partagé avec le site principal --------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", t === "dark" ? "#0a0a0b" : "#faf8f3");
    if (themeBtn) themeBtn.innerHTML = icon(t === "dark" ? "sun" : "moon");
    try { localStorage.setItem("sja-theme", t); } catch (e) {}
  }
  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("sja-theme") || "light"; } catch (e) {}
  setTheme(savedTheme);
  if (themeBtn) themeBtn.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

  /* ---- Son (mute / unmute) — partagé avec le site principal ------------ */
  const soundBtn = $("#soundToggle");
  if (soundBtn && window.SJA_Sound) {
    const syncSoundBtn = () => { soundBtn.innerHTML = icon(window.SJA_Sound.isMuted() ? "muted" : "sound"); };
    syncSoundBtn();
    soundBtn.addEventListener("click", () => { window.SJA_Sound.toggle(); syncSoundBtn(); });
  }

  /* ---- Gestion des photos : centralisée sur la page Accueil ------------ */
  const photoMgrBtn = $("#photoMgrBtn");
  if (photoMgrBtn) {
    photoMgrBtn.innerHTML = icon("camera");
    photoMgrBtn.addEventListener("click", () => { window.location.href = "index.html#catalogue"; });
  }

  /* ---- Nav : burger + ombrage au scroll -------------------------------- */
  const nav = $("#nav");
  const burger = $("#burger");
  if (burger) burger.addEventListener("click", () => nav.classList.toggle("mobile-open"));
  $$("#nav .nav-links a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("mobile-open")));

  // Mise en évidence du sous-onglet cliqué (au lieu de rester figée sur le premier)
  $$(".nav-subbar a").forEach((a) => a.addEventListener("click", () => {
    $$(".nav-subbar a").forEach((x) => x.classList.remove("active"));
    a.classList.add("active");
  }));
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 30); syncNavHeight(); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hauteur réelle de la nav (logo + sous-onglets) -> variable CSS, pour que rien ne passe dessous
  function syncNavHeight() { document.documentElement.style.setProperty("--nav-h", nav.offsetHeight + "px"); }
  syncNavHeight();
  window.addEventListener("resize", syncNavHeight);
  window.addEventListener("load", syncNavHeight);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncNavHeight);
  setTimeout(syncNavHeight, 300);
  setTimeout(syncNavHeight, 450);

  /* ---- Défilement doux pour les ancres internes ------------------------ */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 24);
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* ---- FAB WhatsApp ----------------------------------------------------- */
  const fabBtn = $("#fabBtn");
  if (fabBtn) fabBtn.addEventListener("click", () =>
    window.open("https://wa.me/33664401237?text=" + encodeURIComponent("Bonjour SJA Passion 73, je souhaite faire estimer mon véhicule pour un rachat cash."), "_blank"));

  /* ---- Révélations au scroll ------------------------------------------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.16 });
    $$(".reveal-up, .steps").forEach((el) => io.observe(el));
  } else {
    root.classList.add("no-anim");
    $$(".reveal-up, .steps").forEach((el) => el.classList.add("in"));
  }

  /* ---- Formulaire d'estimation ----------------------------------------- */
  const form = $("#estimForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$(".field[data-required]", form).forEach((f) => {
        const input = $("input, select, textarea", f);
        const valid = input && input.value.trim().length > 0;
        f.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      // email facultatif mais validé s'il est renseigné
      const email = $("#fEmail");
      if (email && email.value.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
        email.closest(".field").classList.add("invalid"); ok = false;
      }
      if (!ok) return;
      const success = $("#formSuccess");
      if (success) success.classList.add("show");
      form.querySelectorAll("input, select, textarea").forEach((i) => (i.value = ""));
      setTimeout(() => { if (success) success.classList.remove("show"); }, 6000);
    });
    // retire l'état d'erreur dès la saisie
    $$("input, select, textarea", form).forEach((i) =>
      i.addEventListener("input", () => i.closest(".field").classList.remove("invalid")));
  }
})();
