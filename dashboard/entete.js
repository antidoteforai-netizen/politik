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
    ".eg{position:relative;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:22px 36px;padding:24px 24px 22px;margin:0 0 26px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(135deg,var(--surface) 0%,color-mix(in srgb,var(--accent-soft) 70%,var(--surface)) 100%);overflow:hidden}",
    ".eg-ribbon{position:absolute;inset:0 0 auto 0;height:5px;display:flex}",
    ".eg-ribbon i{flex:1;background:var(--f)}",
    ".eg-titre{grid-column:1/-1;margin:2px 0 2px;font-family:var(--font-display);font-size:clamp(1.15rem,2.3vw,1.6rem);line-height:1.28;font-weight:700;color:var(--ink);max-width:62ch;text-wrap:balance}",
    ".eg-titre:before{content:\"\\201C\";display:block;font-size:2.4em;line-height:.6;color:var(--accent);margin-bottom:6px}",
    ".eg-label{display:flex;align-items:center;gap:8px;margin:0 0 14px;font-size:.74rem;text-transform:uppercase;letter-spacing:.09em;font-weight:700;color:var(--ink-2)}",
    ".eg-label:before{content:\"\";width:8px;height:8px;border-radius:50%;background:var(--accent)}",
    ".eg-list{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:14px 12px}",
    ".eg-tile{display:flex;flex-direction:column;align-items:center;gap:8px;width:92px;text-decoration:none;color:var(--ink);text-align:center}",
    ".eg-ico{position:relative;display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:22px;background:linear-gradient(150deg,color-mix(in srgb,var(--f) 24%,var(--surface)) 0%,color-mix(in srgb,var(--f) 9%,var(--surface)) 100%);color:var(--f);border:1.5px solid color-mix(in srgb,var(--f) 38%,var(--line));box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 6px 14px -8px color-mix(in srgb,var(--f) 55%,transparent)}",
    ".eg-ico svg{width:42px;height:42px;stroke-width:2.2}",
    ".eg-nom{font-size:.78rem;line-height:1.2;font-weight:600;color:var(--ink)}",
    ".eg-tile:hover .eg-ico,.eg-tile:focus-visible .eg-ico{border-color:var(--f)}",
    ".eg-tile:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:12px}",
    ".eg-plus .eg-ico{background:var(--surface-2);color:var(--ink-2);--f:var(--ink-3);font-weight:700;font-size:1.05rem;box-shadow:none}",
    ".eg-news{list-style:none;margin:0;padding:0;display:grid;gap:10px}",
    ".eg-news li{display:grid;grid-template-columns:54px 1fr;gap:12px;align-items:center;padding:10px 12px;border:1px solid var(--line);border-radius:14px;background:var(--surface);font-size:.9rem;line-height:1.35}",
    ".eg-date{display:flex;flex-direction:column;align-items:center;justify-content:center;width:54px;height:54px;border-radius:12px;background:color-mix(in srgb,var(--f) 14%,var(--surface));color:var(--f);border:1px solid color-mix(in srgb,var(--f) 30%,var(--line));font-family:var(--font-display);line-height:1}",
    ".eg-date b{font-size:1.35rem;font-weight:700}",
    ".eg-date span{font-size:.66rem;text-transform:uppercase;letter-spacing:.06em;margin-top:3px;font-weight:600}",
    ".eg-news a{color:var(--ink);text-decoration-color:var(--line);text-underline-offset:2px;font-weight:600}",
    ".eg-news a:hover{text-decoration-color:var(--accent)}",
    ".eg-src{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:.76rem;color:var(--ink-3);margin-top:3px}",
    ".eg-all{display:inline-block;margin-top:12px;font-size:.86rem;font-weight:700}",
    ".eg-empty{margin:0;font-size:.9rem;color:var(--ink-2)}",
    "body.falc .eg-news li,body.falc .eg-nom,body.falc .eg-empty{font-size:1rem}",
    "@media (max-width:760px){.eg{grid-template-columns:1fr;padding:22px 18px 18px}.eg-tile{width:82px}.eg-ico{width:64px;height:64px;border-radius:20px}.eg-ico svg{width:38px;height:38px}}",
    "@media print{.eg{display:none}}"
  ].join("\n");
  var all = G.ministeres.concat(G.autres_acteurs), byId = {}; all.forEach(function (m) { byId[m.id] = m; });
  var key = (location.pathname.split("/").pop() || "index.html");
  var ids = (G.pages[key] || []).slice();
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function dateCourte(d) { var m = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]; var p = d.split("-"); return +p[2] + " " + m[+p[1] - 1]; }
  function dateBloc(d) { var m = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]; var p = d.split("-"); return '<span class="eg-date" aria-hidden="true"><b>' + (+p[2]) + "</b><span>" + m[+p[1] - 1] + "</span></span>"; }
  function news() {
    return G.actualites.filter(function (a) { return (a.pages || []).indexOf(key) >= 0 || a.ministeres.some(function (id) { return ids.indexOf(id) >= 0; }); })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
  }
  function build() {
    var falc = document.body.classList.contains("falc");
    var max = 6, shown = ids.slice(0, max), extra = ids.length - shown.length;
    var tiles = shown.map(function (id) { var m = byId[id]; if (!m) return ""; return '<li><a class="eg-tile" href="ministere-' + esc(id) + '.html" style="--f:' + FAM[m.famille] + '" title="' + esc(m.nom) + '"><span class="eg-ico"><svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + m.icone + '</svg></span><span class="eg-nom">' + esc(m.court) + "</span></a></li>"; }).join("");
    if (extra > 0) tiles += '<li><a class="eg-tile eg-plus" href="gouvernement.html"><span class="eg-ico">+' + extra + '</span><span class="eg-nom">' + (falc ? "Voir tous" : "Tous les ministères") + "</span></a></li>";
    var n = news();
    var items = n.length ? '<ul class="eg-news">' + n.map(function (a) { var m0 = byId[(a.ministeres || [])[0]] || { famille: "autres" }; return '<li style="--f:' + FAM[m0.famille] + '">' + dateBloc(a.date) + '<span><a href="' + esc(a.url) + '" target="_blank" rel="noopener"><span class="sr-only">' + esc(dateCourte(a.date)) + " : </span>" + esc(a.titre) + '</a><span class="eg-src">' + esc(a.source) + ' <span class="lvl lvl-' + esc(a.niveau || "V") + '">' + esc(a.niveau || "V") + "</span></span></span></li>"; }).join("") + "</ul>" : '<p class="eg-empty">' + (falc ? "Pas encore de nouvelle vérifiée." : "Aucune actualité vérifiée sur un site officiel pour le moment.") + "</p>";
    var ribbon = '<div class="eg-ribbon" aria-hidden="true">' + shown.map(function (id) { var m = byId[id]; return m ? '<i style="--f:' + FAM[m.famille] + '"></i>' : ""; }).join("") + "</div>";
    var mt = document.querySelector('meta[name="eg-titre"]'); var titre = mt && mt.content ? '<h2 class="eg-titre">' + esc(mt.content) + "</h2>" : "";
    return ribbon + titre + '<div class="eg-min"><p class="eg-label">' + (falc ? "Les ministères" : "Ministères concernés") + '</p><ul class="eg-list">' + tiles + '</ul></div><div class="eg-actu"><p class="eg-label">' + (falc ? "Les nouvelles" : "Actualité en bref") + "</p>" + items + '<a class="eg-all" href="gouvernement.html#actualites">' + (falc ? "Toutes les nouvelles" : "Toute l'actualité") + "</a></div>";
  }
  function init() {
    if (document.querySelector('meta[name="eg-masquer"]')) return;
    var host = document.querySelector("header.hero") || document.querySelector("main"); if (!host || !ids.length) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var box = document.createElement("section"); box.className = "eg"; box.setAttribute("aria-label", "Ministères concernés et actualité en bref");
    host.insertBefore(box, host.firstChild); box.innerHTML = build();
    new MutationObserver(function () { box.innerHTML = build(); }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
