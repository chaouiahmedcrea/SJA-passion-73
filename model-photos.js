/* =========================================================================
   SJA Passion 73 — Photothèque par défaut (par marque|modèle|vue)
   Photos livrées avec le site, appliquées à toutes les annonces du modèle.
   L'admin peut les remplacer via la Gestion des photos (stockage navigateur,
   prioritaire sur celles-ci).
   ========================================================================= */
window.SJA_MODEL_PHOTOS = {
  "dacia|Duster|face": "assets/duster-face.webp",
  "dacia|Duster|profil": "assets/duster-profil.webp",
  "dacia|Duster|troisquart": "assets/duster-troisquart.webp",
  "dacia|Duster|arriere": "assets/duster-arriere.webp",
  "dacia|Duster|interieur": "assets/duster-interieur.webp",

  "dacia|Sandero Stepway|face": "assets/sandero-face.webp",
  "dacia|Sandero Stepway|profil": "assets/sandero-profil.webp",
  "dacia|Sandero Stepway|troisquart": "assets/sandero-troisquart.webp",

  "dacia|Bigster|face": "assets/bigster-face.webp",
  "dacia|Bigster|troisquart": "assets/bigster-troisquart.webp",

  "dacia|Jogger|face": "assets/jogger-face.webp",
  "dacia|Jogger|troisquart": "assets/jogger-troisquart.webp",

  "renault|Clio 5|face": "assets/clio-face.webp",
  "renault|Clio 5|troisquart": "assets/clio-troisquart.webp",
  "renault|Clio 5|profil": "assets/clio-profil.webp",

  "renault|Clio 6|troisquart": "assets/clio6-troisquart.webp",

  "renault|Arkana|face": "assets/arkana-face.webp",
  "renault|Arkana|troisquart": "assets/arkana-troisquart.webp",
  "renault|Arkana|profil": "assets/arkana-profil.webp",
  "renault|Arkana|arriere": "assets/arkana-arriere.webp",
  "renault|Arkana|interieur": "assets/arkana-interieur.webp",

  "renault|Captur|face": "assets/captur-face.webp",
  "renault|Captur|troisquart": "assets/captur-troisquart.webp",

  "renault|Austral|face": "assets/austral-face.webp",
  "renault|Austral|troisquart": "assets/austral-troisquart.webp",
  "renault|Austral|profil": "assets/austral-profil.webp",

  "renault|Mégane|face": "assets/megane-face.webp",
  "renault|Mégane|troisquart": "assets/megane-troisquart.webp",
  "renault|Mégane|profil": "assets/megane-profil.webp",
  "renault|Mégane E-Tech|face": "assets/megane-face.webp",
  "renault|Mégane E-Tech|troisquart": "assets/megane-troisquart.webp",
  "renault|Mégane E-Tech|profil": "assets/megane-profil.webp",

  "renault|Symbioz|troisquart": "assets/symbioz-troisquart.webp",

  "ram|RAM 1500|face": "assets/ram1500-hero.avif",
  "ram|RAM 1500|troisquart": "assets/ram1500-troisquart.webp",

  "renault|Renault 5 E-Tech|face": "assets/r5-face.webp",
  "renault|Renault 5 E-Tech|troisquart": "assets/r5-troisquart.webp",

  "renault|Master|face": "assets/master-face.webp",
  "renault|Master|troisquart": "assets/master-troisquart.webp",

  "renault|Kangoo|face": "assets/kangoo-face.webp",
  "renault|Kangoo|troisquart": "assets/kangoo-troisquart.webp",

  "renault|Rafale|face": "assets/rafale-face.webp",
  "renault|Rafale|troisquart": "assets/rafale-troisquart.webp",
};

/* Versions recolorisées disponibles (carrosserie retouchée par coloris).
   Clé = photo de base ; valeur = liste des coloris (slugs) générés. */
window.SJA_RECOLOR = {
  "assets/duster-face.webp":       ["schiste","sandstone","grey","silver","white","green","brown","blue","red","beige","orange","black"],
  "assets/duster-profil.webp":     ["schiste","sandstone","grey","silver","white","green","brown","blue","red","beige","orange"],
  "assets/duster-troisquart.webp": ["schiste","sandstone","grey","silver","white","green","brown","blue","red","beige","orange","black"],
  "assets/duster-arriere.webp":    ["schiste","sandstone","grey","silver","white","green","brown","blue","red","beige","orange"],

  "assets/sandero-face.webp":       ["white","yellow","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/sandero-profil.webp":     ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/sandero-troisquart.webp": ["white","yellow","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/bigster-face.webp":       ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/bigster-troisquart.webp": ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/jogger-face.webp":       ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/jogger-troisquart.webp": ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/clio-face.webp":       ["white","schiste","sandstone","grey","silver","green","brown","blue","beige","orange","black"],
  "assets/clio-troisquart.webp": ["white","schiste","sandstone","grey","silver","green","brown","blue","beige","orange","black"],
  "assets/clio-profil.webp":     ["schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/clio6-troisquart.webp": ["white","blue","red","green","black","grey","silver"],

  "assets/symbioz-troisquart.webp": ["white","blue","grey","black","red"],

  "assets/arkana-face.webp":       ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/arkana-troisquart.webp": ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/arkana-profil.webp":     ["schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/arkana-arriere.webp":    ["schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/captur-face.webp":       ["white","black","schiste","grey","silver","sandstone","blue","red","green","brown","beige","orange"],
  "assets/captur-troisquart.webp": ["white","black","schiste","grey","silver","sandstone","blue","red","green","brown","beige","orange"],

  "assets/austral-face.webp":       ["white","schiste","red","blue","grey","silver","sandstone","green","brown","beige","orange","black"],
  "assets/austral-troisquart.webp": ["white","schiste","red","blue","grey","silver","sandstone","green","brown","beige","orange","black"],
  "assets/austral-profil.webp":     ["white","schiste","grey","silver","sandstone","red","green","brown","beige","orange","black"],

  "assets/megane-face.webp":       ["white","grey","schiste","sandstone","blue","red","green","brown","beige","orange","black"],
  "assets/megane-troisquart.webp": ["white","grey","schiste","sandstone","blue","red","green","brown","beige","orange","black"],
  "assets/megane-profil.webp":     ["white","schiste","grey","silver","sandstone","blue","green","brown","beige","orange","black"],

  "assets/r5-face.webp":           ["green","black"],
  "assets/r5-troisquart.webp":     ["green","black"],

  "assets/master-face.webp":       ["white"],
  "assets/master-troisquart.webp": ["white"],

  "assets/kangoo-face.webp":       ["white","black"],
  "assets/kangoo-troisquart.webp": ["white","black"],

  "assets/rafale-face.webp":       ["schiste","black"],
  "assets/rafale-troisquart.webp": ["schiste","black"],
};
