/* =========================================================================
   SJA Passion 73 — Photothèque par défaut (par marque|modèle|vue)
   Photos livrées avec le site, appliquées à toutes les annonces du modèle.
   L'admin peut les remplacer via la Gestion des photos (stockage navigateur,
   prioritaire sur celles-ci).
   ========================================================================= */
window.SJA_MODEL_PHOTOS = {
  "dacia|Duster|face": "assets/duster-face.jpg",
  "dacia|Duster|profil": "assets/duster-profil.jpg",
  "dacia|Duster|troisquart": "assets/duster-troisquart.jpg",
  "dacia|Duster|arriere": "assets/duster-arriere.jpg",
  "dacia|Duster|interieur": "assets/duster-interieur.jpg",

  "dacia|Sandero Stepway|face": "assets/sandero-face.jpg",
  "dacia|Sandero Stepway|profil": "assets/sandero-profil.jpg",
  "dacia|Sandero Stepway|troisquart": "assets/sandero-troisquart.jpg",

  "dacia|Bigster|face": "assets/bigster-face.jpg",
  "dacia|Bigster|troisquart": "assets/bigster-troisquart.jpg",

  "dacia|Jogger|face": "assets/jogger-face.jpg",
  "dacia|Jogger|troisquart": "assets/jogger-troisquart.jpg",

  "renault|Clio 5|face": "assets/clio-face.jpg",
  "renault|Clio 5|troisquart": "assets/clio-troisquart.jpg",
  "renault|Clio 5|profil": "assets/clio-profil.jpg",

  "renault|Clio 6|troisquart": "assets/clio6-troisquart.jpg",

  "renault|Arkana|face": "assets/arkana-face.jpg",
  "renault|Arkana|troisquart": "assets/arkana-troisquart.jpg",
  "renault|Arkana|profil": "assets/arkana-profil.jpg",
  "renault|Arkana|arriere": "assets/arkana-arriere.jpg",
  "renault|Arkana|interieur": "assets/arkana-interieur.jpg",

  "renault|Captur|face": "assets/captur-face.jpg",
  "renault|Captur|troisquart": "assets/captur-troisquart.jpg",

  "renault|Austral|face": "assets/austral-face.jpg",
  "renault|Austral|troisquart": "assets/austral-troisquart.jpg",
  "renault|Austral|profil": "assets/austral-profil.jpg",

  "renault|Mégane|face": "assets/megane-face.jpg",
  "renault|Mégane|troisquart": "assets/megane-troisquart.jpg",
  "renault|Mégane|profil": "assets/megane-profil.jpg",
  "renault|Mégane E-Tech|face": "assets/megane-face.jpg",
  "renault|Mégane E-Tech|troisquart": "assets/megane-troisquart.jpg",
  "renault|Mégane E-Tech|profil": "assets/megane-profil.jpg",

  "renault|Symbioz|troisquart": "assets/symbioz-troisquart.jpg",

  "ram|RAM 1500|face": "assets/ram1500-hero.avif",
  "ram|RAM 1500|troisquart": "assets/ram1500-troisquart.jpg",

  "renault|Renault 5 E-Tech|face": "assets/r5-face.jpg",
  "renault|Renault 5 E-Tech|troisquart": "assets/r5-troisquart.jpg",

  "renault|Master|face": "assets/master-face.jpg",
  "renault|Master|troisquart": "assets/master-troisquart.jpg",

  "renault|Kangoo|face": "assets/kangoo-face.jpg",
  "renault|Kangoo|troisquart": "assets/kangoo-troisquart.jpg",

  "renault|Rafale|face": "assets/rafale-face.jpg",
  "renault|Rafale|troisquart": "assets/rafale-troisquart.jpg",
};

/* Versions recolorisées disponibles (carrosserie retouchée par coloris).
   Clé = photo de base ; valeur = liste des coloris (slugs) générés. */
window.SJA_RECOLOR = {
  "assets/duster-face.jpg":       ["schiste","sandstone","grey","silver","white","green","brown","blue","red","beige","orange","black"],
  "assets/duster-profil.jpg":     ["schiste","sandstone","grey","silver","white","green","brown","blue","red","beige","orange"],
  "assets/duster-troisquart.jpg": ["schiste","sandstone","grey","silver","white","green","brown","blue","red","beige","orange","black"],
  "assets/duster-arriere.jpg":    ["schiste","sandstone","grey","silver","white","green","brown","blue","red","beige","orange"],

  "assets/sandero-face.jpg":       ["white","yellow","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/sandero-profil.jpg":     ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/sandero-troisquart.jpg": ["white","yellow","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/bigster-face.jpg":       ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/bigster-troisquart.jpg": ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/jogger-face.jpg":       ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/jogger-troisquart.jpg": ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/clio-face.jpg":       ["white","schiste","sandstone","grey","silver","green","brown","blue","beige","orange","black"],
  "assets/clio-troisquart.jpg": ["white","schiste","sandstone","grey","silver","green","brown","blue","beige","orange","black"],
  "assets/clio-profil.jpg":     ["schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/clio6-troisquart.jpg": ["white","blue","red","green","black","grey","silver"],

  "assets/symbioz-troisquart.jpg": ["white","blue","grey","black","red"],

  "assets/arkana-face.jpg":       ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/arkana-troisquart.jpg": ["white","schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/arkana-profil.jpg":     ["schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],
  "assets/arkana-arriere.jpg":    ["schiste","sandstone","grey","silver","green","brown","blue","red","beige","orange","black"],

  "assets/captur-face.jpg":       ["white","black","schiste","grey","silver","sandstone","blue","red","green","brown","beige","orange"],
  "assets/captur-troisquart.jpg": ["white","black","schiste","grey","silver","sandstone","blue","red","green","brown","beige","orange"],

  "assets/austral-face.jpg":       ["white","schiste","red","blue","grey","silver","sandstone","green","brown","beige","orange","black"],
  "assets/austral-troisquart.jpg": ["white","schiste","red","blue","grey","silver","sandstone","green","brown","beige","orange","black"],
  "assets/austral-profil.jpg":     ["white","schiste","grey","silver","sandstone","red","green","brown","beige","orange","black"],

  "assets/megane-face.jpg":       ["white","grey","schiste","sandstone","blue","red","green","brown","beige","orange","black"],
  "assets/megane-troisquart.jpg": ["white","grey","schiste","sandstone","blue","red","green","brown","beige","orange","black"],
  "assets/megane-profil.jpg":     ["white","schiste","grey","silver","sandstone","blue","green","brown","beige","orange","black"],

  "assets/r5-face.jpg":           ["green","black"],
  "assets/r5-troisquart.jpg":     ["green","black"],

  "assets/master-face.jpg":       ["white"],
  "assets/master-troisquart.jpg": ["white"],

  "assets/kangoo-face.jpg":       ["white","black"],
  "assets/kangoo-troisquart.jpg": ["white","black"],

  "assets/rafale-face.jpg":       ["schiste","black"],
  "assets/rafale-troisquart.jpg": ["schiste","black"],
};
