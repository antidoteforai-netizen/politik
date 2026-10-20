#!/usr/bin/env python3
"""Politik — aides à la presse par titre et par groupe (ministère de la Culture, data.gouv.fr).

Télécharge les deux jeux officiels, rattache chaque titre aidé à une famille de propriétaires
(Arnault, Niel-Pigasse-Křetínský, Bolloré, Saadé, Dassault, Crédit Mutuel, Ouest-France, Bayard,
Altice, Rossel, Sud Ouest, Humanité) à partir de la colonne « Groupes ou sociétés de presse
d'appartenance » du jeu, calcule les totaux par famille et par année, écrit data/aides-presse.json
et injecte `const AIDES` dans dashboard/medias.html entre /* AIDES-START */ et /* AIDES-END */.

Stdlib seulement.   python3 Politik/scripts/fetch-aides-presse.py
"""
import csv, io, json, re, urllib.request, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "aides-presse.json"
HTML = ROOT / "dashboard" / "medias.html"
UA = {"User-Agent": "Mozilla/5.0 Politik/0.5 (tableau de bord citoyen)"}
TITRES = "https://static.data.gouv.fr/resources/aides-a-la-presse-classement-des-titres-de-presse-aides/20250827-130747/aides-a-la-presse-classement-des-titres-de-presse-aides.csv"
GROUPES = "https://static.data.gouv.fr/resources/aides-a-la-presse-classement-des-principaux-groupes-de-presse-aides/20250827-130734/aides-a-la-presse-classement-des-principaux-groupes-de-presse-aides.csv"
SRC_TITRES = "https://www.data.gouv.fr/fr/datasets/aides-a-la-presse-classement-des-titres-de-presse-aides/"
SRC_GROUPES = "https://www.data.gouv.fr/fr/datasets/aides-a-la-presse-classement-des-principaux-groupes-de-presse-aides/"

# Rattachement d'une société de presse à une famille d'actionnaires de contrôle. Le motif est testé
# sur la colonne « groupe d'appartenance » puis, à défaut, sur le nom du titre. Ordre = priorité.
FAMILLES = [
    ("Arnault (LVMH)", r"UFIPAR|LES ECHOS|LE PARISIEN|LVMH|SFA-PAR"),
    ("Niel, Pigasse, Křetínský (Le Monde)", r"GROUPE LE MONDE|SOCIETE EDITRICE DU MONDE|LE MONDE LIBRE|LE MONDE / lemonde|TELERAMA|COURRIER INTERNATIONAL|LA VIE|HUFFINGTON"),
    ("Křetínský (CMI France)", r"CZECH MEDIA|CMI FRANCE|MARIANNE|ELLE / elle\.fr|FRANC-TIREUR"),
    ("Bolloré (Lagardère, Prisma)", r"LAGARDERE|PRISMA|JOURNAL DU DIMANCHE|LE JDD|PARIS MATCH"),
    ("Saadé (CMA CGM)", r"LA PROVENCE|LA TRIBUNE|CORSE MATIN|CMA CGM"),
    ("Dassault (Le Figaro)", r"GROUPE FIGARO|LE FIGARO"),
    ("Crédit Mutuel (EBRA)", r"EBRA|CREDIT MUTUEL"),
    ("Famille Hutin (Ouest-France)", r"SIPA|OUEST[- ]FRANCE"),
    ("Bayard (congrégation)", r"BAYARD"),
    ("Drahi (Altice, jusqu'en 2020)", r"SFR PRESSE|ALTICE|LIBERATION"),
    ("Rossel (La Voix du Nord)", r"ROSSEL|LA VOIX DU NORD"),
    ("Groupe Sud Ouest", r"SUD[- ]OUEST|PMSO"),
    ("L'Humanité (société des lecteurs)", r"HUMANIT"),
]
FAMILLE_SOURCE = {f: "colonne « groupe d'appartenance » du jeu titres aidés, puis nom du titre" for f, _ in FAMILLES}

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read().decode("utf-8")

def num(x):
    x = (x or "").strip().replace(" ", "").replace(" ", "").replace(",", ".")
    try:
        return float(x)
    except ValueError:
        return 0.0

def famille(groupe, titre):
    for nom, motif in FAMILLES:
        if re.search(motif, groupe, re.I):
            return nom
    for nom, motif in FAMILLES:
        if re.search(motif, titre, re.I):
            return nom
    return None

rows = list(csv.reader(io.StringIO(get(TITRES)), delimiter=";"))
head, body = rows[0], [r for r in rows[1:] if len(r) == 18]
# Colonnes (vérifiées le 2026-10-20) : 1 bénéficiaire, 2 aides directes, 8 aide filière, 13 total, 14 diffusion, 16 groupe, 17 année
par_annee = {}
for r in body:
    an = str(int(num(r[17]))) if num(r[17]) else None
    if not an:
        continue
    a = par_annee.setdefault(an, {"titres": 0, "total": 0.0, "direct": 0.0, "familles": {}, "sans_groupe": 0})
    total, direct = num(r[13]), num(r[2])
    a["titres"] += 1; a["total"] += total; a["direct"] += direct
    fam = famille(r[16] or "", r[1] or "")
    if not (r[16] or "").strip():
        a["sans_groupe"] += 1
    if fam:
        f = a["familles"].setdefault(fam, {"total": 0.0, "direct": 0.0, "titres": 0, "principaux": []})
        f["total"] += total; f["direct"] += direct; f["titres"] += 1
        f["principaux"].append((r[1].strip(), total))
annees = sorted(par_annee)
derniere = annees[-1]
for an in annees:
    for f in par_annee[an]["familles"].values():
        f["principaux"] = [{"titre": t, "total_eur": round(v)} for t, v in sorted(f["principaux"], key=lambda x: -x[1])[:5]]
        f["total"] = round(f["total"]); f["direct"] = round(f["direct"])
    par_annee[an]["total"] = round(par_annee[an]["total"]); par_annee[an]["direct"] = round(par_annee[an]["direct"])

# Série par famille (M€, total des aides individuelles), toutes années.
series = []
for nom, _ in FAMILLES:
    pts = [{"annee": an, "total_meur": round(par_annee[an]["familles"].get(nom, {"total": 0})["total"] / 1e6, 2),
            "titres": par_annee[an]["familles"].get(nom, {"titres": 0})["titres"]} for an in annees]
    if any(p["total_meur"] for p in pts):
        series.append({"famille": nom, "points": pts, "dernier": pts[-1]})
series.sort(key=lambda s: -s["dernier"]["total_meur"])

# Jeu « groupes » 2016-2019 : total par groupe tel que publié par le ministère (sans rattachement).
grows = list(csv.reader(io.StringIO(get(GROUPES)), delimiter=";"))
gh = grows[0]
gi = {"nom": 0, "direct": 1, "total": gh.index(next(c for c in gh if c.startswith("Total des aides"))), "annee": len(gh) - 1}
groupes = {}
for r in grows[1:]:
    if len(r) < len(gh):
        continue
    an = str(int(num(r[gi["annee"]]))) if num(r[gi["annee"]]) else None
    if an:
        groupes.setdefault(an, []).append({"groupe": r[gi["nom"]].strip(), "direct_eur": round(num(r[gi["direct"]])), "total_eur": round(num(r[gi["total"]]))})
for an in groupes:
    groupes[an].sort(key=lambda x: -x["total_eur"])

result = {
    "calcule_le": datetime.date.today().isoformat(),
    "sources": {"titres": SRC_TITRES, "groupes": SRC_GROUPES},
    "methode": "Famille = rattachement par expression régulière de la colonne « groupe d'appartenance » (puis du nom du titre) du jeu « titres aidés ». Un titre sans groupe renseigné n'est rattaché que si son nom est reconnu. Montants = « Total des aides individuelles » (directes + filière + exceptionnelles + modernisation sociale), en euros courants.",
    "annees": annees,
    "derniere_annee": derniere,
    "par_annee": {an: {k: v for k, v in par_annee[an].items() if k != "familles"} for an in annees},
    "familles_derniere_annee": {nom: par_annee[derniere]["familles"][nom] for nom in par_annee[derniere]["familles"]},
    "series": series,
    "groupes_publies": {an: groupes[an][:15] for an in sorted(groupes)},
}
OUT.parent.mkdir(exist_ok=True)
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
msg = f"OK : {OUT.relative_to(ROOT)} écrit ({derniere} : {par_annee[derniere]['titres']} titres, {par_annee[derniere]['total']/1e6:.1f} M€ ; familles reconnues : {len(series)})"
if HTML.exists():
    html = HTML.read_text(encoding="utf-8")
    start, end = "/* AIDES-START */", "/* AIDES-END */"
    if start in html and end in html:
        html = html[:html.index(start)] + f"{start}\nconst AIDES = {json.dumps(result, ensure_ascii=False)};\n{end}" + html[html.index(end) + len(end):]
        HTML.write_text(html, encoding="utf-8")
        msg += " ; medias.html injecté"
    else:
        msg += " ; marqueurs AIDES absents de medias.html, rien injecté"
else:
    msg += " ; medias.html absent, rien injecté"
print(msg)
for s in series:
    print(f"  {s['famille']:<40} " + "  ".join(f"{p['annee']}:{p['total_meur']:.2f}" for p in s["points"]))
