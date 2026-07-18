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
  email: "contact.sjapassion73@gmail.com",
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
  // Marge appliquée au prix fournisseur (HT) pour obtenir le prix de vente affiché.
  // Modifiable aussi en direct via le panneau Tweaks.
  salesMarkup: 1500,
  defaultTheme: "light",                   // "dark" | "light"
};

/* Statistiques de visite : collez ici votre ID de mesure Google Analytics 4 (ex. "G-XXXXXXXXXX"). Laissez vide pour désactiver. */
window.SJA_GA_ID = "";
