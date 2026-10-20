#!/usr/bin/env python3
"""Politik — violences et délinquance enregistrées par la police et la gendarmerie (SSMSI, data.gouv.fr).

Télécharge la base départementale du service statistique ministériel de la sécurité intérieure (SSMSI),
additionne les départements et calcule, pour chaque indicateur de violences et de dégradations, la série
2016-2025, la variation sur un an, la variation moyenne annuelle depuis 2016 et le taux pour 1 000 habitants.
Écrit data/violences-ssmsi.json et injecte `const VIOL` dans dashboard/forces.html entre
/* VIOL-START */ et /* VIOL-END */.

Vérification de cohérence : le total des victimes d'homicide 2025 doit valoir 975 (bilan « Insécurité et
délinquance en 2025 », SSMSI, publié le 9 juillet 2026) ; le script s'arrête sinon.

Stdlib seulement.   python3 Politik/scripts/fetch-violences.py
"""
import csv, io, json, re, urllib.request, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "violences-ssmsi.json"
HTML = ROOT / "dashboard" / "forces.html"
UA = {"User-Agent": "Mozilla/5.0 Politik/0.6 (tableau de bord citoyen)", "Accept": "application/json,*/*"}
SLUG = "bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales"
INDICATEURS = [
    ("Homicides", "Victimes d'homicide"),
    ("Tentatives d'homicide", "Victimes de tentatives d'homicide"),
    ("Violences physiques hors cadre familial", "Violences physiques hors cadre familial"),
    ("Violences physiques intrafamiliales", "Violences physiques intrafamiliales"),
    ("Violences sexuelles", "Violences sexuelles"),
    ("Destructions et dégradations volontaires", "Destructions et dégradations volontaires"),
    ("Vols violents sans arme", "Vols violents sans arme"),
]

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()

def num(x):
    try:
        return int(float(str(x).replace(",", ".").strip() or 0))
    except ValueError:
        return 0

d = json.loads(get(f"https://www.data.gouv.fr/api/1/datasets/{SLUG}/"))
res = next(r for r in d["resources"] if re.search(r"^DEP - Base statistique d", r["title"]))
rows = list(csv.DictReader(io.StringIO(get(res["url"]).decode("utf-8-sig")), delimiter=";"))
agg, pop = {}, {}
for r in rows:
    k = r["indicateur"]
    if k not in dict(INDICATEURS):
        continue
    y = int(r["annee"])
    agg.setdefault(k, {}).setdefault(y, 0)
    agg[k][y] += num(r["nombre"])
    if k == "Homicides":  # population : une seule fois par département et par année
        pop[y] = pop.get(y, 0) + num(r["insee_pop"])
annees = sorted(next(iter(agg.values())))
last = annees[-1]
if agg["Homicides"][last] != 975 and last == 2025:
    raise SystemExit(f"cohérence : homicides {last} = {agg['Homicides'][last]}, 975 attendu")
series = []
for k, lab in INDICATEURS:
    v = agg[k]
    pts = [{"annee": y, "n": v[y], "pour_1000": round(1000 * v[y] / pop[y], 3) if pop.get(y) else None} for y in annees]
    prev, first = v[annees[-2]], v[annees[0]]
    n_ans = last - annees[0]
    series.append({"indicateur": k, "libelle": lab, "points": pts,
                   "var_1an_pct": round((v[last] / prev - 1) * 100, 1) if prev else None,
                   "var_moy_annuelle_pct": round(((v[last] / first) ** (1 / n_ans) - 1) * 100, 1) if first and n_ans else None})
result = {
    "calcule_le": datetime.date.today().isoformat(),
    "jeu": SLUG, "maj_jeu": res.get("last_modified", "")[:10] or d.get("last_update", "")[:10],
    "url_jeu": f"https://www.data.gouv.fr/datasets/{SLUG}",
    "annees": annees, "derniere_annee": last,
    "methode": "Somme des départements de la base départementale du SSMSI (police et gendarmerie nationales), unité de compte « victime » ; faits enregistrés, pas faits réels : de nombreuses victimes ne portent pas plainte (enquête Vécu et ressenti en matière de sécurité).",
    "series": series,
    "bilan_officiel": {"titre": "Insécurité et délinquance en 2025 : bilan statistique et atlas départemental", "date": "2026-07-09", "url": "https://www.interieur.gouv.fr/actualites/communiques-de-presse/insecurite-et-delinquance-en-2025-bilan-statistique-et-atlas-departemental"},
}
OUT.parent.mkdir(exist_ok=True)
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
msg = f"OK : {OUT.relative_to(ROOT)} écrit ({len(series)} indicateurs, {annees[0]}-{last})"
if HTML.exists():
    h = HTML.read_text(encoding="utf-8")
    a, b = "/* VIOL-START */", "/* VIOL-END */"
    if a in h and b in h:
        h = h[:h.index(a)] + f"{a}\nconst VIOL = {json.dumps(result, ensure_ascii=False)};\n{b}" + h[h.index(b) + len(b):]
        HTML.write_text(h, encoding="utf-8"); msg += " ; forces.html injecté"
    else:
        msg += " ; marqueurs VIOL absents de forces.html, rien injecté"
print(msg)
for s in series:
    print(f"  {s['libelle']:<45} 2025 : {s['points'][-1]['n']:>8}  var 1 an {s['var_1an_pct']:>5} %  moy. annuelle {s['var_moy_annuelle_pct']:>5} %")
