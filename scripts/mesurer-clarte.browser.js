/* Politik — mesure de lisibilité des pages, dans les deux niveaux (Termes de l'État, FALC).
   Se colle dans la console d'une page servie en http (ex. http://127.0.0.1:8765/donnees.html), ou s'exécute
   via un outil d'automatisation de navigateur. Charge chaque page dans un iframe, bascule le niveau, mesure.
   Sortie : une ligne par page et par niveau.

   Mesures (texte courant seulement : sans tableaux, graphiques, boutons, pastilles, sources) :
   - phrase moyenne, part de phrases > 15 mots (cible FALC : moins de 10 %), > 20 mots (cible État : moins de 25 %) ;
   - indice de Kandel-Moles (adaptation française de Flesch : 207 - 1,015 x mots/phrase - 73,6 x syllabes/mot ;
     plus c'est haut, plus c'est facile ; 60 à 70 = standard, au-dessus de 80 = facile). Syllabes estimées par
     groupes de voyelles : approximation, utile pour comparer deux versions, pas comme valeur absolue ;
   - sigles développés : pour chaque sigle du dictionnaire d'acronymes.js présent dans le texte VISIBLE, au moins une
     occurrence est suivie ou précédée d'une parenthèse (cible : tous) ;
   - pastilles V/S/D/A et lignes de lecture « Ce qu'on voit ».
   Pièges déjà rencontrés (voir LEARNINGS) : un clone hors du DOM perd les <br> et innerText, donc des phrases FALC
   paraissent collées ; un tableau dans <details> fermé est invisible, donc ne compte pas comme « vu ». */
async () => {
  const KEYS = "CAF CNAF RSA INSEE DREES OFPRA SSMSI DCPAF DGEF OQTF ONDAM CNAV TNT ITT IGPN RBD SSPO CNRS MGP IFI PISA PIB PLF API UE LCP KPI".split(" ");
  const PAGES = [["index.html", "Fraude sociale"], ["medias.html", "Médias"], ["forces.html", "Forces de l'ordre"], ["presidentielle-2027.html", "Présidentielle 2027"], ["secteurs.html", "Comment va la France"], ["donnees.html", "Sources et données"]];
  const V = "aeiouyàâäéèêëîïôöùûüÿœæ";
  const syll = w => { w = w.toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüÿœæç]/g, ""); if (!w) return 0; const m = w.replace(new RegExp("(?:[^" + V + "]es|ed|[^" + V + "]e)$"), "").match(new RegExp("[" + V + "]+", "g")); return Math.max(1, m ? m.length : 1); };
  const load = (file, level) => new Promise(res => { const f = document.createElement("iframe"); f.style.cssText = "position:fixed;left:-9999px;width:1200px;height:900px"; f.src = file; f.onload = () => setTimeout(() => { const d = f.contentDocument; const b = d.querySelector('#switch button[data-level="' + level + '"]'); if (b && b.getAttribute("aria-pressed") !== "true") b.click(); setTimeout(() => res(f), 700); }, 500); document.body.appendChild(f); });
  const rows = [];
  for (const [file, name] of PAGES) for (const level of ["etat", "falc"]) {
    const f = await load(file, level), d = f.contentDocument, main = d.querySelector("main") || d.body, vis = main.innerText;
    const clone = main.cloneNode(true);
    clone.querySelectorAll("script,style,table,svg,.tbl,.hbar,.cols,details,nav,.sous-sommaire,.chips,button,.lvl,.grade,.pill,.src,.tip,.muted.small").forEach(e => e.remove());
    clone.querySelectorAll("br").forEach(b => b.replaceWith("\n"));
    const text = [...clone.querySelectorAll("p,li,h1,h2,h3,.lede,.lecture,.def,.kind")].map(e => e.textContent.replace(/[ \t]+/g, " ").trim()).filter(t => t.length > 3).join("\n");
    const sents = text.split(/\n|(?<=[.!?…])\s+|(?<=[.!?:])(?=[A-ZÉÈ«?])/).map(s => s.trim()).filter(s => s.split(/\s+/).length >= 3);
    const words = text.split(/\s+/).filter(w => /[a-zA-Zàâéèêîôûç]/.test(w));
    const lens = sents.map(s => s.split(/\s+/).length), asl = lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length), asw = words.reduce((s, w) => s + syll(w), 0) / Math.max(1, words.length);
    let ex = 0, pr = 0; const un = [];
    for (const k of KEYS) { const m = [...vis.matchAll(new RegExp("\\b" + k + "\\b", "g"))]; if (!m.length) continue; pr++; (m.some(x => vis.slice(x.index + k.length, x.index + k.length + 2) === " (" || vis.charAt(x.index - 1) === "(")) ? ex++ : un.push(k); }
    rows.push(`${name} | ${level} | mots ${words.length} | phrase moy. ${asl.toFixed(1)} | >15 mots ${Math.round(lens.filter(l => l > 15).length / Math.max(1, lens.length) * 100)} % | >20 mots ${Math.round(lens.filter(l => l > 20).length / Math.max(1, lens.length) * 100)} % | Kandel-Moles ${Math.round(207 - 1.015 * asl - 73.6 * asw)} | sigles développés ${ex}/${pr}${un.length ? " (manque " + un.join(" ") + ")" : ""} | pastilles ${main.querySelectorAll(".lvl").length} | lignes de lecture ${main.querySelectorAll(".lecture").length}`);
    f.remove();
  }
  return rows;
}
