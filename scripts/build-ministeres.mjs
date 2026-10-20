#!/usr/bin/env node
/* Génère dashboard/ministere-<id>.html pour chaque ministère et autre acteur de data/gouvernement.json.
   Aucun texte n'est écrit à la main : tout vient du JSON (relu sur les sites officiels). Relancer après build-gouvernement. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const d = JSON.parse(readFileSync(join(root, "data/gouvernement.json"), "utf8"));
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const dateLong = s => { const [y, m, j] = s.split("-").map(Number); return (j === 1 ? "1er" : j) + " " + MOIS[m - 1] + " " + y; };
const FAM = { regalien: ["Pouvoirs régaliens", "var(--c1)"], economie: ["Économie et travail", "var(--c2)"], territoires: ["Territoires et transitions", "var(--c3)"], societe: ["Société", "var(--c4)"], autres: ["Autres acteurs", "var(--c5)"] };
const PAGES = { "gouvernement.html": "Le Gouvernement", "index.html": "Fraude sociale", "medias.html": "Qui possède les médias", "forces.html": "Police et gendarmerie", "17-octobre-2026.html": "Le 17 octobre 2026", "cybersecurite.html": "Cybersécurité de l'État", "presidentielle-2027.html": "Présidentielle 2027", "secteurs.html": "Comment va la France", "benchmark-usa.html": "Benchmark États-Unis", "donnees.html": "Sources et données" };
const acc = readFileSync(join(root, "dashboard/accueil.html"), "utf8");
const nav = acc.match(/<nav class="nav".*?<\/nav>/s)[0].replace(/ class="here" aria-current="page"/g, "").replace(/<div class="switch"[^>]*><\/div>/, "");
const fonts = acc.slice(acc.indexOf('<link rel="preconnect"'), acc.indexOf("<style>"));
const css = `<style>
.hero-min{display:grid;grid-template-columns:auto 1fr;gap:20px 28px;align-items:center;padding-block:30px 6px}
.min-pic{display:flex;align-items:center;justify-content:center;width:112px;height:112px;border-radius:32px;background:linear-gradient(150deg,color-mix(in srgb,var(--f) 26%,var(--surface)),color-mix(in srgb,var(--f) 8%,var(--surface)));border:2px solid color-mix(in srgb,var(--f) 40%,var(--line));color:var(--f)}
.min-pic svg{width:66px;height:66px;stroke-width:2.1}
.min-facts{display:flex;flex-wrap:wrap;gap:8px 18px;margin:12px 0 0;padding:0;list-style:none;font-size:.92rem;color:var(--ink-2)}
.min-statut{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.78rem;font-weight:700;border:1px solid var(--line)}
.min-statut.ok{background:color-mix(in srgb,var(--ok,#2f6b4f) 14%,var(--surface));color:var(--ok,#2f6b4f)}
.min-statut.todo{background:var(--trou-soft);border-style:dashed;color:var(--ink-2)}
.savoir{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.savoir li{padding:14px 16px;border:1px solid var(--line);border-radius:14px;background:var(--surface)}
.savoir .by{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin-top:6px;font-size:.8rem;color:var(--ink-3)}
.actu{list-style:none;margin:0;padding:0;display:grid}
.actu li{display:grid;grid-template-columns:150px 1fr;gap:14px;padding:12px 0;border-top:1px solid var(--line-2)}
.actu li:first-child{border-top:0}
.actu time{font-family:var(--font-display);font-weight:600;color:var(--accent-ink);font-size:.9rem}
.actu .by{display:block;font-size:.8rem;color:var(--ink-3);margin-top:2px}
.equipe{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:10px}
.equipe li{display:block;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
.equipe b{display:block}
.equipe span{font-size:.86rem;color:var(--ink-2)}
.liens-pol{display:flex;flex-wrap:wrap;gap:10px;list-style:none;margin:0;padding:0}
.liens-pol a{display:inline-block;padding:9px 14px;border:1.5px solid var(--accent-ink);border-radius:10px;font-weight:600;text-decoration:none;color:var(--accent-ink)}
.liens-pol a:hover,.liens-pol a:focus-visible{background:var(--accent-soft);outline:none}
.pn{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:stretch;margin-top:30px}
.pn a{display:flex;flex-direction:column;gap:2px;padding:12px 16px;border:1px solid var(--line);border-radius:14px;background:var(--surface);color:var(--ink);text-decoration:none;min-width:0}
.pn a[rel=next]{text-align:right;align-items:flex-end}
.pn a.all{justify-content:center;font-weight:700;color:var(--accent-ink);text-align:center}
.pn small{font-size:.74rem;color:var(--ink-3);text-transform:uppercase;letter-spacing:.07em}
.pn a:hover,.pn a:focus-visible{border-color:var(--accent-ink);outline:none}
@media (max-width:640px){.pn{grid-template-columns:1fr 1fr}.pn a.all{grid-column:1/-1;order:3}}
@media (max-width:640px){.hero-min{grid-template-columns:1fr}.actu li{grid-template-columns:1fr}.min-pic{width:92px;height:92px;border-radius:26px}.min-pic svg{width:54px;height:54px}}
</style>`;
const all = [...d.ministeres, ...d.autres_acteurs];
let n = 0;
for (const [idx, m] of all.entries()) {
  const [famNom, famCol] = FAM[m.famille] || FAM.autres;
  const verifie = !!m.verifie_le;
  const actus = d.actualites.filter(a => (a.ministeres || []).includes(m.id)).sort((a, b) => (a.date < b.date ? 1 : -1));
  const pages = Object.entries(d.pages).filter(([f, ids]) => ids.includes(m.id) && f !== "simple.html" && PAGES[f]).map(([f]) => f);
  const intro = verifie
    ? `L'essentiel à retenir du site officiel du ministère, lu le ${dateLong(m.verifie_le)}.`
    : `Nous n'avons pas encore lu le site officiel de ce ministère. Cette page indique seulement qui le dirige et les pages de Politik qui le concernent.`;
  const desc = `${m.court} : ${m.ministre ? "ministre " + m.ministre + ", " : ""}ce qu'il faut savoir et l'actualité vérifiée sur le site officiel.`;
  const savoir = (m.a_savoir || []).map(s => `<li><span>${esc(s.texte)}</span><span class="by"><span class="lvl lvl-${esc(s.niveau)}">${esc(s.niveau)}</span><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.source)}</a><span>lu le ${esc(dateLong(s.lu_le))}</span></span></li>`).join("");
  const equipe = [m.ministre ? `<li><b data-ent="${esc(m.ministre)}">${esc(m.ministre)}</b><span>${m.id === "premier-ministre" ? "Premier ministre" : "Ministre"}</span></li>` : "", ...(m.delegues || []).map(x => `<li><b data-ent="${esc(x.nom)}">${esc(x.nom)}</b><span>${esc(x.role)}</span></li>`)].join("");
  const fam = all.filter(x => x.famille === m.famille && x.id !== m.id);
  const prev = all[(idx + all.length - 1) % all.length], next = all[(idx + 1) % all.length];
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(m.court)} : ce qu'il faut savoir · Politik</title>
<meta name="description" content="${esc(desc)}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#141A2B">
${fonts}<link rel="stylesheet" href="politik.css">
${css}
</head>
<body>
${nav}

<header class="hero hero-min wrap" style="--f:${famCol}">
  <div class="min-pic" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false">${m.icone || ""}</svg></div>
  <div>
    <p class="eyebrow">${esc(famNom)} · <a href="gouvernement.html">Le Gouvernement</a></p>
    <h1>${esc(m.nom)}</h1>
    <p class="lede">${esc(intro)}</p>
    <ul class="min-facts">
      ${m.ministre ? `<li>${m.id === "premier-ministre" ? "Premier ministre" : "Ministre"} : <b>${esc(m.ministre)}</b></li>` : ""}
      ${m.site ? `<li>Site officiel : <a href="${esc(m.site)}" target="_blank" rel="noopener">${esc(m.site.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a></li>` : ""}
      <li><span class="min-statut ${verifie ? "ok" : "todo"}">${verifie ? "Relu le " + esc(dateLong(m.verifie_le)) : "À relire sur le site officiel"}</span></li>
    </ul>
  </div>
</header>

<main class="wrap">
<section id="savoir"><div class="sec-head"><h2>À savoir pour les citoyens</h2><p>Chaque information donne sa source et sa date de lecture. V : publié par l'institution elle-même. D : annonce ou position, pas un fait établi.</p></div>
${savoir ? `<ul class="savoir">${savoir}</ul>` : `<div class="card"><p>Rien à afficher pour l'instant : nous lisons les sites officiels un ministère après l'autre.</p></div>`}</section>
<section id="actualite"><div class="sec-head"><h2>Actualité vérifiée</h2><p>Chaque actualité renvoie à la page lue sur le site officiel.</p></div>
<div class="card">${actus.length ? `<ul class="actu">${actus.map(a => `<li><time datetime="${esc(a.date)}">${esc(dateLong(a.date))}</time><span><a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.titre)}</a><span class="by">${esc(a.source)} · <span class="lvl lvl-${esc(a.niveau || "V")}">${esc(a.niveau || "V")}</span></span></span></li>`).join("")}</ul>` : `<p>Aucune actualité vérifiée pour ce ministère pour l'instant.</p>`}</div></section>
${equipe ? `<section id="equipe"><div class="sec-head"><h2>Qui dirige ce ministère</h2><p>D'après la composition du Gouvernement publiée sur info.gouv.fr.</p></div><ul class="equipe">${equipe}</ul></section>` : ""}
${pages.length ? `<section id="dans-politik"><div class="sec-head"><h2>Dans Politik</h2><p>Les pages de Politik qui parlent de ce ministère.</p></div><ul class="liens-pol">${pages.map(f => `<li><a href="${f}">${esc(PAGES[f])}</a></li>`).join("")}</ul></section>` : ""}
${fam.length ? `<section id="famille"><div class="sec-head"><h2>Autres ministères : ${esc(famNom.toLowerCase())}</h2><p>Les ministères de la même famille.</p></div><ul class="liens-pol">${fam.map(x => `<li><a href="ministere-${esc(x.id)}.html">${esc(x.court)}</a></li>`).join("")}</ul></section>` : ""}
<nav class="pn" aria-label="Ministère précédent et suivant"><a rel="prev" href="ministere-${esc(prev.id)}.html"><span aria-hidden="true">←</span> <small>Précédent</small><b>${esc(prev.court)}</b></a><a class="all" href="gouvernement.html">Tous les ministères</a><a rel="next" href="ministere-${esc(next.id)}.html"><small>Suivant</small><b>${esc(next.court)}</b> <span aria-hidden="true">→</span></a></nav>
</main>
<footer class="wrap"><p>Politik · composition du Gouvernement d'après info.gouv.fr, informations lues sur les sites officiels à la date indiquée.</p></footer>

<script src="gouvernement.js"></script>
<script src="entites.js"></script>
<script src="visuels.js"></script>
<script>document.querySelectorAll("[data-ent]").forEach(function(b){ if(window.Ent){ var n=b.dataset.ent; b.insertAdjacentHTML("beforebegin",Ent.avatar(Ent.slug(n),40,n)); } });</script>
<script src="structure.js"></script>
<script src="legende.js"></script>
<script src="mesure.js"></script>
</body>
</html>
`;
  writeFileSync(join(root, "dashboard", `ministere-${m.id}.html`), html, "utf8");
  n++;
}
console.log(`OK : ${n} pages ministère générées (dashboard/ministere-*.html)`);
