/* =========================================================================
   SJA Passion 73 — Mesure d'audience
   -------------------------------------------------------------------------
   Ce fichier compte les visites et les actions utiles au commerce :
   fiches véhicules ouvertes, clics WhatsApp, appels, demandes envoyées.

   Aucun cookie, aucune donnée personnelle, rien qui identifie un visiteur.
   C'est ce qui dispense le site d'un bandeau de consentement (recommandation
   CNIL sur la mesure d'audience exemptée).

   POUR L'ACTIVER : renseignez l'identifiant dans config.js
       window.SJA_CONFIG.analytics = { umamiId: "votre-identifiant" }
   Tant qu'il est vide, ce fichier ne charge rien et n'envoie rien.

   Ne compte jamais :
     - vos propres visites (navigateur en mode propriétaire, voir admin.html)
     - les visiteurs ayant activé "Do Not Track" dans leur navigateur
     - les passages sur admin.html
   ========================================================================= */
(function () {
  "use strict";

  var CFG = (window.SJA_CONFIG && window.SJA_CONFIG.analytics) || {};
  var ID = CFG.umamiId || "";
  var HOTE = CFG.umamiHost || "https://cloud.umami.is";

  /* ---- Faut-il compter cette visite ? ---------------------------------- */
  function exclu() {
    // 1. Le propriétaire : ses allers-retours fausseraient tout.
    if (window.SJA_IS_OWNER) return "proprietaire";
    // 2. Exclusion posée manuellement une fois pour toutes sur ce navigateur.
    try { if (localStorage.getItem("sja-nostats") === "1") return "exclu-manuel"; } catch (e) {}
    // 3. Page d'administration : privée, hors périmètre.
    if (/admin\.html/i.test(location.pathname)) return "page-admin";
    // 4. Refus explicite du visiteur.
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return "do-not-track";
    return null;
  }

  /* Poser ou retirer l'exclusion : ouvrir n'importe quelle page du site avec
     ?nostats=1 (pour s'exclure) ou ?nostats=0 (pour se réinclure). Utile sur
     un téléphone, où le mode propriétaire n'est pas forcément activé. */
  try {
    var p = new URLSearchParams(location.search).get("nostats");
    if (p === "1") localStorage.setItem("sja-nostats", "1");
    else if (p === "0") localStorage.removeItem("sja-nostats");
  } catch (e) {}

  var motif = exclu();
  if (!ID || motif) {
    // Mode inerte : SJA_track existe quand même, pour ne casser aucun appel.
    window.SJA_track = function () {};
    window.SJA_STATS = { actif: false, motif: motif || "identifiant-absent" };
    return;
  }

  /* ---- Chargement du script de mesure ---------------------------------- */
  var s = document.createElement("script");
  s.defer = true;
  s.src = HOTE.replace(/\/+$/, "") + "/script.js";
  s.setAttribute("data-website-id", ID);
  // Les clics sont envoyés par ce fichier, pas par détection automatique :
  // on garde la main sur ce qui est mesuré et sous quel nom.
  s.setAttribute("data-auto-track", "true");
  document.head.appendChild(s);

  /* ---- Envoi d'un évènement -------------------------------------------- */
  /* Le script met un court instant à se charger. Les évènements déclenchés
     avant sont mis en attente plutôt que perdus (un visiteur pressé qui clique
     WhatsApp dans la première seconde est justement le plus intéressant). */
  var file = [];
  var pret = false;

  function envoyer(nom, donnees) {
    try { window.umami.track(nom, donnees || {}); } catch (e) {}
  }

  function vider() {
    pret = true;
    while (file.length) { var e = file.shift(); envoyer(e[0], e[1]); }
  }

  s.addEventListener("load", vider);
  // Filet : si le script est bloqué par une extension, on cesse d'empiler
  // au bout de 8 secondes au lieu de garder la file en mémoire.
  setTimeout(function () { if (!pret) { file.length = 0; pret = true; } }, 8000);

  window.SJA_track = function (nom, donnees) {
    if (!nom) return;
    nom = String(nom).slice(0, 50);
    if (pret && window.umami) envoyer(nom, donnees);
    else file.push([nom, donnees]);
  };
  window.SJA_STATS = { actif: true, motif: null };

  /* ---- Quelle page ? ---------------------------------------------------- */
  /* Le site a cinq pages publiques. Les nommer proprement évite de lire
     "Super%20Promo%20Intra%20UE.html" dans les tableaux. */
  function nomPage() {
    var f = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
    if (/^$|index/i.test(f)) return "Vente France et UE";
    if (/Rachat/i.test(f)) return "Rachat cash";
    if (/Export/i.test(f)) return "Export hors UE";
    if (/Intra/i.test(f)) return "Super Promos Intra UE";
    if (/Extra/i.test(f)) return "Super Promos Extra UE";
    if (/Mentions/i.test(f)) return "Mentions legales";
    return f;
  }
  var PAGE = nomPage();

  /* ---- 1. Fiches véhicules consultées ----------------------------------- */
  /* On observe l'ouverture de la fenêtre de détail plutôt que de modifier
     app.js : ce fichier est regénéré à chaque export Claude Design, la mesure
     survit donc aux mises à jour du site. */
  function suivreAnnonces() {
    var modal = document.getElementById("modal");
    if (!modal) return;
    var ouvert = modal.classList.contains("open");

    new MutationObserver(function () {
      var maintenant = modal.classList.contains("open");
      if (maintenant === ouvert) return;
      ouvert = maintenant;
      if (!maintenant) return;                      // fermeture : rien à compter

      var txt = function (sel) {
        var el = modal.querySelector(sel) || document.querySelector(sel);
        return el ? (el.textContent || "").trim() : "";
      };
      var titre = txt("#mTitle");                   // "Dacia Duster"
      var version = txt("#mDesc");                  // "Extreme TCe 130"
      if (!titre) return;

      var id = "";
      try { id = new URLSearchParams(location.search).get("veh") || ""; } catch (e) {}

      window.SJA_track("annonce-vue", {
        vehicule: (titre + (version ? " " + version : "")).slice(0, 120),
        marque: txt("#mBrand"),
        etat: txt("#mBadge"),                       // Neuf / Occasion
        reference: id,
        page: PAGE
      });
    }).observe(modal, { attributes: true, attributeFilter: ["class"] });
  }

  /* ---- 2. Clics de contact ---------------------------------------------- */
  /* Ce sont les seuls clics qui valent de l'argent : tout le reste est du
     bruit. On les distingue par destination, pas par apparence du bouton. */
  function suivreContacts() {
    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      var href = a.getAttribute("href") || "";
      var ou = { page: PAGE, depuis: (a.textContent || "").trim().slice(0, 40) };

      if (/wa\.me\//i.test(href)) window.SJA_track("clic-whatsapp", ou);
      else if (/^tel:/i.test(href)) window.SJA_track("clic-telephone", ou);
      else if (/^mailto:/i.test(href)) window.SJA_track("clic-email", ou);
    }, true);
  }

  /* ---- 3. Demandes de contact ------------------------------------------- */
  /* On enveloppe l'envoi existant pour distinguer une demande réellement
     partie d'une demande perdue. Une hausse de "demande-echouee" signale une
     panne du service d'envoi, sans attendre qu'un client se plaigne. */
  function suivreFormulaires() {
    var envoiOriginal = window.SJA_sendLead;
    if (typeof envoiOriginal !== "function") return;

    window.SJA_sendLead = function (form, subject) {
      var sujet = String(subject || "").slice(0, 60);
      window.SJA_track("demande-tentee", { sujet: sujet, page: PAGE });
      var r = envoiOriginal.apply(this, arguments);
      if (r && typeof r.then === "function") {
        r.then(function (ok) {
          window.SJA_track(ok ? "demande-envoyee" : "demande-echouee", { sujet: sujet, page: PAGE });
        });
      }
      return r;
    };
  }

  function init() { suivreAnnonces(); suivreContacts(); suivreFormulaires(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
