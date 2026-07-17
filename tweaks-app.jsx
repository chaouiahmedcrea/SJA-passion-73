/* =========================================================================
   SJA Passion 73 — Panneau Tweaks (île React au-dessus du site vanilla)
   Variations : animation porte, accent, police, son.
   ========================================================================= */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "door": "showroom",
  "accent": ["#bd7f2c", "#e0a64a", "rgba(214,150,60,0.30)"],
  "font": "Montserrat / Manrope",
  "theme": "light",
  "sound": true,
  "markup": 1500
}/*EDITMODE-END*/;

const DOOR_LABELS = { showroom: "Showroom", garage: "Garage", serrure: "Serrure" };

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Applique les réglages au site vanilla
  React.useEffect(() => {
    if (window.SJA && window.SJA.applyTweaks) {
      window.SJA.applyTweaks({ door: t.door, accent: t.accent, font: t.font, theme: t.theme });
    }
    if (window.SJA_Sound) window.SJA_Sound.setMuted(!t.sound);
    if (window.SJA && window.SJA.setMarkup) window.SJA.setMarkup(t.markup);
  }, [t.door, t.accent, t.font, t.theme, t.sound, t.markup]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Animation porte" />
      <TweakRadio
        label="Style de révélation"
        value={t.door}
        options={[
          { value: "showroom", label: "Showroom" },
          { value: "garage", label: "Garage" },
          { value: "serrure", label: "Serrure" }
        ]}
        onChange={(v) => { setTweak("door", v); if (window.SJA) window.SJA.applyTweaks({ door: v }); }}
      />
      <TweakButton label="▶ Rejouer la séquence" onClick={() => window.SJA && window.SJA.previewDoor(t.door)} />

      <TweakSection label="Identité visuelle" />
      <TweakColor
        label="Couleur d'accent"
        value={t.accent}
        options={[
          ["#a9842f", "#c4a14a", "rgba(169,132,47,0.30)"],
          ["#b06a3c", "#d08a5a", "rgba(176,106,60,0.30)"],
          ["#8a93a0", "#b9c1cc", "rgba(138,147,160,0.30)"],
          ["#2f8c63", "#5cb88c", "rgba(47,140,99,0.30)"]
        ]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSelect
        label="Police"
        value={t.font}
        options={["Montserrat / Manrope", "Raleway / Inter", "Sora / Manrope"]}
        onChange={(v) => setTweak("font", v)}
      />
      <TweakRadio
        label="Thème"
        value={t.theme}
        options={[
          { value: "light", label: "Clair" },
          { value: "dark", label: "Sombre" }
        ]}
        onChange={(v) => setTweak("theme", v)}
      />

      <TweakSection label="Prix de vente" />
      <TweakSlider
        label="Marge prix de vente (€)"
        value={t.markup}
        min={0} max={6000} step={100} unit=" €"
        onChange={(v) => { setTweak("markup", v); if (window.SJA && window.SJA.setMarkup) window.SJA.setMarkup(v); }}
      />

      <TweakSection label="Son" />
      <TweakToggle
        label="Son de déverrouillage"
        value={t.sound}
        onChange={(v) => setTweak("sound", v)}
      />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  function go() {
    const root = document.getElementById("tweaks-root");
    if (!root || !window.useTweaks) { return setTimeout(go, 60); }
    ReactDOM.createRoot(root).render(<TweaksApp />);
  }
  go();
})();
