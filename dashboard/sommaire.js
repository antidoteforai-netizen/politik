/* Politik — navigation commune : barre « Dans cette page » collante, section en cours surlignée, ancres qui
   ne se cachent plus sous le bandeau.
   Mesure de départ (2026-10-20) : sur les 6 pages, 43 sections sur 45 atterrissaient à 0 px, donc sous le bandeau
   collant de 59 à 62 px ; le sommaire restait derrière dès qu'on défilait ; rien n'indiquait la section en cours ;
   la page fraude n'avait aucun sommaire de ses sections et ses onglets de pôle ne suivaient pas le défilement.
   Fonctionnement :
   - pages à sommaire (.sous-sommaire) : la barre est sortie de l'en-tête pour devenir collante sous le bandeau ;
   - page fraude : une barre compacte fixe (pôles puis sections du pôle actif) apparaît dès que les grands onglets
     de pôle sont sortis de l'écran ;
   - html { scroll-padding-top } = hauteur des barres collantes : toute ancre, y compris scrollIntoView, atterrit
     visible ; la section en cours reçoit aria-current="location" ;
   - lien d'évitement « Aller au contenu » (visible au clavier). */
(function () {
  var D = document, R = D.documentElement;
  var CSS = [
    "html{scroll-padding-top:calc(var(--sticky-h,72px) + 14px)}",
    "@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}",
    ".skip{position:absolute;left:12px;top:-60px;z-index:30;background:var(--ink);color:var(--paper);padding:8px 12px;border-radius:8px;font-weight:600;text-decoration:none}.skip:focus{top:8px}",
    ".sous-sommaire.subbar,.subbar-row{display:flex;flex-wrap:nowrap;gap:6px;align-items:center;overflow-x:auto;scrollbar-width:none;margin:0;padding:7px max(16px,calc((100% - 1120px)/2 + 16px));white-space:nowrap;position:relative}",
    ".sous-sommaire.subbar{position:sticky;top:var(--nav-h,59px);z-index:8;background:color-mix(in srgb,var(--paper) 94%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}",
    ".subbar-label{flex:none;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--ink-2);margin-right:6px;display:inline-flex;align-items:center;gap:6px}",
    ".subbar-label:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--accent)}",
    ".subbar a,.subbar button{flex:none;font:inherit;font-size:.86rem;font-weight:500;min-height:34px;display:inline-flex;align-items:center;padding:5px 13px;border:1px solid var(--line);border-radius:999px;background:var(--surface);color:var(--ink-2);text-decoration:none;cursor:pointer}",
    ".subbar a:hover,.subbar button:hover,.subbar a:focus-visible,.subbar button:focus-visible{border-color:var(--accent);color:var(--accent-ink);outline:none}",
    ".subbar a:focus-visible,.subbar button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}",
    ".sous-sommaire.subbar{background-image:linear-gradient(var(--accent),var(--accent));background-repeat:no-repeat;background-position:0 100%;background-size:calc(var(--p,0)*100%) 3px}",
".sous-sommaire.subbar .subbar-label{position:sticky;left:0;z-index:1;min-width:10.5em;padding-right:10px;background:var(--paper);font-variant-numeric:tabular-nums;color:var(--ink)}",
".subbar a[aria-current]{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 35%,transparent)}",
".subbar [aria-current],.subbar button[aria-pressed=\"true\"]{background:var(--ink);border-color:var(--ink);color:var(--paper);font-weight:700}",
    "@media (pointer:coarse){.subbar a,.subbar button{min-height:44px;padding-inline:16px}}",
    ".subbar.ov,.subbar-row.ov{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 18px,#000 calc(100% - 34px),transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 18px,#000 calc(100% - 34px),transparent 100%)}",
    ".subbar-fixed{position:fixed;top:var(--nav-h,59px);left:0;right:0;z-index:8;background:color-mix(in srgb,var(--paper) 94%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);visibility:hidden}",
    ".subbar-fixed.on{visibility:visible}",
    ".subbar-fixed .subbar-row{padding-block:5px}",
    ".subbar-fixed .subbar-row+.subbar-row{padding-top:0;padding-bottom:7px}",
    "@media print{.subbar,.subbar-fixed,.skip{display:none!important}}",
    "body.falc .subbar a,body.falc .subbar button{font-size:.95rem}"
  ].join("\n");
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function init() {
    var nav = D.querySelector(".nav"); if (!nav) return;
    var st = D.createElement("style"); st.textContent = CSS; D.head.appendChild(st);
    var main = D.querySelector("main"); if (main && !main.id) main.id = "contenu";
    var skip = D.createElement("a"); skip.className = "skip"; skip.href = "#" + (main ? main.id : "top"); skip.textContent = "Aller au contenu"; D.body.insertBefore(skip, D.body.firstChild);

    var tabsEl = D.getElementById("poletabs"), isIndex = !!tabsEl, bar = null, links = [];
    if (isIndex) {
      bar = D.createElement("nav"); bar.className = "subbar subbar-fixed"; bar.setAttribute("aria-label", "Dans cette page");
      bar.innerHTML = '<div class="subbar-row" data-row="poles"></div><div class="subbar-row" data-row="secs"></div>';
      nav.insertAdjacentElement("afterend", bar);
    } else {
      var side = D.querySelector(".sous-sommaire");
      if (side) { nav.insertAdjacentElement("afterend", side); side.classList.add("subbar"); var lab = D.createElement("span"); lab.className = "subbar-label"; lab.textContent = "Dans cette page"; side.insertBefore(lab, side.firstChild); bar = side; links = [].slice.call(side.querySelectorAll("a[href^='#']")); }
    }

    function vars() {
      var nh = nav.getBoundingClientRect().height, bh = bar ? bar.getBoundingClientRect().height : 0;
      R.style.setProperty("--nav-h", nh + "px"); R.style.setProperty("--sticky-h", (nh + bh) + "px");
    }
    function buildIndex() {
      var tabs = [].slice.call(D.querySelectorAll("#poletabs button[data-pole]")); if (!tabs.length) return;
      var rowP = bar.querySelector("[data-row=poles]"), rowS = bar.querySelector("[data-row=secs]");
      rowP.innerHTML = tabs.map(function (b) { var nm = ((b.querySelector('.pt') || {}).textContent || (b.firstChild && b.firstChild.nodeValue) || b.textContent).trim(); return '<button type="button" data-pole="' + esc(b.dataset.pole) + '" aria-pressed="' + (b.getAttribute("aria-selected") === "true") + '">' + esc(nm) + "</button>"; }).join("");
      var act = tabs.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
      var pole = D.querySelector('.pole[data-pole="' + act.dataset.pole + '"]'); if (!pole) return;
      var labels = ((act.querySelector(".ps") || act.querySelector("small") || {}).textContent || "").split(" · ");
      var secs = [].slice.call(pole.querySelectorAll(":scope > section[id]"));
      rowS.innerHTML = secs.map(function (s, i) { return '<a href="#' + s.id + '">' + esc((labels[i] || (s.querySelector("h2") || {}).textContent || s.id).trim()) + "</a>"; }).join("");
      links = [].slice.call(rowS.querySelectorAll("a"));
    }
    function center(a) { var p = a.parentNode; if (p.scrollWidth <= p.clientWidth) return; p.scrollTo({ left: a.offsetLeft - (p.clientWidth - a.offsetWidth) / 2, behavior: "auto" }); }
    var ticking = false;
    function spy() {
      ticking = false;
      var sh = parseFloat(getComputedStyle(R).getPropertyValue("--sticky-h")) || 72, cur = null;
      links.forEach(function (a) { var t = D.getElementById(a.getAttribute("href").slice(1)); if (!t) return; var r = t.getBoundingClientRect(); if (r.height > 0 && r.top <= sh + 30) cur = a; });
      if (!isIndex && bar && lab) {
        var n = cur ? links.indexOf(cur) + 1 : 0, dh = D.documentElement.scrollHeight - innerHeight;
        lab.textContent = cur ? "Vous êtes ici " + n + "/" + links.length : "Dans cette page";
        bar.style.setProperty("--p", dh > 0 ? Math.min(1, Math.max(0, scrollY / dh)).toFixed(4) : 0);
      }
      links.forEach(function (a) { if (a === cur) { if (a.getAttribute("aria-current") !== "location") { a.setAttribute("aria-current", "location"); center(a); } } else a.removeAttribute("aria-current"); });
      if (isIndex) bar.classList.toggle("on", tabsEl.getBoundingClientRect().bottom <= nav.getBoundingClientRect().height + 4);
    }
    function tick() { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }

    if (isIndex) {
      buildIndex();
      new MutationObserver(function () { buildIndex(); vars(); tick(); }).observe(tabsEl, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
      bar.querySelector("[data-row=poles]").addEventListener("click", function (e) {
        var b = e.target.closest("button[data-pole]"); if (!b) return;
        var big = tabsEl.querySelector('button[data-pole="' + b.dataset.pole + '"]'); if (big) big.click();
        setTimeout(function () { var first = D.querySelector('.pole[data-pole="' + b.dataset.pole + '"] > section[id]'); if (first) first.scrollIntoView({ block: "start" }); }, 30);
      });
    }
    function ov() { [].forEach.call(D.querySelectorAll(".subbar, .subbar-row"), function (e) { var o = e.scrollWidth > e.clientWidth + 2; e.classList.toggle("ov", o); if (o) e.setAttribute("tabindex", "0"); else if (e.getAttribute("tabindex") === "0") e.removeAttribute("tabindex"); }); }
    D.addEventListener("keydown", function (e) {
      var a = D.activeElement, row = a && a.closest && a.closest(".subbar, .subbar-row"); if (!row || (a.tagName !== "A" && a.tagName !== "BUTTON")) return;
      if (["ArrowRight", "ArrowLeft", "Home", "End"].indexOf(e.key) < 0) return;
      var items = [].slice.call(row.querySelectorAll("a, button")), i = items.indexOf(a); if (i < 0) return; e.preventDefault();
      var n = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : Math.max(0, Math.min(items.length - 1, i + (e.key === "ArrowRight" ? 1 : -1))); items[n].focus();
    });
    vars(); spy(); ov(); window.addEventListener("resize", ov); if (D.fonts && D.fonts.ready) D.fonts.ready.then(ov);
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", function () { vars(); tick(); });
    if (window.ResizeObserver) { var ro = new ResizeObserver(function () { vars(); tick(); }); ro.observe(nav); if (bar) ro.observe(bar); }
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { vars(); tick(); });
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", init); else init();
})();
