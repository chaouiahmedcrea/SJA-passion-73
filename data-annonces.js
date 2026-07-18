/* =========================================================================
   ANNONCES PUBLIÉES VIA L'ADMINISTRATION (admin.html)
   Pour publier vos changements pour TOUS les visiteurs : ouvrez admin.html,
   cliquez « Publier », puis remplacez CE fichier sur votre hébergement par
   celui téléchargé.
   ========================================================================= */
window.SJA_PUBLISHED = { added: [], edited: {}, removed: [] };
(function () {
  function apply(o) {
    if (!o) return;
    var list = window.SJA_VEHICLES || [];
    if (o.removed && o.removed.length) list = list.filter(function (v) { return o.removed.indexOf(v.id) === -1; });
    if (o.edited) list = list.map(function (v) { return o.edited[v.id] ? Object.assign({}, v, o.edited[v.id]) : v; });
    if (o.added && o.added.length) o.added.forEach(function (a) { if (!list.some(function (v) { return v.id === a.id; })) list = list.concat([a]); });
    window.SJA_VEHICLES = list;
  }
  apply(window.SJA_PUBLISHED);
  // Aperçu local : les modifications faites dans admin.html sur CE navigateur
  try { apply(JSON.parse(localStorage.getItem("sja-admin-overrides") || "null")); } catch (e) {}
})();
