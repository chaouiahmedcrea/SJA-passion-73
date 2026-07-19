/* =========================================================================
   SJA Passion 73 — Intro + polish global (indépendant du reste)
   ========================================================================= */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- INTRO ----------------------------------------------------------- */
  (function intro() {
    const el = $("#sjaIntro");
    if (!el) return;
    if (reduced) { el.remove(); return; }

    const isMobile = window.innerWidth < 768;
    const video = $("#introVideo");
    let timers = [];
    let engineSnd = null;
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    function reveal() {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");          // fait apparaître le logo
      timers.push(setTimeout(finish, 1700)); // laisse l'anim du logo se jouer
    }

    function play(silent) {
      clearTimers();
      el.style.display = "";
      el.classList.remove("run", "reveal", "done");
      void el.offsetWidth; // reflow -> redémarre les animations CSS
      document.body.style.overflow = "hidden";
      if (engineSnd) { try { engineSnd.stop(); } catch (e) {} engineSnd = null; }

      requestAnimationFrame(() => el.classList.add("run"));

      if (!video) { timers.push(setTimeout(reveal, 5000)); return; }

      // vidéo selon le contexte : transition (inter-pages, sans son) ou intro normale (avec son)
      const wanted = silent ? "assets/transition.mp4" : "assets/intro-video.mp4";
      if ((video.getAttribute("src") || "") !== wanted) { video.setAttribute("src", wanted); try { video.load(); } catch (e) {} }

      try { video.pause(); video.currentTime = 0; } catch (e) {}
      // on garde le SON DE LA VIDÉO pour l'intro normale ; silencieux lors des transitions inter-pages
      video.muted = !!silent;
      video.volume = 1;
      video.onended = silent ? null : reveal;

      // fondu du son progressif sur les ~5 dernières secondes (courbe douce, sans coupure nette)
      video.ontimeupdate = function () {
        const d = video.duration;
        if (!d || !isFinite(d)) return;
        const remain = Math.max(0, d - video.currentTime);
        const FADE = 5.0;
        if (remain <= FADE) {
          const t = remain / FADE;          // 1 -> 0
          video.volume = Math.max(0, Math.min(1, t * t)); // quadratique : extinction très douce
        }
      };

      // sécurité : si l'évènement "ended" ne se déclenche pas, on révèle après la durée
      // (transition inter-pages : on limite à 1 seconde, quelle que soit la durée réelle du fichier)
      const guard = () => {
        if (silent) { timers.push(setTimeout(reveal, 125)); return; }
        const d = video.duration && isFinite(video.duration) ? video.duration : 6;
        timers.push(setTimeout(reveal, (d + 0.5) * 1000));
      };
      if (video.readyState >= 1) guard();
      else video.addEventListener("loadedmetadata", guard, { once: true });

      const pr = video.play();
      if (pr && pr.catch) pr.catch(() => {
        // le navigateur bloque l'autoplay avec son -> on rejoue en silencieux
        try { video.muted = true; video.play(); } catch (e) {}
      });
    }
    function finish() {
      el.classList.add("done");
      document.body.style.overflow = "";
      if (engineSnd) { try { engineSnd.stop(); } catch (e) {} engineSnd = null; }
      if (video) { try { video.pause(); } catch (e) {} }
      // on masque sans détruire, pour pouvoir rejouer l'intro à la demande
      timers.push(setTimeout(() => { el.style.display = "none"; el.classList.remove("run", "reveal", "done"); }, 850));
    }
    $("#introSkip").addEventListener("click", finish);

    // accès facile : bouton "Revoir l'animation" (barre du haut) — avec son
    window.SJA_playIntro = function () { play(false); };
    const replay = $("#introReplay");
    if (replay) replay.addEventListener("click", (e) => { e.preventDefault(); play(false); });

    // transition entre pages (vente <-> rachat cash) = animation SANS son
    let silentStart = false, destLabel = "";
    try {
      silentStart = sessionStorage.getItem("sja-xnav") === "1";
      destLabel = sessionStorage.getItem("sja-xnav-label") || "";
      sessionStorage.removeItem("sja-xnav"); sessionStorage.removeItem("sja-xnav-label");
    } catch (e) {}
    const destEl = $("#introDest");
    if (destEl) { destEl.textContent = destLabel; destEl.classList.toggle("show", !!destLabel); }
    // L'intro complète ne se joue qu'une fois par visite (session) : les robots et
    // les visiteurs qui reviennent accèdent directement au contenu.
    let seen = false; try { seen = sessionStorage.getItem("sja-intro-seen") === "1"; } catch (e) {}
    if (silentStart) play(true);
    else if (!seen) { try { sessionStorage.setItem("sja-intro-seen", "1"); } catch (e) {} play(false); }
    else { el.style.display = "none"; document.body.style.overflow = ""; }
  })();

  /* ---- Transition inter-pages : marque le passage pour rejouer l'anim (sans son) */
  document.addEventListener("click", function (e) {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (/(^|\/)index\.html|Rachat\s*Cash\.html|Export\s*Hors\s*UE\.html|Super\s*Promo\s*(Intra|Extra)\s*UE\.html/i.test(href)) {
      let label = "";
      if (/(^|\/)index\.html/i.test(href)) label = "Vente France et UE";
      else if (/Rachat\s*Cash\.html/i.test(href)) label = "Rachat cash";
      else if (/Export\s*Hors\s*UE\.html/i.test(href)) label = "Export hors UE";
      else if (/Super\s*Promo\s*Intra\s*UE\.html/i.test(href)) label = "Super Promo";
      else if (/Super\s*Promo\s*Extra\s*UE\.html/i.test(href)) label = "Super Promo";
      try {
        sessionStorage.setItem("sja-xnav", "1");
        sessionStorage.setItem("sja-xnav-label", label);
      } catch (e2) {}
    }
  }, true);

  /* ---- BARRE DE PROGRESSION SCROLL ------------------------------------- */
  (function progress() {
    const bar = $("#scrollProg");
    if (!bar) return;
    function upd() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop || window.scrollY) / max : 0;
      bar.style.width = (p * 100).toFixed(2) + "%";
    }
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  })();

  /* ---- CURSEUR DORÉ ---------------------------------------------------- */
  (function cursor() {
    const dot = $("#cursorDot"), ring = $("#cursorRing");
    if (!dot || !ring) return;
    if (window.matchMedia("(pointer: coarse)").matches) { dot.remove(); ring.remove(); return; }
    let rx = 0, ry = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.left = tx + "px"; dot.style.top = ty + "px";
    });
    (function loop() {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();
    const hot = 'a, button, .brand-cell, .car-card, .vid-thumb, input, select, textarea, [role="button"]';
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hot)) ring.classList.add("hot");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hot)) ring.classList.remove("hot");
    });
    document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { dot.style.opacity = ""; ring.style.opacity = ""; });
  })();

  /* ---- IMAGE DE FOND (parc automobile) --------------------------------- */
  (function bgUploader() {
    const KEY = "sja-parc-bg-v2";
    const slot = $("#parkBg");
    const btn = $("#bgBtn");
    const input = $("#bgFile");
    const clear = $("#bgClear");
    const wrap = $("#bgUploader");
    if (!slot || !btn || !input) return;

    // Purge l'ancien fond personnalisé (versions précédentes) pour laisser place au fond par défaut.
    try { localStorage.removeItem("sja-parc-bg"); } catch (e) {}

    function apply(dataUrl) {
      if (dataUrl) {
        slot.style.backgroundImage = "url('" + dataUrl + "')";
        if (clear) clear.hidden = false;
      } else {
        slot.style.backgroundImage = "";
        if (clear) clear.hidden = true;
      }
    }

    // restaure
    try { const saved = localStorage.getItem(KEY); if (saved) apply(saved); } catch (e) {}

    // optimise (redimensionne) avant stockage pour rester sous le quota
    function ingest(file) {
      if (!file || !/^image\//.test(file.type)) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const maxW = 1920;
          const scale = Math.min(1, maxW / img.naturalWidth);
          const w = Math.round(img.naturalWidth * scale);
          const h = Math.round(img.naturalHeight * scale);
          const cv = document.createElement("canvas");
          cv.width = w; cv.height = h;
          cv.getContext("2d").drawImage(img, 0, 0, w, h);
          let out;
          try { out = cv.toDataURL("image/jpeg", 0.82); }
          catch (e) { out = ev.target.result; }
          apply(out);
          try { localStorage.setItem(KEY, out); }
          catch (e) { /* quota — l'image reste affichée pour la session */ }
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }

    btn.addEventListener("click", () => input.click());
    input.addEventListener("change", () => { if (input.files[0]) ingest(input.files[0]); });
    if (clear) clear.addEventListener("click", () => { apply(null); try { localStorage.removeItem(KEY); } catch (e) {} });

    // glisser-déposer sur le bouton (propriétaire uniquement)
    if (window.SJA_IS_OWNER) {
      ["dragenter", "dragover"].forEach((t) => wrap.addEventListener(t, (e) => { e.preventDefault(); wrap.classList.add("dragover"); }));
      ["dragleave", "drop"].forEach((t) => wrap.addEventListener(t, (e) => { e.preventDefault(); wrap.classList.remove("dragover"); }));
      wrap.addEventListener("drop", (e) => { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) ingest(f); });
    }
  })();
})();
