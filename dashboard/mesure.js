/* Politik — mesure d'audience Cloudflare Web Analytics (sans cookie, sans empreinte numérique).
   Inactive tant que TOKEN est vide. Ne charge rien en local, ni si le navigateur envoie Do Not Track ou
   Global Privacy Control, ni pour un navigateur piloté par un robot (Playwright, tests : navigator.webdriver),
   ni pour qui s'exclut en ouvrant /?no-analytics=1 (ou localStorage.setItem("no-analytics","1") dans la console).
   Le jeton est public par conception (il figure dans le snippet de Cloudflare). */
(function () {
  /* Événements d'usage (clic sur une intention, réponse « Cette page vous a-t-elle aidé ? », sortie vers un site officiel) :
     Cloudflare compte chaque changement d'adresse comme une page vue. On passe donc brièvement par une adresse
     virtuelle /__a/… (rapport « Chemins », à filtrer sur ce préfixe), puis on revient à la vraie adresse avec la fonction
     d'origine (replaceState mémorisée avant le chargement du script de mesure), pour que ce retour ne soit pas compté une 2e fois.
     Sans mesure active (local, Do Not Track, no-analytics, robot) la fonction ne fait rien. */
  window.politikEvent = function () {};
  var TOKEN = "a41c769469684e7b911a431feb147e98";
  var HOSTS = ["politik-eta.vercel.app"];
  /* S'exclure sans console : ouvrir /?no-analytics=1 (retirer l'exclusion : /?no-analytics=0). Fonctionne aussi sur téléphone. */
  try { var q = new URLSearchParams(location.search).get("no-analytics"); if (q === "1") localStorage.setItem("no-analytics", "1"); else if (q === "0") localStorage.removeItem("no-analytics"); } catch (e) {}
  if (!TOKEN || HOSTS.indexOf(location.hostname) < 0) return;
  if (navigator.webdriver) return;
  try { if (localStorage.getItem("no-analytics")) return; } catch (e) {}
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true) return;
  var rs = History.prototype.replaceState;
  window.politikEvent = function (chemin) {
    try { var u = location.pathname + location.search + location.hash; history.replaceState(history.state, "", chemin); rs.call(history, history.state, "", u); } catch (e) {}
  };
  var s = document.createElement("script");
  s.type = "module"; s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: TOKEN }));
  document.head.appendChild(s);
})();
