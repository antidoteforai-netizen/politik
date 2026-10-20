// Politik — assemble data/gouvernement.json en dashboard/gouvernement.js (window.GOUV), lu par entete.js et gouvernement.html.
//   node Politik/scripts/build-gouvernement.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const d = JSON.parse(readFileSync(join(root, "data/gouvernement.json"), "utf8"));
const ids = new Set([...d.ministeres, ...d.autres_acteurs].map(m => m.id));
const problemes = [];
for (const [page, list] of Object.entries(d.pages)) for (const id of list) if (!ids.has(id)) problemes.push(`page ${page} : ministère inconnu « ${id} »`);
for (const a of d.actualites) { for (const id of a.ministeres) if (!ids.has(id)) problemes.push(`actualité « ${a.titre.slice(0, 40)} » : ministère inconnu « ${id} »`); if (!/^https?:\/\//.test(a.url)) problemes.push(`actualité sans lien : ${a.titre.slice(0, 40)}`); if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date)) problemes.push(`actualité sans date valide : ${a.titre.slice(0, 40)}`); }
if (problemes.length) { console.error(problemes.join("\n")); process.exit(1); }
const verifies = [...d.ministeres, ...d.autres_acteurs].filter(m => m.verifie_le).length;
writeFileSync(join(root, "dashboard/gouvernement.js"), `/* Politik — structure du Gouvernement, généré par scripts/build-gouvernement.mjs depuis data/gouvernement.json. Ne pas éditer. */\nwindow.GOUV = ${JSON.stringify(d)};\n`);
console.log(`OK : ${d.ministeres.length} ministères + ${d.autres_acteurs.length} autre acteur, ${verifies} vérifiés sur leur site officiel, ${d.actualites.length} actualités ; dashboard/gouvernement.js écrit`);
