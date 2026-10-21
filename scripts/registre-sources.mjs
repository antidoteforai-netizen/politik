// Politik — registre unique des sources, API et jeux de données, construit depuis les pages elles-mêmes.
// Lit fraude-sociale.html (DATA.sources, DATA.catalogue), fetch-donnees.py et fetch-aides-presse.py (API appelées),
// medias.html (SOURCES), forces.html (DS, SRC), presidentielle-2027.html et secteurs.html (références `src:`),
// benchmark-usa.html (liens du document). Écrit data/registre-sources.json et dashboard/donnees.js
// (window.REGISTRE + rendu du bloc « Données de cette page » sur chaque page).
//   node Politik/scripts/registre-sources.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = f => readFileSync(join(root, f), "utf8");
const PAGES = [
  { id: "index", titre: "Fraude sociale", fichier: "fraude-sociale.html" },
  { id: "gouvernement", titre: "Le Gouvernement", fichier: "gouvernement.html" },
  { id: "forces", titre: "Forces de l'ordre", fichier: "forces.html" },
  { id: "oct17", titre: "Le 17 octobre 2026", fichier: "17-octobre-2026.html" },
  { id: "cyber", titre: "Cybersécurité de l'État", fichier: "cybersecurite.html" },
  { id: "medias", titre: "Qui possède les médias", fichier: "medias.html" },
  { id: "secteurs", titre: "Comment va la France", fichier: "secteurs.html" },
  { id: "presidentielle", titre: "Présidentielle 2027", fichier: "presidentielle-2027.html" },
  { id: "benchmark", titre: "Benchmark États-Unis", fichier: "benchmark-usa.html" },
];
const entrees = [];
const add = e => { const key = (e.url || e.titre).toLowerCase(); if (!entrees.some(x => x.page === e.page && (x.url || x.titre).toLowerCase() === key)) entrees.push(e); };
const evalArray = (txt) => new Function("return " + txt)();
const block = (src, start, end) => { const i = src.indexOf(start); if (i < 0) throw new Error("bloc introuvable : " + start); const j = src.indexOf(end, i + start.length); return src.slice(i + start.length - 1, j + end.length).replace(/,\s*$/, ""); };

// 1. Page fraude : registre des sources (titre, type, niveau, url) et catalogue data.gouv (6 colonnes).
const index = read("dashboard/fraude-sociale.html");
for (const [titre, type, niveau, url] of evalArray(block(index, "sources: [", "\n  ]"))) add({ page: "index", type: /officiel/i.test(type) ? "document" : "reference", titre, producteur: type, niveau, url, statut: "cité" });
for (const [titre, producteur, granularite, description, url, statut] of evalArray(block(index, "catalogue: [", "\n  ],"))) add({ page: "index", type: "jeu", titre, producteur, granularite, description, url, niveau: "V", statut });

// 2. API et fichiers appelés par les scripts de collecte, une entrée par fonction d'étape.
const LIBELLES = { protection: "OFPRA, bénéficiaires de la protection internationale", asile_dept: "OFPRA, demandes d'asile par département × geo.api.gouv.fr", ifi_filosofi: "DGFiP, IFI par commune × INSEE Filosofi", urssaf: "Open Urssaf, LCTI et contrôle", caf: "data.caf.fr, RSA national et par département", cnam: "CNAM, dépenses mensuelles", urssaf_encaissements: "Urssaf, encaissements", crimes: "Crimes et délits 2012-2021 (xlsx)", egalite: "INSEE, égalité femmes-hommes (if349)", ssmsi: "SSMSI, délinquance par département 2016-2025", rsa_departements: "RSA × pauvreté par département", sailly: "Sailly-lez-Lannoy (réutilisation) et Datawrapper", drees_minima: "DREES, dépenses de RSA 2009-2024", dcpaf: "DCPAF, fraude documentaire (xls BIFF8)", ips: "IPS des collèges (API)", seniors: "60 ans et plus, Caisse des Dépôts (API)", odd: "ODD, indicateurs (xlsx)", entreprises: "API Recherche d'entreprises (associations)", datagov: "data.gov (catalogue CKAN)" };
const py = read("scripts/fetch-donnees.py");
for (const m of py.matchAll(/\ndef (\w+)\(\):([\s\S]*?)(?=\ndef |\n# ---|$)/g)) {
  if (!LIBELLES[m[1]]) continue;
  const urls = [...new Set([...m[2].matchAll(/https?:\/\/[^\s"'<>)]+/g)].map(x => x[0].replace(/[.,;]$/, "")))];
  if (!urls.length) continue;
  add({ page: "index", type: "api", titre: LIBELLES[m[1]], producteur: new URL(urls[0]).host, url: urls[0], autres_urls: urls.slice(1), niveau: m[1] === "datagov" ? "A" : "V", statut: m[1] === "datagov" ? "inaccessible (erreur 404)" : "interrogée automatiquement lors de la mise à jour des données" });
}
const aides = read("scripts/fetch-aides-presse.py");
for (const [nom, re] of [["Ministère de la Culture, titres de presse aidés (CSV)", /TITRES = "([^"]+)"/], ["Ministère de la Culture, groupes de presse aidés (CSV)", /GROUPES = "([^"]+)"/]]) add({ page: "medias", type: "api", titre: nom, producteur: "static.data.gouv.fr", url: aides.match(re)[1], niveau: "V", statut: "téléchargée automatiquement lors de la mise à jour des données" });

// 3. Page médias : SOURCES (titre, url, niveau).
const medias = read("dashboard/medias.html");
for (const [titre, url, niveau] of evalArray(block(medias, "const SOURCES=[", "\n];"))) add({ page: "medias", type: url ? (/data\.gouv|\.pdf|vivendi|louishachette|ticker\.app|episciences/.test(url) ? "document" : "reference") : "reference", titre, url, niveau, statut: "cité" });

// 4. Page forces : registre DS (id, nom, producteur, statut, état) ; sources S# non résolues.
const forces = read("dashboard/forces.html");
const DS = evalArray(block(forces, "const DS=[", "\n];").replace(/\{etat:"([^"]*)",falc:"[^"]*"\}/g, '"$1"'));
for (const [id, nom, producteur, statut, etat] of DS) add({ page: "forces", type: "jeu", titre: `${id} · ${nom}`, producteur, url: "", niveau: etat === "ok" ? "V" : "A", statut: etat === "ok" ? "accessible : " + statut : (etat === "todo" ? "à explorer : " : "non ouvert : ") + statut });
add({ page: "forces", type: "document", titre: "Réponses ministérielles et questions parlementaires (Assemblée nationale, Sénat)", producteur: "Parlement", url: "https://www.assemblee-nationale.fr/dyn/15/comptes-rendus/ceordre/l15ceordre2021011_compte-rendu.pdf", niveau: "V", statut: "cité (audition de l'IGPN, 15e législature) ; autres publications à rattacher" });

// 4 bis. Page « Le 17 octobre 2026 » : SOURCES (titre, url, niveau) ; statut « cité ».
const oct17 = read("dashboard/17-octobre-2026.html");
const oSrc = [...oct17.matchAll(/const SRC_(\w+)=\{t:"([^"]+)",u:"([^"]+)"\}/g)];
for (const m of oSrc) add({ page: "oct17", type: "document", titre: m[2], producteur: new URL(m[3]).host, url: m[3], niveau: "V", statut: "cité (texte lu le 20 oct. 2026)" });

const sp = JSON.parse(read("data/sources-police.json"));
for (const s of sp.sources) add({ page: "forces", type: s.categorie === "O" ? "document" : "reference", titre: `${s.id} · ${s.titre}`, producteur: new URL(s.url).host, url: s.url, niveau: s.niveau, statut: "cité (index de la synthèse du 20 oct. 2026, " + s.nature + ")" });
const cyb = read("dashboard/cybersecurite.html");
const SRC_NIV = { PLAN: "V", COM: "V", ANSSI: "V", EDU: "V", CERT: "V", ANSSIH: "V", KIT: "V", ITC: "S", POD: "S", VT: "D" };
for (const m of cyb.matchAll(/const SRC_(\w+)=\{t:"([^"]+)",u:"([^"]+)"\}/g)) add({ page: "cyber", type: "document", titre: m[2], producteur: new URL(m[3]).host, url: m[3], niveau: SRC_NIV[m[1]] || "S", statut: "cité (texte lu le 20 oct. 2026)" });
add({ page: "oct17", type: "document", titre: "Ministère de l'Intérieur, SSMSI, « Insécurité et délinquance en 2025 : bilan statistique et atlas départemental » (9 juillet 2026)", producteur: "www.interieur.gouv.fr", url: "https://www.interieur.gouv.fr/actualites/communiques-de-presse/insecurite-et-delinquance-en-2025-bilan-statistique-et-atlas-departemental", niveau: "V", statut: "cité (contexte)" });
add({ page: "forces", type: "api", titre: "SSMSI, base départementale de la délinquance enregistrée (violences, 2016-2025)", producteur: "www.data.gouv.fr", url: "https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales", niveau: "V", statut: "téléchargée automatiquement lors de la mise à jour des données" });
add({ page: "forces", type: "document", titre: "Ministère de l'Intérieur, SSMSI, « Insécurité et délinquance en 2025 : bilan statistique et atlas départemental » (9 juillet 2026)", producteur: "www.interieur.gouv.fr", url: "https://www.interieur.gouv.fr/actualites/communiques-de-presse/insecurite-et-delinquance-en-2025-bilan-statistique-et-atlas-departemental", niveau: "V", statut: "cité" });
add({ page: "forces", type: "reference", titre: "Crim'Stream, observatoire territorial de la délinquance (réutilisation sur data.gouv.fr)", producteur: "www.data.gouv.fr", url: "https://www.data.gouv.fr/reuses/crimstream", niveau: "S", statut: "cité (outil de visualisation, réutilise la base du SSMSI)" });
add({ page: "forces", type: "reference", titre: "SSMSI, sources de données (états 4001, enquêtes VRS, CVS, GENESE, TEH)", producteur: "statistiques.interieur.gouv.fr", url: "https://statistiques.interieur.gouv.fr/ssmsi/sources-et-methodes/sources-de-donnees", niveau: "V", statut: "cité" });
add({ page: "forces", type: "document", titre: "Gendarmerie nationale, UNPJ : trois sites de diffusion de contenus intimes volés fermés (8 octobre 2026)", producteur: "www.gendarmerie.interieur.gouv.fr", url: "https://www.gendarmerie.interieur.gouv.fr/unpj/actualites/plus-de-17-000-victimes-dont-des-mineures-trois-sites-de-diffusion-de-contenus-intimes-voles-fermes", niveau: "V", statut: "cité" });
add({ page: "forces", type: "document", titre: "Gendarmerie nationale, Gendinfo : démantèlement de sites proposant des packs de contenus intimes volés (8 octobre 2026)", producteur: "www.gendarmerie.interieur.gouv.fr", url: "https://www.gendarmerie.interieur.gouv.fr/presentation/a-l-international/cooperation-policiere-et-judiciaire-internationale-demantelement-de-sites-internet-proposant-des-packs-de-contenus-intimes-voles", niveau: "V", statut: "cité" });

// 4 ter. Page Gouvernement : composition (info.gouv.fr), actualités et « à savoir » vérifiés sur des sites officiels.
const gouv = JSON.parse(read("data/gouvernement.json"));
add({ page: "gouvernement", type: "document", titre: "info.gouv.fr, Composition du Gouvernement (annoncée le 26 février 2026)", producteur: "www.info.gouv.fr", url: gouv.composition.source, niveau: "V", statut: "lu le " + gouv.composition.lue_le });
for (const a of gouv.actualites) add({ page: "gouvernement", type: "document", titre: a.titre, producteur: a.source, url: a.url, niveau: a.niveau || "V", statut: "actualité lue le " + (a.lu_le || "") });
for (const m of [...gouv.ministeres, ...gouv.autres_acteurs]) { if (m.site && m.site_verifie_le) add({ page: "gouvernement", type: "reference", titre: "Site officiel : " + m.nom, producteur: new URL(m.site).host, url: m.site, niveau: "V", statut: "relu le " + m.site_verifie_le }); for (const s of (m.a_savoir || [])) add({ page: "gouvernement", type: "document", titre: s.texte.slice(0, 120), producteur: s.source, url: s.url, niveau: s.niveau || "V", statut: "à savoir, lu le " + (s.lu_le || m.verifie_le || "") }); }

// 5. Pages présidentielle et secteurs : références `src:"…"` et liens.
for (const [id, f] of [["presidentielle", "presidentielle-2027.html"], ["secteurs", "secteurs.html"]]) {
  const h = read("dashboard/" + f);
  for (const m of h.matchAll(/src:"([^"]{3,160})"/g)) add({ page: id, type: /data\.gouv|insee|ministère|minist|senat\.fr|assemblee|arcom|conseil/i.test(m[1]) && !/via|presse|politicaa/i.test(m[1]) ? "document" : "reference", titre: m[1], url: "", niveau: /officiel|INSEE|Insee|DREES|SSMSI|Justice|Intérieur|DGFiP|Urssaf|CNAF|OFPRA/.test(m[1]) ? "V" : "S", statut: "cité" });
  for (const m of h.matchAll(/https?:\/\/[^\s"'<>)]+/g)) if (!/fonts\.|w3\.org/.test(m[0])) add({ page: id, type: "reference", titre: m[0].replace(/^https?:\/\//, ""), url: m[0], niveau: "S", statut: "lien" });
}

// 6. Benchmark : liens du document.
const bench = read("dashboard/benchmark-usa.html");
for (const m of bench.matchAll(/<a (?:class="docu-a" )?href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) add({ page: "benchmark", type: "reference", titre: m[2].replace(/<[^>]+>/g, "").trim(), url: m[1], niveau: /\.gov\b|usafacts|census|bls\.gov|gao\.gov/.test(m[1]) ? "V" : "S", statut: "cité" });
// Le document cite aussi des URL nues (hors balises <a>) : une entrée par hôte + chemin, dédoublonnée.
for (const m of bench.matchAll(/(?<!href=")https?:\/\/[^\s"'<>)]+/g)) { const u = m[0].replace(/[.,;:]$/, ""); if (/fonts\.|w3\.org/.test(u)) continue; add({ page: "benchmark", type: /\.gov\b|usafacts|gallup|census|gao\.gov/.test(u) ? "document" : "reference", titre: u.replace(/^https?:\/\/(www\.)?/, ""), url: u, niveau: /\.gov\b|usafacts|census|gao\.gov/.test(u) ? "V" : "S", statut: "cité" }); }

const registre = { genere_le: new Date().toISOString().slice(0, 10), pages: PAGES, entrees, totaux: Object.fromEntries(["api", "jeu", "document", "reference"].map(t => [t, entrees.filter(e => e.type === t).length])) };
writeFileSync(join(root, "data/registre-sources.json"), JSON.stringify(registre, null, 2) + "\n");

const js = `/* Politik — registre des sources, généré par scripts/registre-sources.mjs le ${registre.genere_le}. Ne pas éditer.
   Rend le bloc « Données de cette page » dans tout élément #donnees-page[data-page]. */
window.REGISTRE = ${JSON.stringify(registre)};
(function () {
  var el = document.getElementById("donnees-page"); if (!el) return;
  var page = el.getAttribute("data-page");
  var E = window.REGISTRE.entrees.filter(function (e) { return e.page === page; });
  function rendu() {
    var falc = document.body.classList.contains("falc");
    var n = function (t) { return E.filter(function (e) { return e.type === t; }).length; };
    var T = falc ? { api: "appels de données", jeu: "fichiers de données", document: "documents officiels", reference: "autres sources" } : { api: "API appelées", jeu: "jeux de données", document: "documents officiels", reference: "références" };
    var COUL = { api: "var(--c1)", jeu: "var(--c2)", document: "var(--c3)", reference: "var(--c4)" };
    var types = ["api", "jeu", "document", "reference"].filter(n);
    var tuiles = types.map(function (t) { return '<li style="--k:' + COUL[t] + '"><b>' + n(t) + "</b><span>" + T[t] + "</span></li>"; }).join("");
    if (!document.getElementById("dp-style")) {
      var st = document.createElement("style"); st.id = "dp-style";
      st.textContent = ".dp{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px 24px;align-items:center;padding:20px 22px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(135deg,var(--surface),color-mix(in srgb,var(--accent-soft) 35%,var(--surface)))}"
        + ".dp-tot{display:flex;align-items:baseline;gap:10px;margin:0 0 10px;color:var(--ink-2);font-size:.95rem}.dp-tot b{font-family:var(--font-display);font-size:2.2rem;line-height:1;color:var(--ink)}"
        + ".dp-st{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:10px}"
        + ".dp-st li{display:flex;flex-direction:column;gap:2px;min-width:118px;padding:10px 14px;border:1px solid var(--line);border-top:3px solid color-mix(in srgb,var(--k) 55%,var(--line));border-radius:12px;background:var(--surface)}"
        + ".dp-st b{font-family:var(--font-display);font-size:1.4rem;line-height:1.1}.dp-st span{font-size:.8rem;color:var(--ink-2)}"
        + ".dp-note{margin:10px 0 0;font-size:.84rem;color:var(--ink-3);max-width:60ch}"
        + ".dp-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;background:var(--accent-ink);color:#fff;font-weight:700;text-decoration:none;border:2px solid var(--accent-ink);white-space:nowrap}"
        + ".dp-btn:hover,.dp-btn:focus-visible{background:var(--surface);color:var(--accent-ink);outline:none}.dp-btn:focus-visible{outline:2px solid var(--accent);outline-offset:3px}"
        + "@media (max-width:720px){.dp{grid-template-columns:1fr;padding:16px}.dp-btn{justify-self:start}}";
      document.head.appendChild(st);
    }
    el.innerHTML = '<div class="sec-head"><h2>' + (falc ? "Les données de cette page" : "Données de cette page") + '</h2><p>' + (falc ? "D'où viennent les chiffres de cette page." : "Ce que cette page utilise, recensé automatiquement dans le registre commun du site.") + "</p></div>" +
      '<div class="dp"><div><p class="dp-tot"><b>' + E.length + "</b><span>" + (falc ? "sources pour cette page" : "sources recensées pour cette page") + '</span></p><ul class="dp-st">' + tuiles + '</ul><p class="dp-note">' + (falc ? "Chaque ligne du registre dit d'où vient le chiffre." : "Chaque ligne du registre donne la source, sa nature et son niveau de fiabilité.") + '</p></div><a class="dp-btn" href="donnees.html#' + page + '">' + (falc ? "Voir la liste" : "Voir le registre complet") + ' <span aria-hidden="true">\u2192</span></a></div>';
  }
  rendu();
  new MutationObserver(rendu).observe(document.body, { attributes: true, attributeFilter: ["class"] });
})();
`;
writeFileSync(join(root, "dashboard/donnees.js"), js);
console.log(`OK : ${entrees.length} entrées (${Object.entries(registre.totaux).map(([k, v]) => v + " " + k).join(", ")}) ; data/registre-sources.json et dashboard/donnees.js écrits`);
for (const p of PAGES) console.log(`  ${p.id.padEnd(14)} ${entrees.filter(e => e.page === p.id).length}`);
