// Génère simple.html à partir de index.html : même page, niveau par défaut « Simple » au lieu de
// « Termes de l'État », lien croisé inversé. Lancer : node Politik/dashboard/build-simple.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(dir, "index.html"), "utf8");

const replacements = [
  ['const PAGE_LEVELS = ["etat","falc"];', 'const PAGE_LEVELS = ["simple","falc"];'],
  ["<title>Politik</title>", "<title>Politik simple</title>"],
  ['<a class="other-version" id="other-version" href="simple.html">Version simple</a>',
   '<a class="other-version" id="other-version" href="index.html">Version termes de l\'État</a>'],
];
let out = src;
for (const [a, b] of replacements) {
  if (!out.includes(a)) { console.error("Marqueur introuvable :", a); process.exit(1); }
  out = out.replace(a, b);
}
writeFileSync(join(dir, "simple.html"), out);
console.log("simple.html généré depuis index.html");
