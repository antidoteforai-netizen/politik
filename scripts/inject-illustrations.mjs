#!/usr/bin/env node
/* Injecte data/illustrations.json (images Pixabay) dans dashboard/donnees.html entre /* ILLU-START *​/ et /* ILLU-END *​/. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const d = JSON.parse(readFileSync(join(root, "data/illustrations.json"), "utf8"));
const USAGE = { hero: "Hero de l'accueil et image de partage", ministeres: "Menu : Ministères", fraude: "Menu : Fraude sociale", police: "Menu : Police et gendarmerie", cyber: "Menu : Cybersécurité", france: "Menu : Comment va la France", medias: "Menu : Qui possède les médias", oct17: "Menu : Le 17 octobre 2026", election: "Menu : Présidentielle 2027", usa: "Menu : Benchmark États-Unis", donnees: "Menu : Sources et données" };
const rows = d.images.map(i => [i.id, USAGE[i.id] || i.id, i.fichier, i.pixabay_id, i.page]);
const p = join(root, "dashboard/donnees.html"); let h = readFileSync(p, "utf8");
const block = "/* ILLU-START */\nconst ILLU = " + JSON.stringify(rows) + ";\n/* ILLU-END */";
if (!h.includes("/* ILLU-START */")) { console.error("marqueurs absents de donnees.html"); process.exit(1); }
h = h.replace(/\/\* ILLU-START \*\/[\s\S]*?\/\* ILLU-END \*\//, () => block);
writeFileSync(p, h, "utf8"); console.log(`OK : ${rows.length} illustrations injectées dans donnees.html`);
