/* Politik — composant « Test » (QCM) commun aux pages.
   Intention de design : une lectrice doit comprendre en un coup d'œil que c'est un test et qu'elle peut y répondre.
   - UI : cadre en pointillés (zone « à remplir »), étiquette « ? Test », réponses en grosses touches A, B, C
     d'au moins 44 px, survol et focus visibles, aucun mouvement. Le bon choix ne repose pas sur la couleur seule :
     étiquettes « Bonne réponse » et « Votre choix ».
   - Texte : une consigne qui dit quoi faire (« Choisissez une réponse »), un indicateur de progression, un retour
     qui ne dit jamais « faux » (« Pas tout à fait. La bonne réponse est B »), la source et le niveau V/S/D/A de
     chaque valeur, un bilan neutre à la fin, un bouton pour recommencer.
   - Accessibilité : groupe de réponses nommé, zone vocale (role="status") qui annonce le résultat, clavier natif.
   Usage : Qcm.draw("#conteneur", cfg, niveau) ; cfg = { id, qs:[{ q, opts:[…], ans, why, src, lvl }] }.
   Les textes sont des chaînes ou des objets { etat, simple, falc } (repli sur etat). Aucune donnée n'est envoyée ni
   conservée : les réponses vivent le temps de la page. */
(function () {
  var CSS = ".qcm{border:1.5px dashed var(--accent);border-radius:14px;padding:16px;background:color-mix(in srgb,var(--accent-soft) 40%,var(--surface));min-width:0}" +
    ".qcm-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin-bottom:6px}" +
    ".qcm-tag{display:inline-flex;align-items:center;gap:6px;background:var(--ink);color:var(--paper);font-weight:700;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px}" +
    ".qcm-tag i{font-style:normal;display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:var(--paper);color:var(--ink);font-size:.72rem;letter-spacing:0}" +
    ".qcm-meta{font-size:.84rem;color:var(--ink-2)}" +
    ".qcm-how{margin:2px 0 14px;max-width:62ch;color:var(--ink)}" +
    ".qcm-list{display:grid;gap:12px}" +
    ".qcm-q{background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:10px;padding:14px 14px 12px}" +
    ".qcm-q[data-done=\"true\"]{border-left-color:var(--lvl-v)}" +
    ".qcm-n{font-size:.76rem;text-transform:uppercase;letter-spacing:.08em;font-weight:600;color:var(--ink-3);margin:0 0 4px}" +
    ".qcm-text{font-family:var(--font-display);font-weight:600;font-size:1.08rem;line-height:1.3;margin:0 0 12px;text-wrap:balance}" +
    ".qcm-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:8px}" +
    ".qcm-opt{font:inherit;display:flex;align-items:center;gap:10px;min-height:48px;text-align:left;padding:8px 12px;border:1.5px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);cursor:pointer}" +
    ".qcm-opt:hover{border-color:var(--accent);background:var(--accent-soft)}" +
    ".qcm-opt:focus-visible{outline:2px solid var(--accent);outline-offset:2px}" +
    ".qcm-l{flex:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;border:1.5px solid var(--ink-3);font-weight:700;font-size:.82rem;color:var(--ink-2)}" +
    ".qcm-t{min-width:0;flex:1}" +
    ".qcm-flag{flex:none;font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}" +
    ".qcm-opt[aria-disabled=\"true\"]{cursor:default}" +
    ".qcm-opt[aria-disabled=\"true\"]:hover{background:var(--surface);border-color:var(--line)}" +
    ".qcm-opt.right,.qcm-opt.right[aria-disabled=\"true\"]:hover{border-color:var(--lvl-v);background:color-mix(in srgb,var(--lvl-v) 12%,var(--surface))}" +
    ".qcm-opt.right .qcm-l{background:var(--lvl-v);border-color:var(--lvl-v);color:var(--lvl-ink)}" +
    ".qcm-opt.right .qcm-flag{color:var(--lvl-v)}" +
    ".qcm-opt.mine:not(.right),.qcm-opt.mine:not(.right)[aria-disabled=\"true\"]:hover{border-color:var(--lvl-s);border-style:dashed}" +
    ".qcm-opt.mine:not(.right) .qcm-flag{color:var(--lvl-s)}" +
    ".qcm-opt.dim{opacity:.62}" +
    ".qcm-hint{margin:10px 0 0;font-size:.86rem;color:var(--ink-2)}" +
    ".qcm-fb{margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)}" +
    ".qcm-res{margin:0 0 4px;font-weight:700}" +
    ".qcm-res.right{color:var(--lvl-v)}" +
    ".qcm-res.miss{color:var(--ink)}" +
    ".qcm-why{margin:0;max-width:64ch;color:var(--ink-2)}" +
    ".qcm-src{margin:6px 0 0;font-size:.8rem;color:var(--ink-3)}" +
    ".qcm-foot{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;margin-top:14px}" +
    ".qcm-dots{display:inline-flex;gap:5px}" +
    ".qcm-dots span{width:10px;height:10px;border-radius:50%;border:1.5px solid var(--ink-3)}" +
    ".qcm-dots span.on{background:var(--lvl-v);border-color:var(--lvl-v)}" +
    ".qcm-prog{font-size:.86rem;color:var(--ink-2)}" +
    ".qcm-recap{flex-basis:100%;margin:0;font-weight:600;max-width:64ch}" +
    ".qcm-reset{font:inherit;font-weight:600;font-size:.86rem;padding:7px 12px;border-radius:8px;border:1px solid var(--ink);background:transparent;color:var(--ink);cursor:pointer;margin-left:auto}" +
    ".qcm-reset:focus-visible{outline:2px solid var(--accent);outline-offset:2px}" +
    ".qcm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
    "body.falc .qcm{font-family:var(--font-falc);font-size:1.06rem}" +
    "body.falc .qcm-text{font-family:var(--font-falc);font-size:1.15rem}" +
    "body.falc .qcm-opts{grid-template-columns:1fr}" +
    "body.falc .qcm-n,body.falc .qcm-hint,body.falc .qcm-meta,body.falc .qcm-prog,body.falc .qcm-src{font-size:1rem}";

  var TXT = {
    etat: { tag: "Test", meta: function (n) { return n + " questions, environ une minute"; }, how: "Choisissez une réponse : la valeur sourcée s'affiche aussitôt. Il n'y a pas de piège, l'écart avec la réalité est précisément ce que ce test mesure.", n: function (i, n) { return "Question " + i + " sur " + n; }, hint: "Touchez la réponse qui vous semble juste.", right: "Bonne réponse", miss: function (l) { return "Pas tout à fait. La bonne réponse est " + l + "."; }, mine: "Votre choix", good: "Bonne réponse", prog: function (d, n) { return d + " sur " + n + " faites"; }, recap: function (k, n) { return "Vous avez trouvé " + k + " réponse" + (k > 1 ? "s" : "") + " sur " + n + ". Un écart avec la valeur sourcée est normal : ces chiffres sont souvent contre-intuitifs."; }, reset: "Recommencer le test", src: "Source : " },
    falc: { tag: "Test", meta: function (n) { return n + " questions, 1 minute"; }, how: "Choisissez une réponse.<br>La bonne réponse s'affiche.", n: function (i, n) { return "Question " + i + " sur " + n; }, hint: "Touchez une réponse.", right: "Bonne réponse", miss: function (l) { return "Ce n'est pas ça. La bonne réponse est " + l + "."; }, mine: "Votre choix", good: "Bonne réponse", prog: function (d, n) { return d + " sur " + n; }, recap: function (k, n) { return "Vous avez trouvé " + k + " sur " + n + ".<br>C'est normal de se tromper : ces chiffres surprennent."; }, reset: "Recommencer", src: "D'où ça vient : " }
  };
  var state = {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pick(o, L) { if (o == null) return ""; if (typeof o !== "object") return o; var v = o[L]; if (v == null) v = (L === "simple" && o.simple != null) ? o.simple : o.etat; return v == null ? "" : v; }
  function addStyle() { if (document.getElementById("qcm-style")) return; var s = document.createElement("style"); s.id = "qcm-style"; s.textContent = CSS; document.head.appendChild(s); }

  function draw(sel, cfg, L) {
    addStyle();
    var el = typeof sel === "string" ? document.querySelector(sel) : sel; if (!el) return;
    var t = TXT[L === "falc" ? "falc" : "etat"], n = cfg.qs.length;
    var st = state[cfg.id] || (state[cfg.id] = { a: [] });
    if (!el.__qcm) {
      el.__qcm = { cfg: cfg, L: L };
      el.innerHTML = '<div class="qcm" role="group"><div class="qcm-body"></div><p class="qcm-sr" role="status" aria-live="polite"></p></div>';
      el.addEventListener("click", function (e) {
        var b = e.target.closest(".qcm-opt"), r = e.target.closest(".qcm-reset");
        var m = el.__qcm;
        if (r) { state[m.cfg.id] = { a: [] }; draw(el, m.cfg, m.L); return; }
        if (!b || b.getAttribute("aria-disabled") === "true") return;
        var i = +b.dataset.i, j = +b.dataset.j, q = m.cfg.qs[i], s = state[m.cfg.id];
        if (s.a[i] != null) return; s.a[i] = j;
        draw(el, m.cfg, m.L);
        var tt = TXT[m.L === "falc" ? "falc" : "etat"], right = j === q.ans;
        el.querySelector(".qcm-sr").textContent = (right ? tt.good : tt.miss(String.fromCharCode(65 + q.ans))) + " " + String(pick(q.why, m.L)).replace(/<[^>]+>/g, " ");
        var next = el.querySelector('.qcm-q[data-i="' + i + '"] .qcm-opt'); if (next) next.focus({ preventScroll: true });
      });
    }
    el.__qcm.cfg = cfg; el.__qcm.L = L;
    var done = 0, ok = 0;
    var html = '<div class="qcm-head"><span class="qcm-tag"><i aria-hidden="true">?</i>' + t.tag + '</span><span class="qcm-meta">' + t.meta(n) + '</span></div><p class="qcm-how">' + t.how + '</p><div class="qcm-list">';
    cfg.qs.forEach(function (q, i) {
      var a = st.a[i], answered = a != null; if (answered) { done++; if (a === q.ans) ok++; }
      var letter = String.fromCharCode(65 + q.ans);
      html += '<article class="qcm-q" data-i="' + i + '" data-done="' + answered + '"><p class="qcm-n">' + t.n(i + 1, n) + '</p><p class="qcm-text" id="qcm-' + cfg.id + '-' + i + '">' + pick(q.q, L) + '</p><div class="qcm-opts" role="group" aria-labelledby="qcm-' + cfg.id + '-' + i + '">';
      q.opts.forEach(function (o, j) {
        var cls = "qcm-opt" + (answered && j === q.ans ? " right" : "") + (answered && a === j ? " mine" : "") + (answered && j !== q.ans && a !== j ? " dim" : "");
        var flag = answered ? (j === q.ans ? t.right : (a === j ? t.mine : "")) : "";
        html += '<button type="button" class="' + cls + '" data-i="' + i + '" data-j="' + j + '"' + (answered ? ' aria-disabled="true" aria-pressed="' + (a === j) + '"' : "") + '><span class="qcm-l" aria-hidden="true">' + String.fromCharCode(65 + j) + '</span><span class="qcm-t">' + pick(o, L) + '</span>' + (flag ? '<span class="qcm-flag">' + flag + '</span>' : "") + '</button>';
      });
      html += "</div>";
      if (!answered) html += '<p class="qcm-hint">' + t.hint + "</p>";
      else html += '<div class="qcm-fb"><p class="qcm-res ' + (a === q.ans ? "right" : "miss") + '">' + (a === q.ans ? "✓ " + t.good : t.miss(letter)) + '</p><p class="qcm-why">' + pick(q.why, L) + '</p><p class="qcm-src">' + (q.lvl ? '<span class="lvl lvl-' + q.lvl + '">' + q.lvl + "</span> " : "") + t.src + esc(pick(q.src, L)) + "</p></div>";
      html += "</article>";
    });
    html += '</div><div class="qcm-foot"><span class="qcm-dots" aria-hidden="true">';
    for (var k = 0; k < n; k++) html += '<span class="' + (st.a[k] != null ? "on" : "") + '"></span>';
    html += '</span><span class="qcm-prog">' + t.prog(done, n) + "</span>";
    if (done === n) html += '<p class="qcm-recap">' + t.recap(ok, n) + "</p>";
    if (done > 0) html += '<button type="button" class="qcm-reset">' + t.reset + "</button>";
    html += "</div>";
    el.querySelector(".qcm-body").innerHTML = html;
  }
  window.Qcm = { draw: draw };
})();
