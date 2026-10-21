/* Politik : bouton « Cette page vous a-t-elle aidé ? » et événements d'usage, sans cookie ni identifiant.
   - Réponse Oui / Non : envoyée comme page virtuelle /__a/aide/oui<page> ou /__a/aide/non<page> (voir mesure.js,
     window.politikEvent, qui ne fait rien si la mesure est coupée). La réponse est aussi mémorisée dans le navigateur
     pour ne pas redemander la même chose sur la même page pendant 30 jours.
   - Si « Non » : lien vers un signalement GitHub pré-rempli avec l'adresse de la page. Politik ne collecte aucun texte libre.
   - Événements : [data-evt="intention/droits"] au clic, et clic sortant vers un site officiel (*.gouv.fr) : /__a/sortie/<domaine>.
   Chargé par structure.js sur toutes les pages. Non imprimé. */
(function () {
  var D = document, W = window;
  function evt(chemin) { try { if (W.politikEvent) W.politikEvent(chemin); } catch (e) {} }
  var page = location.pathname.replace(/\/$/, "") || "/index.html"; if (page === "") page = "/index.html";
  var CLE = "politik-aide-" + page, TRENTE = 30 * 24 * 3600 * 1000;
  function lire() { try { var v = JSON.parse(localStorage.getItem(CLE) || "null"); return v && Date.now() - v.t < TRENTE ? v.r : null; } catch (e) { return null; } }
  function ecrire(r) { try { localStorage.setItem(CLE, JSON.stringify({ r: r, t: Date.now() })); } catch (e) {} }

  var CSS = [
    ".aide{max-width:1120px;margin:34px auto 0;padding:22px max(16px,env(safe-area-inset-left,0px));border-top:1px solid var(--line)}",
    ".aide-in{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px 24px;padding:18px 22px;border:1px solid var(--line-2);border-radius:20px;background:var(--surface)}",
    ".aide h2{margin:0;font-family:var(--font-display);font-size:1.15rem;font-weight:500;letter-spacing:-.01em}",
    ".aide p{margin:4px 0 0;color:var(--ink-2);font-size:.9rem}",
    ".aide-b{display:flex;gap:10px;flex-wrap:wrap}",
    ".aide-b button{font:inherit;font-weight:600;min-height:44px;min-width:92px;padding:0 20px;border:1px solid var(--line);border-radius:999px;background:var(--surface);color:var(--ink);cursor:pointer}",
    ".aide-b button:hover{border-color:var(--ink-3)}",
    ".aide-b button:focus-visible,.aide a:focus-visible{outline:3px solid var(--accent);outline-offset:2px}",
    ".aide-m{width:100%}",
    ".aide-m a{color:var(--accent-ink)}",
    "body.falc .aide p,body.falc .aide-b button{font-size:1.05rem}",
    "@media print{.aide{display:none}}"
  ].join("\n");

  function issue() {
    var t = "Page à améliorer : " + page, c = "Page : " + location.href.split("#")[0] + "\n\nCe qui manque ou n'est pas clair :\n";
    return "https://github.com/antidoteforai-netizen/politik/issues/new?title=" + encodeURIComponent(t) + "&body=" + encodeURIComponent(c);
  }
  function html(r) {
    if (r === "oui") return '<div class="aide-in"><div><h2>Merci, votre réponse est comptée.</h2><p>Elle ne contient aucune donnée personnelle.</p></div></div>';
    if (r === "non") return '<div class="aide-in"><div><h2>Merci. Dites-nous ce qui manque.</h2><p>Un signalement ouvre une fiche GitHub avec l\'adresse de cette page, sans rien d\'autre.</p></div><div class="aide-b"><a class="btn" style="min-height:44px;padding:0 20px" href="' + issue() + '" target="_blank" rel="noopener">Signaler ce qui manque</a></div></div>';
    return '<div class="aide-in"><div><h2 id="aide-q">Cette page vous a-t-elle aidé ?</h2><p>Une réponse, sans identifiant ni cookie.</p></div><div class="aide-b" role="group" aria-labelledby="aide-q"><button type="button" data-r="oui">Oui</button><button type="button" data-r="non">Non</button></div></div>';
  }
  function monter() {
    if (D.querySelector(".aide") || /og-politik|infographie/.test(location.pathname)) return;
    var st = D.createElement("style"); st.textContent = CSS; D.head.appendChild(st);
    var box = D.createElement("aside"); box.className = "aide"; box.setAttribute("aria-label", "Votre avis sur cette page");
    box.innerHTML = html(lire());
    var ancre = D.getElementById("donnees-page") || D.querySelector("footer");
    if (ancre && ancre.parentNode) ancre.parentNode.insertBefore(box, ancre); else D.body.appendChild(box);
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-r]"); if (!b) return;
      var r = b.dataset.r; ecrire(r); evt("/__a/aide/" + r + page);
      box.innerHTML = html(r); box.setAttribute("aria-live", "polite");
      var h = box.querySelector("h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
    });
  }
  D.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-evt]"); if (a) { evt("/__a/" + a.getAttribute("data-evt")); return; }
    var l = e.target.closest && e.target.closest("a[href^='http']"); if (!l) return;
    try { var h = new URL(l.href).hostname; if (h !== location.hostname && /(^|\.)gouv\.fr$/.test(h)) evt("/__a/sortie/" + h); } catch (x) {}
  }, true);
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", monter); else monter();
})();
