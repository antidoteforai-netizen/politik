#!/usr/bin/env node
/* Publie data/positions-2027.json (positions sourcées des candidats) sous deux formes :
   - dashboard/positions-2027.json : données ouvertes, téléchargeables ;
   - dashboard/positions-2027.js   : window.POS2027, lu par comparer-2027.html et presidentielle-2027.html.
   Règle de contrôle : chaque entrée porte un texte, un lien https, une source, une date et un niveau (V ou S) ;
   une « absence » ne porte que la mention de la source. Sort en 1 si une entrée est incomplète.
     node Politik/scripts/build-positions.mjs */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const d = JSON.parse(readFileSync(join(root, "data/positions-2027.json"), "utf8"));
const pb = [];
for (const [cand, subs] of Object.entries(d.positions)) for (const [s, list] of Object.entries(subs)) for (const e of list) {
  const w = `${cand}/${s}`;
  if (!e.t || !/^https:\/\//.test(e.u || "") || !e.s || !e.d) pb.push(`${w} : entrée incomplète`);
  if (!e.absent && !["V", "S"].includes(e.n)) pb.push(`${w} : niveau absent`);
  if (/Opaline|Zap-politique|DEC-\d|cahier des charges/i.test(JSON.stringify(e))) pb.push(`${w} : mention interne`);
  if (e.t && e.t.length > 420) pb.push(`${w} : citation trop longue`);
}
if (pb.length) { console.error(pb.join("\n")); process.exit(1); }
const json = JSON.stringify(d, null, 1);
writeFileSync(join(root, "dashboard/positions-2027.json"), json + "\n");
writeFileSync(join(root, "dashboard/positions-2027.js"), "/* Généré par scripts/build-positions.mjs depuis data/positions-2027.json. Ne pas éditer. */\nwindow.POS2027 = " + JSON.stringify(d) + ";\n");
const n = Object.values(d.positions).flatMap(c => Object.values(c)).flat().filter(e => !e.absent).length;
console.log(`OK : ${n} positions sourcées, ${Object.keys(d.positions).length} candidats`);
