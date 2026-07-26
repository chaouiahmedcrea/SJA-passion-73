/* =========================================================================
   SJA Passion 73 — Configuration
   Renseignez ici vos paramètres réels. Aucune autre modification nécessaire.
   ========================================================================= */
window.SJA_CONFIG = {
  brand: {
    name: "SJA Passion 73",
    tagline: "Votre expert de la vente et de l'importation depuis plus de 20 ans",
    foundedYear: 2004,
  },

  // Contact ----------------------------------------------------------------
  whatsapp: [
    { label: "Service commercial", number: "33664401237" },
    { label: "Logistique & douane", number: "33679028563" },
  ],
  email: "contact@sjapassion73.fr",
  phoneDisplay: ["+33 6 64 40 12 37", "+33 6 79 02 85 63"],
  address: "73000 Chambéry, Savoie — France",
  hours: [
    { d: "Lundi – Vendredi", h: "9h00 – 19h00" },
    { d: "Samedi", h: "9h00 – 17h00" },
    { d: "Dimanche", h: "Sur rendez-vous" },
  ],
  socials: {
    instagram: "#",
    facebook: "#",
    youtube: "#",
    tiktok: "#",
  },

  // Cartographie -----------------------------------------------------------
  googleMapsApiKey: "",                    // à fournir
  mapEmbedUrl: "",                         // optionnel : URL d'embed Google Maps

  // Passerelle fournisseur -------------------------------------------------
  supplier: {
    endpoint: "",                          // SUPPLIER_API_ENDPOINT à fournir
    apiKey: "",
    refreshOnLoad: false,                  // fallback automatique sur data.js
  },

  // Affichage --------------------------------------------------------------
  currency: { code: "EUR", symbol: "€", locale: "fr-FR" },
  // Les prix de vente sont definitifs dans data.js.
  // Laisser a 0 : le prix d'achat n'est pas publie sur le site.
  salesMarkup: 0,
  defaultTheme: "light",                   // "dark" | "light"

  // Mesure d'audience ------------------------------------------------------
  // Collez ici l'identifiant fourni par Umami apres avoir ajoute le site.
  // Vide = aucune mesure, aucun script tiers charge. Voir analytics.js.
  analytics: {
    umamiId: "1a01367e-0a8a-4412-a9e2-7f02efd4ffd9",
    umamiHost: "https://cloud.umami.is",
  },
};

/* Statistiques de visite : collez ici votre ID de mesure Google Analytics 4 (ex. "G-XXXXXXXXXX"). Laissez vide pour désactiver. */
window.SJA_GA_ID = "";

/* Mode propriétaire : débloqué sur ce navigateur après connexion à admin.html. */
window.SJA_IS_OWNER = (function () { try { return localStorage.getItem("sja-owner") === "1"; } catch (e) { return false; } })();
if (window.SJA_IS_OWNER) document.documentElement.classList.add("sja-owner");
