/* Politik — structure commune du site.
   - Barre d'arborescence toujours visible (seconde ligne du bandeau) : Accueil, Ministères, États des lieux, Dossiers, Plus, sans menu déroulant.
   - Fil d'Ariane sur toutes les pages sauf l'accueil.
   - Plan du site en pied de page, avec la liste des ministères, et note sur la mesure d'audience.
   - Libellé long du niveau FALC sur grand écran, sigle sur petit écran ; en-têtes de tableaux déclarés (scope).
   Sans JavaScript, le menu statique de chaque page reste affiché. */
(function () {
  var PAGES = {
    "index.html": ["Accueil", "Se repérer"], "donnees.html": ["Sources et données", "Se repérer"], "benchmark-usa.html": ["Benchmark États-Unis", "Se repérer"],
    "gouvernement.html": ["Les 21 ministères", "Le Gouvernement"], "presidentielle-2027.html": ["Présidentielle 2027", "Le Gouvernement"],
    "fraude-sociale.html": ["Fraude sociale", "États des lieux"], "forces.html": ["Police et gendarmerie", "États des lieux"],
    "cybersecurite.html": ["Cybersécurité de l'État", "États des lieux"], "secteurs.html": ["Comment va la France", "États des lieux"],
    "medias.html": ["Qui possède les médias", "Dossiers"], "17-octobre-2026.html": ["Le 17 octobre 2026", "Dossiers"]
  };
  var FAMILLES = [["regalien", "Pouvoirs régaliens"], ["economie", "Économie et travail"], ["territoires", "Territoires et transitions"], ["societe", "Société"], ["autres", "Autres acteurs"]];
  var TREE = [
    { k: "accueil", label: "Accueil", href: "index.html" },
    { k: "ministeres", label: "Ministères", menu: "ministeres", href: "gouvernement.html" },
    { k: "etats", label: "États des lieux", items: ["fraude-sociale.html", "forces.html", "cybersecurite.html", "secteurs.html"] },
    { k: "dossiers", label: "Dossiers", items: ["medias.html", "17-octobre-2026.html"] },
    { k: "plus", label: "Aussi", items: ["presidentielle-2027.html", "benchmark-usa.html", "donnees.html"] }
  ];
  var CSS = [
    ".nav.has-mega{background:linear-gradient(var(--paper) 72%,transparent);border-bottom:0;backdrop-filter:none;padding:10px 0 12px}",
    ".nav.has-mega>.wrap{max-width:1200px;padding:8px 10px 8px 16px;border-radius:22px;background:var(--surface);border:1px solid var(--line);box-shadow:0 6px 24px -14px rgba(20,26,43,.28)}",
    ".nav.has-mega>.wrap>ul:not(.mega-list){display:none}",
    ".mega-list{display:flex;align-items:center;gap:2px;list-style:none;margin:0 0 0 auto;padding:0}",
    ".mega-list>li{display:flex}",
    ".nav.has-mega .mega-btn,.nav.has-mega .mega-link{font:inherit;font-size:.95rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;min-height:42px;padding:8px 14px;border:0;border-radius:999px;background:transparent;color:var(--ink);text-decoration:none;cursor:pointer;white-space:nowrap}",
    ".mega-btn svg{width:11px;height:11px;transition:none}",
    ".nav.has-mega .mega-btn:hover,.nav.has-mega .mega-link:hover,.nav.has-mega .mega-btn[aria-expanded=true]{background:var(--surface-2)}",
    ".mega-btn[aria-expanded=true] svg{transform:rotate(180deg)}",
    ".nav.has-mega .mega-btn.here,.nav.has-mega .mega-link.here{background:var(--accent-soft);color:var(--accent-ink)}",
    ".mega-btn:focus-visible,.mega-link:focus-visible{outline:3px solid var(--accent);outline-offset:1px}",
    ".nav.has-mega .switch{margin-left:12px}",
    ".mega-panel{position:fixed;z-index:30;left:50%;transform:translateX(-50%);width:min(1200px,calc(100vw - 32px));max-height:calc(100vh - 110px);overflow:auto;padding:14px;border-radius:22px;background:var(--surface);border:1px solid var(--line);box-shadow:0 24px 60px -20px rgba(20,26,43,.35)}",
    ".mega-panel[hidden]{display:none}",
    ".mega-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px}",
    ".mega-card{position:relative;display:flex;flex-direction:column;justify-content:flex-end;min-height:300px;border-radius:18px;overflow:hidden;color:#fff;text-decoration:none;background:var(--bg,#1f2a44);isolation:isolate}",
    ".mega-card .cr{position:absolute;top:10px;right:12px;z-index:1;max-width:calc(100% - 24px);font-size:.66rem;letter-spacing:.02em;color:#fff;padding:2px 8px;border-radius:999px;background:rgba(10,16,38,.62);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".mega-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}",
    ".mega-card:after{content:\"\";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(10,16,38,.22) 0%,rgba(10,16,38,.34) 40%,rgba(10,16,38,.9) 100%)}",
    ".mega-card .tx{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;padding:16px 16px 16px 18px}",
    ".mega-card b{display:block;font-family:var(--font-display);font-size:1.15rem;line-height:1.2;text-shadow:0 1px 8px rgba(0,0,0,.5)}",
    ".mega-card small{display:block;margin-top:3px;font-size:.84rem;line-height:1.3;color:#fff;opacity:1;text-shadow:0 1px 6px rgba(0,0,0,.55)}",
    ".mega-card .go{flex:none;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#fff;color:var(--ink);font-weight:800}",
    ".mega-card:hover,.mega-card:focus-visible{box-shadow:0 0 0 3px var(--accent)}",
    ".mega-card:focus-visible{outline:3px solid var(--accent);outline-offset:2px}",
    ".mega-card[aria-current]{box-shadow:0 0 0 3px var(--accent)}",
    ".mega-card.clair:after{background:linear-gradient(180deg,rgba(10,16,38,.2) 0%,rgba(10,16,38,.34) 40%,rgba(10,16,38,.88) 100%)}",
    ".mega-card .contain{object-fit:contain;padding:22px 22px 90px;background:var(--bgc,#eef1fb)}",
    ".mega-min{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:16px}",
    ".mega-fam{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 18px;align-content:start}@media (max-width:1100px){.mega-fam{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:640px){.mega-fam{grid-template-columns:minmax(0,1fr)}}",
    ".mega-fam h3{margin:6px 10px 2px;font-size:.7rem;text-transform:uppercase;letter-spacing:.09em;color:var(--ink-2);font-weight:800;display:flex;align-items:center;gap:6px}",
    ".mega-fam h3 i{width:8px;height:8px;border-radius:50%;background:var(--f)}",
    ".mega-fam ul{list-style:none;margin:0;padding:0}",
    ".mega-fam a{display:block;padding:7px 10px;border-radius:10px;font-size:.92rem;color:var(--ink);text-decoration:none}",
    ".mega-fam a:hover,.mega-fam a:focus-visible{background:var(--accent-soft);color:var(--accent-ink);outline:none}",
    ".mega-fam a[aria-current]{font-weight:800;background:var(--accent-soft)}",
    "@media (max-width:980px){.nav.has-mega>.wrap{flex-wrap:wrap;gap:6px}.mega-list{order:3;width:100%;margin:0;overflow-x:auto;scrollbar-width:thin;padding-bottom:4px}.nav.has-mega .switch{margin-left:auto}.mega-min{grid-template-columns:1fr}.mega-card{min-height:200px}}",
    "@media (max-width:640px){.mega-btn,.mega-link{padding:8px 11px;font-size:.88rem}.mega-panel{width:calc(100vw - 20px)}}",
    ".m-burger{display:none;flex:none;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid var(--line);border-radius:50%;background:var(--surface);color:var(--ink);cursor:pointer;padding:0}",
    ".m-burger svg{width:20px;height:20px}",
    ".m-burger:focus-visible,.m-sheet a:focus-visible,.m-sheet summary:focus-visible{outline:3px solid var(--accent);outline-offset:2px}",
    ".m-burger .m-x{display:none}.m-burger[aria-expanded=true] .m-b{display:none}.m-burger[aria-expanded=true] .m-x{display:block}",
    ".m-sheet{position:fixed;left:0;right:0;bottom:0;z-index:40;overflow:auto;overscroll-behavior:contain;background:var(--paper);padding:8px max(16px,env(safe-area-inset-left,0px)) calc(28px + env(safe-area-inset-bottom,0px))}",
    ".m-sheet[hidden]{display:none}",
    ".m-sec{border-bottom:1px solid var(--line-2)}",
    ".m-sec>summary,.m-top{display:flex;align-items:center;justify-content:space-between;min-height:56px;padding:0 4px;font-family:var(--font-display);font-size:1.25rem;font-weight:400;letter-spacing:-.02em;color:var(--ink);text-decoration:none;cursor:pointer;list-style:none;border-bottom:1px solid var(--line-2)}",
    ".m-sec>summary{border-bottom:0}",
    ".m-sec>summary::-webkit-details-marker{display:none}",
    ".m-sec>summary:after{content:\"+\";font-size:1.5rem;color:var(--ink-3);font-weight:300}",
    ".m-sec[open]>summary:after{content:\"–\"}",
    ".m-top[aria-current],.m-sec.here>summary{color:var(--accent-ink)}",
    ".m-body{display:grid;gap:4px;padding:0 0 14px}",
    ".m-row{display:flex;align-items:center;gap:14px;min-height:64px;padding:6px 8px 6px 4px;border-radius:14px;color:var(--ink);text-decoration:none}",
    ".m-row img{flex:none;width:56px;height:56px;border-radius:12px;object-fit:cover}",
    ".m-row b{display:block;font-size:1rem;font-weight:600;line-height:1.25}",
    ".m-row small{display:block;margin-top:2px;font-size:.84rem;line-height:1.3;color:var(--ink-2)}",
    ".m-row[aria-current]{background:var(--accent-soft)}",
    ".m-fam{margin:10px 4px 2px;font-family:var(--font-mono);font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-2);display:flex;align-items:center;gap:8px}",
    ".m-fam i{width:8px;height:8px;border-radius:50%;background:var(--f)}",
    ".m-min{display:flex;align-items:center;min-height:48px;padding:0 10px 0 14px;border-radius:12px;color:var(--ink);text-decoration:none;font-size:1rem}",
    ".m-min[aria-current]{background:var(--accent-soft);font-weight:600}",
    "html.m-lock{overflow:hidden}",
    "@media (max-width:820px){.nav.has-mega .mega-list{display:none}.m-burger{display:inline-flex}.nav.has-mega>.wrap{flex-wrap:nowrap;gap:8px}.nav.has-mega .switch{margin-left:auto}.nav .switch button{min-height:36px}.nav{transition:transform .22s ease}html.nav-away .nav{transform:translateY(-130%)}html.nav-away{--nav-h:0px!important}body{font-size:16px}input,select,textarea{font-size:max(16px,1em)}.eyebrow,.subbar-label,.porte-n,.eg-label,.type,.sref,.kind,.st,.pill,.y,.pr,.old,.pn,.chip-niv,.badge,.ticker span,.m-fam{font-size:max(.78rem,12.5px)}main>section>.sec-head:before{font-size:max(.78rem,12.5px)}.lvl[data-lvl]{position:relative}.lvl[data-lvl]:after{content:\"\";position:absolute;inset:-11px}.fil a{display:inline-block;padding:10px 0}.subbar a,.subbar button{min-height:44px;padding-inline:16px}}",
    "@media (max-width:820px){html .subbar a,html .subbar button{min-height:44px}.sref,.term{position:relative}.sref:after,.term:after{content:\"\";position:absolute;inset:-9px -3px}main button:not(.term):not(.lvl){min-height:44px}main summary{padding-block:11px}.brand{display:inline-flex;align-items:center;min-height:44px}.eg-all{display:inline-flex;align-items:center;min-height:44px}.plan .plan-grid a{padding:13px 0}.nav .switch button{min-height:40px}}",
    "@media (prefers-reduced-motion:reduce){.nav{transition:none}}",
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
  var here = location.pathname.split("/").pop() || "index.html"; if (here === "simple.html") here = "fraude-sociale.html";
  var isMin = /^ministere-.+\.html$/.test(here);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function groupOf(f) { if (isMin || f === "gouvernement.html") return "ministeres"; if (f === "index.html") return "accueil"; var g = PAGES[f] && PAGES[f][1]; return g === "États des lieux" ? "etats" : g === "Dossiers" ? "dossiers" : "plus"; }
  var curGroup = groupOf(here);
  function loadGouv(cb) {
    if (window.GOUV) return cb(window.GOUV);
    var s = document.createElement("script"); s.src = "gouvernement.js"; s.onload = function () { cb(window.GOUV); }; s.onerror = function () { cb(null); }; document.head.appendChild(s);
  }
  var SHORT = { "fraude-sociale.html": "Fraude", "forces.html": "Police", "cybersecurite.html": "Cyber", "secteurs.html": "France", "medias.html": "Médias", "17-octobre-2026.html": "17 octobre", "presidentielle-2027.html": "Élection", "benchmark-usa.html": "États-Unis", "donnees.html": "Sources" };
  function link(f, label, title) { return '<a href="' + f + '"' + (title ? ' title="' + esc(title) + '"' : "") + (f === here || (f === "gouvernement.html" && isMin) ? ' class="here" aria-current="page"' : "") + ">" + label + "</a>"; }
  var ILLU = { "fraude-sociale": "photos/fraude.jpg", forces: "photos/police.jpg", cybersecurite: "photos/cyber.jpg", secteurs: "photos/france.jpg", medias: "photos/medias.jpg", "17-octobre-2026": "photos/oct17.jpg", "presidentielle-2027": "photos/election.jpg", "benchmark-usa": "photos/usa.jpg", donnees: "photos/donnees.jpg", gouvernement: "photos/ministeres.jpg" };
  var DESC = { "fraude-sociale.html": "Ce que l'État estime, détecte et récupère", "forces.html": "Violences, soutien, diplôme et salaire", "cybersecurite.html": "Plan d'action, incidents et constats", "secteurs.html": "Quinze familles de sujets, chiffre par chiffre", "medias.html": "Qui possède quoi, et quelles aides publiques", "17-octobre-2026.html": "Ce que disent les sources officielles", "presidentielle-2027.html": "Candidats et repères avant le scrutin", "benchmark-usa.html": "Ce que font les Américains de leurs données", "donnees.html": "D'où vient chaque chiffre du site" };
  var CHEV = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var openPanel = null, openBtn = null, hoverT = null;
  function closeAll() { clearTimeout(hoverT); if (openPanel) { openPanel.hidden = true; openBtn.setAttribute("aria-expanded", "false"); openPanel = openBtn = null; } }
  var CRED = {"fraude-sociale": "Fabio Gargano", "forces": "flightlog", "cybersecurite": "ProjectManhattan", "secteurs": "Elliott Brown", "medias": "Benoît Prieur", "17-octobre-2026": "flightlog", "presidentielle-2027": "Jamain", "benchmark-usa": "Alvesgaspar", "donnees": "Simon Hattinga Verschure", "gouvernement": "ScareCriterion12"};
  function img(f) { return '<img src="img/' + f + '" alt="" loading="lazy" width="640" height="480">'; }
  function card(f) {
    var key = f.replace(/\.html$/, "");
    return '<a class="mega-card' + (/\.png$/.test(ILLU[key] || "") ? " clair" : "") + '" href="' + f + '"' + (f === here ? ' aria-current="page"' : "") + '>' + img(ILLU[key]) + (CRED[key] ? '<span class="cr">Photo : ' + esc(CRED[key]) + '</span>' : '') + '<span class="tx"><span><b>' + esc(PAGES[f][0]) + "</b><small>" + esc(DESC[f] || "") + '</small></span><span class="go" aria-hidden="true">→</span></span></a>';
  }
  function fillCards(node) { return function (panel, done) { panel.innerHTML = '<div class="mega-cards">' + node.items.map(card).join("") + "</div>"; done(); }; }
  function fillMinisteres(panel, done) {
    loadGouv(function (G) {
      var all = G ? G.ministeres.concat(G.autres_acteurs) : [];
      var COL = { regalien: "var(--c1)", economie: "var(--c2)", territoires: "var(--c3)", societe: "var(--c4)", autres: "var(--c5)" };
      var fam = FAMILLES.map(function (f) {
        var L = all.filter(function (m) { return m.famille === f[0]; }); if (!L.length) return "";
        return '<div><h3 style="--f:' + COL[f[0]] + '"><i></i>' + esc(f[1]) + "</h3><ul>" + L.map(function (m) { var h = "ministere-" + m.id + ".html"; return '<li><a href="' + h + '"' + (h === here ? ' aria-current="page"' : "") + ">" + esc(m.court) + "</a></li>"; }).join("") + "</ul></div>";
      }).join("");
      panel.innerHTML = '<div class="mega-min"><a class="mega-card clair" href="gouvernement.html"' + (here === "gouvernement.html" ? ' aria-current="page"' : "") + ' style="--bgc:#e8edfb">' + img(ILLU.gouvernement) + '<span class="tx"><span><b>Tous les ministères</b><small>La composition du Gouvernement et une page par ministère</small></span><span class="go" aria-hidden="true">→</span></span></a><div class="mega-fam">' + fam + "</div></div>";
      done();
    });
  }
  function addMenu(ul, node, fill) {
    var li = document.createElement("li"), id = "mega-" + node.k;
    li.innerHTML = '<button type="button" class="mega-btn' + (curGroup === node.k ? " here" : "") + '" aria-expanded="false" aria-controls="' + id + '" aria-haspopup="true">' + esc(node.label) + CHEV + "</button>";
    var panel = document.createElement("div"); panel.id = id; panel.className = "mega-panel"; panel.hidden = true; panel.setAttribute("role", "region"); panel.setAttribute("aria-label", node.label); document.body.appendChild(panel);
    var btn = li.firstChild, filled = false;
    function show(focus) {
      if (openPanel === panel) return; closeAll();
      function go() { panel.hidden = false; btn.setAttribute("aria-expanded", "true"); openPanel = panel; openBtn = btn; panel.style.top = (document.querySelector("nav.nav").getBoundingClientRect().bottom - 4) + "px"; if (focus) { var a = panel.querySelector("a"); if (a) a.focus(); } }
      if (!filled) fill(panel, function () { filled = true; go(); }); else go();
    }
    btn.addEventListener("click", function () { if (openPanel === panel) closeAll(); else show(true); });
    li.addEventListener("mouseenter", function () { if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) { clearTimeout(hoverT); hoverT = setTimeout(function () { show(false); }, 90); } });
    li.addEventListener("mouseleave", function () { clearTimeout(hoverT); hoverT = setTimeout(function () { if (!panel.matches(":hover")) closeAll(); }, 220); });
    panel.addEventListener("mouseenter", function () { clearTimeout(hoverT); });
    panel.addEventListener("mouseleave", function () { clearTimeout(hoverT); hoverT = setTimeout(closeAll, 220); });
    btn.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); show(true); } });
    panel.addEventListener("keydown", function (e) { if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return; var l = [].slice.call(panel.querySelectorAll("a")), i = l.indexOf(document.activeElement); if (i < 0) return; e.preventDefault(); var d = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : l.length - 1; l[(i + d) % l.length].focus(); });
    ul.appendChild(li); node.btn = btn;
  }
  function buildNav() {
    var nav = document.querySelector("nav.nav"); if (!nav) return;
    var wrap = nav.querySelector(".wrap"), sw = nav.querySelector(".switch"); if (!wrap) return;
    var ul = document.createElement("ul"); ul.className = "mega-list"; ul.setAttribute("aria-label", "Rubriques du site");
    var li0 = document.createElement("li"); li0.innerHTML = '<a class="mega-link' + (curGroup === "accueil" ? " here" : "") + '" href="index.html"' + (curGroup === "accueil" ? ' aria-current="page"' : "") + ">Accueil</a>"; ul.appendChild(li0);
    TREE.forEach(function (n) {
      if (n.k === "accueil") return;
      if (n.menu) addMenu(ul, n, fillMinisteres); else addMenu(ul, n, fillCards(n));
    });
    wrap.insertBefore(ul, sw || null); nav.classList.add("has-mega");
    buildMobile(nav, wrap, sw);
    document.addEventListener("click", function (e) { if (openPanel && !openPanel.contains(e.target) && !openBtn.parentNode.contains(e.target)) closeAll(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && openPanel) { var b = openBtn; closeAll(); b.focus(); } });
    window.addEventListener("scroll", function () { if (openPanel) closeAll(); }, { passive: true });
    window.addEventListener("resize", closeAll);
  }
  function buildMobile(nav, wrap, sw) {
    var mq = window.matchMedia("(max-width:820px)");
    var bt = document.createElement("button"); bt.type = "button"; bt.className = "m-burger"; bt.setAttribute("aria-expanded", "false"); bt.setAttribute("aria-controls", "m-sheet"); bt.setAttribute("aria-label", "Menu");
    bt.innerHTML = '<svg class="m-b" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 8h16M4 16h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><svg class="m-x" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    wrap.appendChild(bt);
    var sheet = document.createElement("div"); sheet.id = "m-sheet"; sheet.className = "m-sheet"; sheet.hidden = true; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("aria-label", "Menu du site");
    document.body.appendChild(sheet);
    var built = false, R = document.documentElement;
    function row(f) { var k = f.replace(/\.html$/, ""); return '<a class="m-row" href="' + f + '"' + (f === here ? ' aria-current="page"' : "") + '><img src="img/' + ILLU[k] + '" alt="" loading="lazy" width="56" height="56"><span><b>' + esc(PAGES[f][0]) + "</b><small>" + esc(DESC[f] || "") + "</small></span></a>"; }
    function build(cb) {
      if (built) return cb(); built = true;
      loadGouv(function (G) {
        var all = G ? G.ministeres.concat(G.autres_acteurs) : [], COL = { regalien: "var(--c1)", economie: "var(--c2)", territoires: "var(--c3)", societe: "var(--c4)", autres: "var(--c5)" };
        var html = '<a class="m-top" href="index.html"' + (here === "index.html" ? ' aria-current="page"' : "") + ">Accueil</a>";
        TREE.forEach(function (n) {
          if (n.k === "accueil") return;
          var body;
          if (n.menu) {
            body = '<a class="m-row" href="gouvernement.html"' + (here === "gouvernement.html" ? ' aria-current="page"' : "") + '><img src="img/' + ILLU.gouvernement + '" alt="" loading="lazy" width="56" height="56"><span><b>Tous les ministères</b><small>La composition du Gouvernement</small></span></a>' +
              FAMILLES.map(function (f) { var L = all.filter(function (m) { return m.famille === f[0]; }); if (!L.length) return ""; return '<p class="m-fam" style="--f:' + COL[f[0]] + '"><i></i>' + esc(f[1]) + "</p>" + L.map(function (m) { var h = "ministere-" + m.id + ".html"; return '<a class="m-min" href="' + h + '"' + (h === here ? ' aria-current="page"' : "") + ">" + esc(m.court) + "</a>"; }).join(""); }).join("");
          } else body = n.items.map(row).join("");
          html += '<details class="m-sec' + (curGroup === n.k ? " here" : "") + '"' + (curGroup === n.k ? " open" : "") + "><summary>" + esc(n.label) + '</summary><div class="m-body">' + body + "</div></details>";
        });
        sheet.innerHTML = html; cb();
      });
    }
    function focusables() { return [bt].concat([].slice.call(sheet.querySelectorAll("a[href],summary"))); }
    function openM() { build(function () { R.classList.remove("nav-away"); sheet.style.top = (nav.getBoundingClientRect().bottom + 6) + "px"; sheet.hidden = false; bt.setAttribute("aria-expanded", "true"); bt.setAttribute("aria-label", "Fermer le menu"); R.classList.add("m-lock"); var f = sheet.querySelector("summary,a"); if (f) f.focus(); }); }
    function closeM(back) { if (sheet.hidden) return; sheet.hidden = true; bt.setAttribute("aria-expanded", "false"); bt.setAttribute("aria-label", "Menu"); R.classList.remove("m-lock"); if (back) bt.focus(); }
    bt.addEventListener("click", function () { if (sheet.hidden) openM(); else closeM(true); });
    sheet.addEventListener("click", function (e) { if (e.target.closest("a[href]")) closeM(false); });
    document.addEventListener("keydown", function (e) {
      if (sheet.hidden) return;
      if (e.key === "Escape") { closeM(true); return; }
      if (e.key !== "Tab") return;
      var l = focusables(), i = l.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); l[l.length - 1].focus(); } else if (!e.shiftKey && i === l.length - 1) { e.preventDefault(); l[0].focus(); }
    });
    var last = window.scrollY, tk = false;
    window.addEventListener("scroll", function () {
      if (tk) return; tk = true;
      requestAnimationFrame(function () {
        tk = false; var y = window.scrollY, d = y - last;
        if (mq.matches && sheet.hidden) { if (d > 10 && y > 140 && !nav.querySelector(":focus-visible")) R.classList.add("nav-away"); else if (d < -6 || y < 60) R.classList.remove("nav-away"); }
        if (Math.abs(d) > 6) last = y;
      });
    }, { passive: true });
    nav.addEventListener("focusin", function () { R.classList.remove("nav-away"); });
    var onMq = function () { if (!mq.matches) { closeM(false); R.classList.remove("nav-away"); } };
    if (mq.addEventListener) mq.addEventListener("change", onMq); else mq.addListener(onMq);
  }
  function buildCrumbs() {
    if (here === "index.html") return;
    var nav = document.querySelector("nav.nav"); if (!nav) return;
    var name = PAGES[here] ? PAGES[here][0] : ((document.querySelector("h1") || {}).textContent || "").trim();
    var trail = [["Accueil", "index.html"]];
    if (isMin) trail.push(["Ministères", "gouvernement.html"]);
    else if (curGroup === "etats") trail.push(["États des lieux", "index.html#etats"]);
    else if (curGroup === "dossiers") trail.push(["Dossiers", "index.html#dossiers"]);
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
  function logo() { [].forEach.call(document.querySelectorAll("nav.nav .brand"), function (b) { b.setAttribute("href", "index.html"); b.setAttribute("aria-label", "Politik, retour à l'accueil"); b.setAttribute("title", "Retour à l'accueil"); }); }
  function init() {
    var st = document.createElement("style");
    logo(); st.textContent = CSS; document.head.appendChild(st);
    buildNav(); buildCrumbs(); buildPlan();
    fixAll(); var tm; new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(fixAll, 40); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
