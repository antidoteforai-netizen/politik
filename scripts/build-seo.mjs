#!/usr/bin/env node
/* Politik — référencement : titre, description, adresse canonique, Open Graph, Twitter, données structurées (JSON-LD),
   sitemap.xml, robots.txt et llms.txt (pour les moteurs de réponse génératifs).
   Écrit un bloc géré <!--SEO-->…<!--/SEO--> dans le <head> de chaque page de dashboard/ ; à lancer EN DERNIER, après
   build-simple, build-ministeres et md-vers-html (qui régénèrent des pages). Aucun texte n'est inventé : les pages ministère
   reprennent data/gouvernement.json. */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const BASE = "https://politik-eta.vercel.app";
const IMG = BASE + "/og-politik.png?v=20261021"; /* le suffixe force les réseaux sociaux à relire l'image après un changement */
const IMG_ALT = "Politik : comprendre les données publiques de la France. Buste de la République en caractères ASCII sur fond Bleu France.";
const today = new Date().toISOString().slice(0, 10);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const gj = JSON.parse(readFileSync(join(root, "data/gouvernement.json"), "utf8"));
const P = {
  "index.html": ["Politik : comprendre les données publiques de la France", "Une page par ministère, des états des lieux sourcés et des dossiers décryptés : fraude, police, cybersécurité, médias. Chaque chiffre dit d'où il vient.", []],
  "fraude-sociale.html": ["Fraude sociale en France, chiffres et sources · Politik", "Combien coûte la fraude sociale, combien est détecté, combien est récupéré ? Les chiffres officiels, leurs limites et ce qu'on ne mesure pas.", [["États des lieux", "index.html#etats"]]],
  "simple.html": ["Fraude sociale en France, version simple · Politik", "La fraude sociale en France expliquée simplement : les chiffres officiels, ce qu'on ne sait pas, et qui en répond.", [["États des lieux", "index.html#etats"]]],
  "gouvernement.html": ["Le Gouvernement : 20 ministères et leurs actualités · Politik", "Les 20 ministères du Gouvernement, leurs ministres, l'essentiel à savoir pour chacun et l'actualité lue sur les sites officiels.", []],
  "medias.html": ["Qui possède les médias en France ? · Politik", "À qui appartiennent les grands médias français, quels liens avec l'État, quelles aides publiques : un dossier sourcé, groupe par groupe.", [["Dossiers", "index.html#dossiers"]]],
  "forces.html": ["Police et gendarmerie : chiffres et sources · Politik", "Suicides, soutien psychologique, diplôme, salaire, violences et blessés en manifestation : les chiffres de la police et de la gendarmerie, avec leurs sources.", [["États des lieux", "index.html#etats"]]],
  "17-octobre-2026.html": ["Le 17 octobre 2026 : ce que disent les sources · Politik", "Violences, dégradations, agents mobilisés et aides aux commerçants après le 17 octobre 2026 : qui dit quoi, et ce qui n'est pas encore chiffré.", [["Dossiers", "index.html#dossiers"]]],
  "cybersecurite.html": ["Cybersécurité de l'État : plan et incidents · Politik", "Le plan d'action de l'État contre les vols de données, les incidents de 2026 et le rapport de l'ANSSI sur la DGFiP, expliqués simplement.", [["États des lieux", "index.html#etats"]]],
  "presidentielle-2027.html": ["Présidentielle 2027 : candidats et repères · Politik", "Compte à rebours, candidats déclarés et historique des présidentielles de 1958 à 2022, sans sondage ni prévision.", []],
  "secteurs.html": ["Comment va la France, sujet par sujet · Politik", "Quinze familles de sujets, du pouvoir d'achat à la sécurité : où en est la France, chiffre par chiffre, avec la source de chacun.", [["États des lieux", "index.html#etats"]]],
  "benchmark-usa.html": ["Données publiques : ce que font les États-Unis · Politik", "Ce que font les États-Unis avec leurs données publiques : outils pour voter, suivre les dépenses ou demander l'asile, et ce qu'on peut en apprendre.", []],
  "donnees.html": ["Sources et données : le registre complet · Politik", "D'où vient chaque chiffre : le registre des API, jeux de données et documents utilisés par Politik, avec leur niveau de fiabilité.", []]
};
const NOINDEX = new Set(["infographie-police.html", "og-politik.html"]);
const files = readdirSync(join(root, "dashboard")).filter(f => f.endsWith(".html")).sort();
const urls = [];
let n = 0;
for (const f of files) {
  const path = join(root, "dashboard", f);
  let h = readFileSync(path, "utf8");
  h = h.replace(/\n?<!--SEO-->[\s\S]*?<!--\/SEO-->/g, "");
  h = h.replace(/\n?<meta name="description"[^>]*>/g, "").replace(/\n?<meta name="eg-titre"[^>]*>/g, "");
  let title, desc, crumbs, about = null;
  const mm = f.match(/^ministere-(.+)\.html$/);
  if (mm) {
    const m = [...gj.ministeres, ...gj.autres_acteurs].find(x => x.id === mm[1]);
    if (!m) { console.warn("ministère inconnu :", f); continue; }
    title = `${m.court} : l'essentiel à savoir · Politik`;
    desc = `${m.court}${m.ministre ? " : " + (m.id === "premier-ministre" ? "Premier ministre " : "ministre ") + m.ministre + "." : "."} L'essentiel à savoir et l'actualité lue sur le site officiel, avec source et date.`;
    crumbs = [["Ministères", "gouvernement.html"]];
    about = { "@type": "GovernmentOrganization", name: m.nom, ...(m.site ? { url: m.site } : {}) };
  } else if (P[f]) { [title, desc, crumbs] = P[f]; }
  else if (NOINDEX.has(f)) { title = (h.match(/<title>(.*?)<\/title>/s) || [0, "Politik"])[1]; desc = ""; crumbs = []; }
  else { console.warn("page sans fiche SEO :", f); continue; }
  h = h.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  const url = f === "index.html" ? BASE + "/" : `${BASE}/${f}`;
  if (NOINDEX.has(f)) {
    h = h.replace(/\n?<meta name="robots"[^>]*>/g, "");
    h = h.replace("</head>", `<!--SEO-->\n<meta name="robots" content="noindex,follow">\n<!--/SEO-->\n</head>`);
    writeFileSync(path, h, "utf8"); continue;
  }
  const trail = [["Accueil", "index.html"], ...crumbs];
  if (f !== "index.html") trail.push([title.replace(/ · Politik$/, ""), f]);
  /* Aperçus sociaux : ~125 caractères affichés. On garde les phrases entières qui tiennent en 120, sinon on coupe au mot. */
  const ogDesc = (() => {
    if (f === "index.html") return "Une page par ministère, des sujets décryptés, des chiffres sourcés. Chaque chiffre dit d'où il vient.";
    if (desc.length <= 120) return desc;
    const ph = desc.match(/[^.!?]+[.!?]+(\s|$)/g) || [desc]; let o = "";
    for (const x of ph) { if ((o + x).trim().length <= 120) o += x; else break; }
    o = o.trim();
    if (o.length >= 60) return o;
    const cut = desc.slice(0, 117); return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
  })();
  const graph = [
    { "@type": "WebSite", "@id": BASE + "/#site", name: "Politik", url: BASE + "/", inLanguage: "fr", description: P["index.html"][1] },
    { "@type": "WebPage", "@id": url + "#page", url, name: title, description: desc, inLanguage: "fr", isPartOf: { "@id": BASE + "/#site" }, dateModified: today, primaryImageOfPage: { "@type": "ImageObject", url: IMG }, ...(about ? { about } : {}) },
    { "@type": "BreadcrumbList", itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t[0], item: BASE + "/" + (t[1] === "index.html" ? "" : t[1]) })) }
  ];
  if (f === "index.html") {
    const qa = [...h.matchAll(/<details class="faq-q"><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/gs)].map(m => ({ "@type": "Question", name: m[1].replace(/<[^>]+>/g, "").trim(), acceptedAnswer: { "@type": "Answer", text: m[2].replace(/<[^>]+>/g, "").trim() } }));
    if (qa.length) graph.push({ "@type": "FAQPage", mainEntity: qa });
  }
  const block = `<!--SEO-->
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:site_name" content="Politik">
<meta property="og:locale" content="fr_FR">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(ogDesc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${IMG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(IMG_ALT)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(ogDesc)}">
<meta name="twitter:image" content="${IMG}">
<meta name="twitter:image:alt" content="${esc(IMG_ALT)}">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
<!--/SEO-->`;
  h = h.replace("</head>", block + "\n</head>");
  writeFileSync(path, h, "utf8");
  urls.push([url, statSync(path).mtime.toISOString().slice(0, 10), f === "index.html" ? "1.0" : (mm ? "0.5" : "0.8")]);
  n++;
}
writeFileSync(join(root, "dashboard/sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u[0]}</loc><lastmod>${u[1]}</lastmod><priority>${u[2]}</priority></url>`).join("\n")}\n</urlset>\n`, "utf8");
writeFileSync(join(root, "dashboard/robots.txt"), `User-agent: *\nAllow: /\nDisallow: /infographie-police.html\n\nSitemap: ${BASE}/sitemap.xml\n`, "utf8");
const nm = gj.ministeres.length, nv = [...gj.ministeres, ...gj.autres_acteurs].filter(m => m.verifie_le).length;
writeFileSync(join(root, "dashboard/llms.txt"), `# Politik

> Politik rassemble des données publiques françaises (Gouvernement, argent public, médias, police, cybersécurité) et indique pour chaque chiffre sa source, sa date et son niveau de fiabilité. Site en français, sans parti pris, sans cookie de suivi.

Les chiffres portent une pastille : V (publié par l'institution), S (source secondaire), D (déclaration ou annonce), A (à vérifier). Les textes existent en deux niveaux de lecture : termes de l'État et Facile À Lire et à Comprendre (FALC). Les données chiffrées sont relancées tous les deux jours ; ${nv} acteurs sur ${nm + gj.autres_acteurs.length} ont été relus sur leur site officiel le ${today}.

## Pages principales
- [Accueil](${BASE}/): ${P["index.html"][1]}
- [Le Gouvernement](${BASE}/gouvernement.html): ${P["gouvernement.html"][1]}
- [Fraude sociale](${BASE}/fraude-sociale.html): ${P["fraude-sociale.html"][1]}
- [Police et gendarmerie](${BASE}/forces.html): ${P["forces.html"][1]}
- [Cybersécurité de l'État](${BASE}/cybersecurite.html): ${P["cybersecurite.html"][1]}
- [Comment va la France](${BASE}/secteurs.html): ${P["secteurs.html"][1]}
- [Qui possède les médias](${BASE}/medias.html): ${P["medias.html"][1]}
- [Le 17 octobre 2026](${BASE}/17-octobre-2026.html): ${P["17-octobre-2026.html"][1]}
- [Présidentielle 2027](${BASE}/presidentielle-2027.html): ${P["presidentielle-2027.html"][1]}
- [Benchmark États-Unis](${BASE}/benchmark-usa.html): ${P["benchmark-usa.html"][1]}
- [Sources et données](${BASE}/donnees.html): ${P["donnees.html"][1]}

## Une page par ministère
Chaque ministère a sa page à l'adresse ${BASE}/ministere-<identifiant>.html (par exemple ${BASE}/ministere-interieur.html), avec l'essentiel à savoir, l'actualité et les sources lues sur son site officiel.

## Sources et licences
Données issues de data.gouv.fr (Insee, Cour des comptes, SSMSI, Assemblée nationale, Sénat, DREES), des sites officiels des ministères et de documents publics. Chaque page cite ses sources ; le registre complet est sur ${BASE}/donnees.html. Les illustrations viennent de Pixabay (licence Pixabay Content License).

## Code source
https://github.com/antidoteforai-netizen/politik
`, "utf8");
console.log(`OK : ${n} pages optimisées, sitemap.xml (${urls.length} adresses), robots.txt, llms.txt`);
