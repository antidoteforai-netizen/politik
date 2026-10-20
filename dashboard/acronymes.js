/* Politik — développe chaque sigle à sa première apparition dans la page.
   FALC : explication en mots simples. Termes de l'État : nom officiel complet (sauf sur la page
   fraude, qui a son glossaire cliquable : <script src="acronymes.js" data-etat="off">).
   Seul le premier sigle de la page est développé ; un sigle déjà suivi de « ( » ou précédé de « ( »
   est laissé tel quel. Mesure de départ (2026-10-20) : 3,3 sigles pour 100 mots sur « Comment va la
   France » en FALC, 2,3 sur « Qui possède les médias ». */
(function () {
  var D = {
    CAF: ["caisse d'allocations familiales", "la caisse qui verse les aides"],
    CNAF: ["Caisse nationale des allocations familiales", "les allocations familiales, au niveau national"],
    RSA: ["revenu de solidarité active", "l'aide pour les personnes sans revenu"],
    INSEE: ["Institut national de la statistique et des études économiques", "l'institut des chiffres de l'État"],
    DREES: ["direction de la recherche, des études, de l'évaluation et des statistiques", "le service des chiffres du ministère de la Santé"],
    OFPRA: ["Office français de protection des réfugiés et apatrides", "l'office qui examine les demandes d'asile"],
    SSMSI: ["service statistique ministériel de la sécurité intérieure", "le service des chiffres de la police"],
    DCPAF: ["direction centrale de la police aux frontières", "la police aux frontières"],
    DGEF: ["direction générale des étrangers en France", "le service des étrangers en France"],
    OQTF: ["obligation de quitter le territoire français", "l'ordre de quitter la France"],
    ONDAM: ["objectif national de dépenses d'assurance maladie", "le budget de la santé"],
    CNAV: ["Caisse nationale d'assurance vieillesse", "la caisse de retraite"],
    TNT: ["télévision numérique terrestre", "la télé gratuite par antenne"],
    ITT: ["incapacité totale de travail", "l'arrêt de travail"],
    IGPN: ["Inspection générale de la police nationale", "l'inspection de la police"],
    RBD: ["recensement des particuliers blessés ou décédés", "le fichier des blessés"],
    SSPO: ["service de soutien psychologique opérationnel", "le service de psychologues de la police"],
    CNRS: ["Centre national de la recherche scientifique", "le grand centre de recherche"],
    MGP: ["Mutuelle générale de la police", "la mutuelle de la police"],
    IFI: ["impôt sur la fortune immobilière", "l'impôt des personnes qui ont beaucoup de biens"],
    PISA: ["programme international pour le suivi des acquis des élèves", "un test international des élèves"],
    PIB: ["produit intérieur brut", "la richesse produite par le pays"],
    PLF: ["projet de loi de finances", "la loi du budget"],
    API: ["interface de programmation", "un moyen de lire les données par ordinateur"],
    UE: ["Union européenne", "l'Europe"],
    LCP: ["La Chaîne parlementaire", "la télé de l'Assemblée"],
    KPI: ["indicateur clé de performance", "un chiffre de suivi"]
  };
  var script = document.currentScript; var etatOff = script && script.getAttribute("data-etat") === "off";
  var keys = Object.keys(D), re = new RegExp("\\b(" + keys.join("|") + ")\\b", "g"), busy = false, timer = null;
  function skip(n) {
    var inSummary = false;
    for (var p = n.parentNode; p; p = p.parentNode) {
      if (p.nodeType !== 1) continue; var t = p.tagName;
      if (t === "SUMMARY") inSummary = true;
      if (t === "DETAILS" && !p.open && !inSummary) return true; /* contenu replié : le lecteur ne le voit pas */
      if (t === "SCRIPT" || t === "STYLE" || t === "BUTTON" || t === "SVG" || t === "svg" || t === "TITLE") return true;
      if (p.classList && (p.classList.contains("lvl") || p.classList.contains("grade") || p.classList.contains("term") || p.classList.contains("pill") || p.classList.contains("sous-sommaire"))) return true;
    }
    return false;
  }
  function apply() {
    if (busy) return; busy = true;
    var main = document.querySelector("main"); if (!main) { busy = false; return; }
    var falc = document.body.classList.contains("falc"); if (!falc && etatOff) { busy = false; return; }
    var seen = {}, w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = w.nextNode())) if (n.nodeValue.trim().length > 1 && !skip(n)) nodes.push(n);
    nodes.forEach(function (node) {
      var pe = node.parentNode;
      if (pe && pe.classList && pe.classList.contains("ent")) { /* nom décoré par visuels.js : l'explication va juste après */
        var t0 = node.nodeValue.trim(); if (D[t0] && !seen[t0]) { seen[t0] = true; var nx = pe.nextSibling; if (!(nx && nx.nodeValue && nx.nodeValue.indexOf(" (") === 0)) pe.parentNode.insertBefore(document.createTextNode(" (" + D[t0][falc ? 1 : 0] + ")"), pe.nextSibling); }
        return;
      }
      var s = node.nodeValue, out = "", last = 0, m; re.lastIndex = 0;
      while ((m = re.exec(s))) {
        var k = m[1], i = m.index, after = s.slice(i + k.length, i + k.length + 2), before = s.charAt(i - 1);
        if (seen[k]) continue;
        if (after.indexOf(" (") === 0 || before === "(") { seen[k] = true; continue; } /* déjà expliqué dans le texte */
        seen[k] = true;
        out += s.slice(last, i + k.length) + " (" + D[k][falc ? 1 : 0] + ")"; last = i + k.length;
      }
      if (last) node.nodeValue = out + s.slice(last);
    });
    busy = false;
  }
  function later() { clearTimeout(timer); timer = setTimeout(apply, 80); }
  function start() { apply(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
