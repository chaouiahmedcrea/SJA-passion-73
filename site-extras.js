/* Extras partagés : statistiques de visite, envoi des formulaires (email + WhatsApp), bascule FR/EN. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---- STATISTIQUES DE VISITE (Google Analytics 4) ----------------------
     Renseignez votre ID de mesure GA4 ci-dessous (ex. "G-XXXXXXXXXX").
     Créez-le gratuitement sur analytics.google.com puis remplacez la valeur. */
  var GA_ID = window.SJA_GA_ID || "";
  if (GA_ID) {
    var gs = document.createElement("script"); gs.async = true;
    gs.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }

  /* ---- ENVOI DES FORMULAIRES : email + WhatsApp -------------------------
     Email : via formsubmit.co vers contact.sjapassion73@gmail.com
     (au tout premier envoi, FormSubmit envoie un email d'activation à cette
     adresse — cliquez le lien une seule fois, ensuite tout est automatique).
     WhatsApp : ouvre la conversation pré-remplie vers le +33 6 64 40 12 37. */
  var LEAD_EMAIL = "contact.sjapassion73@gmail.com";
  var LEAD_WA = "33664401237";
  window.SJA_sendLead = function (form, subject) {
    var data = { _subject: subject, _template: "table" };
    var lines = [subject, ""];
    form.querySelectorAll("input, select, textarea").forEach(function (i) {
      if (!i.value || i.type === "hidden" || i.type === "file") return;
      var lab = i.id ? form.querySelector('label[for="' + i.id + '"]') : null;
      var key = (lab ? lab.textContent : (i.placeholder || i.name || i.id || "Champ")).trim().replace(/\s+/g, " ");
      data[key] = i.value;
      lines.push(key + " : " + i.value);
    });
    lines.push("", "Page : " + document.title);
    try {
      fetch("https://formsubmit.co/ajax/" + LEAD_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
    } catch (e) {}
    try { window.open("https://wa.me/" + LEAD_WA + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener"); } catch (e) {}
  };

  /* ---- BASCULE FR / EN --------------------------------------------------- */
  var DICT = Object.assign({
    "Vente France et UE": "Sales France & EU", "Rachat cash": "Cash buyback", "Export hors UE": "Export outside EU",
    "Super Promos": "Super Deals", "Catalogue": "Catalogue", "Recherche": "Search", "Marques": "Brands",
    "Process": "Process", "Pourquoi nous": "Why us", "Contact": "Contact", "Vidéos": "Videos",
    "Nos véhicules": "Our vehicles", "Infos": "Info", "Témoignages": "Testimonials",
    "Nos véhicules disponibles": "Our available vehicles", "Choisissez votre marque": "Choose your brand",
    "Étape 1 · Sélectionnez votre marque": "Step 1 · Select your brand", "Étape 2 · Affinez vos critères": "Step 2 · Refine your search",
    "Sélecteur de marques": "Brand selector", "Pourquoi nous choisir": "Why choose us", "Comment ça marche": "How it works",
    "Nos vidéos": "Our videos", "Une question ? Un projet ?": "A question? A project?",
    "Vente automobile en France et à l'international": "Car sales in France and worldwide",
    "Modèle": "Model", "Année": "Year", "Équipements": "Equipment", "Énergie": "Fuel", "Boîte": "Gearbox",
    "Budget max": "Max budget", "Tri": "Sort", "Réinitialiser": "Reset", "Tous": "All", "Neuf": "New",
    "Occasion": "Used", "Marque": "Brand", "Toutes · cliquez sur un logo": "All · click a logo",
    "Prix croissant": "Price: low to high", "Prix décroissant": "Price: high to low", "Plus récents": "Newest",
    "Tous les modèles": "All models", "Toutes les années": "All years", "Toutes énergies": "All fuels", "Toutes boîtes": "All gearboxes",
    "Nom complet": "Full name", "Votre message": "Your message", "Envoyer ma demande": "Send my request",
    "Recevoir mon estimation": "Get my estimate", "Téléphone": "Phone", "Marque / modèle souhaité": "Desired make / model",
    "Pays": "Country", "Navigation": "Navigation", "Société": "Company", "Légal": "Legal",
    "Mentions légales": "Legal notice", "CGV": "Terms of sale", "Confidentialité": "Privacy", "Cookies": "Cookies",
    "© 2026 SJA Passion 73. Tous droits réservés.": "© 2026 SJA Passion 73. All rights reserved.",
    "Voir les modèles": "See models", "Prochainement": "Coming soon", "Bientôt": "Soon", "Passer l'intro": "Skip intro",
    "Filtrer par équipement": "Filter by equipment", "Effacer": "Clear", "véhicules": "vehicles", "véhicule": "vehicle",
    "Étape 1 · Choisissez votre marque": "Step 1 · Choose your brand"
  }, window.SJA_DICT_EN || {});
  var REV = {}; Object.keys(DICT).forEach(function (k) { REV[DICT[k]] = k; });
  function translateTree(root, toEN) {
    var map = toEN ? DICT : REV;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) {
      var t = n.nodeValue, trimmed = t.trim();
      if (trimmed && map[trimmed]) n.nodeValue = t.replace(trimmed, map[trimmed]);
    }
    (root.querySelectorAll ? root.querySelectorAll("[placeholder]") : []).forEach && root.querySelectorAll("[placeholder]").forEach(function (el) {
      var p = el.getAttribute("placeholder"); if (map[p]) el.setAttribute("placeholder", map[p]);
    });
  }
  var lang = "fr";
  try { lang = localStorage.getItem("sja-lang") || "fr"; } catch (e) {}
  var mo = null;
  function setLang(l) {
    lang = l;
    try { localStorage.setItem("sja-lang", l); } catch (e) {}
    document.documentElement.lang = l;
    translateTree(document.body, l === "en");
    var b = $("#langToggle"); if (b) b.textContent = l === "en" ? "FR" : "EN";
    if (mo) mo.disconnect();
    if (l === "en") {
      mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (nd) { if (nd.nodeType === 1) translateTree(nd, true); });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }
  function initLang() {
    var actions = $(".nav-actions");
    if (actions && !$("#langToggle")) {
      var btn = document.createElement("button");
      btn.className = "icon-btn"; btn.id = "langToggle"; btn.type = "button";
      btn.title = "Français / English"; btn.setAttribute("aria-label", "Changer de langue");
      btn.style.cssText = "font-size:12px;font-weight:800;letter-spacing:.04em";
      btn.textContent = lang === "en" ? "FR" : "EN";
      btn.addEventListener("click", function () { setLang(lang === "en" ? "fr" : "en"); });
      actions.insertBefore(btn, actions.firstChild);
    }
    if (lang === "en") setTimeout(function () { setLang("en"); }, 350);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initLang);
  else initLang();
})();
