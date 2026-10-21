/* Politik — mesure d'audience Cloudflare Web Analytics (sans cookie, sans empreinte numérique).
   Inactive tant que TOKEN est vide. Ne charge rien en local, ni si le navigateur envoie Do Not Track ou
   Global Privacy Control, ni pour un navigateur piloté par un robot (Playwright, tests : navigator.webdriver),
   ni pour qui s'exclut en tapant localStorage.setItem("no-analytics","1") dans la console de son navigateur.
   Le jeton est public par conception (il figure dans le snippet de Cloudflare). */
(function () {
  var TOKEN = "a41c769469684e7b911a431feb147e98";
  var HOSTS = ["politik-eta.vercel.app"];
  if (!TOKEN || HOSTS.indexOf(location.hostname) < 0) return;
  if (navigator.webdriver) return;
  try { if (localStorage.getItem("no-analytics")) return; } catch (e) {}
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true) return;
  var s = document.createElement("script");
  s.type = "module"; s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: TOKEN }));
  document.head.appendChild(s);
})();
