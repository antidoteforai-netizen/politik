/* Politik — structure commune : menu « Plus » (le menu du haut garde 7 entrées) et plan du site en pied de page.
   Sans JavaScript, le menu complet reste affiché (dégradation propre). */
(function () {
  var PAGES = {
    "accueil.html": ["Accueil", "Se repérer"],
    "gouvernement.html": ["Le Gouvernement", "L'État"], "cybersecurite.html": ["Cybersécurité de l'État", "L'État"],
    "presidentielle-2027.html": ["Présidentielle 2027", "L'État"],
    "index.html": ["Fraude sociale", "Argent et médias"], "medias.html": ["Qui possède les médias", "Argent et médias"],
    "forces.html": ["Forces de l'ordre", "Sécurité"], "17-octobre-2026.html": ["Le 17 octobre 2026", "Sécurité"],
    "secteurs.html": ["Comment va la France", "Comprendre"], "benchmark-usa.html": ["Benchmark États-Unis", "Comprendre"], "donnees.html": ["Sources et données", "Se repérer"]
  };
  var CSS = [
    ".nav-plus{position:relative}",
    ".nav-plus>button{font:inherit;font-size:.84rem;padding:6px 10px;border-radius:6px;border:0;background:transparent;color:var(--ink-2);cursor:pointer;white-space:nowrap}",
    ".nav-plus>button:hover,.nav-plus>button:focus-visible,.nav-plus>button[aria-expanded=true]{background:var(--accent-soft);color:var(--accent-ink);outline:none}",
    ".nav-plus>button.here{font-weight:600;color:var(--ink)}",
    ".nav-panel{position:fixed;z-index:20;min-width:220px;max-width:calc(100vw - 32px);background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:6px;box-shadow:0 8px 28px rgba(20,26,43,.14)}",
    ".nav-panel[hidden]{display:none}",
    ".nav-panel a{display:block;padding:10px 12px;border-radius:8px;font-size:.92rem;color:var(--ink);text-decoration:none}",
    ".nav-panel a:hover,.nav-panel a:focus-visible{background:var(--accent-soft);color:var(--accent-ink);outline:none}",
    ".nav-panel a.here{font-weight:600}",
    ".plan{margin:28px 0 8px;padding:20px 0 0;border-top:1px solid var(--line)}",
    ".plan h2{font-size:.74rem;text-transform:uppercase;letter-spacing:.09em;color:var(--ink-3);margin:0 0 12px;font-weight:600}",
    ".plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:18px 24px}",
    ".plan-grid h3{font-size:.86rem;margin:0 0 6px;color:var(--ink)}",
    ".plan-grid ul{list-style:none;margin:0;padding:0;display:grid;gap:2px}",
    ".plan-grid a{display:inline-block;padding:5px 0;font-size:.9rem;color:var(--ink-2)}",
    ".plan-grid a[aria-current]{font-weight:600;color:var(--ink)}",
    "@media print{.plan{display:none}}"
  ].join("\n");
  var here = location.pathname.split("/").pop() || "accueil.html"; if (here === "simple.html") here = "index.html";
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function init() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var ul = document.querySelector("nav.nav ul");
    if (ul) {
      var items = [].slice.call(ul.children);
      if (items.length > 7) {
        var extra = items.slice(6), li = document.createElement("li"); li.className = "nav-plus";
        var cur = extra.some(function (x) { return x.querySelector("a.here"); });
        li.innerHTML = '<button type="button" aria-expanded="false" aria-controls="nav-panel" aria-haspopup="true"' + (cur ? ' class="here"' : "") + '>Plus <span aria-hidden="true">▾</span></button>';
        var panel = document.createElement("div"); panel.id = "nav-panel"; panel.className = "nav-panel"; panel.hidden = true;
        panel.innerHTML = extra.map(function (x) { var a = x.querySelector("a"); return '<a href="' + esc(a.getAttribute("href")) + '"' + (a.classList.contains("here") ? ' class="here" aria-current="page"' : "") + ">" + esc(a.getAttribute("title") || a.textContent) + "</a>"; }).join("");
        extra.forEach(function (x) { ul.removeChild(x); }); ul.appendChild(li); document.body.appendChild(panel);
        var btn = li.firstChild;
        var close = function () { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); };
        btn.addEventListener("click", function () { if (!panel.hidden) return close(); var b = btn.getBoundingClientRect(); panel.style.top = (b.bottom + 6) + "px"; panel.style.left = Math.max(16, Math.min(b.left, innerWidth - 236)) + "px"; panel.hidden = false; btn.setAttribute("aria-expanded", "true"); panel.querySelector("a").focus(); });
        document.addEventListener("click", function (e) { if (!panel.hidden && !panel.contains(e.target) && !li.contains(e.target)) close(); });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { close(); btn.focus(); } });
        window.addEventListener("scroll", close, { passive: true });
      }
    }
    var f = document.querySelector("footer"); if (!f) return;
    var groups = {}; Object.keys(PAGES).forEach(function (k) { (groups[PAGES[k][1]] = groups[PAGES[k][1]] || []).push(k); });
    var nav = document.createElement("nav"); nav.className = "plan wrap"; nav.setAttribute("aria-label", "Plan du site");
    nav.innerHTML = "<h2>Plan du site</h2><div class=\"plan-grid\">" + Object.keys(groups).map(function (g) { return "<div><h3>" + esc(g) + "</h3><ul>" + groups[g].map(function (k) { return '<li><a href="' + k + '"' + (k === here ? ' aria-current="page"' : "") + ">" + esc(PAGES[k][0]) + "</a></li>"; }).join("") + "</ul></div>"; }).join("") + "</div>";
    f.parentNode.insertBefore(nav, f);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
