/* Politik — garde la lectrice à la même section quand elle change de niveau (Termes de l'État / FALC).
   Problème mesuré (2026-10-20) : en FALC la page fraude passe de 7 969 à 15 531 px, une phrase par ligne ;
   le navigateur conservait le même décalage en pixels, donc la lectrice se retrouvait plus haut ou plus bas
   dans la page. Ici : avant le rendu, on note la section visible et sa distance au haut de l'écran ; après le
   rendu, on remet cette section au même endroit. */
(function () {
  function SH() { return (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sticky-h")) || 100) + 20; }
  function repere() {
    var secs = document.querySelectorAll("main section[id]"), best = null, bestTop = -Infinity;
    for (var i = 0; i < secs.length; i++) {
      var r = secs[i].getBoundingClientRect();
      if (r.height === 0) continue; /* section masquée (autre onglet) */
      if (r.top <= SH() && r.bottom > SH() && r.top > bestTop) { best = secs[i]; bestTop = r.top; }
    }
    if (!best) { for (var j = 0; j < secs.length; j++) { var q = secs[j].getBoundingClientRect(); if (q.height > 0 && q.top > 0) { best = secs[j]; bestTop = q.top; break; } } }
    return best ? { id: best.id, top: bestTop } : null;
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("#switch button"); if (!b || b.getAttribute("aria-pressed") === "true") return;
    var m = repere(); if (!m) return;
    setTimeout(function () {
      var el = document.getElementById(m.id); if (!el || el.getBoundingClientRect().height === 0) return;
      window.scrollBy({ top: el.getBoundingClientRect().top - m.top, behavior: "instant" });
    }, 150); /* après le rendu de la page et le développement des sigles */
  }, true);
})();
