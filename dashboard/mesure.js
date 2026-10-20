/* Politik — mesure d'audience Cloudflare Web Analytics (sans cookie, sans empreinte numérique).
   Inactive tant que TOKEN est vide. Ne charge rien en local, ni si le navigateur envoie Do Not Track ou
   Global Privacy Control. Le jeton est public par conception (il figure dans le snippet de Cloudflare). */
(function () {
  var TOKEN = "";
  var HOSTS = ["politik-eta.vercel.app"];
  if (!TOKEN || HOSTS.indexOf(location.hostname) < 0) return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true) return;
  var s = document.createElement("script");
  s.defer = true; s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: TOKEN }));
  document.head.appendChild(s);
})();
