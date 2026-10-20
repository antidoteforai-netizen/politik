#!/usr/bin/env python3
"""Convertit un document Markdown simple du dossier docs/ en page HTML habillée par politik.css.
Gère titres, paragraphes, listes, tableaux, gras, liens, code inline. Stdlib seule.

    python3 Politik/scripts/md-vers-html.py docs/benchmark-usa-2026-10-20.md dashboard/benchmark-usa.html "Benchmark américain"
"""
import html, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src, dst, title = sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "Politik"

def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"`(.+?)`", r"<code>\1</code>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    return s

out, lines = [], (ROOT / src).read_text(encoding="utf-8").split("\n")
i = 0
while i < len(lines):
    l = lines[i]
    if l.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s:-]+\|", lines[i + 1]):
        head = [c.strip() for c in l.strip("|").split("|")]; i += 2; rows = []
        while i < len(lines) and lines[i].startswith("|"):
            rows.append([c.strip() for c in lines[i].strip("|").split("|")]); i += 1
        out.append('<div class="tbl"><table><thead><tr>' + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr></thead><tbody>" +
                   "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in rows) + "</tbody></table></div>")
        continue
    m = re.match(r"^(#{1,3})\s+(.*)", l)
    if m:
        n = len(m.group(1)); out.append(f"<h{n}>{inline(m.group(2))}</h{n}>"); i += 1; continue
    if re.match(r"^\s*[-*]\s+", l) or re.match(r"^\s*\d+\.\s+", l):
        ordered = bool(re.match(r"^\s*\d+\.", l)); items = []
        while i < len(lines) and (re.match(r"^\s*[-*]\s+", lines[i]) or re.match(r"^\s*\d+\.\s+", lines[i]) or (lines[i].startswith("   ") and items)):
            if lines[i].startswith("   ") and not re.match(r"^\s*[-*\d]", lines[i]):
                items[-1] += " " + lines[i].strip()
            else:
                items.append(re.sub(r"^\s*([-*]|\d+\.)\s+", "", lines[i]))
            i += 1
        tag = "ol" if ordered else "ul"
        out.append(f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>"); continue
    if l.strip() == "":
        i += 1; continue
    para = [l]; i += 1
    while i < len(lines) and lines[i].strip() and not lines[i].startswith(("|", "#", "-", "*")) and not re.match(r"^\s*\d+\.\s", lines[i]):
        para.append(lines[i]); i += 1
    out.append(f"<p>{inline(' '.join(x.strip() for x in para))}</p>")

body = "\n".join(out)
page = f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title>
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#141A2B">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="politik.css">
<style>
.doc{{max-width:860px;margin:0 auto;padding-block:32px 56px}}
.doc h1{{font-size:clamp(1.8rem,4vw,2.6rem);margin-bottom:12px}}
.doc h2{{margin:34px 0 10px}} .doc h3{{margin:22px 0 8px}}
.doc p{{margin:8px 0;max-width:72ch;color:var(--ink-2)}}
.doc ul,.doc ol{{margin:8px 0 8px 0;padding-left:22px;color:var(--ink-2)}} .doc li{{margin:4px 0}}
.doc code{{font-size:.9em;background:var(--surface-2);padding:1px 5px;border-radius:4px}}
.doc .tbl{{margin:10px 0 16px}} .doc table{{background:var(--surface)}}
</style>
</head>
<body>
<nav class="nav" aria-label="Pages Politik"><div class="wrap">
  <a class="brand" href="index.html" style="display:inline-flex;align-items:center;gap:8px"><svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect width="64" height="64" rx="15" fill="#141A2B"/><rect x="19" y="14" width="8" height="36" rx="4" fill="#fff"/><circle cx="35" cy="26" r="10.5" fill="none" stroke="#fff" stroke-width="8"/><circle cx="35" cy="26" r="3.6" fill="#7A9BEC"/></svg><span style="color:inherit">Politik<span>.</span></span></a>
  <ul><li><a href="gouvernement.html" title="Le Gouvernement : ministères, ministres, actualité en bref">Gouvernement</a></li><li><a href="index.html" title="Fraude sociale">Fraude</a></li><li><a href="medias.html" title="Qui possède les médias">Médias</a></li><li><a href="forces.html" title="Forces de l'ordre : police et gendarmerie">Police</a></li><li><a href="17-octobre-2026.html" title="Le 17 octobre 2026">17 octobre</a></li><li><a href="presidentielle-2027.html" title="Présidentielle 2027">Élection</a></li><li><a href="secteurs.html" title="Comment va la France">France</a></li><li><a href="benchmark-usa.html" class="here" aria-current="page" title="Benchmark États-Unis">États-Unis</a></li><li><a href="donnees.html" title="Sources et données">Sources</a></li></ul>
</div></nav>
<main class="wrap doc">
{body}
</main>
<section class="wrap" id="donnees-page" data-page="benchmark" style="margin-top:8px"></section>
<footer class="wrap"><p>Politik · {html.escape(title)} : repères sur les tableaux de bord civiques américains, avec liens vers les sources.</p></footer>
<script src="donnees.js"></script>
<script src="acronymes.js"></script>
<script src="gouvernement.js"></script>
<script src="entete.js"></script>
<script src="entites.js"></script>
<script src="visuels.js"></script>
<script src="sommaire.js"></script>
<script src="niveau.js"></script>
<script src="legende.js"></script>
</body>
</html>
"""
(ROOT / dst).write_text(page, encoding="utf-8")
print(f"OK : {dst} ({len(page)//1024} Ko)")
