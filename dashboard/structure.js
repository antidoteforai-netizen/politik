/* Politik — structure commune du site.
   - Menu du haut en arborescence : Accueil, Ministères, États des lieux, Dossiers, Plus (menus accessibles au clavier).
   - Fil d'Ariane sur toutes les pages sauf l'accueil.
   - Plan du site en pied de page, avec la liste des ministères, et note sur la mesure d'audience.
   - Libellé long du niveau FALC sur grand écran, sigle sur petit écran ; en-têtes de tableaux déclarés (scope).
   Sans JavaScript, le menu statique de chaque page reste affiché. */
(function () {
  var PAGES = {
    "accueil.html": ["Accueil", "Se repérer"], "donnees.html": ["Sources et données", "Se repérer"], "benchmark-usa.html": ["Benchmark États-Unis", "Se repérer"],
    "gouvernement.html": ["Les 21 ministères", "Le Gouvernement"], "presidentielle-2027.html": ["Présidentielle 2027", "Le Gouvernement"],
    "index.html": ["Fraude sociale", "États des lieux"], "forces.html": ["Police et gendarmerie", "États des lieux"],
    "cybersecurite.html": ["Cybersécurité de l'État", "États des lieux"], "secteurs.html": ["Comment va la France", "États des lieux"],
    "medias.html": ["Qui possède les médias", "Dossiers"], "17-octobre-2026.html": ["Le 17 octobre 2026", "Dossiers"]
  };
  var FAMILLES = [["regalien", "Pouvoirs régaliens"], ["economie", "Économie et travail"], ["territoires", "Territoires et transitions"], ["societe", "Société"], ["autres", "Autres acteurs"]];
  var TREE = [
    { k: "accueil", label: "Accueil", href: "accueil.html" },
    { k: "ministeres", label: "Ministères", menu: "ministeres", href: "gouvernement.html" },
    { k: "etats", label: "États des lieux", items: ["index.html", "forces.html", "cybersecurite.html", "secteurs.html"] },
    { k: "dossiers", label: "Dossiers", items: ["medias.html", "17-octobre-2026.html"] },
    { k: "plus", label: "Plus", items: ["presidentielle-2027.html", "benchmark-usa.html", "donnees.html"] }
  ];
  var CSS = [
    ".nav-menu{position:relative}",
    ".nav-menu>button{font:inherit;font-size:.84rem;padding:6px 10px;border-radius:6px;border:0;background:transparent;color:var(--ink-2);cursor:pointer;white-space:nowrap}",
    ".nav-menu>button:hover,.nav-menu>button:focus-visible,.nav-menu>button[aria-expanded=true]{background:var(--accent-soft);color:var(--accent-ink);outline:none}",
    ".nav-menu>button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}",
    ".nav-menu>button.here{font-weight:600;color:var(--ink);background:var(--accent-soft)}",
    ".nav-panel{position:fixed;z-index:20;min-width:230px;max-width:calc(100vw - 32px);max-height:calc(100vh - 90px);overflow:auto;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:8px;box-shadow:0 12px 32px rgba(20,26,43,.16)}",
    ".nav-panel[hidden]{display:none}",
    ".nav-panel a{display:block;padding:9px 12px;border-radius:8px;font-size:.92rem;color:var(--ink);text-decoration:none}",
    ".nav-panel a:hover,.nav-panel a:focus-visible{background:var(--accent-soft);color:var(--accent-ink);outline:none}",
    ".nav-panel a[aria-current]{font-weight:700}",
    ".nav-panel.wide{width:min(760px,calc(100vw - 32px));padding:14px}",
    ".nav-panel .all{display:flex;justify-content:space-between;align-items:center;margin:0 0 8px;padding:10px 12px;border-radius:10px;background:var(--accent-soft);color:var(--accent-ink);font-weight:700}",
    ".nav-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px 18px}",
    ".nav-cols h3{margin:6px 12px 2px;font-size:.7rem;text-transform:uppercase;letter-spacing:.09em;color:var(--ink-3);font-weight:700;display:flex;align-items:center;gap:6px}",
    ".nav-cols h3 i{width:8px;height:8px;border-radius:50%;background:var(--f)}",
    ".nav-cols ul{list-style:none;margin:0;padding:0}",
    ".nav-cols a{padding:6px 12px;font-size:.88rem}",
    ".fil{margin:0;padding:10px 0 0}",
    ".fil ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:2px 0;font-size:.82rem;color:var(--ink-3)}",
    ".fil li:not(:last-child):after{content:\"›\";margin:0 8px;color:var(--ink-3)}",
    ".fil a{color:var(--ink-2);text-decoration-color:var(--line)}",
    ".fil [aria-current]{color:var(--ink);font-weight:600}",
    ".plan{margin:28px 0 8px;padding:20px 0 0;border-top:1px solid var(--line)}",
    ".plan h2{font-size:.74rem;text-transform:uppercase;letter-spacing:.09em;color:var(--ink-3);margin:0 0 12px;font-weight:600}",
    ".plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:18px 24px}",
    ".mesure-note{margin:16px 0 0;font-size:.8rem;color:var(--ink-3);max-width:70ch}",
    ".plan-grid h3{font-size:.86rem;margin:0 0 6px;color:var(--ink)}",
    ".plan-grid ul{list-style:none;margin:0;padding:0;display:grid;gap:2px}",
    ".plan-grid a{display:inline-block;padding:5px 0;font-size:.9rem;color:var(--ink-2)}",
    ".plan-grid a[aria-current]{font-weight:600;color:var(--ink)}",
    ".switch .lv-short{display:none}",
    "@media (max-width:1240px){.switch .lv-long{display:none}.switch .lv-short{display:inline}}",
    "@media print{.plan,.fil{display:none}}"
  ].join("\n");
  var here = location.pathname.split("/").pop() || "accueil.html"; if (here === "simple.html") here = "index.html";
  var isMin = /^ministere-.+\.html$/.test(here);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function groupOf(f) { if (isMin || f === "gouvernement.html") return "ministeres"; if (f === "accueil.html") return "accueil"; var g = PAGES[f] && PAGES[f][1]; return g === "États des lieux" ? "etats" : g === "Dossiers" ? "dossiers" : "plus"; }
  var curGroup = groupOf(here);
  function loadGouv(cb) {
    if (window.GOUV) return cb(window.GOUV);
    var s = document.createElement("script"); s.src = "gouvernement.js"; s.onload = function () { cb(window.GOUV); }; s.onerror = function () { cb(null); }; document.head.appendChild(s);
  }
  var openPanel = null, openBtn = null;
  function closeAll() { if (openPanel) { openPanel.hidden = true; openBtn.setAttribute("aria-expanded", "false"); openPanel = openBtn = null; } }
  function place(btn, panel) { var b = btn.getBoundingClientRect(), w = panel.offsetWidth; panel.style.top = (b.bottom + 6) + "px"; panel.style.left = Math.max(16, Math.min(b.left, window.innerWidth - w - 16)) + "px"; }
  function addMenu(ul, node, fill) {
    var li = document.createElement("li"); li.className = "nav-menu";
    var id = "nav-panel-" + node.k;
    li.innerHTML = '<button type="button" aria-expanded="false" aria-controls="' + id + '" aria-haspopup="true"' + (curGroup === node.k ? ' class="here"' : "") + ">" + esc(node.label) + ' <span aria-hidden="true">▾</span></button>';
    var panel = document.createElement("div"); panel.id = id; panel.className = "nav-panel" + (node.menu ? " wide" : ""); panel.hidden = true; document.body.appendChild(panel);
    var btn = li.firstChild, filled = false;
    btn.addEventListener("click", function () {
      if (!panel.hidden) { closeAll(); return; }
      closeAll();
      function show() { panel.hidden = false; btn.setAttribute("aria-expanded", "true"); openPanel = panel; openBtn = btn; place(btn, panel); var a = panel.querySelector("a"); if (a) a.focus(); }
      if (!filled) { fill(panel, function () { filled = true; show(); }); } else show();
    });
    panel.addEventListener("keydown", function (e) { if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return; var l = [].slice.call(panel.querySelectorAll("a")), i = l.indexOf(document.activeElement); e.preventDefault(); l[(i + (e.key === "ArrowDown" ? 1 : l.length - 1)) % l.length].focus(); });
    ul.appendChild(li);
  }
  function fillItems(node) {
    return function (panel, done) {
      panel.innerHTML = node.items.map(function (f) { return '<a href="' + f + '"' + (f === here ? ' aria-current="page"' : "") + ">" + esc(PAGES[f][0]) + "</a>"; }).join("");
      done();
    };
  }
  function fillMinisteres(panel, done) {
    loadGouv(function (G) {
      var all = G ? G.ministeres.concat(G.autres_acteurs) : [];
      var cols = FAMILLES.map(function (f) {
        var L = all.filter(function (m) { return m.famille === f[0]; }); if (!L.length) return "";
        var col = { regalien: "var(--c1)", economie: "var(--c2)", territoires: "var(--c3)", societe: "var(--c4)", autres: "var(--c5)" }[f[0]];
        return '<div><h3 style="--f:' + col + '"><i></i>' + esc(f[1]) + "</h3><ul>" + L.map(function (m) { var h = "ministere-" + m.id + ".html"; return '<li><a href="' + h + '"' + (h === here ? ' aria-current="page"' : "") + ">" + esc(m.court) + "</a></li>"; }).join("") + "</ul></div>";
      }).join("");
      panel.innerHTML = '<a class="all" href="gouvernement.html">Tous les ministères et la composition du Gouvernement <span aria-hidden="true">→</span></a><div class="nav-cols">' + cols + "</div>";
      done();
    });
  }
  function buildNav() {
    var ul = document.querySelector("nav.nav ul"); if (!ul) return;
    ul.innerHTML = "";
    TREE.forEach(function (n) {
      if (n.items) return addMenu(ul, n, fillItems(n));
      if (n.menu) return addMenu(ul, n, fillMinisteres);
      var li = document.createElement("li"); li.innerHTML = '<a href="' + n.href + '"' + (curGroup === n.k ? ' class="here" aria-current="page"' : "") + ">" + esc(n.label) + "</a>"; ul.appendChild(li);
    });
    document.addEventListener("click", function (e) { if (openPanel && !openPanel.contains(e.target) && !openBtn.parentNode.contains(e.target)) closeAll(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && openPanel) { var b = openBtn; closeAll(); b.focus(); } });
    window.addEventListener("scroll", closeAll, { passive: true });
    window.addEventListener("resize", closeAll);
  }
  function buildCrumbs() {
    if (here === "accueil.html") return;
    var nav = document.querySelector("nav.nav"); if (!nav) return;
    var name = PAGES[here] ? PAGES[here][0] : ((document.querySelector("h1") || {}).textContent || "").trim();
    var trail = [["Accueil", "accueil.html"]];
    if (isMin) trail.push(["Ministères", "gouvernement.html"]);
    else if (curGroup === "etats") trail.push(["États des lieux", "accueil.html#etats"]);
    else if (curGroup === "dossiers") trail.push(["Dossiers", "accueil.html#dossiers"]);
    if (here !== "gouvernement.html" || true) trail.push([name, null]);
    if (here === "gouvernement.html") { trail.pop(); trail.push(["Ministères", null]); }
    var w = document.createElement("div"); w.className = "wrap";
    w.innerHTML = '<nav class="fil" aria-label="Fil d\'Ariane"><ol>' + trail.map(function (t) { return t[1] ? '<li><a href="' + t[1] + '">' + esc(t[0]) + "</a></li>" : '<li aria-current="page">' + esc(t[0]) + "</li>"; }).join("") + "</ol></nav>";
    nav.parentNode.insertBefore(w, nav.nextSibling);
  }
  function buildPlan() {
    var f = document.querySelector("footer"); if (!f) return;
    var groups = {}; Object.keys(PAGES).forEach(function (k) { (groups[PAGES[k][1]] = groups[PAGES[k][1]] || []).push(k); });
    var nav = document.createElement("nav"); nav.className = "plan wrap"; nav.setAttribute("aria-label", "Plan du site");
    var html = "<h2>Plan du site</h2><div class=\"plan-grid\">" + Object.keys(groups).map(function (g) { return "<div><h3>" + esc(g) + "</h3><ul>" + groups[g].map(function (k) { return '<li><a href="' + k + '"' + (k === here ? ' aria-current="page"' : "") + ">" + esc(PAGES[k][0]) + "</a></li>"; }).join("") + "</ul></div>"; }).join("") + '<div id="plan-min"></div></div><p class="mesure-note">Mesure d\'audience : Cloudflare Web Analytics, sans cookie et sans suivi d\'une personne d\'une page à l\'autre. Désactivée si votre navigateur envoie « Ne pas suivre ».</p>';
    nav.innerHTML = html; f.parentNode.insertBefore(nav, f);
    loadGouv(function (G) { if (!G) return; var all = G.ministeres.concat(G.autres_acteurs); var host = document.getElementById("plan-min"); if (host) host.innerHTML = "<h3>Un ministère, une page</h3><ul>" + all.map(function (m) { var h = "ministere-" + m.id + ".html"; return '<li><a href="' + h + '"' + (h === here ? ' aria-current="page"' : "") + ">" + esc(m.court) + "</a></li>"; }).join("") + "</ul>"; });
  }
  var LONG = "Facile À Lire et à Comprendre (FALC)";
  function fixSwitch() {
    [].forEach.call(document.querySelectorAll(".switch button"), function (b) {
      if (b.textContent.trim() === LONG && !b.querySelector(".lv-long")) { b.setAttribute("aria-label", LONG); b.innerHTML = '<span class="lv-long">' + LONG + '</span><span class="lv-short" aria-hidden="true">FALC</span>'; }
    });
  }
  function fixTables() { [].forEach.call(document.querySelectorAll("thead th:not([scope])"), function (th) { th.setAttribute("scope", "col"); }); }
  function fixAll() { fixTables(); fixSwitch(); }
  function init() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    buildNav(); buildCrumbs(); buildPlan();
    fixAll(); var tm; new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(fixAll, 40); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
