/* =========================================================================
   SJA Passion 73 — Son de déverrouillage "porte futuriste" (Web Audio)
   Aucune ressource externe : tout est synthétisé. Toggle mute global.
   ========================================================================= */
window.SJA_Sound = (function () {
  let ctx = null;
  let muted = (localStorage.getItem("sja-muted") === "1");

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function isMuted() { return muted; }
  function setMuted(v) { muted = !!v; localStorage.setItem("sja-muted", muted ? "1" : "0"); }
  function toggle() { setMuted(!muted); if (!muted) blip(); return muted; }

  // Petit clic de confirmation
  function blip() {
    const c = ensure(); if (!c || muted) return;
    const t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(660, t);
    o.frequency.exponentialRampToValueAtTime(990, t + 0.06);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.14);
  }

  // Séquence "déverrouillage + ouverture porte futuriste"
  function unlock() {
    const c = ensure(); if (!c || muted) return;
    const t0 = c.currentTime;
    const master = c.createGain();
    master.gain.value = 0.9; master.connect(c.destination);

    // 1) Mécanisme serrure : deux clics métalliques
    [0, 0.13].forEach((d, i) => {
      const t = t0 + d;
      const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
      o.type = "square"; o.frequency.setValueAtTime(1200 - i * 250, t);
      f.type = "highpass"; f.frequency.value = 700;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + 0.09);
    });

    // 2) Sweep ascendant futuriste (montée énergétique)
    const t1 = t0 + 0.22;
    const sweep = c.createOscillator(), sg = c.createGain(), sf = c.createBiquadFilter();
    sweep.type = "sawtooth";
    sweep.frequency.setValueAtTime(140, t1);
    sweep.frequency.exponentialRampToValueAtTime(880, t1 + 0.55);
    sf.type = "bandpass"; sf.Q.value = 6;
    sf.frequency.setValueAtTime(300, t1);
    sf.frequency.exponentialRampToValueAtTime(2600, t1 + 0.55);
    sg.gain.setValueAtTime(0.0001, t1); sg.gain.exponentialRampToValueAtTime(0.14, t1 + 0.1);
    sg.gain.exponentialRampToValueAtTime(0.0001, t1 + 0.7);
    sweep.connect(sf).connect(sg).connect(master); sweep.start(t1); sweep.stop(t1 + 0.75);

    // 3) Whoosh d'air (bruit filtré qui s'ouvre) — ouverture de la porte
    const t2 = t0 + 0.45;
    const dur = 0.9;
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const noise = c.createBufferSource(); noise.buffer = buf;
    const nf = c.createBiquadFilter(); nf.type = "bandpass"; nf.Q.value = 0.8;
    nf.frequency.setValueAtTime(400, t2);
    nf.frequency.exponentialRampToValueAtTime(2400, t2 + dur);
    const ng = c.createGain();
    ng.gain.setValueAtTime(0.0001, t2); ng.gain.exponentialRampToValueAtTime(0.16, t2 + 0.18);
    ng.gain.exponentialRampToValueAtTime(0.0001, t2 + dur);
    noise.connect(nf).connect(ng).connect(master); noise.start(t2); noise.stop(t2 + dur);

    // 4) Accord de résolution doré (révélation)
    const t3 = t0 + 0.95;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t3 + i * 0.04);
      g.gain.exponentialRampToValueAtTime(0.08, t3 + i * 0.04 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t3 + 0.9);
      o.connect(g).connect(master); o.start(t3 + i * 0.04); o.stop(t3 + 1.0);
    });
  }

  // Son d'une voiture DIESEL qui roule (grondement grave + cliquetis), synthétisé.
  // Retourne { stop } pour l'arrêter (skip / fin d'anim).
  function engine(duration) {
    const c = ensure(); if (!c || muted) return { stop() {} };
    const t0 = c.currentTime;
    const dur = Math.max(1, duration || 5);
    const nodes = [];

    const master = c.createGain();
    master.gain.setValueAtTime(0.0001, t0);
    master.gain.exponentialRampToValueAtTime(0.26, t0 + 0.4);    // démarrage
    master.gain.setValueAtTime(0.26, t0 + dur * 0.78);
    master.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.25); // s'éloigne
    master.connect(c.destination);

    // bus modulé par le "chug" diesel (cliquetis lent ~ rythme des cylindres)
    const bus = c.createGain();
    bus.gain.setValueAtTime(1, t0);
    bus.connect(master);
    const chug = c.createOscillator(); chug.type = "square";
    chug.frequency.setValueAtTime(22, t0);                       // ralenti diesel rugueux
    chug.frequency.linearRampToValueAtTime(46, t0 + 1.6);        // monte en régime
    chug.frequency.linearRampToValueAtTime(60, t0 + dur * 0.7);
    const chugG = c.createGain(); chugG.gain.value = 0.5;        // modulation marquée -> "tac-tac"
    chug.connect(chugG).connect(bus.gain);
    chug.start(t0); chug.stop(t0 + dur + 0.3); nodes.push(chug);

    // bloc moteur : fondamentale TRÈS grave + harmonique, dans un passe-bas serré
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 9;
    lp.frequency.setValueAtTime(220, t0);
    lp.frequency.linearRampToValueAtTime(520, t0 + 1.6);
    lp.frequency.linearRampToValueAtTime(680, t0 + dur * 0.7);
    lp.connect(bus);
    const base = 34;                                            // diesel = grave
    [[0, "sawtooth", 0.18], [12, "square", 0.12], [-7, "sawtooth", 0.1]].forEach(([det, type, gain]) => {
      const o = c.createOscillator(); o.type = type; o.detune.value = det;
      o.frequency.setValueAtTime(base * 0.75, t0);
      o.frequency.linearRampToValueAtTime(base * 1.5, t0 + 1.6);
      o.frequency.linearRampToValueAtTime(base * 1.85, t0 + dur * 0.7);
      o.frequency.linearRampToValueAtTime(base * 1.35, t0 + dur);
      const g = c.createGain(); g.gain.value = gain;
      o.connect(g).connect(lp); o.start(t0); o.stop(t0 + dur + 0.3); nodes.push(o);
    });

    // cliquetis diesel : bruit large-bande haché par le chug (injecteurs / combustion)
    const cb = c.createBuffer(1, Math.ceil(c.sampleRate * (dur + 0.3)), c.sampleRate);
    const cd = cb.getChannelData(0);
    for (let i = 0; i < cd.length; i++) cd[i] = Math.random() * 2 - 1;
    const clatter = c.createBufferSource(); clatter.buffer = cb; clatter.loop = true;
    const cf = c.createBiquadFilter(); cf.type = "bandpass"; cf.Q.value = 1.4;
    cf.frequency.setValueAtTime(1800, t0);
    cf.frequency.linearRampToValueAtTime(2600, t0 + dur * 0.7);
    const cg = c.createGain(); cg.gain.value = 0.0;
    // module le cliquetis par le chug pour l'effet "tac-tac-tac"
    const clG = c.createGain(); clG.gain.value = 0.05;
    chug.connect(clG).connect(cg.gain);
    cg.gain.setValueAtTime(0.05, t0);
    clatter.connect(cf).connect(cg).connect(bus);
    clatter.start(t0); clatter.stop(t0 + dur + 0.3); nodes.push(clatter);

    // roulement route (pneus) plus discret
    const nb = c.createBuffer(1, Math.ceil(c.sampleRate * (dur + 0.3)), c.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const noise = c.createBufferSource(); noise.buffer = nb; noise.loop = true;
    const nf = c.createBiquadFilter(); nf.type = "bandpass"; nf.Q.value = 0.7;
    nf.frequency.setValueAtTime(600, t0);
    nf.frequency.linearRampToValueAtTime(1200, t0 + dur * 0.7);
    const ng = c.createGain(); ng.gain.value = 0.04;
    noise.connect(nf).connect(ng).connect(bus);
    noise.start(t0); noise.stop(t0 + dur + 0.3); nodes.push(noise);

    let stopped = false;
    function stop() {
      if (stopped) return; stopped = true;
      const t = c.currentTime;
      try {
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(Math.max(0.0001, master.gain.value || 0.0001), t);
        master.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      } catch (e) {}
      nodes.forEach((n) => { try { n.stop(t + 0.3); } catch (e) {} });
    }
    return { stop };
  }

  return { unlock, blip, engine, toggle, isMuted, setMuted, ensure };
})();
