/* Politik — légende des niveaux de confiance, disponible sur chaque pastille V / S / D / A.
   Chaque pastille devient un bouton : survol = infobulle, clic ou Entrée = légende complète,
   Échap = fermer. Chargé par toutes les pages. */
(function () {
  var LEG = {
    V: "V · Vérifié : lu dans une source officielle ou primaire.",
    S: "S · Source secondaire (presse, think tank, association) : à recouper.",
    D: "D · Déclaration ou position d'un acteur : pas un fait établi.",
    A: "A · À vérifier : issu de connaissances générales ou non retrouvé."
  };
  var pop = null;
  function close() { if (pop) { var b = pop._btn; pop.remove(); pop = null; if (b) b.setAttribute("aria-expanded", "false"); } }
  function open(btn) {
    close();
    var k = btn.getAttribute("data-lvl");
    pop = document.createElement("div"); pop.className = "pop legende-pop"; pop.setAttribute("role", "dialog"); pop._btn = btn;
    pop.innerHTML = "<b>Niveau de confiance</b>" + Object.keys(LEG).map(function (x) {
      return '<div class="legende-ligne' + (x === k ? " ici" : "") + '"><span class="lvl lvl-' + x + '">' + x + "</span> " + LEG[x].replace(/^[VSDA] · /, "") + "</div>";
    }).join("") + '<button class="close" type="button" aria-label="Fermer">×</button>';
    document.body.appendChild(pop);
    var r = btn.getBoundingClientRect(); var top = r.bottom + window.scrollY + 6; var left = r.left + window.scrollX;
    if (left + 340 > window.innerWidth - 12) left = Math.max(12, window.innerWidth - 352);
    pop.style.top = top + "px"; pop.style.left = left + "px";
    btn.setAttribute("aria-expanded", "true");
    pop.querySelector(".close").addEventListener("click", function () { close(); btn.focus(); });
  }
  function arm() {
    document.querySelectorAll(".lvl:not([data-lvl])").forEach(function (el) {
      var k = (el.textContent || "").trim().charAt(0);
      if (!LEG[k]) return;
      el.setAttribute("data-lvl", k);
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-expanded", "false");
      el.setAttribute("aria-label", LEG[k]);
      el.setAttribute("title", LEG[k]);
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".lvl[data-lvl]");
    if (b) { e.preventDefault(); (pop && pop._btn === b) ? close() : open(b); return; }
    if (pop && !(e.target.closest && e.target.closest(".legende-pop"))) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && pop) { var b = pop._btn; close(); b && b.focus(); return; }
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("lvl")) { e.preventDefault(); e.target.click(); }
  });
  var style = document.createElement("style");
  style.textContent = ".lvl[data-lvl]{cursor:help}.lvl[data-lvl]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.pop.legende-pop{position:absolute;z-index:30;max-width:340px;background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:8px;box-shadow:0 18px 40px -24px rgba(20,26,43,.35);padding:10px 34px 10px 12px;font-size:.86rem;line-height:1.45}.pop.legende-pop b{display:block;font-family:var(--font-display);margin-bottom:6px}.legende-ligne{display:flex;gap:8px;align-items:flex-start;padding:3px 0}.legende-ligne.ici{font-weight:600}.pop.legende-pop .close{position:absolute;top:4px;right:6px;border:0;background:none;font:inherit;color:var(--ink-3);cursor:pointer;padding:2px 6px}";
  document.head.appendChild(style);
  arm();
  new MutationObserver(arm).observe(document.body, { childList: true, subtree: true });
})();
