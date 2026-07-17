/* =========================================================================
   SJA Passion 73 — Application (vanilla JS)
   Nav, hero, sélecteur de marques + animation porte, catalogue, modal,
   témoignages, vidéos, contact, thème, son, tweaks.
   ========================================================================= */
(function () {
  "use strict";
  const CFG = window.SJA_CONFIG;
  const BRANDS = window.SJA_BRANDS;
  const VEHICLES = window.SJA_VEHICLES;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const byId = (id) => BRANDS.find((b) => b.id === id);
  const brandName = (id) => (byId(id) || {}).name || id;

  const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const fmtPrice = (n) => euro.format(n);
  // Marge prix de vente (modifiable via Tweaks). price = priceHT + markup.
  let markup = (CFG && typeof CFG.salesMarkup === "number") ? CFG.salesMarkup : 1500;
  function recomputePrices() { VEHICLES.forEach((v) => { if (!v.htLocked) v.price = (v.priceHT || 0) + markup; }); }
  recomputePrices();
  // Couleur lisible : premier coloris, sans préfixes "4x", en capitales douces
  function prettyColour(s) {
    if (!s) return "—";
    let first = String(s).replace(/\b\d+x\s*/gi, "").split(/\s{2,}|,|\//)[0].trim();
    first = first.replace(/\s+/g, " ");
    if (first.length > 22) first = first.slice(0, 22) + "…";
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : "—";
  }
  function optChips(s) {
    if (!s) return [];
    return String(s).split(/\s{2,}|;|,|\bPCV\d+\b|\bTBI\d+\b/).map((o) => o.trim()).filter((o) => o.length > 2).slice(0, 10);
  }
  // Disponibilité : on retire la durée de stock en semaines/mois ; on garde
  // "En stock" et la livraison par mois (en français).
  const MONTHS = { january:"janvier", february:"février", march:"mars", april:"avril", may:"mai", june:"juin", july:"juillet", august:"août", september:"septembre", october:"octobre", november:"novembre", december:"décembre" };
  function prettyAvail(s) {
    const x = (s || "").toString().trim();
    if (!x) return "Sur demande";
    if (/stock/i.test(x)) return "En stock";
    const low = x.toLowerCase();
    for (const en in MONTHS) { if (low.indexOf(en) !== -1) return "Livraison " + MONTHS[en]; }
    return "Sur demande";
  }

  function ph(label, cls) {
    const d = document.createElement("div");
    d.className = "ph" + (cls ? " " + cls : "");
    d.setAttribute("data-label", label);
    return d;
  }

  /* ---- Couleur réelle -> teinte CSS (pour les visuels véhicule) -------- */
  const COLOUR_MAP = [
    [/blanc|white|neige|glacier|nacr|\balb\b|ynm|yuy/i, "#eef0f2", "white"],
    [/noir|black|nacr[ée] noir|étoile|biton/i, "#1a1c1f", "black"],
    [/schiste|anthracite|titanium|gris fonc|dark grey|dark gray|cosmos|yvm/i, "#3f4651", "schiste"],
    [/sand\s?stone|grès/i, "#c5c2b9", "sandstone"],
    [/highland|gris|grey|gray|platine|lunaire|cassiop|comète|metal/i, "#8b929b", "grey"],
    [/argent|silver|alu|aluminium|étain/i, "#b9bdc2", "silver"],
    [/rouge|red|flamme|passion|carmin/i, "#9c2b27", "red"],
    [/bleu|blue|iron|baltique|cosmo|marine|navy/i, "#2b4a66", "blue"],
    [/vert|green|kaki|amazonie|olive|ceddar|cedar|moton/i, "#3f5b46", "green"],
    [/beige|sable|sand|dune|cappuccino|sahara|taupe/i, "#c2b196", "beige"],
    [/orange|cuivre|terracotta|teracota|valencia|atacama|mango/i, "#b46a3a", "orange"],
    [/jaune|yellow|sirius/i, "#cb9a3a", "yellow"],
    [/marron|brun|brown|chocolat|chestnut/i, "#5d4636", "brown"],
  ];
  function firstColour(raw) {
    // segment de tête (couleur dominante) d'une liste "5xSCHISTE GREY , 4xBlack, ..."
    return (raw || "").toString().replace(/\b\d+\s*x\s*/gi, "").split(/,|\/|\s{2,}/)[0].trim();
  }
  function colourToCss(raw) {
    const first = firstColour(raw), s = (raw || "").toString();
    for (const row of COLOUR_MAP) if (row[0].test(first)) return row[1];
    for (const row of COLOUR_MAP) if (row[0].test(s)) return row[1];
    return "#7d8590";
  }
  function colourSlug(raw) {
    const first = firstColour(raw), s = (raw || "").toString();
    for (const row of COLOUR_MAP) if (row[0].test(first)) return row[2];
    for (const row of COLOUR_MAP) if (row[0].test(s)) return row[2];
    return null;
  }
  // Renvoie la version recolorisée d'une photo de base si elle existe pour ce coloris
  function recolorSrc(baseSrc, slug) {
    const map = window.SJA_RECOLOR || {};
    if (slug && map[baseSrc] && map[baseSrc].indexOf(slug) !== -1) {
      return baseSrc.replace(/\.jpg$/i, "__" + slug + ".jpg");
    }
    return null;
  }
  function isDefaultPhoto(v, view) {
    const k = photoKey(v, view);
    return !Object.prototype.hasOwnProperty.call(loadPhotos(), k) && !!(window.SJA_MODEL_PHOTOS || {})[k];
  }
  function isDarkHex(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) < 130;
  }
  function relLum(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  // Visuel véhicule teinté par sa vraie couleur, vue = "face" | "profil" | "interieur"
  const VIEW_LABEL = { face: "Face", profil: "Profil", arriere: "Arrière", troisquart: "3/4 avant", interieur: "Intérieur" };
  const VIEW_ORDER = ["face", "profil", "troisquart", "arriere", "interieur"];

  /* ---- Photothèque par modèle (déposée par l'admin, persistée) --------- */
  const PHOTO_KEY = "sja-model-photos";
  function loadPhotos() { try { return JSON.parse(localStorage.getItem(PHOTO_KEY) || "{}"); } catch (e) { return {}; } }
  function savePhotos(m) { try { localStorage.setItem(PHOTO_KEY, JSON.stringify(m)); } catch (e) {} }
  function photoKey(v, view) { return v.brand + "|" + v.model + "|" + view; }
  function getModelPhoto(v, view) {
    const m = loadPhotos(); const k = photoKey(v, view);
    if (Object.prototype.hasOwnProperty.call(m, k)) return m[k] || null; // override (ou "" = retiré)
    return (window.SJA_MODEL_PHOTOS || {})[k] || null;
  }
  function setModelPhoto(v, view, dataUrl) { const m = loadPhotos(); if (dataUrl) m[photoKey(v, view)] = dataUrl; else delete m[photoKey(v, view)]; savePhotos(m); }
  // Première vue disposant d'une photo (sinon "face") — pour la vignette de carte
  function primaryView(v) {
    for (const view of VIEW_ORDER) { if (getModelPhoto(v, view)) return view; }
    return "face";
  }

  // Sélection / lecture / compression d'une photo (appliquée à tout le modèle)
  let _photoInput = null, _photoPending = null;
  function pickModelPhoto(v, view, done) {
    if (!_photoInput) {
      _photoInput = document.createElement("input");
      _photoInput.type = "file"; _photoInput.accept = "image/*"; _photoInput.hidden = true;
      document.body.appendChild(_photoInput);
      _photoInput.addEventListener("change", () => {
        const f = _photoInput.files && _photoInput.files[0];
        if (f && _photoPending) readModelPhoto(_photoPending.v, _photoPending.view, f, _photoPending.done);
        _photoInput.value = "";
      });
    }
    _photoPending = { v, view, done };
    _photoInput.click();
  }
  function readModelPhoto(v, view, file, done) {
    if (!file || !/^image\//.test(file.type)) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const im = new Image();
      im.onload = () => {
        const maxW = 1024, scale = Math.min(1, maxW / im.naturalWidth);
        const w = Math.round(im.naturalWidth * scale), h = Math.round(im.naturalHeight * scale);
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(im, 0, 0, w, h);
        let out; try { out = cv.toDataURL("image/jpeg", 0.82); } catch (e) { out = ev.target.result; }
        setModelPhoto(v, view, out);
        if (done) done();
      };
      im.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
  // Met à jour les cartes déjà rendues pour ce modèle (vue face)
  function refreshCardPhotos(v) {
    $$("#carGrid .car-card").forEach((card) => {
      const id = card.getAttribute("data-id");
      const veh = VEHICLES.find((x) => x.id === id);
      if (!veh || veh.brand !== v.brand || veh.model !== v.model) return;
      const wrap = $(".car-media", card);
      const fav = $(".car-fav", card), badge = $(".car-badge", card);
      const fresh = carPhoto(veh, primaryView(veh)); fresh.classList.add("car-media-ph");
      const old = $(".car-photo", wrap); if (old) wrap.replaceChild(fresh, old);
    });
  }

  function carPhoto(v, view, big) {
    const hex = colourToCss(v.colour);
    const dark = isDarkHex(hex);
    const stored = getModelPhoto(v, view);
    const el = document.createElement("div");
    el.className = "car-photo car-photo--" + view + (big ? " car-photo--big" : "") + (dark ? " is-dark" : "") + (stored ? " has-img" : "");
    el.style.setProperty("--paint", hex);
    el.dataset.view = view;
    if (stored) {
      let src = stored;
      // Recolorisation : pour les photos par défaut, on sert la version
      // retouchée au bon coloris (pas de calque de teinte = rendu réaliste).
      if (view !== "interieur" && isDefaultPhoto(v, view)) {
        const cand = recolorSrc(stored, colourSlug(v.colour));
        if (cand) src = cand;
      }
      el.innerHTML =
        '<img class="cp-img" src="' + src + '" alt="' + brandName(v.brand) + " " + v.model + " " + (VIEW_LABEL[view] || "") + '" loading="lazy" />' +
        '<div class="cp-swatch" title="' + prettyColour(v.colour) + '"></div>' +
        '<div class="cp-note">Photos non contractuelles — disponibles à la demande</div>';
    } else {
      el.innerHTML =
        '<div class="cp-studio"></div>' +
        '<div class="cp-car">' + carViewSvg(view) + "</div>" +
        '<div class="cp-meta"><span class="cp-view">' + (VIEW_LABEL[view] || "") + "</span>" +
          '<span class="cp-model">' + brandName(v.brand) + " " + v.model + "</span></div>" +
        '<div class="cp-swatch" title="' + prettyColour(v.colour) + '"></div>' +
        '<div class="cp-note">Photos non contractuelles — disponibles à la demande</div>';
    }
    return el;
  }
  // Silhouettes simples (formes basiques) selon la vue
  function carViewSvg(view) {
    if (view === "profil") {
      return '<svg viewBox="0 0 200 88" preserveAspectRatio="xMidYMid meet"><path class="cp-body" d="M12 64 C16 47 26 42 40 41 L64 26 C74 20 86 18 100 18 L132 18 C150 18 166 26 182 44 L190 50 C196 53 196 60 196 64 L196 68 C196 71 194 72 190 72 L18 72 C14 72 12 70 12 66 Z"/><path class="cp-glass" d="M62 40 L82 27 C90 23 100 22 110 22 L128 22 C140 23 150 28 160 40 Z"/><circle class="cp-wheel" cx="56" cy="72" r="15"/><circle class="cp-wheel" cx="156" cy="72" r="15"/><circle class="cp-hub" cx="56" cy="72" r="6"/><circle class="cp-hub" cx="156" cy="72" r="6"/></svg>';
    }
    if (view === "interieur") {
      return '<svg viewBox="0 0 200 88" preserveAspectRatio="xMidYMid meet"><rect class="cp-glass" x="22" y="14" width="156" height="30" rx="8"/><path class="cp-body" d="M16 50 L184 50 L176 78 L24 78 Z"/><circle class="cp-hub" cx="64" cy="60" r="13"/><rect class="cp-hub" x="120" y="52" width="44" height="16" rx="4"/></svg>';
    }
    if (view === "arriere") {
      return '<svg viewBox="0 0 200 88" preserveAspectRatio="xMidYMid meet"><path class="cp-body" d="M32 60 C32 40 46 28 72 26 L128 26 C154 28 168 40 168 60 L168 70 C168 73 166 74 162 74 L38 74 C34 74 32 73 32 70 Z"/><path class="cp-glass" d="M54 42 C58 34 66 32 78 32 L122 32 C134 32 142 34 146 42 Z"/><rect class="cp-light" x="38" y="50" width="20" height="11" rx="3" style="fill:#b6443a;opacity:.85"/><rect class="cp-light" x="142" y="50" width="20" height="11" rx="3" style="fill:#b6443a;opacity:.85"/><rect class="cp-hub" x="84" y="64" width="32" height="6" rx="3"/></svg>';
    }
    if (view === "troisquart") {
      return '<svg viewBox="0 0 200 88" preserveAspectRatio="xMidYMid meet"><path class="cp-body" d="M20 62 C24 46 36 40 52 39 L92 24 C102 20 114 19 126 20 L150 22 C164 24 176 32 184 48 C188 54 186 60 184 64 L184 68 C184 71 182 72 178 72 L26 72 C22 72 20 70 20 66 Z"/><path class="cp-glass" d="M70 38 L94 26 C102 23 112 22 122 23 L142 25 C152 28 158 33 164 42 Z"/><circle class="cp-wheel" cx="60" cy="71" r="14"/><circle class="cp-wheel" cx="152" cy="71" r="13"/><circle class="cp-hub" cx="60" cy="71" r="5.5"/><circle class="cp-hub" cx="152" cy="71" r="5"/><rect class="cp-light" x="174" y="50" width="9" height="8" rx="3"/></svg>';
    }
    // face
    return '<svg viewBox="0 0 200 88" preserveAspectRatio="xMidYMid meet"><path class="cp-body" d="M30 60 C30 40 44 26 70 24 L130 24 C156 26 170 40 170 60 L170 70 C170 73 168 74 164 74 L36 74 C32 74 30 73 30 70 Z"/><path class="cp-glass" d="M52 40 C56 32 64 30 76 30 L124 30 C136 30 144 32 148 40 Z"/><rect class="cp-light" x="38" y="50" width="22" height="9" rx="4"/><rect class="cp-light" x="140" y="50" width="22" height="9" rx="4"/><rect class="cp-hub" x="78" y="62" width="44" height="8" rx="4"/></svg>';
  }

  /* ---- State ----------------------------------------------------------- */
  const state = {
    brand: "all",
    model: "all",
    year: "all",
    condition: "all",
    options: [],
    energy: "all",
    gearbox: "all",
    sort: "price-asc",
    maxPrice: 200000,
    door: "showroom",
    page: 1,
  };

  /* Équipements filtrables : libellé -> détection dans le champ `options` */
  const OPTION_DEFS = [
    ["Sièges chauffants", /heated seat|si[èe]ges?\s*(avant\s*)?chauff/i],
    ["Volant chauffant", /heated steering|volant chauff/i],
    ["Aide au stationnement", /parking pack|park(ing)?\s*(sensor|assist|pack)|front\s*&?\s*rear sensor|blind spot|city package|\bpark\b/i],
    ["Caméra de recul", /camera|cam[ée]ra|multiview|rear view/i],
    ["Navigation GPS", /media nav|navigation|\bgps\b/i],
    ["Climatisation auto", /climate|climatisation|air conditioning|automatic air/i],
    ["Toit ouvrant / panoramique", /sunroof|panoramic|toit ouvrant|panoramique/i],
    ["Apple CarPlay / Android Auto", /carplay|android auto|smartphone replication/i],
    ["Roue de secours", /spare wheel|roue de secours/i],
  ];
  function vehicleHasOption(v, re) { return re.test(v.options || ""); }

  /* Énergie & boîte : déduites des champs version / rawModel / transmission */
  const EV_MODELS = ["Renault 5 E-Tech", "Mégane E-Tech"];
  function energyOf(v) {
    const s = (v.version || "") + " " + (v.rawModel || "") + " " + (v.model || "");
    if (EV_MODELS.indexOf(v.model) !== -1 || /\belectric\b|ev60|\bev\d|urb(an)? range|\bzoe\b/i.test(s)) return "Électrique";
    if (/hybrid|e-?tech|mhev|mhyb|\bhev\b|\bphev\b|\bhyb\b/i.test(s)) return "Hybride";
    if (/dci|\btdi\b|\bhdi\b|diesel|\bcdi\b|d-?4d|3[.,]5t|4[.,]0t|l[234]h[234]/i.test(s)) return "Diesel";
    if (/eco-?g|\blpg\b|\bgpl\b|bi-?fuel|bicarbur/i.test(s)) return "GPL / Bicarburation";
    if (/tce|tsi|puretech|\bsce\b|\bgpf\b|mpi|essence|petrol|vti|thp|dig-?t/i.test(s)) return "Essence";
    return null;
  }
  function gearboxOf(v) {
    const s = (v.transmission || "") + " " + (v.version || "") + " " + (v.rawModel || "");
    if (/auto|bva|\bedc\b|\bat\d?\b|\bdct\b|\bcvt\b/i.test(s)) return "Automatique";
    if (/manual|bvm|\bmt\b|\bmanuelle?\b|6eb|6mt|5mt/i.test(s)) return "Manuelle";
    const e = energyOf(v);
    if (e === "Électrique" || e === "Hybride") return "Automatique";
    return null;
  }

  /* =====================================================================
     NAV
     ===================================================================== */
  const nav = $("#nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 24); syncNavHeight(); }
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

  $("#burger").addEventListener("click", () => nav.classList.toggle("mobile-open"));
  $$("#nav .nav-links a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("mobile-open")));

  // Mise en évidence du sous-onglet cliqué (au lieu de rester figée sur le premier)
  $$(".nav-subbar a").forEach((a) => a.addEventListener("click", () => {
    $$(".nav-subbar a").forEach((x) => x.classList.remove("active"));
    a.classList.add("active");
  }));

  // Smooth anchor scroll with nav offset
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const t = $(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 24);
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* =====================================================================
     COMPTEURS ANIMÉS
     ===================================================================== */
  function animateCount(elm, to, dur) {
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      elm.textContent = Math.round(eased * to).toLocaleString("fr-FR");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  let countersDone = false;
  function runCounters() {
    if (countersDone) return; countersDone = true;
    $$(".stat .num[data-to]").forEach((n) => {
      const to = +n.dataset.to;
      if (document.visibilityState === "visible") animateCount(n, to, 1600);
      else n.textContent = to.toLocaleString("fr-FR");
    });
  }

  /* =====================================================================
     SÉLECTEUR DE MARQUES
     ===================================================================== */
  function brandVehicleCount(id) { return VEHICLES.filter((v) => v.brand === id).length; }
  function renderBrands() {
    const grid = $("#brandGrid");
    grid.innerHTML = "";
    const logos = loadLogos();
    BRANDS.forEach((b) => {
      const cell = document.createElement("div");
      cell.className = "brand-cell";
      cell.setAttribute("data-brand", b.id);
      const stored = logos[b.id] || b.logo || "";
      cell.className = "brand-cell" + (b.soon ? " is-soon" : "");
      cell.innerHTML =
        '<span class="brand-count">' + (b.soon ? "Bientôt" : brandVehicleCount(b.id)) + "</span>" +
        '<div class="brand-coin">' +
          '<img class="brand-logo-img" alt="' + b.name + '"' + (stored ? ' src="' + stored + '"' : " hidden") + " />" +
          '<span class="brand-wordmark"' + (stored ? " hidden" : "") + ">" + b.wordmark + "</span>" +
          '<button class="brand-logo-edit" type="button" title="Insérer / changer le logo" aria-label="Changer le logo ' + b.name + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5L5 20"/></svg>' +
          "</button>" +
        "</div>" +
        '<button class="brand-go" type="button" aria-label="Voir les véhicules ' + b.name + '">' +
          '<span class="brand-name-sm">' + b.name + "</span>" +
          '<span class="brand-go-cta">' + (b.soon ? "Prochainement" : "Voir les modèles " + icon("arrow")) + "</span>" +
        "</button>";
      // Clic normal (logo compris) = ouvre le showroom.
      cell.addEventListener("click", () => triggerReveal(b.id, cell));
      // Petit bouton d'édition = insère le logo (sans déclencher la porte).
      const editBtn = $(".brand-logo-edit", cell);
      editBtn.addEventListener("click", (e) => { e.stopPropagation(); openLogoPicker(b.id, cell); });
      // Glisser-déposer un logo sur le médaillon.
      const coin = $(".brand-coin", cell);
      ["dragenter", "dragover"].forEach((t) => coin.addEventListener(t, (e) => { e.preventDefault(); e.stopPropagation(); coin.classList.add("dropping"); }));
      ["dragleave", "drop"].forEach((t) => coin.addEventListener(t, (e) => { e.preventDefault(); coin.classList.remove("dropping"); }));
      coin.addEventListener("drop", (e) => { e.stopPropagation(); const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) setBrandLogo(b.id, cell, f); });
      grid.appendChild(cell);
    });
  }

  /* ---- Gestion des logos de marque (insertion + persistance) ----------- */
  const LOGO_KEY = "sja-brand-logos";
  function loadLogos() { try { return JSON.parse(localStorage.getItem(LOGO_KEY) || "{}"); } catch (e) { return {}; } }
  function saveLogos(m) { try { localStorage.setItem(LOGO_KEY, JSON.stringify(m)); } catch (e) {} }
  let _logoInput = null, _logoPending = null;
  function ensureLogoInput() {
    if (_logoInput) return _logoInput;
    _logoInput = document.createElement("input");
    _logoInput.type = "file"; _logoInput.accept = "image/*"; _logoInput.hidden = true;
    document.body.appendChild(_logoInput);
    _logoInput.addEventListener("change", () => {
      const f = _logoInput.files && _logoInput.files[0];
      if (f && _logoPending) setBrandLogo(_logoPending.id, _logoPending.cell, f);
      _logoInput.value = "";
    });
    return _logoInput;
  }
  function openLogoPicker(id, cell) { _logoPending = { id, cell }; ensureLogoInput().click(); }
  function applyBrandLogo(cell, dataUrl) {
    const img = $(".brand-logo-img", cell), wm = $(".brand-wordmark", cell);
    if (dataUrl) { img.src = dataUrl; img.hidden = false; if (wm) wm.hidden = true; }
    else { img.removeAttribute("src"); img.hidden = true; if (wm) wm.hidden = false; }
  }
  function setBrandLogo(id, cell, file) {
    if (!file || !/^image\//.test(file.type)) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const im = new Image();
      im.onload = () => {
        const max = 256, scale = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
        const w = Math.round(im.naturalWidth * scale), h = Math.round(im.naturalHeight * scale);
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(im, 0, 0, w, h);
        let out; try { out = cv.toDataURL("image/png"); } catch (e) { out = ev.target.result; }
        applyBrandLogo(cell, out);
        const m = loadLogos(); m[id] = out; saveLogos(m);
      };
      im.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* =====================================================================
     ANIMATION PORTE + RÉVÉLATION
     ===================================================================== */
  const stage = $("#revealStage");
  let revealing = false;
  function triggerReveal(brandId, cell) {
    if (revealing) return;
    revealing = true;
    window.SJA_Sound.unlock();

    const coin = $(".brand-coin", cell);
    if (coin) { cell.classList.add("is-turning"); setTimeout(() => cell.classList.remove("is-turning"), 700); }

    // Pré-charge le catalogue filtré (cartes masquées le temps de la cascade)
    state.brand = brandId;
    syncFilterChips();
    renderCatalogue(true);

    // Logo de la marque sur les battants (à défaut : sigle texte)
    const _b = byId(brandId) || {};
    const _logoSrc = loadLogos()[brandId] || _b.logo || "";
    const _brandMarkup = _logoSrc
      ? '<img src="' + _logoSrc + '" alt="' + (_b.name || "") + '" />'
      : '<span class="door-wordmark">' + (_b.wordmark || _b.name || "") + "</span>";
    $(".door-l .door-brand").innerHTML = _brandMarkup;
    $(".door-r .door-brand").innerHTML = _brandMarkup;

    stage.setAttribute("data-door", state.door);
    stage.classList.add("active", "closed", "locking");
    $("#lockDisc").textContent = (byId(brandId) || {}).wordmark || "73";

    // Place le catalogue derrière la porte (saut masqué par l'overlay)
    setTimeout(() => {
      const cat = $("#carGrid") || $("#catalogue") || $("#listings");
      const y = cat.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 14);
      window.scrollTo({ top: y, behavior: "auto" });
    }, 120);

    // 1) Serrure tournée -> 2) ouverture des battants
    setTimeout(() => {
      stage.classList.remove("locking");
      stage.classList.add("opening");
      stage.classList.remove("closed");
    }, 640);

    // 3) Fin d'ouverture -> on masque la porte et on lance la cascade
    setTimeout(() => {
      stage.classList.remove("active", "opening");
      runCascade();
      revealing = false;
    }, 1620);
  }

  // Ouvre une annonce avec la même animation de porte de garage (logo de la marque respecté).
  function revealCar(v) {
    if (revealing) { openModal(v); return; }
    revealing = true;
    window.SJA_Sound.unlock();

    const brandId = v.brand;
    const _b = byId(brandId) || {};
    const _logoSrc = loadLogos()[brandId] || _b.logo || "";
    const _brandMarkup = _logoSrc
      ? '<img src="' + _logoSrc + '" alt="' + (_b.name || "") + '" />'
      : '<span class="door-wordmark">' + (_b.wordmark || _b.name || "") + "</span>";
    $(".door-l .door-brand").innerHTML = _brandMarkup;
    $(".door-r .door-brand").innerHTML = _brandMarkup;

    stage.setAttribute("data-door", state.door);
    stage.style.zIndex = "500";           // au-dessus de la fiche pendant l'ouverture
    stage.classList.add("active", "closed", "locking");
    $("#lockDisc").textContent = _b.wordmark || "73";

    // La fiche s'ouvre DERRIÈRE les battants fermés, puis se trouve révélée à l'ouverture.
    setTimeout(() => openModal(v), 180);

    // 1) serrure tournée -> 2) ouverture des battants
    setTimeout(() => {
      stage.classList.remove("locking");
      stage.classList.add("opening");
      stage.classList.remove("closed");
    }, 640);

    // 3) fin d'ouverture -> on masque la porte (la fiche reste affichée)
    setTimeout(() => {
      stage.classList.remove("active", "opening");
      stage.style.zIndex = "";
      revealing = false;
    }, 1620);
  }

  function runCascade() {
    $$("#carGrid .car-card.cascade").forEach((card, i) => {
      setTimeout(() => card.classList.add("in"), i * 100);
    });
  }

  /* =====================================================================
     CATALOGUE
     ===================================================================== */
  function filteredVehicles() {
    let list = VEHICLES.slice();
    if (state.brand !== "all") list = list.filter((v) => v.brand === state.brand);
    if (state.model !== "all") list = list.filter((v) => v.model === state.model);
    if (state.year !== "all") list = list.filter((v) => String(v.year) === String(state.year));
    if (state.condition !== "all") list = list.filter((v) => v.condition === state.condition);
    if (state.options.length) {
      const res = state.options.map((label) => (OPTION_DEFS.find((d) => d[0] === label) || [])[1]).filter(Boolean);
      list = list.filter((v) => res.every((re) => vehicleHasOption(v, re)));
    }
    if (state.energy !== "all") list = list.filter((v) => energyOf(v) === state.energy);
    if (state.gearbox !== "all") list = list.filter((v) => gearboxOf(v) === state.gearbox);
    list = list.filter((v) => v.price <= state.maxPrice);
    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.year - a.year || a.price - b.price);
    return list;
  }

  function carCard(v, cascade) {
    const card = document.createElement("article");
    card.className = "car-card" + (cascade ? " cascade" : "");
    card.setAttribute("data-id", v.id);

    const media = carPhoto(v, primaryView(v));
    media.classList.add("car-media-ph");
    const mediaWrap = document.createElement("div");
    mediaWrap.className = "car-media";
    const badge = document.createElement("span");
    badge.className = "car-badge " + v.condition;
    badge.textContent = v.condition === "neuf" ? "Neuf" : "Occasion";
    mediaWrap.appendChild(badge);
    if (v.promoZone) {
      const promoBadge = document.createElement("span");
      promoBadge.className = "car-badge-promo";
      promoBadge.textContent = "Super Promo";
      mediaWrap.appendChild(promoBadge);
    }
    if (v.market === "hors-ue") {
      const marketBadge = document.createElement("span");
      marketBadge.className = "car-badge-market";
      marketBadge.textContent = "Export hors UE uniquement";
      mediaWrap.appendChild(marketBadge);
    }
    const fav = document.createElement("button");
    fav.className = "car-fav"; fav.setAttribute("aria-label", "Ajouter aux favoris");
    fav.innerHTML = icon("heart");
    fav.addEventListener("click", (e) => { e.stopPropagation(); fav.classList.toggle("on"); fav.style.color = fav.classList.contains("on") ? "var(--gold)" : ""; });
    mediaWrap.append(media, fav);

    const specs = [];
    specs.push("<span>" + prettyColour(v.colour) + "</span>");
    if (v.transmission && v.transmission !== "—") specs.push("<span>" + (/auto/i.test(v.transmission) ? "Automatique" : "Manuelle") + "</span>");
    specs.push("<span>" + (v.condition === "neuf" ? "Véhicule neuf" : "Occasion") + "</span>");

    const body = document.createElement("div");
    body.className = "car-body";
    body.innerHTML =
      '<div class="car-brandrow"><span>' + brandName(v.brand) + "</span><span>" + v.year + "</span></div>" +
      '<h3 class="car-title">' + v.model + "</h3>" +
      '<p class="car-version">' + (v.version || "") + "</p>" +
      '<div class="car-specs">' + specs.join("") + "</div>" +
      '<div class="car-foot">' +
        '<div class="car-price">' + fmtPrice(v.price) + (v.htLocked ? " HT" : "") + '<small>' + (v.htLocked ? "Prix hors taxes · export uniquement" : "Prix de vente · hors transport") + '</small></div>' +
        '<span class="btn btn--gold btn--sm">Détails ' + icon("arrow") + "</span>" +
      "</div>";

    card.append(mediaWrap, body);
    card.addEventListener("click", () => revealCar(v));
    return card;
  }

  function renderCatalogue(cascade, keepPage) {
    const grid = $("#carGrid");
    const list = filteredVehicles();
    if (!keepPage) state.page = 1;
    const PER = 12;
    const pages = Math.max(1, Math.ceil(list.length / PER));
    if (state.page > pages) state.page = pages;
    const slice = list.slice((state.page - 1) * PER, state.page * PER);
    grid.innerHTML = "";
    $("#catCount").innerHTML = "<b>" + list.length + "</b> véhicule" + (list.length > 1 ? "s" : "");
    renderPager(pages, list.length);
    if (!list.length) {
      const e = document.createElement("div");
      e.className = "cat-empty";
      const sb = byId(state.brand);
      if (sb && sb.soon) {
        e.innerHTML = "<strong>" + sb.name + "</strong> arrive très bientôt dans notre catalogue.<br>Contactez-nous pour une demande spécifique sur cette marque.";
      } else {
        e.innerHTML = "Aucun véhicule ne correspond à ces critères.<br>Ajustez les filtres ou contactez-nous pour une recherche sur mesure.";
      }
      grid.appendChild(e);
      return;
    }
    slice.forEach((v) => grid.appendChild(carCard(v, cascade)));
    if (!cascade) $$("#carGrid .car-card.cascade").forEach((c) => c.classList.add("in"));
  }

  function renderPager(pages, total) {
    let pager = $("#catPager");
    if (!pager) {
      pager = document.createElement("div");
      pager.className = "pager"; pager.id = "catPager";
      $("#carGrid").after(pager);
    }
    pager.innerHTML = "";
    if (pages <= 1) return;
    const cur = state.page;
    const go = (p) => {
      state.page = Math.min(Math.max(1, p), pages);
      renderCatalogue(false, true);
      const y = ($("#catalogue") || $("#listings")).getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 14);
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    const mk = (label, p, opt) => {
      const b = document.createElement("button");
      b.textContent = label;
      if (opt && opt.active) b.classList.add("active");
      if (opt && opt.disabled) b.disabled = true;
      else b.addEventListener("click", () => go(p));
      pager.appendChild(b);
    };
    const ell = () => { const s = document.createElement("span"); s.className = "pg-ell"; s.textContent = "…"; pager.appendChild(s); };
    mk("‹", cur - 1, { disabled: cur === 1 });
    const nums = new Set([1, pages, cur, cur - 1, cur + 1]);
    let prev = 0;
    Array.from(nums).filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b).forEach((n) => {
      if (n - prev > 1) ell();
      mk(String(n), n, { active: n === cur });
      prev = n;
    });
    mk("›", cur + 1, { disabled: cur === pages });
  }

  function syncFilterChips() {
    $$('#catalogue [data-filter="brand"]').forEach((c) =>
      c.classList.toggle("active", c.dataset.val === state.brand));
    $$('#catalogue [data-filter="condition"]').forEach((c) =>
      c.classList.toggle("active", c.dataset.val === state.condition));
  }

  function buildCatalogueBar() {
    // marque chips : uniquement les marques avec du stock
    const brandWrap = $("#brandFilters");
    brandWrap.innerHTML = "";
    brandWrap.appendChild(makeChip("Toutes marques", "brand", "all"));
    BRANDS.filter((b) => brandVehicleCount(b.id) > 0).forEach((b) =>
      brandWrap.appendChild(makeChip(b.name + " (" + brandVehicleCount(b.id) + ")", "brand", b.id)));
    populateModelSelect();
    populateYearSelect();
    populateEnergySelect();
    populateGearboxSelect();
    syncFilterChips();
  }

  function modelsFor(brandId) {
    const set = new Map();
    VEHICLES.forEach((v) => {
      if (brandId !== "all" && v.brand !== brandId) return;
      set.set(v.model, (set.get(v.model) || 0) + 1);
    });
    return Array.from(set.entries()).sort((a, b) => b[1] - a[1]);
  }
  function populateModelSelect() {
    const sel = $("#modelSelect");
    if (!sel) return;
    const cur = state.model;
    const models = modelsFor(state.brand);
    sel.innerHTML = '<option value="all">Tous les modèles</option>' +
      models.map(([m, n]) => '<option value="' + m.replace(/"/g, "&quot;") + '">' + m + " (" + n + ")</option>").join("");
    // garde la sélection si toujours valide
    sel.value = models.some(([m]) => m === cur) ? cur : "all";
    state.model = sel.value;
  }
  function populateYearSelect() {
    const sel = $("#yearSelect");
    if (!sel) return;
    const cur = state.year;
    const years = Array.from(new Set(VEHICLES
      .filter((v) => state.brand === "all" || v.brand === state.brand)
      .map((v) => v.year))).sort((a, b) => b - a);
    sel.innerHTML = '<option value="all">Toutes les années</option>' +
      years.map((y) => '<option value="' + y + '">' + y + "</option>").join("");
    sel.value = years.some((y) => String(y) === String(cur)) ? cur : "all";
    state.year = sel.value;
  }
  function brandScopedList() {
    return VEHICLES.filter((v) => state.brand === "all" || v.brand === state.brand);
  }
  function populateEnergySelect() {
    const sel = $("#energySelect");
    if (!sel) return;
    const cur = state.energy;
    const order = ["Essence", "Diesel", "Hybride", "Électrique", "GPL / Bicarburation"];
    const counts = {};
    brandScopedList().forEach((v) => { const e = energyOf(v); if (e) counts[e] = (counts[e] || 0) + 1; });
    const avail = order.filter((e) => counts[e]);
    sel.innerHTML = '<option value="all">Toutes énergies</option>' +
      avail.map((e) => '<option value="' + e + '">' + e + " (" + counts[e] + ")</option>").join("");
    sel.value = avail.indexOf(cur) !== -1 ? cur : "all";
    state.energy = sel.value;
  }
  function populateGearboxSelect() {
    const sel = $("#gearboxSelect");
    if (!sel) return;
    const cur = state.gearbox;
    const order = ["Automatique", "Manuelle"];
    const counts = {};
    brandScopedList().forEach((v) => { const g = gearboxOf(v); if (g) counts[g] = (counts[g] || 0) + 1; });
    const avail = order.filter((g) => counts[g]);
    sel.innerHTML = '<option value="all">Toutes boîtes</option>' +
      avail.map((g) => '<option value="' + g + '">' + g + " (" + counts[g] + ")</option>").join("");
    sel.value = avail.indexOf(cur) !== -1 ? cur : "all";
    state.gearbox = sel.value;
  }
  function makeChip(label, filter, val) {
    const c = document.createElement("button");
    c.className = "cat-chip";
    c.dataset.filter = filter; c.dataset.val = val;
    c.textContent = label;
    c.addEventListener("click", () => {
      state[filter] = val;
      if (filter === "brand") { state.model = "all"; state.year = "all"; populateModelSelect(); populateYearSelect(); populateEnergySelect(); populateGearboxSelect(); }
      syncFilterChips();
      renderCatalogue(false);
    });
    return c;
  }

  // condition chips + sort + price (statiques dans le HTML)
  $$('[data-filter="condition"]').forEach((c) => c.addEventListener("click", () => {
    state.condition = c.dataset.val; syncFilterChips(); renderCatalogue(false);
  }));
  $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderCatalogue(false); });
  const modelSel = $("#modelSelect");
  if (modelSel) modelSel.addEventListener("change", (e) => { state.model = e.target.value; renderCatalogue(false); });
  const yearSel = $("#yearSelect");
  if (yearSel) yearSel.addEventListener("change", (e) => { state.year = e.target.value; renderCatalogue(false); });
  const energySel = $("#energySelect");
  if (energySel) energySel.addEventListener("change", (e) => { state.energy = e.target.value; renderCatalogue(false); });
  const gearboxSel = $("#gearboxSelect");
  if (gearboxSel) gearboxSel.addEventListener("change", (e) => { state.gearbox = e.target.value; renderCatalogue(false); });
  const priceRange = $("#priceRange");
  priceRange.addEventListener("input", (e) => {
    state.maxPrice = +e.target.value;
    $("#priceVal").textContent = fmtPrice(state.maxPrice);
    renderCatalogue(false);
  });

  /* ---- Filtre Équipements (multi-sélection) ---------------------------- */
  (function optionsFilter() {
    const wrap = $("#optFilter");
    const toggle = $("#optToggle");
    const panel = $("#optPanel");
    const list = $("#optList");
    const badge = $("#optBadge");
    const clearBtn = $("#optClear");
    if (!wrap || !toggle || !panel || !list) return;

    // compte les véhicules correspondant à une option, en respectant les AUTRES filtres actifs
    function baseList() {
      let l = VEHICLES.slice();
      if (state.brand !== "all") l = l.filter((v) => v.brand === state.brand);
      if (state.model !== "all") l = l.filter((v) => v.model === state.model);
      if (state.year !== "all") l = l.filter((v) => String(v.year) === String(state.year));
      if (state.condition !== "all") l = l.filter((v) => v.condition === state.condition);
      return l;
    }

    function build() {
      const base = baseList();
      list.innerHTML = "";
      OPTION_DEFS.forEach(([label, re]) => {
        const n = base.filter((v) => vehicleHasOption(v, re)).length;
        const checked = state.options.indexOf(label) !== -1;
        const lbl = document.createElement("label");
        lbl.className = "opt-item" + (n === 0 && !checked ? " is-empty" : "");
        lbl.innerHTML =
          '<input type="checkbox"' + (checked ? " checked" : "") + ' value="' + label + '">' +
          '<span class="opt-name">' + label + "</span>" +
          '<span class="opt-n">' + n + "</span>";
        lbl.querySelector("input").addEventListener("change", (e) => {
          if (e.target.checked) { if (state.options.indexOf(label) === -1) state.options.push(label); }
          else { state.options = state.options.filter((o) => o !== label); }
          syncBadge();
          renderCatalogue(false);
          build(); // recalcule les compteurs
        });
        list.appendChild(lbl);
      });
    }
    function syncBadge() {
      const n = state.options.length;
      badge.textContent = n;
      badge.hidden = n === 0;
    }
    function open() { wrap.classList.add("open"); panel.hidden = false; toggle.setAttribute("aria-expanded", "true"); build(); }
    function close() { wrap.classList.remove("open"); panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); }

    toggle.addEventListener("click", (e) => { e.stopPropagation(); wrap.classList.contains("open") ? close() : open(); });
    panel.addEventListener("click", (e) => e.stopPropagation());
    clearBtn.addEventListener("click", () => { state.options = []; syncBadge(); renderCatalogue(false); build(); });
    document.addEventListener("click", () => { if (wrap.classList.contains("open")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    // expose pour rafraîchir les compteurs quand la marque change
    window.SJA = window.SJA || {};
    window.SJA._rebuildOptionCounts = function () { if (wrap.classList.contains("open")) build(); };
    syncBadge();
  })();

  /* =====================================================================
     MODAL DÉTAIL
     ===================================================================== */
  const modal = $("#modal");
  function openModal(v) {
    $("#mTitle").textContent = brandName(v.brand) + " " + v.model;
    $("#mBrand").textContent = brandName(v.brand);
    $("#mPrice").textContent = fmtPrice(v.price) + (v.htLocked ? " HT" : "");
    $("#mBadge").textContent = v.condition === "neuf" ? "Neuf" : "Occasion";
    $("#mBadge").className = "car-badge " + v.condition;
    $("#mDesc").textContent = v.version || "";

    const main = $("#mMainImg"); main.innerHTML = "";
    const gallery = Array.isArray(v.gallery) && v.gallery.length ? v.gallery : null;
    let curView = gallery ? 0 : primaryView(v);
    function renderMain() {
      main.innerHTML = "";
      if (gallery) {
        const img = document.createElement("img");
        img.src = gallery[curView]; img.alt = v.model;
        img.style.width = "100%"; img.style.height = "100%"; img.style.objectFit = "cover";
        main.appendChild(img);
        return;
      }
      main.appendChild(carPhoto(v, curView, true));
      // bouton d'ajout / remplacement de photo pour la vue affichée
      const tools = document.createElement("div");
      tools.className = "cp-tools";
      const has = !!getModelPhoto(v, curView);
      tools.innerHTML =
        '<button class="cp-up" type="button">' + icon("camera") + (has ? " Remplacer la photo" : " Ajouter une photo") + "</button>" +
        (has ? '<button class="cp-rm" type="button" title="Retirer">' + icon("trash") + "</button>" : "");
      main.appendChild(tools);
      $(".cp-up", tools).addEventListener("click", () => pickModelPhoto(v, curView, refreshGallery));
      const rm = $(".cp-rm", tools);
      if (rm) rm.addEventListener("click", () => { setModelPhoto(v, curView, null); refreshGallery(); });
      // glisser-déposer sur l'image principale
      const photo = $(".car-photo", main);
      ["dragenter", "dragover"].forEach((t) => photo.addEventListener(t, (e) => { e.preventDefault(); photo.classList.add("cp-drop"); }));
      ["dragleave", "drop"].forEach((t) => photo.addEventListener(t, (e) => { e.preventDefault(); photo.classList.remove("cp-drop"); }));
      photo.addEventListener("drop", (e) => { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) readModelPhoto(v, curView, f, refreshGallery); });
    }
    const thumbs = $("#mThumbs");
    function renderThumbs() {
      thumbs.innerHTML = "";
      if (gallery) {
        gallery.forEach((src, i) => {
          const t = document.createElement("div");
          t.className = "cp-thumb" + (i === curView ? " active" : "");
          t.innerHTML = '<img src="' + src + '" alt="" style="width:100%;height:100%;object-fit:cover" />';
          t.addEventListener("click", () => { curView = i; refreshGallery(); });
          thumbs.appendChild(t);
        });
        return;
      }
      VIEW_ORDER.forEach((view) => {
        const t = carPhoto(v, view);
        t.classList.add("cp-thumb");
        if (view === curView) t.classList.add("active");
        t.addEventListener("click", () => { curView = view; refreshGallery(); });
        thumbs.appendChild(t);
      });
    }
    function refreshGallery() { renderMain(); renderThumbs(); refreshCardPhotos(v); }
    refreshGallery();

    const transm = v.transmission && v.transmission !== "—" ? (/auto/i.test(v.transmission) ? "Automatique" : "Manuelle") : "—";
    $("#mSpecs").innerHTML =
      specCell("Marque", brandName(v.brand)) + specCell("Modèle", v.model) +
      specCell("Année", v.year) + specCell("Couleur", prettyColour(v.colour)) +
      specCell("Transmission", transm) + specCell("Réf.", (v.vin || v.id).toString().toUpperCase());

    const chips = optChips(v.options);
    $("#mOpts").innerHTML = chips.length ? chips.map((o) => "<span>" + o + "</span>").join("") : '<span style="color:var(--muted)">Équipements de série</span>';

    const msg = encodeURIComponent("Bonjour SJA Passion 73, je suis intéressé par la " + brandName(v.brand) + " " + v.model + " " + (v.version || "") + " (" + fmtPrice(v.price) + "). Pouvez-vous me donner plus d'informations ?");
    $("#mWhatsapp").href = "https://wa.me/" + CFG.whatsapp[0].number + "?text=" + msg;
    $("#mContact").addEventListener("click", () => { closeModal(); setTimeout(() => { location.hash = "#contact"; prefillContact(v); }, 200); }, { once: true });

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function specCell(k, v) { return '<div><div class="k">' + k + '</div><div class="v">' + v + "</div></div>"; }
  function closeModal() { modal.classList.remove("open"); document.body.style.overflow = ""; }
  if ($("#mClose")) $("#mClose").addEventListener("click", closeModal);
  if ($("#mBack")) $("#mBack").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeLightbox(); } });

  function prefillContact(v) {
    const msg = $("#fMessage");
    if (msg) msg.value = "Bonjour, je suis intéressé par la " + brandName(v.brand) + " " + v.model + ". Merci de me recontacter.";
    const mm = $("#fModel"); if (mm) mm.value = brandName(v.brand) + " " + v.model;
  }

  /* =====================================================================
     GESTION DES PHOTOS PAR MODÈLE (admin)
     ===================================================================== */
  const photoMgr = $("#photoMgr");
  const PM_VIEWS = VIEW_ORDER.map((v) => [v, VIEW_LABEL[v]]);
  // Liste unique des modèles avec stock : un véhicule "représentant" par modèle
  function modelReps() {
    const seen = new Map();
    VEHICLES.forEach((v) => {
      const k = v.brand + "|" + v.model;
      if (!seen.has(k)) seen.set(k, { rep: v, count: 0 });
      seen.get(k).count++;
    });
    return Array.from(seen.values()).sort((a, b) =>
      a.rep.brand === b.rep.brand ? b.count - a.count : a.rep.brand.localeCompare(b.rep.brand));
  }
  function pmUpdateProgress() {
    const reps = modelReps();
    const total = reps.length * PM_VIEWS.length;
    let filled = 0;
    reps.forEach(({ rep }) => PM_VIEWS.forEach(([view]) => { if (getModelPhoto(rep, view)) filled++; }));
    $("#pmProgress").innerHTML = "<b>" + filled + "</b> / " + total + " photos déposées · <b>" + reps.length + "</b> modèles";
  }
  function pmCellInner(rep, view, label) {
    const stored = getModelPhoto(rep, view);
    if (stored) return '<img src="' + stored + '" alt="' + label + '" /><span class="pm-cell-tag">' + label + "</span><button class=\"pm-cell-rm\" type=\"button\" aria-label=\"Retirer\">" + icon("trash") + "</button>";
    return '<span class="pm-cell-ic">' + icon("camera") + "</span><span class=\"pm-cell-tag\">" + label + "</span><span class=\"pm-cell-hint\">Déposer</span>";
  }
  function buildPhotoManager() {
    const grid = $("#pmGrid");
    grid.innerHTML = "";
    modelReps().forEach(({ rep, count }) => {
      const row = document.createElement("div");
      row.className = "pm-row";
      row.innerHTML =
        '<div class="pm-rowhead"><span class="pm-brand">' + brandName(rep.brand) + '</span><span class="pm-model">' + rep.model + '</span><span class="pm-count">' + count + " annonce" + (count > 1 ? "s" : "") + "</span></div>" +
        '<div class="pm-cells"></div>';
      const cells = $(".pm-cells", row);
      PM_VIEWS.forEach(([view, label]) => {
        const cell = document.createElement("div");
        cell.className = "pm-cell" + (getModelPhoto(rep, view) ? " has" : "");
        cell.innerHTML = pmCellInner(rep, view, label);
        function refresh() {
          cell.className = "pm-cell" + (getModelPhoto(rep, view) ? " has" : "");
          cell.innerHTML = pmCellInner(rep, view, label);
          bind();
          pmUpdateProgress();
          refreshCardPhotos(rep);
        }
        function bind() {
          cell.addEventListener("click", (e) => {
            if (e.target.closest(".pm-cell-rm")) { e.stopPropagation(); setModelPhoto(rep, view, null); refresh(); return; }
            pickModelPhoto(rep, view, refresh);
          });
          ["dragenter", "dragover"].forEach((t) => cell.addEventListener(t, (e) => { e.preventDefault(); cell.classList.add("drop"); }));
          ["dragleave", "drop"].forEach((t) => cell.addEventListener(t, (e) => { e.preventDefault(); cell.classList.remove("drop"); }));
          cell.addEventListener("drop", (e) => { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) readModelPhoto(rep, view, f, refresh); });
        }
        bind();
        cells.appendChild(cell);
      });
      grid.appendChild(row);
    });
    pmUpdateProgress();
  }
  function openPhotoMgr() { buildPhotoManager(); photoMgr.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closePhotoMgr() { photoMgr.classList.remove("open"); document.body.style.overflow = ""; }
  if ($("#photoMgrBtn")) {
    $("#photoMgrBtn").innerHTML = icon("camera");
    $("#photoMgrBtn").addEventListener("click", openPhotoMgr);
  }
  if ($("#pmClose")) $("#pmClose").addEventListener("click", closePhotoMgr);
  if ($("#pmBack")) $("#pmBack").addEventListener("click", closePhotoMgr);
  if ($("#pmReset")) $("#pmReset").addEventListener("click", () => {
    if (!confirm("Retirer toutes les photos déposées ?")) return;
    savePhotos({}); buildPhotoManager();
    $$("#carGrid .car-card").forEach((card) => {
      const veh = VEHICLES.find((x) => x.id === card.getAttribute("data-id"));
      if (veh) refreshCardPhotos(veh);
    });
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePhotoMgr(); });

  /* =====================================================================
     TÉMOIGNAGES
     ===================================================================== */
  const TESTIMONIALS = [
    { q: "Une voiture impeccable livrée à Alger en 5 semaines. Suivi du dossier irréprochable du début à la fin.", name: "Karim B.", city: "Alger", stars: 5 },
    { q: "J'avais peur des démarches de douane, SJA a tout géré. Mon Duster est arrivé comme neuf. Je recommande à 100%.", name: "Sofiane M.", city: "Oran", stars: 5 },
    { q: "Prix transparent, aucune mauvaise surprise. Une équipe de vrais professionnels qui connaissent l'export.", name: "Yacine D.", city: "Constantine", stars: 5 },
    { q: "Troisième véhicule importé avec eux pour ma société. Sérieux, rapides, et toujours de bons conseils.", name: "Nabil R.", city: "Sétif", stars: 5 },
  ];
  let tIndex = 0;
  function renderTestimonials() {
    const track = $("#tstTrack");
    if (!track) return;
    track.innerHTML = "";
    TESTIMONIALS.forEach((t) => {
      const card = document.createElement("div");
      card.className = "tst-card";
      card.innerHTML =
        '<div class="tst-inner">' +
          '<div class="tst-photo"></div>' +
          "<div>" +
            '<div class="tst-stars">' + Array(t.stars).fill(icon("star")).join("") + "</div>" +
            '<p class="tst-quote">« ' + t.q + ' »</p>' +
            '<div class="tst-meta"><b>' + t.name + "</b><span>·</span><span>" + t.city + "</span>" +
              '<span class="tst-verif">' + icon("check") + " Client vérifié</span></div>" +
          "</div>" +
        "</div>";
      card.querySelector(".tst-photo").appendChild(ph(t.name.split(" ")[0]));
      track.appendChild(card);
    });
    const dots = $("#tstDots"); dots.innerHTML = "";
    TESTIMONIALS.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "tst-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => goTestimonial(i));
      dots.appendChild(d);
    });
  }
  function goTestimonial(i) {
    tIndex = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    $("#tstTrack").style.transform = "translateX(" + (-tIndex * 100) + "%)";
    $$("#tstDots .tst-dot").forEach((d, k) => d.classList.toggle("active", k === tIndex));
  }
  if ($("#tstPrev")) $("#tstPrev").addEventListener("click", () => goTestimonial(tIndex - 1));
  if ($("#tstNext")) $("#tstNext").addEventListener("click", () => goTestimonial(tIndex + 1));
  let tstTimer = $("#tstTrack") ? setInterval(() => goTestimonial(tIndex + 1), 6000) : null;
  if ($("#tstTrack")) $("#tstTrack").addEventListener("pointerdown", () => { clearInterval(tstTimer); });

  /* =====================================================================
     VIDÉOS (lightbox)
     ===================================================================== */
  const lightbox = $("#lightbox");
  function openLightbox(label, src) {
    const frame = $("#lbFrame");
    frame.innerHTML = "";
    if (src) {
      const v = document.createElement("video");
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute("controlslist", "nodownload");
      frame.appendChild(v);
    } else {
      frame.appendChild(ph("Lecteur vidéo · " + label));
    }
    lightbox.classList.add("open"); document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    const vid = $("#lbFrame video");
    if (vid) { vid.pause(); vid.removeAttribute("src"); vid.load(); }
    $("#lbFrame").innerHTML = "";
    lightbox.classList.remove("open"); document.body.style.overflow = "";
  }
  if ($("#lbClose")) $("#lbClose").addEventListener("click", closeLightbox);
  if ($("#lbBack")) $("#lbBack").addEventListener("click", closeLightbox);

  // Lecture sur place (dans la vignette d'origine) pour les vidéos réelles ;
  // lightbox seulement pour les vignettes encore sans fichier.
  function playInline(container) {
    const v = container.querySelector(".vid-preview");
    if (!v) return;
    if (v.src.indexOf("#t=") !== -1) v.src = v.src.split("#")[0];
    v.muted = false;
    v.controls = true;
    v.setAttribute("controlslist", "nodownload");
    container.classList.add("playing");
    try { v.currentTime = 0; } catch (e) {}
    v.play();
  }
  $$("[data-video]").forEach((el) =>
    el.addEventListener("click", (e) => {
      if (el.dataset.src) {
        // ne pas relancer si on interagit déjà avec les contrôles natifs
        if (el.classList.contains("playing") && e.target.tagName === "VIDEO") return;
        playInline(el);
      } else {
        openLightbox(el.dataset.video);
      }
    })
  );

  /* =====================================================================
     THÈME + SON
     ===================================================================== */
  const root = document.documentElement;
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    localStorage.setItem("sja-theme", t);
    $("#themeToggle").innerHTML = icon(t === "dark" ? "sun" : "moon");
  }
  setTheme(localStorage.getItem("sja-theme") || CFG.defaultTheme || "dark");
  $("#themeToggle").addEventListener("click", () =>
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

  function syncSoundBtn() { if ($("#soundToggle")) $("#soundToggle").innerHTML = icon(window.SJA_Sound.isMuted() ? "muted" : "sound"); }
  syncSoundBtn();
  if ($("#soundToggle")) $("#soundToggle").addEventListener("click", () => { window.SJA_Sound.toggle(); syncSoundBtn(); });

  /* =====================================================================
     WHATSAPP FAB
     ===================================================================== */
  const fab = $("#fab");
  $("#fabBtn").addEventListener("click", () => fab.classList.toggle("open"));
  const fabMenu = $("#fabMenu");
  CFG.whatsapp.forEach((w, i) => {
    const a = document.createElement("a");
    a.href = "https://wa.me/" + w.number;
    a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = icon("whatsapp") + '<span><span class="wn">' + CFG.phoneDisplay[i] + "</span><small>" + w.label + "</small></span>";
    fabMenu.appendChild(a);
  });

  /* =====================================================================
     FORMULAIRE CONTACT
     ===================================================================== */
  const form = $("#contactForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$(".field[data-required]", form).forEach((f) => {
      const input = $("input, textarea, select", f);
      const val = (input.value || "").trim();
      let valid = !!val;
      if (input.type === "email") valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
      f.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) return;
    window.SJA_Sound.blip();
    $("#formSuccess").classList.add("show");
    form.reset();
    setTimeout(() => $("#formSuccess").classList.remove("show"), 6000);
  });
  $$(".field input, .field textarea, .field select", form).forEach((i) =>
    i.addEventListener("input", () => i.closest(".field").classList.remove("invalid")));

  /* =====================================================================
     INTERSECTION OBSERVERS
     ===================================================================== */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.18 });
  function observeReveals() { $$(".reveal-up, .steps, #heroStats").forEach((el) => io.observe(el)); }
  // counters when hero stats visible
  const ioStats = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { runCounters(); ioStats.disconnect(); } });
  }, { threshold: 0.4 });

  /* =====================================================================
     TWEAKS (variations animation porte, accent, police)
     ===================================================================== */
  window.SJA = window.SJA || {};
  function setPriceBounds() {
    const prices = VEHICLES.map((v) => v.price);
    const maxP = Math.ceil(Math.max.apply(null, prices) / 1000) * 1000;
    const minP = Math.floor(Math.min.apply(null, prices) / 1000) * 1000;
    const pr = $("#priceRange");
    if (pr) { pr.min = minP; pr.max = maxP; pr.value = maxP; state.maxPrice = maxP; }
  }
  // Modifier la marge prix de vente en direct (Tweaks)
  window.SJA.setMarkup = function (m) {
    markup = Math.max(0, Math.round(+m || 0));
    recomputePrices();
    setPriceBounds();
    if ($("#priceVal")) $("#priceVal").textContent = fmtPrice(state.maxPrice);
    renderCatalogue(false, true);
  };
  window.SJA.getMarkup = function () { return markup; };
  const FONTS = {
    "Montserrat / Manrope": ["Montserrat", "Manrope"],
    "Raleway / Inter": ["Raleway", "Mulish"],
    "Sora / Manrope": ["Sora", "Manrope"],
  };
  window.SJA.applyTweaks = function (t) {
    if (!t) return;
    if (t.door) state.door = t.door;
    if (t.accent) {
      let c;
      if (Array.isArray(t.accent)) c = t.accent;
      else {
        const map = {
          "Or": ["#a9842f", "#c4a14a", "rgba(169,132,47,0.30)"],
          "Cuivre": ["#b06a3c", "#d08a5a", "rgba(176,106,60,0.30)"],
          "Platine": ["#8a93a0", "#b9c1cc", "rgba(138,147,160,0.30)"],
          "Émeraude": ["#2f8c63", "#5cb88c", "rgba(47,140,99,0.30)"],
        };
        c = map[t.accent] || map["Or"];
      }
      root.style.setProperty("--gold", c[0]);
      root.style.setProperty("--gold-2", c[1]);
      root.style.setProperty("--gold-glow", c[2]);
    }
    if (t.font && FONTS[t.font]) {
      root.style.setProperty("--font-display", '"' + FONTS[t.font][0] + '", system-ui, sans-serif');
      root.style.setProperty("--font-body", '"' + FONTS[t.font][1] + '", system-ui, sans-serif');
    }
    if (typeof t.theme === "string") setTheme(t.theme);
  };
  // preview helper: rejouer l'animation depuis le panneau
  window.SJA.previewDoor = function (variant) {
    if (variant) state.door = variant;
    const first = BRANDS[0];
    const cell = $('.brand-cell[data-brand="' + first.id + '"]');
    if (cell) { $("#brands").scrollIntoView({ behavior: "smooth" }); setTimeout(() => triggerReveal(first.id, cell), 400); }
  };

  /* =====================================================================
     ICONS (inline svg)
     ===================================================================== */
  function icon(n) {
    const I = {
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      heart: '<path d="M12 21s-7-4.35-9.5-8.5C1 9 2.5 5.5 6 5.5c2 0 3 1.2 6 4 3-2.8 4-4 6-4 3.5 0 5 3.5 3.5 7C19 16.65 12 21 12 21z"/>',
      star: '<path d="M12 2l3 6.5 7 .8-5 4.8 1.3 7L12 17.8 5.4 21l1.3-7-5-4.8 7-.8L12 2z" fill="currentColor" stroke="none"/>',
      check: '<path d="M20 6L9 17l-5-5"/>',
      sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      moon: '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"/>',
      sound: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/>',
      muted: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/>',
      whatsapp: '<path fill="currentColor" stroke="none" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01ZM12.04 20.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43l-.48-.01c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/>',
      pin: '<path d="M12 22s7-7.6 7-13a7 7 0 10-14 0c0 5.4 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/>',
      phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8 9.6a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.7 2z"/>',
      mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
      camera: '<path d="M3 8a2 2 0 012-2h2l1.5-2h5L20 6h2a0 0 0 010 0 2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" transform="translate(-1 0)"/><circle cx="12" cy="13" r="3.4"/>',
      trash: '<path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      shield: '<path d="M12 2l8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/>',
      route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H15a3.5 3.5 0 000-7H9a3.5 3.5 0 010-7h6.5"/>',
      cert: '<circle cx="12" cy="9" r="6"/><path d="M9 14l-1 7 4-2 4 2-1-7"/><path d="M9.5 9l1.7 1.7L15 7"/>',
      tag: '<path d="M20 12l-8.5 8.5a2 2 0 01-2.8 0L3 14.8a2 2 0 010-2.8L11.2 4H20v8z"/><circle cx="16" cy="8" r="1.3" fill="currentColor" stroke="none"/>',
      play: '<path d="M7 4v16l13-8L7 4z" fill="currentColor" stroke="none"/>',
      ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
      fb: '<path d="M14 9V7c0-1 .5-1.5 1.5-1.5H17V2h-2.5C12 2 10.5 3.7 10.5 6v3H8v3.5h2.5V22H14v-9.5h2.5L17 9h-3z" fill="currentColor" stroke="none"/>',
      yt: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none"/>',
      tk: '<path d="M16 4c.5 2.3 2 3.8 4 4v3c-1.6 0-3-.5-4-1.3V15a5.5 5.5 0 11-5.5-5.5c.4 0 .7 0 1 .1v3.1a2.5 2.5 0 101.5 2.3V4H16z" fill="currentColor" stroke="none"/>',
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (I[n] || "") + "</svg>";
  }
  window.SJA.icon = icon;

  /* =====================================================================
     INIT
     ===================================================================== */
  function init() {
    renderBrands();
    buildCatalogueBar();
    renderCatalogue(false);
    renderTestimonials();
    // hero stats values (absentes sur les pages Super Promo, qui n'affichent pas ce bloc)
    if ($("#statVehicles")) $("#statVehicles").dataset.to = VEHICLES.length;
    if ($("#statBrands")) $("#statBrands").dataset.to = BRANDS.filter((b) => brandVehicleCount(b.id) > 0).length;
    if ($("#statYears")) $("#statYears").dataset.to = Math.max(20, new Date().getFullYear() - (CFG.brand.foundedYear || 2004));
    // borne le curseur de budget sur les prix réels
    setPriceBounds();
    $("#priceVal").textContent = fmtPrice(state.maxPrice);
    // inject icons in placeholders that need them
    $$("[data-icon]").forEach((e) => e.innerHTML = icon(e.dataset.icon));
    observeReveals();
    if ($("#heroStats")) ioStats.observe($("#heroStats"));

    // Entrée du hero = enrichissement progressif : le contenu est visible par
    // défaut ; on ne joue l'animation que si le document est réellement affiché.
    const hero = $(".hero");
    function playHero() {
      if (document.visibilityState === "visible") { hero.classList.add("animate"); runCounters(); }
    }
    playHero();
    document.addEventListener("visibilitychange", playHero);
    // Garde-fou : si l'IntersectionObserver est absent, on révèle tout.
    if (!("IntersectionObserver" in window)) {
      document.documentElement.classList.add("no-anim");
    }
    // Garde-fou horloge gelée (capture hors-écran / rendu sans timeline active) :
    // si aucune animation n'a progressé, on bascule en rendu statique visible.
    setTimeout(function () {
      let frozen = false;
      if (hero.getAnimations) {
        const a = hero.getAnimations({ subtree: true });
        frozen = a.length > 0 && a.every((x) => Number(x.currentTime || 0) === 0);
      }
      if (frozen) {
        document.documentElement.classList.add("no-anim");
        hero.classList.remove("animate");
        runCounters();
        $$(".reveal-up, .steps").forEach((el) => el.classList.add("in"));
      }
    }, 500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
