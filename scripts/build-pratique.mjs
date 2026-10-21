#!/usr/bin/env node
/* Contenu pratique (logement, travail, consommation, famille) : data/pratique.json → dashboard/pratique.js (window.PRATIQUE),
   et data/populaires.json → dashboard/populaires.js (window.POPULAIRES). Lus par l'accueil et par demarches.html.
   Règle de contrôle : chaque phrase est copiée d'un site officiel (lien https, source, date de vérification de la fiche) ;
   aucune mention interne ; une phrase tient en 520 caractères au plus. Sort en 1 si une entrée est incomplète.
     node Politik/scripts/build-pratique.mjs */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const d = JSON.parse(readFileSync(join(root, "data/pratique.json"), "utf8"));
const pb = [];
const verif = (e, w) => {
  if (!e.t || e.t.length > 520) pb.push(`${w} : phrase absente ou trop longue`);
  if (!/^https:\/\//.test(e.u || "")) pb.push(`${w} : lien https absent`);
  if (!e.s || !e.d) pb.push(`${w} : source ou date absente`);
  if (/Opaline|Zap-politique|DEC-\d|cahier des charges/i.test(JSON.stringify(e))) pb.push(`${w} : mention interne`);
};
for (const s of d.sujets) {
  for (const k of ["droits", "demarches", "numeros"]) for (const [i, e] of (s[k] || []).entries()) verif(e, `${s.id}/${k}/${i}`);
  if (!s.droits?.length || !s.demarches?.length) pb.push(`${s.id} : au moins un droit et une démarche`);
}
if (pb.length) { console.error(pb.join("\n")); process.exit(1); }
writeFileSync(join(root, "dashboard/pratique.js"), "/* Généré par scripts/build-pratique.mjs depuis data/pratique.json. Ne pas éditer. */\nwindow.PRATIQUE = " + JSON.stringify(d) + ";\n");
let msg = `OK : ${d.sujets.length} sujets, ${d.sujets.reduce((n, s) => n + s.droits.length + s.demarches.length + (s.numeros || []).length, 0)} éléments sourcés`;
const pop = join(root, "data/populaires.json");
if (existsSync(pop)) {
  const p = JSON.parse(readFileSync(pop, "utf8"));
  if (!p.service_public?.plus_lues?.length || !p.datagouv?.jeux?.length) { console.error("populaires.json incomplet"); process.exit(1); }
  writeFileSync(join(root, "dashboard/populaires.js"), "/* Généré par scripts/build-pratique.mjs depuis data/populaires.json. Ne pas éditer. */\nwindow.POPULAIRES = " + JSON.stringify(p) + ";\n");
  msg += `, ${p.service_public.plus_lues.length} fiches les plus lues, ${p.datagouv.jeux.length} jeux de données`;
}
console.log(msg);
