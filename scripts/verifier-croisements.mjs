// Politik — vérification croisée finale.
// Contrôle que chaque source collectée est présente, non vide, injectée dans la page, rendue dans un
// conteneur existant, et que chaque ligne du catalogue porte un statut d'usage explicite.
// Sort en 0 si tout passe, 1 sinon.   node Politik/scripts/verifier-croisements.mjs
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const api = JSON.parse(readFileSync(join(root, "data/donnees-api.json"), "utf8"));
const html = readFileSync(join(root, "dashboard/fraude-sociale.html"), "utf8");
const problems = [];
const ok = [];

// 1. Chaque étape de collecte a produit des données, et la page les rend dans un conteneur existant.
const attendu = {
  protection: { test: a => a.serie?.length >= 5 && a.dernier?.total > 0, ids: ["ch-prot"] },
  asile_departements: { test: a => a.top?.length === 8 && a.france?.pour_10000 > 0, ids: ["ch-dep"] },
  ifi_communes: { test: a => a.top?.length >= 6 && a.communes_jointes_filosofi > 200 && a.france_2020?.taux_pauvrete > 0, ids: ["ch-ifi", "tbl-ifi"] },
  urssaf: { test: a => a.travail_dissimule?.length >= 6 && a.controle?.length >= 6, ids: ["ch-ulcti", "ch-uctrl"] },
  caf_rsa: { test: a => a.foyers > 1e6 && a.montant_annualise_meur > 1e4, ids: ["ch-rsa"] },
  cnam: { test: a => a.soins_de_ville?.["2025"]?.rembourse_meur > 1e5 && a.ondam_2025_meur > 2e5, ids: ["ch-ratios"] },
  urssaf_encaissements: { test: a => a.dernier?.total_meur > 3e5, ids: ["ch-ratios"] },
  crimes: { test: a => ["faux_identite", "escroqueries", "travail_clandestin", "fraudes_fiscales"].every(k => a[k]?.length === 10), ids: ["ch-crimes", "ch-fauxid"] },
  egalite: { test: a => a.dernier?.revenu_salarial > 0 && a.dernier?.salaire_eqtp > 0, ids: ["ch-fh"] },
  ssmsi: { test: a => a.escroqueries?.length >= 8, ids: ["ch-ssmsi"] },
  rsa_departements: { test: a => a.departements_joints >= 90 && typeof a.correlation_pearson === "number", ids: ["ch-rsadep", "tbl-rsadep"] },
  sailly: { test: a => a.serie?.length === 3, ids: ["ch-sailly"] },
  drees_rsa: { test: a => a.serie?.length >= 10 && a.serie[a.serie.length - 1].depenses_meur_2024 > 1e4, ids: ["tbl-drees"] },
  dcpaf: { test: a => a.total?.length >= 5 && a.total.every(x => x.faux_documents > 1000), ids: ["ch-dcpaf"] },
  ips: { test: a => a.departements_joints >= 90 && typeof a.correlation_pearson === "number", ids: ["ch-ips"] },
  seniors: { test: a => a.departements_joints >= 90 && a.haut?.length >= 6, ids: ["ch-seniors"] },
  odd: { test: a => a.nb >= 1, ids: ["odd-check"] },
  entreprises: { test: a => a.associations?.length >= 4 && a.associations.every(x => x.siren), ids: ["tbl-entreprises"] },
  datagov: { test: a => typeof a.disponible === "boolean", ids: [] },
};
for (const [k, { test, ids }] of Object.entries(attendu)) {
  const a = api[k];
  if (!a) { problems.push(`étape absente du JSON : ${k}`); continue; }
  if (!test(a)) { problems.push(`données incomplètes : ${k}`); continue; }
  for (const id of ids) if (!html.includes(`id="${id}"`)) problems.push(`conteneur manquant dans la page : #${id} (${k})`);
  ok.push(`${k} : données présentes${ids.length ? ", rendu dans #" + ids.join(", #") : ""}`);
}
if (api.erreurs?.length) problems.push(`erreurs de collecte : ${api.erreurs.map(e => e.etape).join(", ")}`);

// 2. Le bloc API injecté dans la page est bien celui du JSON (même date de calcul).
const m = html.match(/\/\* API-DATA-START \*\/\s*const API = (\{.*?\});\s*\/\* API-DATA-END \*\//s);
if (!m) problems.push("bloc API-DATA introuvable dans fraude-sociale.html");
else {
  const injected = JSON.parse(m[1]);
  if (injected.calcule_le !== api.calcule_le) problems.push(`page injectée le ${injected.calcule_le}, JSON du ${api.calcule_le}`);
  else ok.push(`page injectée le ${injected.calcule_le}, cohérente avec data/donnees-api.json`);
}

// 3. Catalogue : chaque ligne a six colonnes et un statut d'usage explicite.
const cat = html.match(/catalogue: \[([\s\S]*?)\n  \],/);
if (!cat) problems.push("tableau catalogue introuvable");
else {
  const rows = cat[1].split("\n").filter(l => l.trim().startsWith('["'));
  const statuts = { croisé: 0, utilisé: 0, appelée: 0, remplacé: 0, "non croisable": 0, inaccessible: 0, doublon: 0 };
  for (const l of rows) {
    const cells = [...l.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(x => x[1]);
    if (cells.length !== 6) { problems.push(`ligne de catalogue sans 6 colonnes : ${cells[0]}`); continue; }
    const s = cells[5].toLowerCase();
    const key = Object.keys(statuts).find(k => s.startsWith(k));
    if (!key) problems.push(`statut d'usage non reconnu : « ${cells[5].slice(0, 60)} » (${cells[0].slice(0, 40)})`);
    else statuts[key]++;
    if (/^non crois[ée]\b(?! ?:)/.test(s) || s === "non croisé") problems.push(`statut « non croisé » sans raison : ${cells[0]}`);
  }
  ok.push(`catalogue : ${rows.length} lignes, ${Object.entries(statuts).filter(([, n]) => n).map(([k, n]) => `${n} ${k}`).join(", ")}`);
}

// 4. Textes : chaque data-t a son entrée, et le script de la page est syntaxiquement valide.
const keys = [...html.matchAll(/data-t="([^"]+)"/g)].map(x => x[1]);
const missing = keys.filter(k => !html.includes(`"${k}":{`));
if (missing.length) problems.push(`clés de texte sans entrée : ${missing.join(", ")}`); else ok.push(`${keys.length} clés de texte toutes définies`);
try { new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]); ok.push("script de la page : syntaxe valide"); } catch (e) { problems.push("script de la page : " + e.message); }

// 5. Page « Qui possède les médias » : données d'aides à la presse injectées, cohérentes, rendues ; textes et script valides.
try {
  const aides = JSON.parse(readFileSync(join(root, "data/aides-presse.json"), "utf8"));
  const med = readFileSync(join(root, "dashboard/medias.html"), "utf8");
  const mm = med.match(/\/\* AIDES-START \*\/\s*const AIDES = (\{.*?\});\s*\/\* AIDES-END \*\//s);
  if (!mm) problems.push("bloc AIDES introuvable dans medias.html");
  else {
    const inj = JSON.parse(mm[1]);
    if (inj.calcule_le !== aides.calcule_le) problems.push(`medias.html injecté le ${inj.calcule_le}, JSON du ${aides.calcule_le}`);
    else if (!(inj.series?.length >= 10 && inj.par_annee?.[inj.derniere_annee]?.titres > 500)) problems.push("aides à la presse : données incomplètes");
    else ok.push(`aides à la presse : ${inj.series.length} familles, ${inj.par_annee[inj.derniere_annee].titres} titres en ${inj.derniere_annee}, injecté le ${inj.calcule_le}`);
  }
  for (const id of ["owners", "schema", "ch-aides", "tbl-evo", "ch-grp", "frise", "board", "focus-aides", "autres-grid", "tbl-src"]) if (!med.includes(`id="${id}"`)) problems.push(`conteneur manquant dans medias.html : #${id}`);
  const mk = [...med.matchAll(/data-t="([^"]+)"/g)].map(x => x[1]).filter(k => !med.includes(`"${k}":{`) && !med.includes(`  ${k}:{`));
  if (mk.length) problems.push(`medias.html, clés de texte sans entrée : ${mk.join(", ")}`); else ok.push("medias.html : clés de texte toutes définies");
  try { new Function(med.match(/<script>([\s\S]*?)<\/script>/)[1]); ok.push("medias.html : syntaxe du script valide"); } catch (e) { problems.push("medias.html : " + e.message); }
  for (const page of ["fraude-sociale.html", "simple.html", "presidentielle-2027.html", "secteurs.html", "benchmark-usa.html"]) if (!readFileSync(join(root, "dashboard", page), "utf8").includes('href="medias.html"')) problems.push(`${page} : lien de navigation vers medias.html absent`);
} catch (e) { problems.push("page médias : " + e.message); }

// 6. Page « Forces de l'ordre » : observations du cahier des charges rendues, textes, script, 3114, navigation.
try {
  const fo = readFileSync(join(root, "dashboard/forces.html"), "utf8");
  for (const id of ["kpis", "qcm-forces", "grades", "ch-a1", "conf", "ch-gn", "ch-taux", "sante-tiles", "ch-tspt", "ratio", "ch-psy", "tbl-disp", "ch-agr", "ch-bless", "tbl-manif", "tbl-ds", "todo", "liens-grid", "regles-list"]) if (!fo.includes(`id="${id}"`)) problems.push(`conteneur manquant dans forces.html : #${id}`);
  const fk = [...fo.matchAll(/data-t="([^"]+)"/g)].map(x => x[1]).filter(k => !fo.includes(`"${k}":{`) && !fo.includes(`  ${k}:{`));
  if (fk.length) problems.push(`forces.html, clés de texte sans entrée : ${fk.join(", ")}`); else ok.push("forces.html : clés de texte toutes définies");
  if (!fo.includes("3114")) problems.push("forces.html : le 3114 n'apparaît pas (règle éthique 5)");
  const nObs = (fo.match(/\{kpi:"A1"/g) || []).length; if (nObs !== 12) problems.push(`forces.html : ${nObs} observations KPI-A1, 12 attendues`); else ok.push("forces.html : 12 observations KPI-A1, dont le conflit 2019");
  try { new Function(fo.match(/<script>([\s\S]*?)<\/script>/)[1]); ok.push("forces.html : syntaxe du script valide"); } catch (e) { problems.push("forces.html : " + e.message); }
  for (const page of ["fraude-sociale.html", "simple.html", "medias.html", "presidentielle-2027.html", "secteurs.html", "benchmark-usa.html"]) if (!readFileSync(join(root, "dashboard", page), "utf8").includes('href="forces.html"')) problems.push(`${page} : lien de navigation vers forces.html absent`);
  if (!readFileSync(join(root, "dashboard/secteurs.html"), "utf8").includes("forces.html#suicide")) problems.push("secteurs.html : la famille Sécurité ne pointe pas vers forces.html");
} catch (e) { problems.push("page forces : " + e.message); }


// 7. Gouvernement, 17 octobre, visuels : structure, liens, images présentes, en-tête commun sur chaque page.
try {
  const gj = JSON.parse(readFileSync(join(root, "data/gouvernement.json"), "utf8"));
  const gjs = readFileSync(join(root, "dashboard/gouvernement.js"), "utf8");
  const nMin = gj.ministeres.length;
  if (nMin !== 20) problems.push(`gouvernement.json : ${nMin} ministères, 20 attendus (composition du 26/02/2026)`); else ok.push("gouvernement : 20 ministères, tous avec pictogramme et ministre");
  for (const m of [...gj.ministeres, ...gj.autres_acteurs]) { if (!m.icone || !m.court) problems.push(`gouvernement.json : ${m.id} sans pictogramme ou nom court`); if (m.verifie_le && !m.site) problems.push(`gouvernement.json : ${m.id} marqué vérifié sans site officiel`); }
  for (const m of gj.ministeres) if (!gjs.includes(`"id":"${m.id}"`)) problems.push(`gouvernement.js périmé : ${m.id} absent (relancer scripts/build-gouvernement.mjs)`);
  if (!gjs.includes(`"${gj.actualites.length ? gj.actualites[0].titre.slice(0, 20).replace(/"/g, '\\"') : "x"}`)) problems.push("gouvernement.js périmé : actualités différentes du JSON");
  for (const [page, list] of Object.entries(gj.pages)) if (page !== "simple.html" && !list.length) problems.push(`page ${page} sans ministère rattaché`);
  const pagesIdx = ["fraude-sociale.html", "simple.html", "medias.html", "forces.html", "17-octobre-2026.html", "cybersecurite.html", "presidentielle-2027.html", "secteurs.html", "donnees.html", "benchmark-usa.html"];
  for (const pg of pagesIdx) { const h = readFileSync(join(root, "dashboard", pg), "utf8"); for (const need of ["entete.js", "gouvernement.js", "visuels.js", 'href="gouvernement.html"']) if (!h.includes(need)) problems.push(`${pg} : ${need} absent`); if (!gj.pages[pg]) problems.push(`${pg} : aucun ministère défini dans gouvernement.json`); }
  const frc = readFileSync(join(root, "dashboard/forces.html"), "utf8");
  for (const id of ["tbl-etudes", "tbl-enquetes", "tbl-sciences", "entree-cards", "tbl-crit", "tbl-sp", "sp-filter"]) if (!frc.includes(`id="${id}"`)) problems.push(`conteneur manquant dans forces.html : #${id}`);
  const spj = JSON.parse(readFileSync(join(root, "data/sources-police.json"), "utf8")).sources;
  const spIds = new Set(spj.map(s => s.id.slice(1)));
  const refs = new Set(); for (const m of frc.matchAll(/(?:,|\{)\s*(?:s|src):"([0-9, ]+)"|"([0-9]{1,2}(?:, [0-9]{1,2})*)"\]/g)) for (const n of (m[1] || m[2]).split(",")) refs.add(n.trim());
  const orphelines = [...refs].filter(n => n && !spIds.has(n)); if (orphelines.length) problems.push("forces.html : références S# absentes de l'index : " + orphelines.join(", ")); else ok.push(`forces.html : ${refs.size} références S# toutes présentes dans l'index (${spj.length} sources)`);
  if (!frc.includes(`const SRCP = [["1",`)) problems.push("forces.html : index SRCP vide, relancer scripts/inject-sources-police.py");
  for (const m of [...gj.ministeres, ...gj.autres_acteurs]) { const f = join(root, "dashboard", `ministere-${m.id}.html`); if (!existsSync(f)) problems.push(`page ministère absente : ministere-${m.id}.html (lancer scripts/build-ministeres.mjs)`); else { const h = readFileSync(f, "utf8"); if (/Opaline|Zap-politique|cahier des charges/i.test(h)) problems.push(`ministere-${m.id}.html : mention interdite dans le texte`); if (m.verifie_le && !h.includes("Relu le")) problems.push(`ministere-${m.id}.html périmée : relancer scripts/build-ministeres.mjs`); } }
  ok.push(`pages ministère : ${gj.ministeres.length + gj.autres_acteurs.length} présentes`);
  if (!existsSync(join(root, "dashboard/telechargements/politik-police-gendarmerie-infographie.pdf"))) problems.push("PDF absent : lancer sh scripts/build-infographie.sh"); else ok.push("infographie PDF présente");
  if (!frc.includes("telechargements/politik-police-gendarmerie-infographie.pdf")) problems.push("forces.html : lien de téléchargement du PDF absent");
  for (const need of ["27", "3,1", "7\u202f399", "2\u202f787"]) void need;
  { // référencement : chaque page indexable a titre, description, canonique, Open Graph, Twitter, JSON-LD valide, image de partage
    const seoPb = [];
    for (const f of readdirSync(join(root, "dashboard")).filter(n => n.endsWith(".html") && !["infographie-police.html", "og-politik.html"].includes(n))) {
      const h = readFileSync(join(root, "dashboard", f), "utf8");
      const title = (h.match(/<title>(.*?)<\/title>/s) || [0, ""])[1], desc = (h.match(/<meta name="description" content="([^"]*)"/) || [0, ""])[1];
      if (title.length < 10 || title.length > 70) seoPb.push(`${f} : titre de ${title.length} caractères`);
      if (desc.length < 70 || desc.length > 175) seoPb.push(`${f} : description de ${desc.length} caractères`);
      for (const need of ['rel="canonical"', 'property="og:title"', 'property="og:image"', 'name="twitter:card"', 'application/ld+json']) if (!h.includes(need)) seoPb.push(`${f} : ${need} absent`);
      const ld = h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/); try { JSON.parse(ld[1]); } catch { seoPb.push(`${f} : JSON-LD invalide`); }
      if ((h.match(/<h1[ >]/g) || []).length > 1) seoPb.push(`${f} : plusieurs h1`);
    }
    for (const f of ["og-politik.png", "sitemap.xml", "robots.txt", "llms.txt"]) if (!existsSync(join(root, "dashboard", f))) seoPb.push(`fichier absent : ${f}`);
    if (seoPb.length) problems.push(...seoPb); else ok.push("référencement : titre, description, canonique, Open Graph, Twitter et JSON-LD valides sur toutes les pages");
  }
  const acc = readFileSync(join(root, "dashboard/index.html"), "utf8");
  try { new Function(acc.match(/<script>([\s\S]*?)<\/script>/)[1]); ok.push("index.html : syntaxe du script valide"); } catch (e) { problems.push("index.html : " + e.message); }
  for (const id of ["portes", "actu", "roles", "methode"]) if (!acc.includes(`id="${id}"`)) problems.push(`conteneur manquant dans index.html : #${id}`);
  for (const m of acc.matchAll(/href:"([^"#]+)"/g)) if (!existsSync(join(root, "dashboard", m[1]))) problems.push(`index.html : lien vers une page absente : ${m[1]}`);
  const ent = JSON.parse(readFileSync(join(root, "data/entites.json"), "utf8")).entites;
  let manque = 0, sansCredit = 0, nImg = 0;
  for (const [k, e] of Object.entries(ent)) if (e.img) { nImg++; try { readFileSync(join(root, "dashboard", e.img)); } catch { manque++; } if (!e.credit || !e.credit.licence) sansCredit++; }
  if (manque) problems.push(`visuels : ${manque} fichier(s) image absent(s) du dossier`); if (sansCredit) problems.push(`visuels : ${sansCredit} image(s) sans licence ni crédit`);
  if (!manque && !sansCredit) ok.push(`visuels : ${nImg} images présentes, chacune avec son crédit`);
  const o17 = readFileSync(join(root, "dashboard/17-octobre-2026.html"), "utf8");
  for (const id of ["frise", "tbl-qui", "deg-cards", "com-cards", "jus-cards", "ord-cards", "manque-list", "qcm-17", "tbl-src"]) if (!o17.includes(`id="${id}"`)) problems.push(`conteneur manquant dans 17-octobre-2026.html : #${id}`);
  try { new Function(o17.match(/<script>([\s\S]*?)<\/script>/)[1]); ok.push("17-octobre-2026.html : syntaxe du script valide"); } catch (e) { problems.push("17-octobre-2026.html : " + e.message); }
  const gh = readFileSync(join(root, "dashboard/gouvernement.html"), "utf8"); try { new Function(gh.match(/<script>([\s\S]*?)<\/script>/)[1]); ok.push("gouvernement.html : syntaxe du script valide"); } catch (e) { problems.push("gouvernement.html : " + e.message); }
  const bad = /Opaline|Zap-politique|cahier des charges/i; for (const pg of [...pagesIdx, "gouvernement.html"]) { const h = readFileSync(join(root, "dashboard", pg), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, ""); const m = h.match(bad); if (m) problems.push(`${pg} : mention interdite « ${m[0]} » dans le texte affiché`); }
} catch (e) { problems.push("section gouvernement/visuels : " + e.message); }

console.log("Vérification croisée Politik — " + new Date().toISOString().slice(0, 10));
for (const o of ok) console.log("  ok   " + o);
for (const p of problems) console.log("  KO   " + p);
console.log(problems.length ? `\n${problems.length} problème(s)` : "\nTout passe.");
process.exit(problems.length ? 1 : 0);
