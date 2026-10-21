#!/usr/bin/env python3
"""Convertit un document Markdown simple du dossier docs/ en page HTML habillée par politik.css.
Gère titres, citations, paragraphes, listes, tableaux, gras, liens, code inline. Stdlib seule.
Tableaux reconnus par leur première colonne :
  « Outil » ou « Lecture »  -> fiches cliquables avec pastilles de fiabilité (V, S, D, A) ;
  « Organisme »             -> liste de sources (organisme, document, date, lien).
La barre de navigation est reprise de dashboard/index.html.

    python3 Politik/scripts/md-vers-html.py docs/benchmark-usa-2026-10-20.md dashboard/benchmark-usa.html "Benchmark États-Unis"
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

def plain(s):
    return re.sub(r"\s+", " ", re.sub(r"\*\*|`", "", re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s))).strip()

def links(s):
    return [(plain(a), b) for a, b in re.findall(r"\[([^\]]+)\]\(([^)]+)\)", s)]

LV = {"V": "publié par l'institution elle-même", "S": "relayé par la presse ou un rapport extérieur", "D": "donné par l'organisation qui gère l'outil", "A": "non vérifié"}
def badges(cell):
    out = []
    for m in re.finditer(r"\b([VSDA])\b(?:\s*\(([^)]*)\))?", cell):
        k, note = m.group(1), m.group(2)
        out.append(f'<span class="niv"><span class="lvl lvl-{k}" title="{LV[k]}">{k}</span>' + (f"<small>{html.escape(note)}</small>" if note else "") + "</span>")
    return "".join(out)

def first_level(cell):
    m = re.search(r"\b([VSDA])\b", cell); return m.group(1) if m else "S"

def btn(label, url, nom):
    return f'<a class="btn" href="{html.escape(url)}" target="_blank" rel="noopener" aria-label="{html.escape(label)} : {html.escape(nom)} (nouvel onglet)">{html.escape(label)} <span aria-hidden="true">↗</span></a>'

def cards(head, rows):
    four = len(head) >= 4
    out = ['<div class="outils">']
    for r in rows:
        nom_html = inline(r[0]); ls = links(r[0]) + [l for c in r[1:3] for l in links(c) if False]
        lv = first_level(r[3]) if four else None
        cls = f" lv-{lv}" if lv else ""
        buttons = ""
        if len(ls) == 1: buttons = btn("Ouvrir le site" if four else "Lire la source", ls[0][1], ls[0][0])
        elif len(ls) > 1: buttons = "".join(btn(n, u, n) for n, u in ls)
        et2 = "Ce qu'on sait de son effet" if four else "Ce qu'on en retient"
        et1 = "Ce qu'il fait" if four else "De quoi il s'agit"
        out.append(f'<article class="outil{cls}"><header><h3>{nom_html}</h3>' + (f'<div class="fiab" aria-label="Fiabilité">{badges(r[3])}</div>' if four else "") + "</header>"
                   f'<p class="fait"><span class="et">{et1}</span>{inline(r[1])}</p><p class="preuve"><span class="et">{et2}</span>{inline(r[2])}</p>'
                   + (f'<div class="acts">{buttons}</div>' if buttons else "") + "</article>")
    out.append("</div>")
    return "".join(out)

def sources(rows):
    out = ['<ul class="srcs">']
    for r in rows:
        org, docu, date, lien = r[0], r[1], r[2], r[3]
        ls = links(lien)
        a = f'<a class="btn" href="{html.escape(ls[0][1])}" target="_blank" rel="noopener" aria-label="Ouvrir {html.escape(plain(docu))} (nouvel onglet)">{html.escape(ls[0][0])} <span aria-hidden="true">↗</span></a>' if ls else '<span class="nolink">lien non disponible</span>'
        dl = f'<a class="docu-a" href="{html.escape(ls[0][1])}" target="_blank" rel="noopener">{html.escape(plain(docu))}</a>' if ls else inline(docu)
        out.append(f'<li><span class="org">{inline(org)}</span><span class="docu">{dl}</span><span class="date">{html.escape(plain(date))}</span>{a}</li>')
    out.append("</ul>")
    return "".join(out)

items, lines = [], (ROOT / src).read_text(encoding="utf-8").split("\n")
i = 0
def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"[̀-ͯ]", "", __import__("unicodedata").normalize("NFD", s.lower()))).strip("-")
while i < len(lines):
    l = lines[i]
    if l.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s:-]+\|", lines[i + 1]):
        head = [c.strip() for c in l.strip("|").split("|")]; i += 2; rows = []
        while i < len(lines) and lines[i].startswith("|"):
            rows.append([c.strip() for c in lines[i].strip("|").split("|")]); i += 1
        k = plain(head[0]).lower()
        if k in ("outil", "lecture"): items.append(("html", cards(head, rows)))
        elif k == "organisme": items.append(("html", sources(rows)))
        else:
            items.append(("html", '<div class="tbl"><table><thead><tr>' + "".join(f"<th scope=\"col\">{inline(c)}</th>" for c in head) + "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in rows) + "</tbody></table></div>"))
        continue
    m = re.match(r"^(#{1,3})\s+(.*)", l)
    if m:
        n = len(m.group(1)); txt = m.group(2); items.append((f"h{n}", f'<h{n} id="{slug(plain(txt))}">{inline(txt)}</h{n}>' if n == 2 else f"<h{n}>{inline(txt)}</h{n}>", plain(txt))); i += 1; continue
    if l.startswith(">"):
        q = []
        while i < len(lines) and lines[i].startswith(">"): q.append(lines[i][1:].strip()); i += 1
        items.append(("quote", f'<blockquote class="accroche"><p>{inline(" ".join(q))}</p></blockquote>')); continue
    if re.match(r"^\s*[-*]\s+", l) or re.match(r"^\s*\d+\.\s+", l):
        ordered = bool(re.match(r"^\s*\d+\.", l)); its = []
        while i < len(lines) and (re.match(r"^\s*[-*]\s+", lines[i]) or re.match(r"^\s*\d+\.\s+", lines[i]) or (lines[i].startswith("   ") and its)):
            if lines[i].startswith("   ") and not re.match(r"^\s*[-*\d]", lines[i]): its[-1] += " " + lines[i].strip()
            else: its.append(re.sub(r"^\s*([-*]|\d+\.)\s+", "", lines[i]))
            i += 1
        tag = "ol" if ordered else "ul"
        items.append(("html", f'<{tag} class="lecons">' + "".join(f"<li>{inline(x)}</li>" for x in its) + f"</{tag}>")); continue
    if l.strip() == "": i += 1; continue
    para = [l]; i += 1
    while i < len(lines) and lines[i].strip() and not lines[i].startswith(("|", "#", "-", "*", ">")) and not re.match(r"^\s*\d+\.\s", lines[i]):
        para.append(lines[i]); i += 1
    items.append(("p", f"<p>{inline(' '.join(x.strip() for x in para))}</p>"))

# --- assemblage : héro (h1, citation, premier paragraphe), légende, sommaire, sections
hero, rest, sec = [], [], []
k = 0
if items and items[0][0] == "h1":
    h1 = items[0][1]; k = 1; quote = ""; lede = ""
    while k < len(items) and items[k][0] in ("quote", "p") and not (quote and lede):
        if items[k][0] == "quote" and not quote: quote = items[k][1]
        elif items[k][0] == "p" and not lede: lede = items[k][1]
        else: break
        k += 1
    hero = [f'<header class="b-hero"><p class="b-eyebrow">Benchmark · États-Unis · 20 octobre 2026</p>{h1}{quote}<div class="b-lede">{lede}</div></header>']
for it in items[k:]:
    rest.append(it[1])
    if it[0] == "h2": sec.append((slug(it[2]), it[2]))
def court(t):
    t = t.split(":")[0].strip(); t = re.sub(r"^Pour (les |l')?", "", t); return t[:1].upper() + t[1:]
toc = '<nav class="sous-sommaire" aria-label="Dans cette page">' + "".join(f'<a href="#{s}">{html.escape(court(t))}</a>' for s, t in sec) + "</nav>"
legende = ('<aside class="legende-niv" aria-label="Comment lire la fiabilité"><b>Comment lire la fiabilité</b><ul>' +
           "".join(f'<li><span class="lvl lvl-{k}">{k}</span>{v[:1].upper() + v[1:]}</li>' for k, v in LV.items()) + "</ul></aside>")
body = "\n".join(hero + [legende] + rest)

acc = (ROOT / "dashboard/index.html").read_text(encoding="utf-8")
NAV = re.search(r'<nav class="nav".*?</nav>', acc, re.S).group(0).replace(' class="here" aria-current="page"', "")
NAV = re.sub(r'<div class="switch"[^>]*></div>', "", NAV)
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
<meta name="eg-masquer" content="1">
<meta name="description" content="Ce que font les États-Unis avec leurs données publiques : outils pour voter, suivre les dépenses, chiffrer une loi ou demander l'asile, avec ce qu'on sait de leur effet réel.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="politik.css">
<style>
.doc{{max-width:1088px;margin:0 auto;padding-block:28px 56px}}
.doc h2{{margin:44px 0 6px;font-size:clamp(1.4rem,2.6vw,1.9rem);scroll-margin-top:calc(var(--sticky-h,100px) + 14px)}} .doc h3{{margin:0}}
.doc p{{margin:8px 0;max-width:72ch;color:var(--ink-2)}}
.doc code{{font-size:.9em;background:var(--surface-2);padding:1px 5px;border-radius:4px}}
.b-hero{{position:relative;margin:6px 0 18px;padding:34px 36px 30px;border-radius:28px;border:1px solid var(--line);background:radial-gradient(110% 90% at 90% 0%,color-mix(in srgb,var(--accent) 8%,transparent),transparent 60%),linear-gradient(135deg,var(--surface),color-mix(in srgb,var(--accent-soft) 40%,var(--surface)))}}
.b-eyebrow{{margin:0 0 10px;font-size:.74rem;text-transform:uppercase;letter-spacing:.1em;font-weight:700;color:var(--ink-2)}}
.b-hero h1{{font-size:clamp(1.9rem,4.4vw,3rem);line-height:1.1;margin:0 0 18px;max-width:20ch;text-wrap:balance}}
.accroche{{margin:0 0 18px;padding:14px 18px;border-left:4px solid color-mix(in srgb,var(--accent) 60%,var(--surface));background:var(--surface);border-radius:0 14px 14px 0;max-width:62ch}}
.accroche p{{margin:0;font-family:var(--font-display);font-size:clamp(1.05rem,2vw,1.3rem);line-height:1.35;color:var(--ink);font-weight:600}}
.b-lede p{{font-size:1.04rem;color:var(--ink-2);max-width:68ch;margin:0}}
.legende-niv{{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;margin:0 0 6px;padding:12px 16px;border:1px solid var(--line);border-radius:14px;background:var(--surface);font-size:.88rem;color:var(--ink-2)}}
.legende-niv b{{color:var(--ink)}} .legende-niv ul{{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px 18px}} .legende-niv li{{display:flex;align-items:center;gap:7px}}
.outils{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:14px;margin:14px 0 6px}}
.outil{{--lv:var(--ink-3);display:flex;flex-direction:column;gap:10px;padding:16px 18px 16px;border:1px solid var(--line);border-top:4px solid color-mix(in srgb,var(--lv) 38%,var(--line));border-radius:16px;background:var(--surface);min-width:0}}
.outil.lv-V{{--lv:#2d6a4f}} .outil.lv-S{{--lv:#8a6a14}} .outil.lv-D{{--lv:#9b3550}} .outil.lv-A{{--lv:#6b7280}}
.outil header{{display:flex;flex-direction:column;gap:8px}}
.outil h3{{font-size:1.12rem;line-height:1.25}} .outil h3 a{{color:var(--ink);text-decoration-color:color-mix(in srgb,var(--accent) 50%,transparent);text-underline-offset:3px}} .outil h3 a:hover{{color:var(--accent-ink)}}
.fiab{{display:flex;flex-wrap:wrap;gap:6px}} .niv{{display:inline-flex;align-items:center;gap:6px}} .niv small{{font-size:.76rem;color:var(--ink-2)}}
.outil p{{margin:0;font-size:.92rem;line-height:1.5;color:var(--ink-2);max-width:none}}
.outil .et{{display:block;margin-bottom:2px;font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;font-weight:800;color:var(--ink-3)}}
.outil .acts{{margin-top:auto;padding-top:4px;display:flex;flex-wrap:wrap;gap:8px}}
.btn{{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;border:1.5px solid color-mix(in srgb,var(--accent-ink) 45%,var(--line));background:var(--surface);color:var(--accent-ink);font-size:.86rem;font-weight:700;text-decoration:none;min-height:36px}}
.btn:hover,.btn:focus-visible{{background:var(--accent-soft);border-color:var(--accent-ink);outline:none}} .btn:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
.lecons{{list-style:none;counter-reset:l;padding:0;margin:14px 0;display:grid;gap:10px}}
.lecons li{{counter-increment:l;display:grid;grid-template-columns:42px 1fr;gap:14px;align-items:start;padding:14px 16px;border:1px solid var(--line);border-radius:14px;background:var(--surface);color:var(--ink-2);margin:0}}
.lecons li:before{{content:counter(l);display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--accent-soft);color:var(--accent-ink);font-family:var(--font-display);font-weight:800}}
.srcs{{list-style:none;margin:14px 0 0;padding:0;display:grid;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:var(--surface)}}
.srcs li{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.7fr) 150px 230px;gap:6px 18px;align-items:center;padding:12px 18px;border-top:1px solid var(--line-2,var(--line));margin:0}}
.srcs li:first-child{{border-top:0}}
.srcs .org{{font-weight:700;color:var(--ink)}} .srcs .docu{{color:var(--ink-2);font-size:.92rem}} .srcs .docu a{{color:var(--ink);text-decoration-color:color-mix(in srgb,var(--accent) 50%,transparent);text-underline-offset:3px;font-weight:600}} .srcs .docu a:hover{{color:var(--accent-ink)}}
.srcs .date{{display:inline-block;justify-self:start;padding:2px 10px;border-radius:999px;background:var(--surface-2);font-size:.8rem;font-weight:700;color:var(--ink-2);white-space:nowrap}}
.srcs .nolink{{font-size:.82rem;color:var(--ink-3);justify-self:end}} .srcs .btn{{justify-self:end}}
@media (max-width:900px){{.srcs li{{grid-template-columns:minmax(0,1fr) auto;padding:12px 14px}}.srcs .org,.srcs .docu{{grid-column:1/-1}}}}
@media (max-width:760px){{.b-hero{{padding:24px 18px 22px;border-radius:22px}}.srcs .org,.srcs .docu{{grid-column:1/-1}}.lecons li{{grid-template-columns:1fr}}.lecons li:before{{width:30px;height:30px}}}}
body.falc .outil p{{font-size:1rem}}
@media print{{.btn{{display:none}}}}
</style>
</head>
<body>
{NAV}
<main id="contenu" class="wrap doc">
{toc}
{body}
</main>
<section class="wrap" id="donnees-page" data-page="benchmark" style="margin-top:8px"></section>
<footer class="wrap"><p>Politik · Benchmark États-Unis : repères sur les outils américains de lecture des données publiques, avec liens vers les sources.</p></footer>
<script src="donnees.js"></script>
<script src="acronymes.js"></script>
<script src="gouvernement.js"></script>
<script src="entete.js"></script>
<script src="entites.js"></script>
<script src="visuels.js"></script>
<script src="sommaire.js"></script>
<script src="structure.js"></script>
<script src="niveau.js"></script>
<script src="legende.js"></script>
<script src="mesure.js"></script>
</body>
</html>
"""
(ROOT / dst).write_text(page, encoding="utf-8")
print(f"OK : {dst} ({len(page)//1024} Ko)")
