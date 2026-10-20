/* Politik — structure commune du site.
   - Barre d'arborescence toujours visible (seconde ligne du bandeau) : Accueil, Ministères, États des lieux, Dossiers, Plus, sans menu déroulant.
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
    { k: "plus", label: "Aussi", items: ["presidentielle-2027.html", "benchmark-usa.html", "donnees.html"] }
  ];
  var CSS = [
    ".nav.has-tree>.wrap>ul{display:none}",
    ".nav.has-tree>.wrap{padding-block:8px}",
    ".nav.has-tree .switch{margin-left:auto}",
    ".nav-tree{border-top:1px solid var(--line);background:color-mix(in srgb,var(--surface) 55%,transparent)}",
    ".nav-tree .wrap{padding-block:7px;max-width:1400px}",
    ".nav-tree ul{list-style:none;margin:0;padding:0}",
    ".nav-tree .tree{display:flex;align-items:center;flex-wrap:wrap;gap:6px 8px;padding-block:2px}",
    ".nav-tree .tree>li{flex:none;display:flex;align-items:center}",
    ".nav-tree a{text-decoration:none;white-space:nowrap}",
    ".nav-tree .t-solo a{display:inline-flex;align-items:center;gap:7px;min-height:38px;padding:6px 14px;border-radius:999px;font-size:.92rem;font-weight:700;color:var(--ink);border:1.5px solid var(--line);background:var(--surface)}",
    ".nav-tree .t-solo.cur a,.nav-tree .t-solo a.here{background:var(--ink);color:var(--paper);border-color:var(--ink)}",
    ".nav-tree .cnt{font-size:.74rem;font-weight:800;padding:1px 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent-ink)}",
    ".nav-tree .cnt:empty{display:none}",
    ".nav-tree .t-solo.cur .cnt{background:rgba(255,255,255,.22);color:inherit}",
    ".nav-tree .t-grp{display:flex;align-items:center;gap:2px;padding:3px 4px 3px 12px;border:1.5px solid var(--line);border-radius:999px;background:var(--surface)}",
    ".nav-tree .t-grp.cur{border-color:var(--accent)}",
    ".nav-tree .t-lab{font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2);white-space:nowrap;margin-right:4px;display:inline-flex;align-items:center;gap:6px}",
    ".nav-tree .t-lab:before{content:\"\";width:7px;height:7px;border-radius:50%;background:var(--ink-3)}",
    ".nav-tree .t-grp.cur .t-lab{color:var(--accent-ink)}",
    ".nav-tree .t-grp.cur .t-lab:before{background:var(--accent)}",
    ".nav-tree .t-grp ul{display:flex;gap:2px}",
    ".nav-tree .t-grp a{display:inline-flex;align-items:center;min-height:32px;padding:4px 11px;border-radius:999px;font-size:.88rem;font-weight:600;color:var(--ink)}",
    ".nav-tree .t-grp a:hover,.nav-tree .t-solo a:hover{background:var(--accent-soft);color:var(--accent-ink)}",
    ".nav-tree .t-solo a:hover{border-color:var(--accent)}",
    ".nav-tree a:focus-visible{outline:3px solid var(--accent);outline-offset:2px}",
    ".nav-tree .t-grp a.here{background:var(--accent);color:#fff;font-weight:800}",
    "@media (pointer:coarse){.nav-tree .t-solo a{min-height:44px}.nav-tree .t-grp a{min-height:40px}}",
    "@media (max-width:760px){.nav-tree .tree{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:thin;padding-bottom:6px}.nav-tree .tree.ov{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 36px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 36px),transparent)}}",
    "@media (max-width:640px){.nav-tree .t-solo a{padding:6px 11px;font-size:.86rem}.nav-tree .t-grp a{padding:4px 9px;font-size:.84rem}}",
    ".fil{margin:0;padding:10px 0 0}",
    ".fil ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:2px 0;font-size:.82rem;color:var(--ink-3)}",
    ".fil li:not(:last-child):after{content:\"›\";margin:0 8px;color:var(--ink-3)}",
    ".fil a{color:var(--ink-2);text-decoration-color:var(--line)}",
    ".fil [aria-current]{color:var(--ink);font-weight:600}",
    ".plan{margin:28px 0 8px;padding:20px 0 0;border-top:1px solid var(--line)}",
    ".plan h2{font-size:.74rem;text-transform:uppercase;letter-spacing:.09em;color:var(--ink-3);margin:0 0 12px;font-weight:600}",
    ".plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:18px 24px}",
    ".mesure-note{margin:18px auto 0;font-size:.8rem;color:var(--ink-2);max-width:70ch;text-align:center}",
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
  var SHORT = { "index.html": "Fraude", "forces.html": "Police", "cybersecurite.html": "Cyber", "secteurs.html": "France", "medias.html": "Médias", "17-octobre-2026.html": "17 octobre", "presidentielle-2027.html": "Élection", "benchmark-usa.html": "États-Unis", "donnees.html": "Sources" };
  function link(f, label, title) { return '<a href="' + f + '"' + (title ? ' title="' + esc(title) + '"' : "") + (f === here || (f === "gouvernement.html" && isMin) ? ' class="here" aria-current="page"' : "") + ">" + label + "</a>"; }
  function buildNav() {
    var nav = document.querySelector("nav.nav"); if (!nav) return;
    var row = document.createElement("div"); row.className = "nav-tree";
    var groups = TREE.filter(function (n) { return n.items; }).map(function (n) {
      return '<li class="t-grp' + (curGroup === n.k ? " cur" : "") + '" role="group" aria-labelledby="tl-' + n.k + '"><span class="t-lab" id="tl-' + n.k + '">' + esc(n.label) + '</span><ul>' + n.items.map(function (f) { return "<li>" + link(f, esc(SHORT[f] || PAGES[f][0]), PAGES[f][0]) + "</li>"; }).join("") + "</ul></li>";
    });
    row.innerHTML = '<div class="wrap"><ul class="tree">'
      + '<li class="t-solo' + (curGroup === "accueil" ? " cur" : "") + '">' + link("accueil.html", "Accueil") + "</li>"
      + '<li class="t-solo' + (curGroup === "ministeres" ? " cur" : "") + '">' + link("gouvernement.html", 'Ministères <span class="cnt" id="nav-cnt"></span>', "Les ministères et la composition du Gouvernement") + "</li>"
      + groups.join("") + "</ul></div>";
    nav.appendChild(row); nav.classList.add("has-tree");
    var tree = row.querySelector(".tree");
    function ov() { var o = tree.scrollWidth > tree.clientWidth + 2; tree.classList.toggle("ov", o); if (o) tree.setAttribute("tabindex", "0"); else tree.removeAttribute("tabindex"); }
    ov(); window.addEventListener("resize", ov); if (document.fonts && document.fonts.ready) document.fonts.ready.then(ov);
    row.addEventListener("keydown", function (e) {
      if (["ArrowRight", "ArrowLeft", "Home", "End"].indexOf(e.key) < 0) return;
      var items = [].slice.call(row.querySelectorAll("a")), i = items.indexOf(document.activeElement); if (i < 0) return; e.preventDefault();
      var n = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : Math.max(0, Math.min(items.length - 1, i + (e.key === "ArrowRight" ? 1 : -1))); items[n].focus();
    });
    loadGouv(function (G) { var c = document.getElementById("nav-cnt"); if (G && c) c.textContent = G.ministeres.length + G.autres_acteurs.length; });
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
    var f = document.querySelector("body > footer, footer.wrap"); if (!f) return;
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
