/* Politik — en-tête commun : ministères concernés (illustration simple) et actualité en bref.
   Lit window.GOUV (dashboard/gouvernement.js, généré depuis data/gouvernement.json).
   - Une tuile par ministère concerné par la page : pictogramme en traits dans un carré arrondi, couleur de sa
     famille (régalien, économie, territoires, société, autres), lien vers la fiche du ministère.
   - « Actualité en bref » : au plus trois actualités vérifiées sur un site officiel, les plus récentes d'abord,
     filtrées sur la page ou sur ses ministères. Chaque ligne porte sa date, sa source et son lien.
   Les pictogrammes sont dessinés pour ce site (aucun logo officiel n'est utilisé comme illustration). */
(function () {
  var G = window.GOUV; if (!G) return;
  var FAM = { regalien: "var(--c1)", economie: "var(--c2)", territoires: "var(--c3)", societe: "var(--c4)", autres: "var(--c5)" };
  var CSS = [
    ".eg{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:20px 32px;padding:16px 18px;margin:0 0 22px;border:1px solid var(--line);border-radius:14px;background:var(--surface)}",
    ".eg-label{margin:0 0 10px;font-size:.74rem;text-transform:uppercase;letter-spacing:.09em;font-weight:600;color:var(--ink-3)}",
    ".eg-list{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:10px}",
    ".eg-tile{display:flex;flex-direction:column;align-items:center;gap:6px;width:84px;text-decoration:none;color:var(--ink);text-align:center}",
    ".eg-ico{display:flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:18px;background:color-mix(in srgb,var(--f) 13%,var(--surface));color:var(--f);border:1px solid color-mix(in srgb,var(--f) 28%,var(--line))}",
    ".eg-ico svg{width:34px;height:34px}",
    ".eg-nom{font-size:.76rem;line-height:1.2;font-weight:600;color:var(--ink-2)}",
    ".eg-tile:hover .eg-ico,.eg-tile:focus-visible .eg-ico{border-color:var(--f);outline:none}",
    ".eg-tile:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:10px}",
    ".eg-plus .eg-ico{background:var(--surface-2);color:var(--ink-2);--f:var(--ink-3);font-weight:700;font-size:.95rem}",
    ".eg-news{list-style:none;margin:0;padding:0;display:grid;gap:10px}",
    ".eg-news li{display:grid;grid-template-columns:56px 1fr;gap:10px;font-size:.9rem;line-height:1.35}",
    ".eg-news time{font-family:var(--font-display);font-weight:600;color:var(--accent-ink);font-size:.82rem;padding-top:1px}",
    ".eg-news a{color:var(--ink);text-decoration-color:var(--line);text-underline-offset:2px;font-weight:500}",
    ".eg-news a:hover{text-decoration-color:var(--accent)}",
    ".eg-src{display:block;font-size:.76rem;color:var(--ink-3);margin-top:2px}",
    ".eg-all{display:inline-block;margin-top:10px;font-size:.84rem;font-weight:600}",
    ".eg-empty{margin:0;font-size:.9rem;color:var(--ink-2)}",
    "body.falc .eg-news li,body.falc .eg-nom,body.falc .eg-empty{font-size:1rem}",
    "@media (max-width:760px){.eg{grid-template-columns:1fr}.eg-tile{width:76px}}",
    "@media print{.eg{display:none}}"
  ].join("\n");
  var all = G.ministeres.concat(G.autres_acteurs), byId = {}; all.forEach(function (m) { byId[m.id] = m; });
  var key = (location.pathname.split("/").pop() || "index.html");
  var ids = (G.pages[key] || []).slice();
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function dateCourte(d) { var m = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]; var p = d.split("-"); return +p[2] + " " + m[+p[1] - 1]; }
  function news() {
    return G.actualites.filter(function (a) { return (a.pages || []).indexOf(key) >= 0 || a.ministeres.some(function (id) { return ids.indexOf(id) >= 0; }); })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
  }
  function build() {
    var falc = document.body.classList.contains("falc");
    var max = 6, shown = ids.slice(0, max), extra = ids.length - shown.length;
    var tiles = shown.map(function (id) { var m = byId[id]; if (!m) return ""; return '<li><a class="eg-tile" href="gouvernement.html#' + esc(id) + '" style="--f:' + FAM[m.famille] + '" title="' + esc(m.nom) + '"><span class="eg-ico"><svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + m.icone + '</svg></span><span class="eg-nom">' + esc(m.court) + "</span></a></li>"; }).join("");
    if (extra > 0) tiles += '<li><a class="eg-tile eg-plus" href="gouvernement.html"><span class="eg-ico">+' + extra + '</span><span class="eg-nom">' + (falc ? "Voir tous" : "Tous les ministères") + "</span></a></li>";
    var n = news();
    var items = n.length ? '<ul class="eg-news">' + n.map(function (a) { return "<li><time datetime=\"" + a.date + '">' + dateCourte(a.date) + '</time><span><a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.titre) + '</a><span class="eg-src">' + esc(a.source) + "</span></span></li>"; }).join("") + "</ul>" : '<p class="eg-empty">' + (falc ? "Pas encore de nouvelle vérifiée." : "Aucune actualité vérifiée sur un site officiel pour le moment.") + "</p>";
    return '<div class="eg-min"><p class="eg-label">' + (falc ? "Les ministères" : "Ministères concernés") + '</p><ul class="eg-list">' + tiles + '</ul></div><div class="eg-actu"><p class="eg-label">' + (falc ? "Les nouvelles" : "Actualité en bref") + "</p>" + items + '<a class="eg-all" href="gouvernement.html#actualites">' + (falc ? "Toutes les nouvelles" : "Toute l'actualité") + "</a></div>";
  }
  function init() {
    var host = document.querySelector("header.hero") || document.querySelector("main"); if (!host || !ids.length) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var box = document.createElement("section"); box.className = "eg"; box.setAttribute("aria-label", "Ministères concernés et actualité en bref");
    host.insertBefore(box, host.firstChild); box.innerHTML = build();
    new MutationObserver(function () { box.innerHTML = build(); }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
