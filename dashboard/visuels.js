/* Politik — photos des personnes citées et logos des institutions, médias et entreprises.
   Lit window.ENTITES (dashboard/entites.js, généré par scripts/fetch-visuels.py ; images servies depuis img/ent/).
   - Première mention de chaque entité dans chaque section : petit avatar (rond pour une personne, carré arrondi
     pour un logo) à côté du nom. Traitement identique pour tous (même taille, même cadrage, ordre inchangé).
   - Survol, focus clavier ou toucher : fiche avec l'image, le nom, la description Wikipédia, le lien et le crédit
     (auteur et licence) de l'image.
   - Les images ne sont jamais chargées depuis un autre site. Une photo non libre est écartée à la collecte :
     sans image libre, le nom reste sans avatar.
   Expose window.Ent = { img(slug), nom(slug), avatar(slug, taille) } pour les pages (cartes, schéma). */
(function () {
  var E = window.ENTITES; if (!E) return;
  var CSS = [
    ".ent{border-bottom:1px dotted var(--ink-3);cursor:help;white-space:normal}",
    ".ent:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}",
    ".ent-i{display:inline-block;width:1.3em;height:1.3em;vertical-align:-.3em;margin-right:.3em;object-fit:cover;border:1px solid var(--line);background:#fff}",
    ".ent-i.personne{border-radius:50%}",
    ".ent-i.logo{border-radius:5px;object-fit:contain;padding:1px}",
    ".ent-av{flex:none;width:44px;height:44px;border:1px solid var(--line);background:#fff;object-fit:cover}",
    ".ent-av.personne{border-radius:50%}",
    ".ent-av.ini{display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);color:var(--accent-ink);font-weight:700;font-size:.9rem}",
    ".ent-av.logo{border-radius:10px;object-fit:contain;padding:3px}",
    ".entcard{position:fixed;z-index:40;width:min(320px,calc(100vw - 24px));background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:14px;padding:14px;box-shadow:0 18px 40px -20px rgba(20,26,43,.4);display:grid;grid-template-columns:64px 1fr;gap:12px}",
    ".entcard img{width:64px;height:64px;object-fit:cover;border:1px solid var(--line);background:#fff}",
    ".entcard img.personne{border-radius:50%}.entcard img.logo{border-radius:12px;object-fit:contain;padding:4px}",
    ".entcard b{display:block;font-family:var(--font-display);font-size:1rem;line-height:1.2}",
    ".entcard .t{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--accent-ink);font-weight:600}",
    ".entcard p{margin:4px 0 0;font-size:.84rem;color:var(--ink-2);line-height:1.35}",
    ".entcard a{font-size:.82rem}",
    ".entcard .cr{grid-column:1/-1;font-size:.72rem;color:var(--ink-3);border-top:1px dashed var(--line);padding-top:8px;line-height:1.3}",
    "@media print{.entcard{display:none}}"
  ].join("\n");
  var TYPE = { personne: "Personne", institution: "Institution", media: "Média", entreprise: "Entreprise" };
  var list = [], alias = {};
  Object.keys(E).forEach(function (slug) { var e = E[slug]; if (!e.img) return; e.alias.forEach(function (a) { alias[a.toLowerCase()] = slug; }); });
  var names = Object.keys(alias).sort(function (a, b) { return b.length - a.length; });
  function rx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var RE = names.length ? new RegExp("(?<![\\p{L}\\p{N}_-])(" + names.map(rx).join("|") + ")(?![\\p{L}\\p{N}_-])", "giu") : null;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function img(slug) { return E[slug] && E[slug].img || null; }
  function slugify(n) { return String(n).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function avatar(slug, size, nom) { var e = E[slug]; if (!e || !e.img) { if (!nom) return ""; var ini = String(nom).split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(""); return '<span class="ent-av personne ini" style="width:' + (size || 44) + 'px;height:' + (size || 44) + 'px" aria-hidden="true">' + esc(ini) + "</span>"; } return '<img class="ent-av ' + (e.type === "personne" ? "personne" : "logo") + '" src="' + esc(e.img) + '" alt="" width="' + (size || 44) + '" height="' + (size || 44) + '" loading="lazy">'; }
  window.Ent = { slug: slugify, img: img, nom: function (s) { return E[s] && E[s].nom; }, avatar: avatar };

  var card = null, owner = null;
  function show(el) {
    var slug = el.getAttribute("data-ent"), e = E[slug]; if (!e) return; hide();
    var cr = e.credit || {};
    card = document.createElement("div"); card.className = "entcard"; card.setAttribute("role", "tooltip");
    card.innerHTML = '<img class="' + (e.type === "personne" ? "personne" : "logo") + '" src="' + esc(e.img) + '" alt=""><div><span class="t">' + (TYPE[e.type] || "") + "</span><b>" + esc(e.nom) + "</b>" + (e.desc ? "<p>" + esc(e.desc) + "</p>" : "") + (e.wiki ? '<a href="' + esc(e.wiki) + '" target="_blank" rel="noopener">Wikipédia</a>' : "") + '</div><div class="cr">' + (cr.type_image === "photo" ? "Photo" : "Logo") + " : " + (cr.auteur ? esc(cr.auteur) + ", " : "") + esc(cr.licence || "") + (cr.source ? ' · <a href="' + esc(cr.source) + '" target="_blank" rel="noopener">fichier source</a>' : "") + "</div>";
    document.body.appendChild(card); owner = el;
    var r = el.getBoundingClientRect(), w = card.offsetWidth, h = card.offsetHeight;
    var left = Math.max(12, Math.min(r.left, window.innerWidth - w - 12)), top = r.bottom + 8; if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);
    card.style.left = left + "px"; card.style.top = top + "px"; el.setAttribute("aria-describedby", "entcard-live"); card.id = "entcard-live";
  }
  function hide() { if (card) { card.remove(); card = null; } if (owner) { owner.removeAttribute("aria-describedby"); owner = null; } }

  function skip(n) {
    for (var p = n.parentNode; p; p = p.parentNode) {
      if (p.nodeType !== 1) continue; var t = p.tagName;
      if (t === "SCRIPT" || t === "STYLE" || t === "BUTTON" || t === "A" || t === "SVG" || t === "svg" || t === "TITLE" || t === "NAV" || t === "H1" || t === "H2" || t === "H3" || t === "TH" || t === "SUMMARY") return true;
      if (t === "DETAILS" && !p.open) return true;
      if (p.hasAttribute("data-noent")) return true;
      var c = p.classList; if (c && (c.contains("ent") || c.contains("lvl") || c.contains("grade") || c.contains("term") || c.contains("eg") || c.contains("subbar") || c.contains("sous-sommaire") || c.contains("qcm") || c.contains("src") || c.contains("kind") || c.contains("entcard") || c.contains("pill") || c.contains("eyebrow") || c.contains("who") || c.contains("officiel") || c.contains("d") || c.contains("head"))) return true;
    }
    return false;
  }
  var busy = false, timer = null;
  function apply() {
    if (busy || !RE) return; busy = true;
    var scopes = [].slice.call(document.querySelectorAll("header.hero, main section[id]"));
    scopes.forEach(function (sc) {
      var done = {}; [].forEach.call(sc.querySelectorAll(".ent[data-ent]"), function (x) { done[x.getAttribute("data-ent")] = true; });
      var w = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT, null), nodes = [], n;
      while ((n = w.nextNode())) if (n.nodeValue.trim().length > 2 && !skip(n)) nodes.push(n);
      nodes.forEach(function (node) {
        var s = node.nodeValue, last = 0, frag = null, m; RE.lastIndex = 0;
        while ((m = RE.exec(s))) {
          var slug = alias[m[1].toLowerCase()]; if (!slug || done[slug]) continue; done[slug] = true;
          if (!frag) frag = document.createDocumentFragment();
          if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
          var sp = document.createElement("span"); sp.className = "ent"; sp.setAttribute("data-ent", slug); sp.tabIndex = 0; sp.setAttribute("role", "button");
          var im = document.createElement("img"); im.className = "ent-i " + (E[slug].type === "personne" ? "personne" : "logo"); im.src = E[slug].img; im.alt = ""; im.loading = "lazy";
          sp.appendChild(im); sp.appendChild(document.createTextNode(m[1])); frag.appendChild(sp); last = m.index + m[1].length;
        }
        if (frag) { if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last))); node.parentNode.replaceChild(frag, node); }
      });
    });
    busy = false;
  }
  function later() { clearTimeout(timer); timer = setTimeout(apply, 160); }
  function init() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    apply();
    new MutationObserver(function (muts) { if (busy) return; if (muts.every(function (m) { return card && (m.target === card || card.contains(m.target)) || (m.addedNodes.length && [].every.call(m.addedNodes, function (x) { return x === card || (x.classList && x.classList.contains("entcard")); })); })) return; later(); }).observe(document.body, { childList: true, subtree: true });
    document.addEventListener("mouseover", function (e) { var el = e.target.closest && e.target.closest(".ent"); if (el) show(el); else if (card && !(e.target.closest && e.target.closest(".entcard"))) hide(); });
    document.addEventListener("focusin", function (e) { var el = e.target.closest && e.target.closest(".ent"); if (el) show(el); else if (!(e.target.closest && e.target.closest(".entcard"))) hide(); });
    document.addEventListener("click", function (e) { var el = e.target.closest && e.target.closest(".ent"); if (el) { if (owner === el) hide(); else show(el); } else if (!(e.target.closest && e.target.closest(".entcard"))) hide(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("ent")) { e.preventDefault(); if (owner === e.target) hide(); else show(e.target); } });
    window.addEventListener("scroll", hide, { passive: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
